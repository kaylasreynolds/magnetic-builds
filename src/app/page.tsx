import Link from "next/link";

export default function Home() {
  return (
    <section>
      <p className="eyebrow">Milestone 1</p>
      <h1>Build ideas into something real.</h1>
      <p>
        Magnetic Builds is beginning its first collection workflow. The current slice reads your owned sets from D1 and derives the pieces available from those sets.
      </p>
      <p>
        <Link href="/collection">View My Collection</Link>
      </p>
      <p className="note">This is intentionally a functional skeleton. Visual design and collection editing controls come next.</p>
    </section>
  );
}
