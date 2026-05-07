import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function PreviewFrame({ children }: { children: ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;

    if (!iframe || !doc) return;

    doc.open();
    doc.write('<!doctype html><html><head></head><body><div id="preview-root"></div></body></html>');
    doc.close();

    const base = doc.createElement("base");
    base.href = document.baseURI;
    doc.head.appendChild(base);

    for (const node of Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))) {
      doc.head.appendChild(node.cloneNode(true));
    }

    const style = doc.createElement("style");
    style.textContent = `
      :root {
        color-scheme: dark;
      }

      html,
      body,
      #preview-root {
        min-height: 100%;
        margin: 0;
      }

      body {
        background:
          radial-gradient(circle at 0 0, rgba(139, 92, 246, .13), transparent 22rem),
          linear-gradient(180deg, rgba(2, 6, 23, .98), rgba(8, 17, 31, .96));
        color: #f8fafc;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      #preview-root {
        display: grid;
        place-items: center;
        min-height: 100%;
        padding: 24px;
      }

      .noctra-preview-inner {
        width: min(100%, 760px);
      }

      button,
      input,
      select,
      textarea {
        font: inherit;
      }
    `;
    doc.head.appendChild(style);

    const root = doc.getElementById("preview-root");
    setMountNode(root);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      className="nd-preview-frame"
      title="Noctra component preview"
      sandbox="allow-scripts allow-same-origin"
    >
      {mountNode ? createPortal(<div className="noctra-preview-inner">{children}</div>, mountNode) : null}
    </iframe>
  );
}