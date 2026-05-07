import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "@noctra/styles/index.css";
import "./styles.css";
import { Alert,
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Divider,
  IconButton,
  Input,
  Modal,
  NoctraProvider,
  Skeleton,
  Spinner,
  Tooltip } from "./components/docs-system/NoctraRuntimeMock";
import type { NcAccentMode, NcDensity, NcRadiusMode } from "./components/docs-system/NoctraRuntimeMock";
import { buttonDoc } from "./registry/button.docs";
import { defaultButtonPlaygroundState, generateButtonCode } from "./playground/buttonPlayground";
import type { ButtonPlaygroundState } from "./playground/buttonPlayground";
import { DocsTable } from "./components/DocsTable";
import { TokenInspector } from "./components/TokenInspector";
import { ComponentDocsOverview } from "./components/ComponentDocsOverview";
import { FoundationQualityGate } from "./components/FoundationQualityGate";
import { AccessibilityAudit } from "./components/AccessibilityAudit";

const arrowIcon = <span aria-hidden="true">→</span>;

const searchIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.473 9.765l2.631 2.63a.75.75 0 1 0 1.061-1.06l-2.63-2.632A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd" />
  </svg>
);

const settingsIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.17.965.413 1.392.72l1.421-.49a1 1 0 0 1 1.18.436l.68 1.178a1 1 0 0 1-.2 1.241l-1.127.982a6.08 6.08 0 0 1 0 1.312l1.128.982a1 1 0 0 1 .199 1.241l-.68 1.178a1 1 0 0 1-1.18.436l-1.421-.49a6.005 6.005 0 0 1-1.392.72l-.294 1.473a1 1 0 0 1-.981.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.004 6.004 0 0 1-1.392-.72l-1.421.49a1 1 0 0 1-1.18-.436l-.68-1.178a1 1 0 0 1 .2-1.241l1.127-.982a6.073 6.073 0 0 1 0-1.312L3.572 6.362a1 1 0 0 1-.2-1.241l.68-1.178a1 1 0 0 1 1.18-.436l1.421.49c.427-.307.895-.55 1.392-.72l.294-1.473ZM10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" clipRule="evenodd" />
  </svg>
);

const copyIcon = (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M7 2.75A2.75 2.75 0 0 1 9.75 0h5.5A2.75 2.75 0 0 1 18 2.75v5.5A2.75 2.75 0 0 1 15.25 11h-5.5A2.75 2.75 0 0 1 7 8.25v-5.5Z" />
    <path d="M2 7.75A2.75 2.75 0 0 1 4.75 5H5.5a.75.75 0 0 1 0 1.5h-.75c-.69 0-1.25.56-1.25 1.25v7.5c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25v-.75a.75.75 0 0 1 1.5 0v.75A2.75 2.75 0 0 1 12.25 18h-7.5A2.75 2.75 0 0 1 2 15.25v-7.5Z" />
  </svg>
);

function App() {
  const [buttonState, setButtonState] = useState<ButtonPlaygroundState>(defaultButtonPlaygroundState);
  const [modalOpened, setModalOpened] = useState(false);
  const [themeMode, setThemeMode] = useState<"dark" | "light">("dark");
  const [density, setDensity] = useState<NcDensity>("default");
  const [radiusMode, setRadiusMode] = useState<NcRadiusMode>("default");
  const [accent, setAccent] = useState<NcAccentMode>("violet");
  const buttonCode = useMemo(() => generateButtonCode(buttonState), [buttonState]);

  return (
    <NoctraProvider className="docs-shell" theme={themeMode} density={density} radiusMode={radiusMode} accent={accent}>
      <aside className="docs-sidebar">
        <div className="docs-brand">
          <span className="docs-brand-mark">N</span>
          <div>
            <strong>Noctra</strong>
            <span>Design Ecosystem</span>
          </div>
        </div>

        <nav className="docs-nav" aria-label="Documentation navigation">
          <a className="docs-nav-item docs-nav-item-active" href="#overview">Overview</a>
          <a className="docs-nav-item" href="#core">Core</a>
          <a className="docs-nav-item" href="#mvp">MVP Set</a>
          <a className="docs-nav-item" href="#theme">Theme</a>
          <a className="docs-nav-item" href="#component-docs">Component Docs</a>
          <a className="docs-nav-item" href="#button">Button</a>
          <a className="docs-nav-item" href="#playground">Playground</a>
          <a className="docs-nav-item" href="#tokens">Tokens</a>
          <a className="docs-nav-item" href="#quality">Quality Gate</a>
          <a className="docs-nav-item" href="#accessibility">Accessibility</a>
          <a className="docs-nav-item" href="#api">API</a>
        </nav>
      </aside>

      <section className="docs-content">
        <header className="docs-hero" id="overview">
          <div className="docs-kicker">Dark-first premium React design ecosystem</div>
          <h1>Noctra Documentation</h1>
          <p>Token-first components, premium surfaces, controlled states, and playground-ready documentation.</p>
          <div className="docs-actions">
            <Button>Get started</Button>
            <Button variant="surface" tone="neutral">View components</Button>
            <Button variant="ghost" tone="neutral" onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}>
              {themeMode === "dark" ? "Light preview" : "Dark preview"}
            </Button>
          </div>
        </header>

        <section className="docs-section" id="theme">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Theme Foundation</span>
              <h2>Theme Controls</h2>
              <p className="docs-section-description">NoctraProvider now controls theme, density, radius mode, and accent color through data attributes.</p>
            </div>
            <Badge tone="primary" variant="outline">{accent}</Badge>
          </div>

          <Card>
            <CardBody>
              <div className="docs-theme-controls">
                <label>
                  Theme
                  <select value={themeMode} onChange={(event) => setThemeMode(event.target.value as "dark" | "light")}>
                    {["dark", "light"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label>
                  Density
                  <select value={density} onChange={(event) => setDensity(event.target.value as NcDensity)}>
                    {["compact", "default", "comfortable"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label>
                  Radius
                  <select value={radiusMode} onChange={(event) => setRadiusMode(event.target.value as NcRadiusMode)}>
                    {["sharp", "default", "rounded"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>

                <label>
                  Accent
                  <select value={accent} onChange={(event) => setAccent(event.target.value as NcAccentMode)}>
                    {["violet", "indigo", "blue", "cyan", "emerald"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </label>
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="docs-section" id="core">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Core System Proof</span>
              <h2>First Core Components</h2>
              <p className="docs-section-description">Button, Card, Input, Badge, Alert, and Modal now share the same token, surface, state, and anatomy foundation.</p>
            </div>
            <Badge tone="success">12 components</Badge>
          </div>

          <div className="docs-core-grid">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Surface Card</CardTitle>
                <CardDescription>Cards prove the surface, border, radius, and shadow system.</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="docs-card-stack">
                  <Badge tone="primary">Premium surface</Badge>
                  <Badge tone="info" variant="outline">Tokenized</Badge>
                </div>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="surface" tone="neutral">Details</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Quality</CardTitle>
                <CardDescription>Input proves focus, invalid, label, helper, and placeholder contrast.</CardDescription>
              </CardHeader>
              <CardBody>
                <Input label="Project name" placeholder="Noctra dashboard" description="Use a short, readable name." />
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Semantic Feedback</CardTitle>
                <CardDescription>Alert proves semantic color without aggressive visual noise.</CardDescription>
              </CardHeader>
              <CardBody>
                <Alert tone="success" title="Foundation ready">The first component layer is now connected to the Noctra visual system.</Alert>
              </CardBody>
            </Card>

            <Card variant="interactive" interactive>
              <CardHeader>
                <CardTitle>Overlay Test</CardTitle>
                <CardDescription>Modal proves overlay surface, z-index, border, shadow, and close behavior.</CardDescription>
              </CardHeader>
              <CardBody>
                <Button onClick={() => setModalOpened(true)}>Open modal</Button>
              </CardBody>
            </Card>
          </div>
        </section>

        <section className="docs-section" id="mvp">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">MVP Expansion</span>
              <h2>Utility Components</h2>
              <p className="docs-section-description">IconButton, Tooltip, Spinner, Skeleton, Divider, and Avatar complete the first MVP component foundation.</p>
            </div>
            <Badge tone="primary" variant="outline">MVP ready</Badge>
          </div>

          <div className="docs-mvp-grid">
            <Card>
              <CardHeader>
                <CardTitle>Icon actions</CardTitle>
                <CardDescription>Compact accessible actions with labels and selected state.</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="docs-card-stack">
                  <Tooltip content="Search">
                    <IconButton label="Search" icon={searchIcon} />
                  </Tooltip>
                  <Tooltip content="Copy">
                    <IconButton label="Copy" icon={copyIcon} variant="surface" />
                  </Tooltip>
                  <Tooltip content="Settings">
                    <IconButton label="Settings" icon={settingsIcon} selected />
                  </Tooltip>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loading states</CardTitle>
                <CardDescription>Spinner and Skeleton provide calm, reduced-motion aware loading feedback.</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="docs-stack-demo">
                  <Spinner label="Loading" />
                  <Skeleton shape="text" width="80%" />
                  <Skeleton shape="text" width="60%" />
                  <Skeleton shape="rect" height={56} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identity</CardTitle>
                <CardDescription>Avatar supports image, initials, fallback, status, size, and radius.</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="docs-card-stack">
                  <Avatar name="Noctra System" status="online" />
                  <Avatar name="Design Lead" status="away" size="lg" />
                  <Avatar icon={settingsIcon} status="busy" variant="icon" />
                  <Avatar name="Premium UI" size="xl" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Separation</CardTitle>
                <CardDescription>Divider uses role-based borders for sections, menus, and docs blocks.</CardDescription>
              </CardHeader>
              <CardBody>
                <div className="docs-stack-demo">
                  <span className="nc-type-caption">Foundation</span>
                  <Divider label="Tokenized" />
                  <span className="nc-type-caption">Components</span>
                  <Divider variant="dashed" />
                  <span className="nc-type-caption">Playground</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>

        <section className="docs-section" id="component-docs">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Documentation Registry</span>
              <h2>Component Docs Baseline</h2>
              <p className="docs-section-description">Each MVP component now has a documentation metadata contract for anatomy, variants, key tokens, and accessibility notes.</p>
            </div>
            <Badge tone="info" variant="outline">12 docs</Badge>
          </div>

          <ComponentDocsOverview />
        </section>

        <section className="docs-section" id="button">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Core Component</span>
              <h2>{buttonDoc.name}</h2>
              <p className="docs-section-description">{buttonDoc.description}</p>
            </div>
            <span className="docs-status">{buttonDoc.status}</span>
          </div>

          <div className="docs-preview">
            <div className="docs-preview-row">
              <Button>Primary</Button>
              <Button variant="soft">Soft</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="surface" tone="neutral">Surface</Button>
            </div>

            <div className="docs-preview-row">
              <Button tone="success">Success</Button>
              <Button tone="danger">Danger</Button>
              <Button tone="warning">Warning</Button>
              <Button tone="info">Info</Button>
              <Button loading>Loading</Button>
            </div>

            <div className="docs-preview-row">
              <Badge>Neutral</Badge>
              <Badge tone="primary">Primary</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="danger">Danger</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="info">Info</Badge>
            </div>
          </div>
        </section>

        <section className="docs-section" id="playground">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Playground MVP</span>
              <h2>Button Playground</h2>
            </div>
            <Badge tone="primary" variant="outline">{themeMode}</Badge>
          </div>

          <div className="docs-playground">
            <div className="docs-playground-preview">
              <Button
                variant={buttonState.variant}
                tone={buttonState.tone}
                size={buttonState.size}
                radius={buttonState.radius}
                density={buttonState.density}
                loading={buttonState.loading}
                disabled={buttonState.disabled}
                fullWidth={buttonState.fullWidth}
                leftIcon={buttonState.leftIcon ? arrowIcon : undefined}
                rightIcon={buttonState.rightIcon ? arrowIcon : undefined}
              >
                {buttonState.label}
              </Button>
            </div>

            <div className="docs-playground-controls">
              <label>
                Variant
                <select value={buttonState.variant} onChange={(event) => setButtonState({ ...buttonState, variant: event.target.value as ButtonPlaygroundState["variant"] })}>
                  {["solid", "soft", "outline", "ghost", "subtle", "surface", "link"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Tone
                <select value={buttonState.tone} onChange={(event) => setButtonState({ ...buttonState, tone: event.target.value as ButtonPlaygroundState["tone"] })}>
                  {["primary", "neutral", "success", "danger", "warning", "info"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Size
                <select value={buttonState.size} onChange={(event) => setButtonState({ ...buttonState, size: event.target.value as ButtonPlaygroundState["size"] })}>
                  {["xs", "sm", "md", "lg", "xl"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Radius
                <select value={buttonState.radius} onChange={(event) => setButtonState({ ...buttonState, radius: event.target.value as ButtonPlaygroundState["radius"] })}>
                  {["none", "sm", "md", "lg", "xl", "full"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Density
                <select value={buttonState.density} onChange={(event) => setButtonState({ ...buttonState, density: event.target.value as ButtonPlaygroundState["density"] })}>
                  {["compact", "default", "comfortable"].map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>

              <label>
                Label
                <input value={buttonState.label} onChange={(event) => setButtonState({ ...buttonState, label: event.target.value })} />
              </label>

              <label className="docs-check"><input type="checkbox" checked={buttonState.loading} onChange={(event) => setButtonState({ ...buttonState, loading: event.target.checked })} /> Loading</label>
              <label className="docs-check"><input type="checkbox" checked={buttonState.disabled} onChange={(event) => setButtonState({ ...buttonState, disabled: event.target.checked })} /> Disabled</label>
              <label className="docs-check"><input type="checkbox" checked={buttonState.fullWidth} onChange={(event) => setButtonState({ ...buttonState, fullWidth: event.target.checked })} /> Full width</label>
              <label className="docs-check"><input type="checkbox" checked={buttonState.leftIcon} onChange={(event) => setButtonState({ ...buttonState, leftIcon: event.target.checked })} /> Left icon</label>
              <label className="docs-check"><input type="checkbox" checked={buttonState.rightIcon} onChange={(event) => setButtonState({ ...buttonState, rightIcon: event.target.checked })} /> Right icon</label>
            </div>

            <pre className="docs-code"><code>{buttonCode}</code></pre>
          </div>
        </section>

        <section className="docs-section" id="tokens">
          <TokenInspector title="Noctra Token Inspector" limit={14} />
        </section>


        <section className="docs-section" id="quality">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Release Foundation</span>
              <h2>Quality Gate</h2>
              <p className="docs-section-description">The current foundation is tracked through build, component, theme, docs, accessibility, and release gates.</p>
            </div>
            <Badge tone="success" variant="outline">baseline</Badge>
          </div>

          <FoundationQualityGate />
        </section>

        <section className="docs-section" id="accessibility">
          <div className="docs-section-header">
            <div>
              <span className="docs-kicker">Accessibility Pass</span>
              <h2>Accessibility Audit</h2>
              <p className="docs-section-description">Noctra MVP components now include a documented accessibility baseline for actions, forms, overlays, feedback, helpers, and interactive surfaces.</p>
            </div>
            <Badge tone="success" variant="outline">patched</Badge>
          </div>

          <AccessibilityAudit />
        </section>
        <section className="docs-section" id="api">
          <h2>Button API</h2>

          <h3>Anatomy</h3>
          <DocsTable columns={[{ key: "slot", label: "Slot" }, { key: "description", label: "Description" }, { key: "dataSlot", label: "Data Slot" }]} rows={buttonDoc.anatomy} />

          <h3>Props</h3>
          <DocsTable columns={[{ key: "prop", label: "Prop" }, { key: "type", label: "Type" }, { key: "defaultValue", label: "Default" }, { key: "description", label: "Description" }]} rows={buttonDoc.props} />

          <h3>CSS Variables</h3>
          <DocsTable columns={[{ key: "token", label: "Token" }, { key: "purpose", label: "Purpose" }, { key: "slot", label: "Slot" }]} rows={buttonDoc.cssVariables} />

          <h3>Data Attributes</h3>
          <DocsTable columns={[{ key: "attribute", label: "Attribute" }, { key: "values", label: "Values" }, { key: "purpose", label: "Purpose" }]} rows={buttonDoc.dataAttributes} />

          <h3>Accessibility</h3>
          <ul className="docs-list">
            {buttonDoc.accessibility.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      </section>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Noctra Modal"
        description="Overlay, border, radius, shadow, and accessible dialog structure are connected."
        footer={
          <>
            <Button variant="ghost" tone="neutral" onClick={() => setModalOpened(false)}>Cancel</Button>
            <Button onClick={() => setModalOpened(false)}>Confirm</Button>
          </>
        }
      >
        <Alert tone="info" title="Modal foundation">This modal is part of the first core component proof layer.</Alert>
      </Modal>
    </NoctraProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
