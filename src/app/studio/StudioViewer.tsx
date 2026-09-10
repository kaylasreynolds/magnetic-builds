"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useMemo, useRef, useState } from "react";
import { demoStudioBuild, studioPieceCounts, studioStepCount, type StudioPlacement } from "@/lib/studio-model";

const BABYLON_CDN = "https://cdn.babylonjs.com/babylon.js";

function ensureBabylon() {
  return new Promise<any>((resolve, reject) => {
    const existing = (window as any).BABYLON;
    if (existing) {
      resolve(existing);
      return;
    }

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

function createMaterial(B: any, scene: any, color: string, alpha: number) {
  const material = new B.StandardMaterial(`mat-${color}-${alpha}-${Math.random()}`, scene);
  const c = B.Color3.FromHexString(color);
  material.diffuseColor = c;
  material.emissiveColor = c.scale(0.12);
  material.specularColor = new B.Color3(0.45, 0.45, 0.45);
  material.alpha = alpha;
  material.backFaceCulling = false;
  return material;
}

function addSquare(B: any, scene: any, placement: StudioPlacement, alpha: number) {
  const root = new B.TransformNode(placement.id, scene);
  const panelMaterial = createMaterial(B, scene, placement.color, Math.min(alpha, 0.48));
  const edgeMaterial = createMaterial(B, scene, placement.color, alpha);

  const panel = B.MeshBuilder.CreateBox(`${placement.id}-panel`, { width: 1.62, height: 1.62, depth: 0.08 }, scene);
  panel.material = panelMaterial;
  panel.parent = root;

  const edgeSpecs: Array<[number, number, number, number]> = [
    [0, 0.91, 1.88, 0.18],
    [0, -0.91, 1.88, 0.18],
    [-0.91, 0, 0.18, 1.88],
    [0.91, 0, 0.18, 1.88],
  ];

  edgeSpecs.forEach(([x, y, width, height], index) => {
    const edge = B.MeshBuilder.CreateBox(`${placement.id}-edge-${index}`, { width, height, depth: 0.14 }, scene);
    edge.position.x = x;
    edge.position.y = y;
    edge.material = edgeMaterial;
    edge.parent = root;
  });

  return root;
}

function addTriangle(B: any, scene: any, placement: StudioPlacement, alpha: number) {
  const root = new B.TransformNode(placement.id, scene);
  const edgeMaterial = createMaterial(B, scene, placement.color, alpha);
  const panelMaterial = createMaterial(B, scene, placement.color, Math.min(alpha, 0.44));

  const panel = new B.Mesh(`${placement.id}-panel`, scene);
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
    const edge = B.MeshBuilder.CreateBox(name, { width: length, height: 0.18, depth: 0.14 }, scene);
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

function addRamp(B: any, scene: any, placement: StudioPlacement, alpha: number) {
  const root = new B.TransformNode(placement.id, scene);
  const material = createMaterial(B, scene, placement.color, alpha);
  const ramp = B.MeshBuilder.CreateBox(`${placement.id}-body`, { width: 1.8, height: 0.18, depth: 4.4 }, scene);
  ramp.material = material;
  ramp.parent = root;
  return root;
}

function placeMesh(node: any, placement: StudioPlacement) {
  node.position.set(...placement.position);
  node.rotation.set(...placement.rotation);
}

export default function StudioViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [step, setStep] = useState(10);
  const [loadError, setLoadError] = useState<string | null>(null);
  const maxStep = studioStepCount(demoStudioBuild);
  const counts = useMemo(() => studioPieceCounts(demoStudioBuild), []);
  const newPieces = useMemo(
    () => demoStudioBuild.placements.filter((placement) => placement.step === step),
    [step],
  );

  useEffect(() => {
    let engine: any;
    let scene: any;
    let resize: (() => void) | undefined;
    let cancelled = false;

    ensureBabylon()
      .then((B) => {
        if (cancelled || !canvasRef.current) return;

        engine = new B.Engine(canvasRef.current, true, { preserveDrawingBuffer: true, stencil: true });
        scene = new B.Scene(engine);
        scene.clearColor = new B.Color4(0.965, 0.97, 0.98, 1);

        const camera = new B.ArcRotateCamera("camera", -Math.PI / 2.5, Math.PI / 2.7, 24, new B.Vector3(0, 7, 0), scene);
        camera.lowerRadiusLimit = 10;
        camera.upperRadiusLimit = 34;
        camera.wheelPrecision = 32;
        camera.pinchPrecision = 120;
        camera.attachControl(canvasRef.current, true);

        const hemi = new B.HemisphericLight("hemi", new B.Vector3(0, 1, 0), scene);
        hemi.intensity = 1.05;
        const directional = new B.DirectionalLight("directional", new B.Vector3(-0.4, -1, 0.35), scene);
        directional.position = new B.Vector3(8, 18, -8);
        directional.intensity = 0.55;

        const ground = B.MeshBuilder.CreateGround("ground", { width: 32, height: 32 }, scene);
        const groundMat = new B.StandardMaterial("ground-mat", scene);
        groundMat.diffuseColor = new B.Color3(0.91, 0.92, 0.94);
        groundMat.specularColor = B.Color3.Black();
        ground.material = groundMat;

        for (const placement of demoStudioBuild.placements) {
          if (placement.step > step) continue;
          const alpha = placement.step === step ? 0.96 : 0.38;
          const node = placement.piece === "square"
            ? addSquare(B, scene, placement, alpha)
            : placement.piece === "right-triangle"
              ? addTriangle(B, scene, placement, alpha)
              : addRamp(B, scene, placement, alpha);
          placeMesh(node, placement);
        }

        engine.runRenderLoop(() => scene.render());
        resize = () => engine?.resize();
        window.addEventListener("resize", resize);
      })
      .catch(() => {
        if (!cancelled) setLoadError("The 3D viewer could not load. Refresh and try again.");
      });

    return () => {
      cancelled = true;
      if (resize) window.removeEventListener("resize", resize);
      scene?.dispose();
      engine?.dispose();
    };
  }, [step]);

  return (
    <div className="studio-layout">
      <section className="studio-viewer-card">
        <div className="studio-viewer-header">
          <div>
            <p className="section-kicker">3D Build</p>
            <h1>{demoStudioBuild.title}</h1>
          </div>
          <span className="studio-step-pill">Step {step} of {maxStep}</span>
        </div>

        <div className="studio-canvas-shell">
          {loadError ? <div className="studio-error">{loadError}</div> : <canvas ref={canvasRef} aria-label="Interactive 3D magnetic tile build" />}
          <div className="studio-canvas-help">Drag to rotate · Scroll or pinch to zoom</div>
        </div>

        <div className="studio-step-controls" aria-label="Instruction step controls">
          <button type="button" onClick={() => setStep((value) => Math.max(1, value - 1))} disabled={step === 1}>← Previous</button>
          <div className="studio-step-dots" aria-hidden="true">
            {Array.from({ length: maxStep }, (_, index) => index + 1).map((number) => (
              <span key={number} className={number === step ? "is-active" : number < step ? "is-complete" : ""} />
            ))}
          </div>
          <button type="button" onClick={() => setStep((value) => Math.min(maxStep, value + 1))} disabled={step === maxStep}>Next →</button>
        </div>
      </section>

      <aside className="studio-sidebar">
        <section className="studio-info-card">
          <p className="section-kicker">Build Pieces</p>
          <div className="studio-count-list">
            <div><strong>{counts.square}</strong><span>Squares</span></div>
            <div><strong>{counts["right-triangle"]}</strong><span>Right Triangles</span></div>
            <div><strong>{counts.ramp}</strong><span>Ramp</span></div>
          </div>
        </section>

        <section className="studio-info-card">
          <p className="section-kicker">Add This Step</p>
          <h2>Step {step}</h2>
          {newPieces.length === 0 ? (
            <p className="studio-muted">No new pieces in this step.</p>
          ) : (
            <div className="studio-new-pieces">
              {Object.entries(
                newPieces.reduce<Record<string, number>>((acc, placement) => {
                  const label = placement.piece === "square" ? "Square" : placement.piece === "right-triangle" ? "Right Triangle" : "Ramp";
                  acc[label] = (acc[label] ?? 0) + 1;
                  return acc;
                }, {}),
              ).map(([label, quantity]) => <div key={label}><span>{label}</span><strong>×{quantity}</strong></div>)}
            </div>
          )}
          <p className="studio-muted">Pieces from earlier steps are faded so the new pieces are easy to spot.</p>
        </section>
      </aside>
    </div>
  );
}
