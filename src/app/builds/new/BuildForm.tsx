"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_PHOTOS = 8;

type CreateBuildResponse = {
  buildId?: string;
  error?: string;
};

export default function BuildForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  function syncInput(nextFiles: File[]) {
    setFiles(nextFiles);
    const input = inputRef.current;
    if (!input || typeof DataTransfer === "undefined") return;
    const transfer = new DataTransfer();
    nextFiles.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
  }

  function handlePhotos(event: React.ChangeEvent<HTMLInputElement>) {
    syncInput(Array.from(event.target.files ?? []).slice(0, MAX_PHOTOS));
  }

  function removePhoto(index: number) {
    syncInput(files.filter((_, fileIndex) => fileIndex !== index));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/builds", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });

      let result: CreateBuildResponse = {};
      try {
        result = (await response.json()) as CreateBuildResponse;
      } catch {
        // A non-JSON response is handled by the generic save error below.
      }

      if (!response.ok || !result.buildId) {
        setError(result.error ?? "We couldn’t save this build. Please try again.");
        return;
      }

      router.push(`/builds/${result.buildId}`);
      router.refresh();
    } catch (saveError) {
      console.error("Unable to save build", saveError);
      setError("We couldn’t save this build. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="build-form" encType="multipart/form-data">
      <div className="build-photo-field">
        <div className="build-photo-label-row">
          <label htmlFor="photos">Photos <span>Optional</span></label>
          <small>{files.length}/{MAX_PHOTOS}</small>
        </div>
        <label className="build-photo-picker" htmlFor="photos">
          <strong>{files.length > 0 ? "Choose different photos" : "Add build photos"}</strong>
          <span>JPEG, PNG or WebP · up to 8 photos</span>
        </label>
        <input
          className="build-photo-input"
          id="photos"
          name="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          ref={inputRef}
          onChange={handlePhotos}
          disabled={pending}
        />
      </div>

      {previews.length > 0 ? (
        <div className="build-photo-previews" aria-label="Selected build photos">
          {previews.map(({ file, url }, index) => (
            <div className="build-photo-preview" key={`${file.name}-${file.lastModified}-${index}`}>
              {/* Browser-local preview only; the original file is uploaded when Save Build is pressed. */}
              <img src={url} alt={`Selected build photo ${index + 1}`} />
              {index === 0 ? <span className="cover-badge">Cover</span> : null}
              <button type="button" onClick={() => removePhoto(index)} disabled={pending} aria-label={`Remove photo ${index + 1}`}>×</button>
            </div>
          ))}
        </div>
      ) : null}

      <label htmlFor="title">Title <span>Optional</span></label>
      <input id="title" name="title" type="text" maxLength={160} autoComplete="off" placeholder="What did you build?" disabled={pending} />
      <p className="build-form-help">You can leave this blank and name your build later.</p>
      {error ? <p className="build-error" role="alert">{error}</p> : null}
      <button className="primary-action" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save Build"}
      </button>
    </form>
  );
}
