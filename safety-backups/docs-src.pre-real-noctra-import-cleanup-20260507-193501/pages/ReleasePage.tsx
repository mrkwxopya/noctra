import { CodeBlock, DataTable, DocCard, PageHero, SectionTitle, StatCard } from "../components/DocsChrome";

const publishOrderRows = [
  ["1", "@noctra/utils", "Shared helpers"],
  ["2", "@noctra/tokens", "Token package"],
  ["3", "@noctra/styles", "CSS package"],
  ["4", "../components/docs-system/NoctraRuntimeMock", "React package"]
];

const decisionRows = [
  ["FINAL_RELEASE_DECISION.md", "Overall package release decision", "Must pass"],
  ["FINAL_DOCS_RELEASE_DECISION.md", "Professional docs release decision", "Must pass"],
  ["PUBLISH_CHECKLIST.md", "Manual publish checklist", "Must be reviewed"],
  ["RELEASE_NOTES.md", "Release-facing notes", "Must be reviewed"],
  ["professional-docs-audit-report.md", "Docs audit", "Problems must be zero"]
];

export function ReleasePage() {
  return (
    <div className="nd-page-stack">
      <PageHero
        eyebrow="Release"
        title="Publish only after docs, packages, and release gates pass."
        description="This page documents the final GitHub, GitHub Pages, and npm release flow for Noctra."
      />

      <div className="nd-stats-grid">
        <StatCard label="GitHub" value="main" description="Primary branch" />
        <StatCard label="Docs" value="Pages" description="GitHub Actions deployment" />
        <StatCard label="npm packages" value="4" description="Publishable packages" />
        <StatCard label="Manual checks" value="Required" description="Checklist before release" />
      </div>

      <section className="nd-doc-section">
        <SectionTitle
          id="decisions"
          eyebrow="Decision files"
          title="Release decision sources"
          description="These files are the source of truth before GitHub release or npm publishing."
        />

        <DocCard title="Decision matrix" premium>
          <DataTable columns={["File", "Purpose", "Requirement"]} rows={decisionRows} />
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="github"
          eyebrow="GitHub"
          title="GitHub publish flow"
          description="Commit after local gates pass. The docs workflow deploys from GitHub Actions."
        />

        <div className="nd-two-grid">
          <DocCard title="Commit and push">
            <CodeBlock>{`git status
git add .
git commit -m "Prepare Noctra release"
git push -u origin main`}</CodeBlock>
          </DocCard>

          <DocCard title="GitHub Pages">
            <CodeBlock>{`Settings > Pages > Source: GitHub Actions

Actions > Deploy Noctra Docs

Expected URL:
https://mrkwxopya.github.io/noctra/`}</CodeBlock>
          </DocCard>
        </div>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="npm"
          eyebrow="npm"
          title="Package publish order"
          description="Publish lower-level packages first, then the React package."
        />

        <DocCard title="Publish order">
          <DataTable columns={["Order", "Package", "Reason"]} rows={publishOrderRows} />
        </DocCard>

        <DocCard title="Safe publish commands">
          <CodeBlock>{`pnpm --filter @noctra/utils publish --access public --no-git-checks
pnpm --filter @noctra/tokens publish --access public --no-git-checks
pnpm --filter @noctra/styles publish --access public --no-git-checks
pnpm --filter @noctra/react publish --access public --no-git-checks`}</CodeBlock>
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="do-not-publish"
          eyebrow="Safety"
          title="Do not publish if"
          description="Stop the release if any of these conditions are true."
        />

        <div className="nd-feature-grid">
          <DocCard title="Build or typecheck fails" description="Any TypeScript, package, or docs build failure blocks release." />
          <DocCard title="Audit reports problems" description="Critical reports must have zero problems." />
          <DocCard title="Docs page is broken" description="GitHub Pages must load assets under /noctra/assets." />
        </div>
      </section>
    </div>
  );
}
