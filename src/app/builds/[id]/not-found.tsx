import Link from "next/link";

export default function BuildNotFound() {
  return <section className="collection-shell builds-shell builds-empty"><div className="build-empty-state"><h1>Build not found</h1><p>This build may have been removed or the link may be incorrect.</p><Link className="primary-action" href="/builds">Back to My Builds</Link></div></section>;
}
