import { CodeBlock, DataTable, DocCard, PageHero, SectionTitle, StatCard, TagList } from "../components/DocsChrome";

const toneItems = ["primary", "neutral", "success", "danger", "warning", "info"];
const variantItems = ["surface", "soft", "outline", "filled", "ghost", "elevated", "subtle", "interactive"];
const radiusItems = ["none", "sm", "md", "lg", "xl", "full"];
const densityItems = ["compact", "default", "comfortable"];

const tokenRows = [
  ["Global color", "--nc-bg-page", "Page background"],
  ["Surface color", "--nc-bg-surface", "Card, panel, and overlay surfaces"],
  ["Text color", "--nc-text-primary", "Primary readable text"],
  ["Muted text", "--nc-text-muted", "Descriptions, captions, helper text"],
  ["Accent", "--nc-accent-rgb", "Brand and interactive emphasis"],
  ["Radius", "--nc-radius-lg", "Reusable corner radius"],
  ["Shadow", "--nc-shadow-md", "Elevation primitive"],
  ["Component", "--nc-card-bg", "Component-specific surface token"]
];

export function ThemingPage() {
  return (
    <div className="nd-page-stack">
      <PageHero
        eyebrow="Theming & tokens"
        title="Token-first styling without heavy runtime theme logic."
        description="Noctra uses CSS variables, component tokens, tones, variants, radius, density, and predictable naming to keep styling stable across apps and documentation."
      />

      <div className="nd-stats-grid">
        <StatCard label="Tones" value={toneItems.length} description="Semantic color intent" />
        <StatCard label="Variants" value={variantItems.length} description="Surface and emphasis styles" />
        <StatCard label="Radius scale" value={radiusItems.length} description="Reusable shape tokens" />
        <StatCard label="Density modes" value={densityItems.length} description="Compact to comfortable UI" />
      </div>

      <section className="nd-doc-section">
        <SectionTitle
          id="system-props"
          eyebrow="System props"
          title="Shared appearance vocabulary"
          description="Components should speak the same visual language across the whole library."
        />

        <div className="nd-two-grid">
          <DocCard title="Tones" description="Semantic color intent for feedback, actions, and status.">
            <TagList items={toneItems} />
          </DocCard>

          <DocCard title="Variants" description="Surface and emphasis styles for component states.">
            <TagList items={variantItems} />
          </DocCard>

          <DocCard title="Radius" description="Corner shape scale.">
            <TagList items={radiusItems} />
          </DocCard>

          <DocCard title="Density" description="Spacing density scale.">
            <TagList items={densityItems} />
          </DocCard>
        </div>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="token-map"
          eyebrow="Token map"
          title="Core token conventions"
          description="Tokens should be readable, stable, and easy to override from plain CSS."
        />

        <DocCard title="Token examples" premium>
          <DataTable columns={["Area", "Token", "Purpose"]} rows={tokenRows} />
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="theme-override"
          eyebrow="Customization"
          title="Application theme override"
          description="A product can customize Noctra by overriding CSS variables at the app root."
        />

        <DocCard title="Dark product theme">
          <CodeBlock>{`:root {
  --nc-bg-page: #050a12;
  --nc-bg-surface: #08111f;
  --nc-text-primary: #f8fafc;
  --nc-text-muted: #94a3b8;
  --nc-accent-rgb: 139, 92, 246;
  --nc-radius-lg: 1rem;
  --nc-shadow-md: 0 16px 48px rgba(0, 0, 0, .28);
}`}</CodeBlock>
        </DocCard>
      </section>

      <section className="nd-doc-section">
        <SectionTitle
          id="component-tokens"
          eyebrow="Component tokens"
          title="Component-specific token strategy"
          description="Component tokens should be local enough to style one component and predictable enough to document automatically."
        />

        <div className="nd-two-grid">
          <DocCard title="Card component token pattern">
            <CodeBlock>{`--nc-card-bg
--nc-card-border
--nc-card-text
--nc-card-radius
--nc-card-padding
--nc-card-shadow`}</CodeBlock>
          </DocCard>

          <DocCard title="Button component token pattern">
            <CodeBlock>{`--nc-button-bg
--nc-button-color
--nc-button-border
--nc-button-radius
--nc-button-height
--nc-button-padding`}</CodeBlock>
          </DocCard>
        </div>
      </section>
    </div>
  );
}