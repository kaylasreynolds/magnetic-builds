import Link from "next/link";
import StudioViewer from "./StudioViewer";
import "./studio.css";

export default function StudioPage() {
  return (
    <section className="collection-shell studio-shell">
      <div className="studio-page-heading">
        <div>
          <p className="section-kicker">Tileable Build Studio</p>
          <h1>Build it here, piece by piece.</h1>
          <p className="collection-subtitle">Place the magnetic tiles yourself. Tileable keeps the 3D model and instruction steps together.</p>
        </div>
        <Link className="studio-back-link" href="/builds">My Builds</Link>
      </div>
      <StudioViewer />
    </section>
  );
}
