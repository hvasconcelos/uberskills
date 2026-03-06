import { describe, expect, it } from "vitest";
import type { SystemPromptFile } from "../system-prompt-builder";
import { buildTestSystemPrompt, isFileReferenced } from "../system-prompt-builder";

const SKILL_CONTENT = "You are a helpful coding assistant.\n\nFollow best practices.";

function makeFile(overrides: Partial<SystemPromptFile> & { path: string }): SystemPromptFile {
  return {
    content: "file content here",
    type: "reference",
    ...overrides,
  };
}

function makeLargeContent(lineCount: number): string {
  return Array.from({ length: lineCount }, (_, i) => `line ${i + 1}`).join("\n");
}

// ---------------------------------------------------------------------------
// isFileReferenced
// ---------------------------------------------------------------------------

describe("isFileReferenced", () => {
  it("returns true when the full path appears in content", () => {
    const content = "Refer to references/api-docs.md for API details.";
    expect(isFileReferenced(content, "references/api-docs.md")).toBe(true);
  });

  it("returns true when only the filename appears in content", () => {
    const content = "Follow the rules in style-guide.md at all times.";
    expect(isFileReferenced(content, "references/style-guide.md")).toBe(true);
  });

  it("returns false when neither path nor filename appears", () => {
    const content = "You are a helpful assistant.";
    expect(isFileReferenced(content, "references/api-docs.md")).toBe(false);
  });

  it("returns false for partial matches that are not the filename", () => {
    const content = "Use the api module.";
    expect(isFileReferenced(content, "references/api-docs.md")).toBe(false);
  });

  it("handles paths with no directory separator", () => {
    const content = "See notes.txt for details.";
    expect(isFileReferenced(content, "notes.txt")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// buildTestSystemPrompt
// ---------------------------------------------------------------------------

describe("buildTestSystemPrompt", () => {
  it("returns resolvedContent unchanged when there are no files", () => {
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [],
    });

    expect(result.systemPrompt).toBe(SKILL_CONTENT);
    expect(result.inlinedCount).toBe(0);
    expect(result.summarizedCount).toBe(0);
  });

  it("inlines small reference files in full", () => {
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/style-guide.md", content: "Use tabs." })],
    });

    expect(result.systemPrompt).toContain("## Skill Reference Files");
    expect(result.systemPrompt).toContain("### File: references/style-guide.md (reference)");
    expect(result.systemPrompt).toContain("Use tabs.");
    expect(result.inlinedCount).toBe(1);
    expect(result.summarizedCount).toBe(0);
  });

  it("always inlines script files regardless of size", () => {
    const largeScript = makeLargeContent(200);
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "scripts/setup.md", content: largeScript, type: "script" })],
    });

    expect(result.systemPrompt).toContain("line 200");
    expect(result.inlinedCount).toBe(1);
    expect(result.summarizedCount).toBe(0);
  });

  it("summarizes large unreferenced reference files with preview", () => {
    const largeReference = makeLargeContent(150);
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/api-docs.md", content: largeReference })],
    });

    expect(result.systemPrompt).toContain("Showing first 20 of 150 lines");
    expect(result.systemPrompt).toContain("130 additional lines omitted");
    expect(result.systemPrompt).toContain("line 1");
    expect(result.systemPrompt).toContain("line 20");
    expect(result.systemPrompt).not.toContain("line 21");
    expect(result.inlinedCount).toBe(0);
    expect(result.summarizedCount).toBe(1);
  });

  it("fully inlines large reference files when referenced by full path", () => {
    const largeReference = makeLargeContent(200);
    const contentWithRef = "You are an assistant.\n\nRefer to references/api-docs.md for guidance.";
    const result = buildTestSystemPrompt({
      resolvedContent: contentWithRef,
      files: [makeFile({ path: "references/api-docs.md", content: largeReference })],
    });

    expect(result.systemPrompt).toContain("line 200");
    expect(result.systemPrompt).not.toContain("omitted for brevity");
    expect(result.inlinedCount).toBe(1);
    expect(result.summarizedCount).toBe(0);
  });

  it("fully inlines large reference files when referenced by filename only", () => {
    const largeReference = makeLargeContent(200);
    const contentWithRef = "Follow the rules in style-guide.md at all times.";
    const result = buildTestSystemPrompt({
      resolvedContent: contentWithRef,
      files: [makeFile({ path: "references/style-guide.md", content: largeReference })],
    });

    expect(result.systemPrompt).toContain("line 200");
    expect(result.inlinedCount).toBe(1);
    expect(result.summarizedCount).toBe(0);
  });

  it("handles mixed referenced and unreferenced large reference files", () => {
    const contentWithRef = "Use api-docs.md as a reference.";
    const result = buildTestSystemPrompt({
      resolvedContent: contentWithRef,
      files: [
        makeFile({ path: "references/api-docs.md", content: makeLargeContent(200) }),
        makeFile({ path: "references/changelog.md", content: makeLargeContent(200) }),
      ],
    });

    // api-docs.md referenced → inlined, changelog.md not referenced → summarized
    expect(result.inlinedCount).toBe(1);
    expect(result.summarizedCount).toBe(1);
    expect(result.systemPrompt).toContain("line 200"); // from api-docs (inlined)
    expect(result.systemPrompt).toContain("Showing first 20 of 200 lines"); // from changelog
  });

  it("respects custom resourceInlineThreshold", () => {
    const content = makeLargeContent(50);
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/data.txt", content })],
      resourceInlineThreshold: 30,
    });

    expect(result.summarizedCount).toBe(1);
    expect(result.systemPrompt).toContain("Showing first 20 of 50 lines");
  });

  it("respects custom previewLines", () => {
    const content = makeLargeContent(150);
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/data.txt", content })],
      previewLines: 5,
    });

    expect(result.systemPrompt).toContain("Showing first 5 of 150 lines");
    expect(result.systemPrompt).toContain("line 5");
    expect(result.systemPrompt).not.toContain("line 6");
  });

  it("orders script files before reference files", () => {
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [
        makeFile({ path: "references/ref.md", content: "reference content" }),
        makeFile({ path: "scripts/init.md", content: "script content", type: "script" }),
      ],
    });

    const scriptIdx = result.systemPrompt.indexOf("scripts/init.md");
    const referenceIdx = result.systemPrompt.indexOf("references/ref.md");
    expect(scriptIdx).toBeLessThan(referenceIdx);
  });

  it("handles mixed inline and summarized files", () => {
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [
        makeFile({ path: "scripts/core.md", content: makeLargeContent(200), type: "script" }),
        makeFile({ path: "references/small.txt", content: "tiny" }),
        makeFile({ path: "references/big.txt", content: makeLargeContent(150) }),
      ],
    });

    expect(result.inlinedCount).toBe(2); // script (always inline) + small reference
    expect(result.summarizedCount).toBe(1); // big unreferenced reference
    expect(result.systemPrompt).toContain("3 file(s) are bundled");
  });

  it("reference file at exactly threshold lines is inlined", () => {
    const content = makeLargeContent(100);
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/exact.txt", content })],
      resourceInlineThreshold: 100,
    });

    expect(result.inlinedCount).toBe(1);
    expect(result.summarizedCount).toBe(0);
  });

  it("reference file at threshold + 1 lines is summarized when unreferenced", () => {
    const content = makeLargeContent(101);
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/over.txt", content })],
      resourceInlineThreshold: 100,
    });

    expect(result.inlinedCount).toBe(0);
    expect(result.summarizedCount).toBe(1);
  });

  it("preserves resolvedContent at the start of systemPrompt", () => {
    const result = buildTestSystemPrompt({
      resolvedContent: SKILL_CONTENT,
      files: [makeFile({ path: "references/a.txt", content: "data" })],
    });

    expect(result.systemPrompt.startsWith(SKILL_CONTENT)).toBe(true);
  });
});
