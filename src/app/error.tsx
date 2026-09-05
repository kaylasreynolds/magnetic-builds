"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Something went wrong</h1>
      <p>Magnetic Builds hit an unexpected error.</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
