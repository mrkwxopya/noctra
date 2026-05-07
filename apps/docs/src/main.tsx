import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DocsChrome, type DocsRoute } from "./components/DocsChrome";
import { OverviewPage } from "./pages/OverviewPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { ComponentDetailPage } from "./pages/ComponentDetailPage";
import { ArchitecturePage } from "./pages/ArchitecturePage";
import { ThemingPage } from "./pages/ThemingPage";
import { QualityPage } from "./pages/QualityPage";
import { ReleasePage } from "./pages/ReleasePage";
import { noctraDocsComponents } from "./generated/noctra-professional-docs.generated";
import "./docs.css";

function parseRoute(): { route: DocsRoute; componentSlug?: string } {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);

  if (parts.length === 0) return { route: "overview" };

  if (parts[0] === "components" && parts[1]) {
    return { route: "component", componentSlug: parts[1] };
  }

  if (parts[0] === "components") return { route: "components" };
  if (parts[0] === "architecture") return { route: "architecture" };
  if (parts[0] === "theming") return { route: "theming" };
  if (parts[0] === "quality") return { route: "quality" };
  if (parts[0] === "release") return { route: "release" };

  return { route: "overview" };
}

function App() {
  const [parsedRoute, setParsedRoute] = useState(() => parseRoute());

  useEffect(() => {
    const handleHashChange = () => setParsedRoute(parseRoute());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const component = useMemo(() => {
    if (!parsedRoute.componentSlug) return undefined;

    return noctraDocsComponents.find((item) => item.kebab === parsedRoute.componentSlug);
  }, [parsedRoute.componentSlug]);

  useEffect(() => {
    document.title = component ? `Noctra Docs — ${component.name}` : "Noctra Professional Docs";
  }, [component]);

  const page = useMemo(() => {
    if (parsedRoute.route === "component") {
      return component ? <ComponentDetailPage component={component} /> : <ComponentsPage />;
    }

    if (parsedRoute.route === "components") return <ComponentsPage />;
    if (parsedRoute.route === "architecture") return <ArchitecturePage />;
    if (parsedRoute.route === "theming") return <ThemingPage />;
    if (parsedRoute.route === "quality") return <QualityPage />;
    if (parsedRoute.route === "release") return <ReleasePage />;

    return <OverviewPage />;
  }, [component, parsedRoute.route]);

  return (
    <DocsChrome route={parsedRoute.route}>
      {page}
    </DocsChrome>
  );
}

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);