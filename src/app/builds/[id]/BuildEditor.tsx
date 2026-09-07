"use client";

import { useActionState, useState } from "react";
import type { BuildDetail } from "@/lib/builds";
import { addBuildPhotosAction, removeBuildPhotoAction, setCoverPhotoAction, updateBuildAction } from "./actions";

const INITIAL_STATE = { error: null, success: null };

export default function BuildEditor({ build }: { build: BuildDetail }) {
  const [editing, setEditing] = useState(false);
  const [detailsState, detailsAction, detailsPending] = useActionState(updateBuildAction.bind(null, build.id), INITIAL_STATE);
  const [photosState, photosAction, photosPending] = useActionState(addBuildPhotosAction.bind(null, build.id), INITIAL_STATE);

  return (
    <div className="build-edit-stack">
      <div className="build-edit-heading">
        <div><h2>Build Details</h2><p>Edit the information you want to remember later.</p></div>
        <button className="secondary-action build-edit-toggle" type="button" onClick={() => setEditing((value) => !value)}>{editing ? "Close" : "Edit"}</button>
      </div>

      {editing ? (
        <form action={detailsAction} className="build-edit-form">
          <label htmlFor="edit-title">Title <span>Optional</span></label>
          <input id="edit-title" name="title" type="text" maxLength={160} defaultValue={build.title ?? ""} placeholder="What did you build?" />
          <label htmlFor="edit-description">Description <span>Optional</span></label>
          <textarea id="edit-description" name="description" maxLength={2000} defaultValue={build.description ?? ""} placeholder="What is this build?" rows={4} />
          <label htmlFor="edit-notes">Notes <span>Optional</span></label>
          <textarea id="edit-notes" name="notes" maxLength={2000} defaultValue={build.notes ?? ""} placeholder="Anything you want to remember for next time?" rows={4} />
          <label htmlFor="edit-status">Status</label>
          <select id="edit-status" name="status" defaultValue={build.status}>
            <option value="saved">Saved</option><option value="in_progress">In Progress</option><option value="complete">Complete</option><option value="archived">Archived</option>
          </select>
          {detailsState.error ? <p className="build-error" role="alert">{detailsState.error}</p> : null}
          {detailsState.success ? <p className="build-success" role="status">{detailsState.success}</p> : null}
          <button className="primary-action" type="submit" disabled={detailsPending}>{detailsPending ? "Saving…" : "Save Changes"}</button>
        </form>
      ) : (
        <div className="build-detail-copy">
          <div><span>Description</span><p>{build.description ?? "No description yet."}</p></div>
          <div><span>Notes</span><p>{build.notes ?? "No notes yet."}</p></div>
        </div>
      )}

      <div className="build-photo-manager">
        <div className="build-edit-heading"><div><h2>Photos</h2><p>{build.photos.length}/8 saved · choose any photo as the cover.</p></div></div>
        {build.photos.length > 0 ? (
          <div className="build-manage-photo-grid">
            {build.photos.map((photo, index) => (
              <div className="build-manage-photo" key={photo.id}>
                <img src={`/api/media/${photo.id}`} alt={photo.altText ?? `Build photo ${index + 1}`} />
                <div className="build-photo-actions">
                  {index === 0 ? <span className="cover-badge">Cover</span> : <form action={setCoverPhotoAction.bind(null, build.id, photo.id)}><button type="submit">Make Cover</button></form>}
                  <form action={removeBuildPhotoAction.bind(null, build.id, photo.id)}><button className="danger-link" type="submit">Remove</button></form>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="build-form-help">No photos saved yet.</p>}

        {build.photos.length < 8 ? (
          <form action={photosAction} className="build-add-photo-form" encType="multipart/form-data">
            <input id="add-photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={photosPending} />
            {photosState.error ? <p className="build-error" role="alert">{photosState.error}</p> : null}
            {photosState.success ? <p className="build-success" role="status">{photosState.success}</p> : null}
            <button className="secondary-action" type="submit" disabled={photosPending}>{photosPending ? "Adding…" : "Add Photos"}</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
