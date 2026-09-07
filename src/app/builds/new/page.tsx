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
        <p className="collection-subtitle">Add the photos you want to remember. A title is optional.</p>
      </div>
      <BuildForm />
    </section>
  );
}
