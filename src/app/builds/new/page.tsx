import Link from "next/link";
import BuildForm from "./BuildForm";
import "../builds.css";

export default function NewBuildPage() {
  return (
    <section className="collection-shell builds-shell build-new-shell">
      <Link className="back-link" href="/builds">← My Builds</Link>
      <div>
        <p className="section-kicker">New Build</p>
        <h1>Save a Build</h1>
        <p className="collection-subtitle">Give it a name now, or simply save it and keep moving.</p>
      </div>
      <BuildForm />
    </section>
  );
}
