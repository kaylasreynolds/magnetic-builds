"use client";

import { useActionState } from "react";
import { createBuildAction } from "../actions";

export default function BuildForm() {
  const [state, action, pending] = useActionState(createBuildAction, { error: null });

  return (
    <form action={action} className="build-form">
      <label htmlFor="title">Title <span>Optional</span></label>
      <input id="title" name="title" type="text" maxLength={160} autoComplete="off" placeholder="What did you build?" />
      <p className="build-form-help">You can leave this blank and name your build later.</p>
      {state.error ? <p className="build-error" role="alert">{state.error}</p> : null}
      <button className="primary-action" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save Build"}
      </button>
    </form>
  );
}
