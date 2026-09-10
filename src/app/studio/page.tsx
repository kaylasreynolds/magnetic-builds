import Link from "next/link";
import StudioViewer from "./StudioViewer";
import "./studio.css";

export default function StudioPage() {
  return (
    <section className="collection-shell studio-shell">
      <div className="studio-page-heading">
        <div>
          <p className="section-kicker">Tileable Build Studio</p>
          <h1>Build instructions you can rotate.</h1>
          <p className="collection-subtitle">A real 3D instruction viewer using magnetic-tile piece data and numbered build steps.</p>
        </div>
        <Link className="studio-back-link" href="/builds">My Builds</Link>
      </div>
      <StudioViewer />
    </section>
  );
}
