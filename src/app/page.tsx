import Link from "next/link";

export default function Home() {
  return (
    <section>
      <h1>Connect. Create. Explore.</h1>
      <p>
        Keep track of your magnetic tile collection, save the builds you love, and discover what you can create with the pieces you already own.
      </p>
      <p>
        <Link href="/collection">Explore My Collection</Link>
      </p>
    </section>
  );
}
