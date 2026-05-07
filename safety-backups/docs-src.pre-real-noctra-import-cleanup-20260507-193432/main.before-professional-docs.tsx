import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { DocsShell } from "./components/DocsShell";
import { docsRoutes, type DocsRouteId } from "./data/docsCatalog";
import { HomePage } from "./pages/HomePage";
import { GettingStartedPage } from "./pages/GettingStartedPage";
import { ComponentsPage } from "./pages/ComponentsPage";
import { LayoutPage } from "./pages/LayoutPage";
import { ThemingPage } from "./pages/ThemingPage";
import { TokensPage } from "./pages/TokensPage";
import { AccessibilityPage } from "./pages/AccessibilityPage";
import { ReleasePage } from "./pages/ReleasePage";
import "./docs.css";

function getRouteFromHash(): DocsRouteId {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const normalized = hash.trim() || "home";

  if (normalized === "") return "home";
  if (normalized === "getting-started") return "getting-started";
  if (normalized === "components") return "components";
  if (normalized === "layout") return "layout";
  if (normalized === "theming") return "theming";
  if (normalized === "tokens") return "tokens";
  if (normalized === "accessibility") return "accessibility";
  if (normalized === "release") return "release";

  return "home";
}

function App() {
  const [route, setRoute] = useState<DocsRouteId>(() => getRouteFromHash());

  useEffect(() => {
    const handleHashChange = () => setRoute(getRouteFromHash());

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = `Noctra Docs — ${docsRoutes.find((item) => item.id === route)?.label ?? "Overview"}`;
  }, [route]);

  const page = useMemo(() => {
    switch (route) {
      case "getting-started":
        return <GettingStartedPage />;
      case "components":
        return <ComponentsPage />;
      case "layout":
        return <LayoutPage />;
      case "theming":
        return <ThemingPage />;
      case "tokens":
        return <TokensPage />;
      case "accessibility":
        return <AccessibilityPage />;
      case "release":
        return <ReleasePage />;
      case "home":
      default:
        return <HomePage />;
    }
  }, [route]);

  return <DocsShell activeRoute={route}>{page}</DocsShell>;
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