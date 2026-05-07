import { CodeBlock, DataTable, DocCard, PageHero, SectionTitle, StatCard } from "../components/DocsChrome";

const gateRows = [
  ["verify-json", "Validates JSON files", "Blocker"],
  ["generate-professional-docs-data", "Generates component docs metadata", "Blocker"],
  ["audit-professional-docs", "Checks docs structure and coverage", "Blocker"],
  ["build packages", "Builds utils, tokens, styles, react", "Blocker"],
  ["verify-exports", "Checks public exports", "Blocker"],
  ["docs typecheck", "Checks docs TypeScript", "Blocker"],
  ["docs build", "Builds Vite docs app", "Blocker"],
  ["final-quality-gate", "Workspace quality summary", "Blocker"],
  ["dist artifact audit", "Checks built package artifacts", "Blocker"],
  ["npm pack dry-run", "Checks package publish payload", "Blocker"]
];

const reportRows = [
  ["professional-docs-audit-report.md", "Docs structure and coverage"],
  ["final-quality-gate-report.md", "Global quality checks"],
  ["package-entry-point-audit-report.md", "Package export entry points"],
  ["dist-artifact-audit-report.md", "Built artifacts"],
  ["npm-pack-dry-run-audit-report.md", "npm publish payload"],
  ["FINAL_RELEASE_DECISION.md", "Final release blocker decision"],
  ["FINAL_DOCS_RELEASE_DECISION.md", "Final docs blocker decision"]
];

export function QualityPage() {
  return (
    <div className="nd-page-stack">
      <PageHero
        eyebrow="Quality gates"
        title="Noctra treats quality gates as part of the product."
        description="The library is checked through build, typecheck, package export, docs generation, docs audit, npm pack dry-run, and final release decision reports."
      />

      <div className="nd-stats-grid">
        <StatCard label="Gate classes" value="10+" description="Build, docs, exports, release" />
        <StatCard label="Critical reports" value="7+" description="Audits and decisions" />
        <StatCard label="Docs checks" value="4+" description="Generated data, audit, typecheck, build" />
        <StatCard label="Release blockers" value="0" description="Required before publish" />
      </div>

      <section className="nd-doc-section">
        <SectionTitle
          id="gate-matrix"
          eyebrow="Gate matrix"
          title="What each quality gate protects"
          description="Every release should be repeatable. These gates catch structural issues before GitHub or npm publishing."
        />

        <DocCard title="Quality gate matrix" premium>
          <DataTable columns={["Gate", "Checks", "Severity"]} rows={gateRows} />
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="reports"
          eyebrow="Reports"
          title="Reports to inspect before publish"
          description="A passing build is not enough. Generated reports explain what was checked."
        />

        <DocCard title="Release report files">
          <DataTable columns={["Report", "Purpose"]} rows={reportRows} />
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="commands"
          eyebrow="Commands"
          title="Local verification sequence"
          description="Run this sequence before pushing important release changes."
        />

        <DocCard title="Recommended local verification">
          <CodeBlock>{`node scripts/verify-json.mjs
node scripts/generate-professional-docs-data.mjs
node scripts/audit-professional-docs.mjs

pnpm --filter @noctra/utils build
pnpm --filter @noctra/tokens build
pnpm --filter @noctra/react build
pnpm --filter @noctra/styles build

node scripts/verify-exports.mjs
pnpm --filter @noctra/docs typecheck
pnpm --filter @noctra/docs build
pnpm typecheck
pnpm build

node scripts/final-quality-gate.mjs
node scripts/final-release-decision.mjs`}</CodeBlock>
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="blocker-logic"
          eyebrow="Blocker logic"
          title="When release must stop"
          description="Noctra should not be published if any critical report still shows unresolved blockers."
        />

        <div className="nd-feature-grid">
          <DocCard title="Build failure" description="Any package or docs build failure blocks release." />
          <DocCard title="Missing artifacts" description="Missing dist files or package exports block release." />
          <DocCard title="Docs audit problems" description="Professional docs audit problems block GitHub docs publishing." />
        </div>
      </section>
    </div>
  );
}