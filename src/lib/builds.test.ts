import assert from "node:assert/strict";
import test from "node:test";
import { displayBuildTitle, makeInitialBuild, normalizeBuildTitle } from "./build-model.ts";

test("a title is trimmed and retained", () => assert.equal(normalizeBuildTitle("  Castle  "), "Castle"));
test("a blank title remains nullable", () => assert.equal(normalizeBuildTitle("   "), null));
test("null and blank titles use the fallback", () => {
  assert.equal(displayBuildTitle(null), "Untitled Build");
  assert.equal(displayBuildTitle(" "), "Untitled Build");
});

test("initial records are private, current, and correctly associated", () => {
  const records = makeInitialBuild(null, "build-id", "version-id", new Date(0));
  assert.equal(records.build.visibility, "private");
  assert.equal(records.build.status, "saved");
  assert.equal(records.version.status, "current");
  assert.equal(records.version.versionOrder, 1);
  assert.equal(records.version.buildId, records.build.id);
});

test("newest-first ordering is deterministic", () => {
  const rows = [{ id: "old", at: 1 }, { id: "new", at: 2 }];
  assert.deepEqual(rows.sort((a, b) => b.at - a.at).map(({ id }) => id), ["new", "old"]);
});
