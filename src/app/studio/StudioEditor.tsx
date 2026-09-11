"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createBlankStudioBuild,
  studioPalette,
  studioPieceCounts,
  studioPieceLabels,
  studioPieceOptions,
  studioStepCount,
  type StudioBuild,
  type StudioPieceKind,
  type StudioPlacement,
} from "@/lib/studio-model";

const BABYLON_CDN = "https://cdn.babylonjs.com/babylon.js";
const POSITION_SNAP = 0.5;
const ROTATION_SNAP = Math.PI / 4;

type TransformMode = "move" | "rotate";
type SaveState = "clean" | "dirty" | "saving" | "saved" | "error";

type Props = {
  initialBuild: StudioBuild | null;
  initialBuildId: string | null;
};

function ensureBabylon() {
  return new Promise<any>((resolve, reject) => {
    const existing = (window as any).BABYLON;
    if (existing) return resolve(existing);
    const previous = document.querySelector<HTMLScriptElement>(`script[src="${BABYLON_CDN}"]`);
    if (previous) {
      previous.addEventListener("load", () => resolve((window as any).BABYLON), { once: true });
      previous.addEventListener("error", () => reject(new Error("Babylon.js failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = BABYLON_CDN;
    script.async = true;
    script.onload = () => resolve((window as any).BABYLON);
    script.onerror = () => reject(new Error("Babylon.js failed to load"));
    document.head.appendChild(script);
  });
}

function material(B: any, scene: any, color: string, alpha: number, selected: boolean) {
  const result = new B.StandardMaterial(`studio-${color}-${Math.random()}`, scene);
  const c = B.Color3.FromHexString(color);
  result.diffuseColor = c;
  result.emissiveColor = selected ? c.scale(0.35) : c.scale(0.1);
  result.specularColor = new B.Color3(0.45, 0.45, 0.45);
  result.alpha = alpha;
  result.backFaceCulling = false;
  return result;
}

function mark(mesh: any, id: string) {
  mesh.metadata = { ...(mesh.metadata ?? {}), studioPlacementId: id };
  return mesh;
}

function rootMesh(B: any, scene: any, placement: StudioPlacement) {
  const root = new B.Mesh(placement.id, scene);
  root.isVisible = false;
  root.isPickable = false;
  root.metadata = { studioPlacementId: placement.id };
  return root;
}

function square(B: any, scene: any, placement: StudioPlacement, alpha: number, selected: boolean) {
  const root = rootMesh(B, scene, placement);
  const panelMat = material(B, scene, placement.color, Math.min(alpha, 0.48), selected);
  const edgeMat = material(B, scene, placement.color, alpha, selected);
  const panel = mark(B.MeshBuilder.CreateBox(`${placement.id}-panel`, { width: 1.62, height: 1.62, depth: 0.08 }, scene), placement.id);
  panel.material = panelMat;
  panel.parent = root;
  [[0, 0.91, 1.88, 0.18], [0, -0.91, 1.88, 0.18], [-0.91, 0, 0.18, 1.88], [0.91, 0, 0.18, 1.88]].forEach(([x, y, width, height], index) => {
    const edge = mark(B.MeshBuilder.CreateBox(`${placement.id}-edge-${index}`, { width, height, depth: 0.14 }, scene), placement.id);
    edge.position.x = x;
    edge.position.y = y;
    edge.material = edgeMat;
    edge.parent = root;
  });
  return root;
}

function rightTriangle(B: any, scene: any, placement: StudioPlacement, alpha: number, selected: boolean) {
  const root = rootMesh(B, scene, placement);
  const edgeMat = material(B, scene, placement.color, alpha, selected);
  const panelMat = material(B, scene, placement.color, Math.min(alpha, 0.44), selected);
  const panel = mark(new B.Mesh(`${placement.id}-panel`, scene), placement.id);
  const positions = [-0.86, -0.86, 0, 0.86, -0.86, 0, -0.86, 0.86, 0];
  const indices = [0, 1, 2];
  const normals: number[] = [];
  B.VertexData.ComputeNormals(positions, indices, normals);
  const data = new B.VertexData();
  data.positions = positions;
  data.indices = indices;
  data.normals = normals;
  data.applyToMesh(panel);
  panel.material = panelMat;
  panel.parent = root;

  const edge = (name: string, length: number, x: number, y: number, z: number) => {
    const mesh = mark(B.MeshBuilder.CreateBox(name, { width: length, height: 0.18, depth: 0.14 }, scene), placement.id);
    mesh.position.x = x;
    mesh.position.y = y;
    mesh.rotation.z = z;
    mesh.material = edgeMat;
    mesh.parent = root;
  };
  edge(`${placement.id}-bottom`, 1.9, 0, -0.91, 0);
  edge(`${placement.id}-left`, 1.9, -0.91, 0, Math.PI / 2);
  edge(`${placement.id}-diag`, 2.56, 0, 0, -Math.PI / 4);
  return root;
}

function ramp(B: any, scene: any, placement: StudioPlacement, alpha: number, selected: boolean) {
  const root = rootMesh(B, scene, placement);
  const body = mark(B.MeshBuilder.CreateBox(`${placement.id}-body`, { width: 1.8, height: 0.18, depth: 5.4 }, scene), placement.id);
  body.material = material(B, scene, placement.color, alpha, selected);
  body.parent = root;
  return root;
}

function makePlacement(piece: StudioPieceKind, color: string, step: number): StudioPlacement {
  return { id: crypto.randomUUID(), piece, color, position: [0, 1, 0], rotation: [0, 0, 0], step };
}

function snapTransform(node: any) {
  const p = (value: number) => Math.round(value / POSITION_SNAP) * POSITION_SNAP;
  const r = (value: number) => Math.round(value / ROTATION_SNAP) * ROTATION_SNAP;
  return {
    position: [p(node.position.x), p(node.position.y), p(node.position.z)] as [number, number, number],
    rotation: [r(node.rotation.x), r(node.rotation.y), r(node.rotation.z)] as [number, number, number],
  };
}

export default function StudioEditor({ initialBuild, initialBuildId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [build, setBuild] = useState<StudioBuild>(() => initialBuild ?? createBlankStudioBuild());
  const [buildId, setBuildId] = useState<string | null>(initialBuildId);
  const [step, setStep] = useState(() => initialBuild ? studioStepCount(initialBuild) : 1);
  const [pieceToAdd, setPieceToAdd] = useState<StudioPieceKind>("square");
  const [colorToAdd, setColorToAdd] = useState(studioPalette[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<TransformMode>("move");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<SaveState>(initialBuildId ? "clean" : "dirty");
  const [saveError, setSaveError] = useState<string | null>(null);

  const selected = build.placements.find((item) => item.id === selectedId) ?? null;
  const maxStep = Math.max(step, studioStepCount(build));
  const counts = useMemo(() => studioPieceCounts(build), [build]);

  const dirty = () => {
    setSaveState("dirty");
    setSaveError(null);
  };

  const updateSelected = (updater: (placement: StudioPlacement) => StudioPlacement) => {
    if (!selectedId) return;
    setBuild((current) => ({ ...current, placements: current.placements.map((item) => item.id === selectedId ? updater(item) : item) }));
    dirty();
  };

  useEffect(() => {
    let engine: any;
    let scene: any;
    let resize: (() => void) | undefined;
    let cancelled = false;

    ensureBabylon().then((B) => {
      if (cancelled || !canvasRef.current) return;
      engine = new B.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
      scene = new B.Scene(engine);
      scene.clearColor = new B.Color4(0.965, 0.97, 0.98, 1);

      const camera = new B.ArcRotateCamera("camera", -Math.PI / 2.5, Math.PI / 2.7, 18, new B.Vector3(0, 4, 0), scene);
      camera.lowerRadiusLimit = 7;
      camera.upperRadiusLimit = 34;
      camera.wheelPrecision = 32;
      camera.pinchPrecision = 120;
      camera.attachControl(canvasRef.current, true);

      const hemi = new B.HemisphericLight("hemi", new B.Vector3(0, 1, 0), scene);
      hemi.intensity = 1.05;
      const directional = new B.DirectionalLight("directional", new B.Vector3(-0.4, -1, 0.35), scene);
      directional.position = new B.Vector3(8, 18, -8);
      directional.intensity = 0.55;

      const ground = B.MeshBuilder.CreateGround("ground", { width: 28, height: 28 }, scene);
      const groundMat = new B.StandardMaterial("ground-mat", scene);
      groundMat.diffuseColor = new B.Color3(0.91, 0.92, 0.94);
      groundMat.specularColor = B.Color3.Black();
      ground.material = groundMat;

      const roots = new Map<string, any>();
      for (const placement of build.placements) {
        if (placement.step > step) continue;
        const alpha = placement.step === step ? 0.98 : 0.42;
        const isSelected = placement.id === selectedId;
        const root = placement.piece === "square"
          ? square(B, scene, placement, alpha, isSelected)
          : placement.piece === "right-triangle"
            ? rightTriangle(B, scene, placement, alpha, isSelected)
            : ramp(B, scene, placement, alpha, isSelected);
        root.position.set(...placement.position);
        root.rotation.set(...placement.rotation);
        roots.set(placement.id, root);
      }

      const gizmos = new B.GizmoManager(scene);
      gizmos.usePointerToAttachGizmos = false;
      gizmos.positionGizmoEnabled = mode === "move";
      gizmos.rotationGizmoEnabled = mode === "rotate";
      if (gizmos.gizmos.positionGizmo) gizmos.gizmos.positionGizmo.snapDistance = POSITION_SNAP;
      if (gizmos.gizmos.rotationGizmo) gizmos.gizmos.rotationGizmo.snapDistance = ROTATION_SNAP;

      const selectedRoot = selectedId ? roots.get(selectedId) : null;
      if (selectedRoot) gizmos.attachToMesh(selectedRoot);

      const sync = () => {
        if (!selectedId || !selectedRoot) return;
        const transform = snapTransform(selectedRoot);
        setBuild((current) => ({
          ...current,
          placements: current.placements.map((item) => item.id === selectedId ? { ...item, ...transform } : item),
        }));
        dirty();
      };

      const behaviors: any[] = [];
      const position = gizmos.gizmos.positionGizmo;
      const rotation = gizmos.gizmos.rotationGizmo;
      if (position) behaviors.push(position.xGizmo.dragBehavior, position.yGizmo.dragBehavior, position.zGizmo.dragBehavior);
      if (rotation) behaviors.push(rotation.xGizmo.dragBehavior, rotation.yGizmo.dragBehavior, rotation.zGizmo.dragBehavior);
      behaviors.forEach((behavior) => {
        behavior.onDragStartObservable.add(() => camera.detachControl());
        behavior.onDragEndObservable.add(() => {
          camera.attachControl(canvasRef.current, true);
          sync();
        });
      });

      scene.onPointerDown = (_event: unknown, pick: any) => {
        const id = pick?.pickedMesh?.metadata?.studioPlacementId;
        if (id) setSelectedId(id);
        else if (pick?.pickedMesh === ground) setSelectedId(null);
      };

      engine.runRenderLoop(() => scene.render());
      resize = () => engine?.resize();
      window.addEventListener("resize", resize);
    }).catch(() => {
      if (!cancelled) setLoadError("The 3D editor could not load. Refresh and try again.");
    });

    return () => {
      cancelled = true;
      if (resize) window.removeEventListener("resize", resize);
      scene?.dispose();
      engine?.dispose();
    };
  }, [build, step, selectedId, mode]);

  const addPiece = () => {
    const placement = makePlacement(pieceToAdd, colorToAdd, step);
    setBuild((current) => ({ ...current, placements: [...current.placements, placement] }));
    setSelectedId(placement.id);
    setMode("move");
    dirty();
  };

  const duplicate = () => {
    if (!selected) return;
    const copy = { ...selected, id: crypto.randomUUID(), position: [selected.position[0] + 0.5, selected.position[1], selected.position[2] + 0.5] as [number, number, number] };
    setBuild((current) => ({ ...current, placements: [...current.placements, copy] }));
    setSelectedId(copy.id);
    dirty();
  };

  const remove = () => {
    if (!selectedId) return;
    setBuild((current) => ({ ...current, placements: current.placements.filter((item) => item.id !== selectedId) }));
    setSelectedId(null);
    dirty();
  };

  const save = async () => {
    setSaveState("saving");
    setSaveError(null);
    try {
      const response = await fetch("/api/studio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buildId, build }),
      });
      const result = await response.json() as { buildId?: string; error?: string };
      if (!response.ok || !result.buildId) throw new Error(result.error || "Save failed");
      setBuildId(result.buildId);
      setSaveState("saved");
      window.history.replaceState(null, "", `/studio?build=${encodeURIComponent(result.buildId)}`);
    } catch (error) {
      setSaveState("error");
      setSaveError(error instanceof Error ? error.message : "We couldn’t save this build.");
    }
  };

  const clear = () => {
    if (!window.confirm("Clear every piece from this workspace? Your last saved version remains in My Builds until you save again.")) return;
    setBuild((current) => ({ ...createBlankStudioBuild(current.title), title: current.title }));
    setStep(1);
    setSelectedId(null);
    dirty();
  };

  return (
    <div className="studio-layout studio-editor-layout">
      <aside className="studio-sidebar studio-toolbox">
        <section className="studio-info-card">
          <p className="section-kicker">Add Piece</p>
          <label className="studio-field">Piece
            <select value={pieceToAdd} onChange={(event) => setPieceToAdd(event.target.value as StudioPieceKind)}>
              {studioPieceOptions.map((piece) => <option key={piece} value={piece}>{studioPieceLabels[piece]}</option>)}
            </select>
          </label>
          <div className="studio-color-row" aria-label="Piece color">
            {studioPalette.map((color) => <button key={color} type="button" className={color === colorToAdd ? "studio-color is-selected" : "studio-color"} style={{ background: color }} onClick={() => setColorToAdd(color)} aria-label={`Use ${color}`} />)}
          </div>
          <button className="studio-primary-button" type="button" onClick={addPiece}>+ Add to Step {step}</button>
        </section>

        <section className="studio-info-card">
          <p className="section-kicker">Selected Piece</p>
          {selected ? <>
            <h2>{studioPieceLabels[selected.piece]}</h2>
            <p className="studio-muted">Use the handles directly on the tile to move or rotate it.</p>
            <label className="studio-field">Step
              <input type="number" min="1" value={selected.step} onChange={(event) => updateSelected((item) => ({ ...item, step: Math.max(1, Number(event.target.value) || 1) }))} />
            </label>
            <label className="studio-field">Color
              <input type="color" value={selected.color} onChange={(event) => updateSelected((item) => ({ ...item, color: event.target.value }))} />
            </label>
            <div className="studio-row-actions">
              <button type="button" onClick={duplicate}>Duplicate</button>
              <button className="studio-danger-button" type="button" onClick={remove}>Delete</button>
            </div>
          </> : <p className="studio-muted">Click a tile in the workspace to edit it.</p>}
        </section>
      </aside>

      <section className="studio-viewer-card studio-editor-card">
        <div className="studio-viewer-header studio-editor-header">
          <label className="studio-title-field"><span>Build name</span>
            <input value={build.title} onChange={(event) => { setBuild((current) => ({ ...current, title: event.target.value })); dirty(); }} />
          </label>
          <span className="studio-step-pill">Step {step} of {maxStep}</span>
        </div>

        <div className="studio-canvas-shell studio-editor-canvas">
          {loadError ? <div className="studio-error">{loadError}</div> : <canvas ref={canvasRef} aria-label="3D magnetic tile placement editor" />}
          <div className="studio-transform-toolbar" aria-label="Transform controls">
            <button type="button" className={mode === "move" ? "is-active" : ""} onClick={() => setMode("move")} disabled={!selected}>↔ Move</button>
            <button type="button" className={mode === "rotate" ? "is-active" : ""} onClick={() => setMode("rotate")} disabled={!selected}>↻ Rotate</button>
          </div>
          <div className="studio-canvas-help">Click a piece to select · Drag empty space to orbit · Scroll/pinch to zoom</div>
        </div>

        <div className="studio-step-controls">
          <button type="button" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1}>← Step</button>
          <strong>Step<br />{step} of {maxStep}</strong>
          <button type="button" onClick={() => setStep((value) => value + 1)}>{step === maxStep ? "New Step →" : "Next Step →"}</button>
        </div>
      </section>

      <aside className="studio-sidebar studio-save-panel">
        <section className="studio-info-card">
          <p className="section-kicker">Your Build</p>
          <button className="studio-primary-button" type="button" onClick={save} disabled={saveState === "saving"}>{saveState === "saving" ? "Saving…" : buildId ? "Save Changes" : "Save to My Builds"}</button>
          {saveState === "saved" ? <p className="studio-save-success">✓ Saved to My Builds</p> : null}
          {saveState === "dirty" ? <p className="studio-muted">Unsaved changes</p> : null}
          {saveState === "clean" ? <p className="studio-muted">Loaded from My Builds</p> : null}
          {saveState === "error" ? <p className="studio-save-error">{saveError}</p> : null}
          {buildId ? <Link className="studio-secondary-button" href={`/builds/${buildId}`}>View Build</Link> : null}
          <button className="studio-secondary-button" type="button" onClick={clear}>Clear Workspace</button>
        </section>

        <section className="studio-info-card">
          <p className="section-kicker">Piece Count</p>
          <div className="studio-count-list">
            <div><strong>{counts.square}</strong><span>Square</span></div>
            <div><strong>{counts["right-triangle"]}</strong><span>Right Triangle</span></div>
            <div><strong>{counts.ramp}</strong><span>Track Slope Ramp</span></div>
          </div>
        </section>
      </aside>
    </div>
  );
}
