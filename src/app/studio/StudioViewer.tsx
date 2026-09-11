"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

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
const STORAGE_KEY = "tileable-studio-build-v1";
const MOVE_INCREMENT = 0.5;
const ROTATE_INCREMENT = Math.PI / 4;

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

function createMaterial(B: any, scene: any, color: string, alpha: number, selected: boolean) {
  const material = new B.StandardMaterial(`mat-${color}-${Math.random()}`, scene);
  const c = B.Color3.FromHexString(color);
  material.diffuseColor = c;
  material.emissiveColor = selected ? new B.Color3(0.34, 0.34, 0.34) : c.scale(0.1);
  material.specularColor = new B.Color3(0.45, 0.45, 0.45);
  material.alpha = alpha;
  material.backFaceCulling = false;
  return material;
}

function markMesh(mesh: any, placementId: string) {
  mesh.metadata = { ...(mesh.metadata ?? {}), studioPlacementId: placementId };
  return mesh;
}

function addSquare(B: any, scene: any, placement: StudioPlacement, alpha: number, selected: boolean) {
  const root = new B.TransformNode(placement.id, scene);
  const panelMaterial = createMaterial(B, scene, placement.color, Math.min(alpha, 0.48), selected);
  const edgeMaterial = createMaterial(B, scene, placement.color, alpha, selected);
  const panel = markMesh(B.MeshBuilder.CreateBox(`${placement.id}-panel`, { width: 1.62, height: 1.62, depth: 0.08 }, scene), placement.id);
  panel.material = panelMaterial;
  panel.parent = root;
  [[0, 0.91, 1.88, 0.18], [0, -0.91, 1.88, 0.18], [-0.91, 0, 0.18, 1.88], [0.91, 0, 0.18, 1.88]].forEach(([x, y, width, height], index) => {
    const edge = markMesh(B.MeshBuilder.CreateBox(`${placement.id}-edge-${index}`, { width, height, depth: 0.14 }, scene), placement.id);
    edge.position.x = x;
    edge.position.y = y;
    edge.material = edgeMaterial;
    edge.parent = root;
  });
  return root;
}

function addTriangle(B: any, scene: any, placement: StudioPlacement, alpha: number, selected: boolean) {
  const root = new B.TransformNode(placement.id, scene);
  const edgeMaterial = createMaterial(B, scene, placement.color, alpha, selected);
  const panelMaterial = createMaterial(B, scene, placement.color, Math.min(alpha, 0.44), selected);
  const panel = markMesh(new B.Mesh(`${placement.id}-panel`, scene), placement.id);
  const positions = [-0.86, -0.86, 0, 0.86, -0.86, 0, -0.86, 0.86, 0];
  const indices = [0, 1, 2];
  const normals: number[] = [];
  B.VertexData.ComputeNormals(positions, indices, normals);
  const vertexData = new B.VertexData();
  vertexData.positions = positions;
  vertexData.indices = indices;
  vertexData.normals = normals;
  vertexData.applyToMesh(panel);
  panel.material = panelMaterial;
  panel.parent = root;
  const makeEdge = (name: string, length: number, x: number, y: number, zRotation: number) => {
    const edge = markMesh(B.MeshBuilder.CreateBox(name, { width: length, height: 0.18, depth: 0.14 }, scene), placement.id);
    edge.position.x = x;
    edge.position.y = y;
    edge.rotation.z = zRotation;
    edge.material = edgeMaterial;
    edge.parent = root;
  };
  makeEdge(`${placement.id}-bottom`, 1.9, 0, -0.91, 0);
  makeEdge(`${placement.id}-left`, 1.9, -0.91, 0, Math.PI / 2);
  makeEdge(`${placement.id}-diag`, 2.56, 0, 0, -Math.PI / 4);
  return root;
}

function addRamp(B: any, scene: any, placement: StudioPlacement, alpha: number, selected: boolean) {
  const root = new B.TransformNode(placement.id, scene);
  const material = createMaterial(B, scene, placement.color, alpha, selected);
  const ramp = markMesh(B.MeshBuilder.CreateBox(`${placement.id}-body`, { width: 1.8, height: 0.18, depth: 5.4 }, scene), placement.id);
  ramp.material = material;
  ramp.parent = root;
  return root;
}

function placeNode(node: any, placement: StudioPlacement) {
  node.position.set(...placement.position);
  node.rotation.set(...placement.rotation);
}

function makePlacement(piece: StudioPieceKind, color: string, step: number): StudioPlacement {
  return {
    id: crypto.randomUUID(),
    piece,
    color,
    position: [0, 1, 0],
    rotation: [0, 0, 0],
    step,
  };
}

export default function StudioViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [build, setBuild] = useState<StudioBuild>(() => createBlankStudioBuild());
  const [step, setStep] = useState(1);
  const [pieceToAdd, setPieceToAdd] = useState<StudioPieceKind>("square");
  const [colorToAdd, setColorToAdd] = useState(studioPalette[0]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState("Not saved yet");
  const selected = build.placements.find((placement) => placement.id === selectedId) ?? null;
  const maxStep = Math.max(step, studioStepCount(build));
  const counts = useMemo(() => studioPieceCounts(build), [build]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved) as StudioBuild;
      if (!parsed || !Array.isArray(parsed.placements)) return;
      setBuild(parsed);
      setStep(studioStepCount(parsed));
      setSavedMessage("Loaded saved draft");
    } catch {
      setSavedMessage("Could not load saved draft");
    }
  }, []);

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

      for (const placement of build.placements) {
        if (placement.step > step) continue;
        const alpha = placement.step === step ? 0.98 : 0.42;
        const isSelected = placement.id === selectedId;
        const node = placement.piece === "square"
          ? addSquare(B, scene, placement, alpha, isSelected)
          : placement.piece === "right-triangle"
            ? addTriangle(B, scene, placement, alpha, isSelected)
            : addRamp(B, scene, placement, alpha, isSelected);
        placeNode(node, placement);
      }

      scene.onPointerDown = (_event: unknown, pickResult: any) => {
        const id = pickResult?.pickedMesh?.metadata?.studioPlacementId;
        if (id) setSelectedId(id);
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
  }, [build, step, selectedId]);

  function updateSelected(updater: (placement: StudioPlacement) => StudioPlacement) {
    if (!selectedId) return;
    setBuild((current) => ({
      ...current,
      placements: current.placements.map((placement) => placement.id === selectedId ? updater(placement) : placement),
    }));
    setSavedMessage("Unsaved changes");
  }

  function addPiece() {
    const placement = makePlacement(pieceToAdd, colorToAdd, step);
    setBuild((current) => ({ ...current, placements: [...current.placements, placement] }));
    setSelectedId(placement.id);
    setSavedMessage("Unsaved changes");
  }

  function duplicateSelected() {
    if (!selected) return;
    const copy: StudioPlacement = {
      ...selected,
      id: crypto.randomUUID(),
      position: [selected.position[0] + 0.5, selected.position[1], selected.position[2] + 0.5],
    };
    setBuild((current) => ({ ...current, placements: [...current.placements, copy] }));
    setSelectedId(copy.id);
    setSavedMessage("Unsaved changes");
  }

  function deleteSelected() {
    if (!selectedId) return;
    setBuild((current) => ({ ...current, placements: current.placements.filter((placement) => placement.id !== selectedId) }));
    setSelectedId(null);
    setSavedMessage("Unsaved changes");
  }

  function moveSelected(axis: 0 | 1 | 2, amount: number) {
    updateSelected((placement) => {
      const next: StudioPlacement = { ...placement, position: [...placement.position] as [number, number, number] };
      next.position[axis] = Math.round((next.position[axis] + amount) * 2) / 2;
      return next;
    });
  }

  function rotateSelected(axis: 0 | 1 | 2, amount: number) {
    updateSelected((placement) => {
      const next: StudioPlacement = { ...placement, rotation: [...placement.rotation] as [number, number, number] };
      next.rotation[axis] += amount;
      return next;
    });
  }

  function saveDraft() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(build));
    setSavedMessage("Saved on this device");
  }

  function clearDraft() {
    if (!window.confirm("Clear every piece from this Studio draft?")) return;
    const blank = createBlankStudioBuild();
    setBuild(blank);
    setStep(1);
    setSelectedId(null);
    localStorage.removeItem(STORAGE_KEY);
    setSavedMessage("Blank workspace");
  }

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
            <div className="studio-control-grid">
              <button type="button" onClick={() => moveSelected(0, -MOVE_INCREMENT)}>← X</button>
              <button type="button" onClick={() => moveSelected(0, MOVE_INCREMENT)}>X →</button>
              <button type="button" onClick={() => moveSelected(1, MOVE_INCREMENT)}>↑ Up</button>
              <button type="button" onClick={() => moveSelected(1, -MOVE_INCREMENT)}>↓ Down</button>
              <button type="button" onClick={() => moveSelected(2, -MOVE_INCREMENT)}>← Z</button>
              <button type="button" onClick={() => moveSelected(2, MOVE_INCREMENT)}>Z →</button>
            </div>
            <p className="studio-mini-label">Rotate 45°</p>
            <div className="studio-control-grid studio-rotate-grid">
              <button type="button" onClick={() => rotateSelected(0, ROTATE_INCREMENT)}>X</button>
              <button type="button" onClick={() => rotateSelected(1, ROTATE_INCREMENT)}>Y</button>
              <button type="button" onClick={() => rotateSelected(2, ROTATE_INCREMENT)}>Z</button>
            </div>
            <label className="studio-field">Step
              <input type="number" min="1" value={selected.step} onChange={(event) => updateSelected((placement) => ({ ...placement, step: Math.max(1, Number(event.target.value) || 1) }))} />
            </label>
            <label className="studio-field">Color
              <input type="color" value={selected.color} onChange={(event) => updateSelected((placement) => ({ ...placement, color: event.target.value }))} />
            </label>
            <div className="studio-row-actions">
              <button type="button" onClick={duplicateSelected}>Duplicate</button>
              <button type="button" className="studio-danger-button" onClick={deleteSelected}>Delete</button>
            </div>
          </> : <p className="studio-muted">Click a piece in the 3D workspace to edit it.</p>}
        </section>
      </aside>

      <section className="studio-viewer-card studio-editor-card">
        <div className="studio-viewer-header">
          <div>
            <p className="section-kicker">Build Workspace</p>
            <input className="studio-title-input" value={build.title} aria-label="Build title" onChange={(event) => { setBuild((current) => ({ ...current, title: event.target.value })); setSavedMessage("Unsaved changes"); }} />
          </div>
          <span className="studio-step-pill">Step {step}</span>
        </div>
        <div className="studio-canvas-shell">
          {loadError ? <div className="studio-error">{loadError}</div> : <canvas ref={canvasRef} aria-label="Interactive 3D magnetic tile editor" />}
          {build.placements.length === 0 ? <div className="studio-empty-hint">Choose a piece and add it to start building.</div> : null}
          <div className="studio-canvas-help">Drag empty space to orbit · Click a piece to select · Scroll/pinch to zoom</div>
        </div>
        <div className="studio-step-controls">
          <button type="button" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1}>← Step</button>
          <div className="studio-step-status">Step {step} of {maxStep}</div>
          <button type="button" onClick={() => setStep((value) => value + 1)}>New Step →</button>
        </div>
      </section>

      <aside className="studio-sidebar studio-summary-sidebar">
        <section className="studio-info-card">
          <p className="section-kicker">Draft</p>
          <button className="studio-primary-button" type="button" onClick={saveDraft}>Save Draft</button>
          <button className="studio-secondary-button" type="button" onClick={clearDraft}>Clear Workspace</button>
          <p className="studio-muted">{savedMessage}</p>
        </section>
        <section className="studio-info-card">
          <p className="section-kicker">Piece Count</p>
          <div className="studio-count-list">
            {studioPieceOptions.map((piece) => <div key={piece}><strong>{counts[piece]}</strong><span>{studioPieceLabels[piece]}</span></div>)}
          </div>
        </section>
      </aside>
    </div>
  );
}
