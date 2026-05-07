# Docs Shell Structure Audit Report

Generated: 2026-05-07T15:05:30.4818262Z

## Files

- apps/docs/src/components/docs-system/NoctraMantineDocs.tsx
- apps/docs/src/docs.css
- apps/docs/src/pages/ButtonReferencePage.tsx

## TSX feature checks

- Table of contents text: yes
- Documentation tab: yes
- Props tab: yes
- Styles API tab: yes
- Previous label: yes
- Next label: yes
- Source label: no
- Package label: no
- Import label: no
- sticky usage: no
- aside usage: yes
- toc class usage: yes
- rail class usage: no
- grid class usage: yes

## CSS feature checks

- grid-template-columns: yes
- position sticky: yes
- max-width: yes
- minmax: yes
- toc selector: yes
- rail selector: no
- related card selector: no
- card selector: yes

## Important line hits

- NoctraMantineDocs.tsx :: Table of contents => 529 - NoctraMantineDocs.tsx :: Documentation => 19, 169, 202, 210, 214, 216, 224 - NoctraMantineDocs.tsx :: Props => 10, 12, 19, 59, 69, 78, 85, 170, 203, 211, 216, 217, 220, 221, 225, 366, 387, 393, 399, 414 - NoctraMantineDocs.tsx :: Styles API => 171, 431 - NoctraMantineDocs.tsx :: Previous => 560, 561, 564, 569, 570, 571, 572 - NoctraMantineDocs.tsx :: Next => 560, 562, 565, 578, 579, 580, 581 - ButtonReferencePage.tsx :: Usage => 71, 166, 167, 168, 172 - ButtonReferencePage.tsx :: Configurator => 72, 189, 190, 191 - ButtonReferencePage.tsx :: Variants => 57, 73, 201, 213, 215, 216, 217 - ButtonReferencePage.tsx :: Tones => 58, 74, 202, 224, 226, 227, 228 - ButtonReferencePage.tsx :: Sizes => 59, 75, 203, 235, 237, 239 - ButtonReferencePage.tsx :: Radius => 33, 40, 52, 60, 76, 86, 101, 196, 204, 246, 248, 249, 250, 251, 252 - ButtonReferencePage.tsx :: States => 77, 258, 260, 261 - ButtonReferencePage.tsx :: Accessibility => 78, 273, 274, 275, 279

## Detected ncd classes

- ncd-aside
- ncd-basic-example-grid
- ncd-bottom-toc
- ncd-card
- ncd-code
- ncd-code-block
- ncd-code-panel
- ncd-code-scroll
- ncd-compact-card
- ncd-component-hero
- ncd-component-meta
- ncd-configurator-grid
- ncd-content-grid
- ncd-content-main
- ncd-control-card
- ncd-controls-grid
- ncd-demo-grid
- ncd-demo-panel
- ncd-demo-section
- ncd-docs-aside
- ncd-docs-body
- ncd-doc-section
- ncd-docs-grid
- ncd-docs-hero
- ncd-docs-inner
- ncd-docs-layout
- ncd-docs-main
- ncd-docs-meta
- ncd-docs-page
- ncd-docs-shell
- ncd-docs-toc
- ncd-doc-tab
- ncd-doc-tabs
- ncd-example-line
- ncd-example-list
- ncd-example-row
- ncd-example-section
- ncd-grid
- ncd-hero
- ncd-hero-meta
- ncd-hero-stats
- ncd-kicker
- ncd-layout
- ncd-layout-grid
- ncd-layout-shell
- ncd-main
- ncd-main-shell
- ncd-meta-list
- ncd-meta-row
- ncd-mobile-toc
- ncd-page
- ncd-page-aside
- ncd-page-body
- ncd-page-hero
- ncd-page-inner
- ncd-page-main
- ncd-page-meta
- ncd-page-toc
- ncd-panel
- ncd-playground-controls
- ncd-preview-code-grid
- ncd-preview-content
- ncd-preview-panel
- ncd-prev-next
- ncd-props-panel
- ncd-props-section
- ncd-props-table
- ncd-radius-list
- ncd-radius-row
- ncd-related-grid
- ncd-related-link
- ncd-related-links
- ncd-related-section
- ncd-section
- ncd-section-tabs
- ncd-size-list
- ncd-size-row
- ncd-stack
- ncd-stat-cards
- ncd-state-list

## Inference

- TOC ile previous/next aynı alt akışta olabilir; bu yüzden altta birikiyor olabilir.
- İçerik bölümleri var; sorun büyük ihtimalle shell/layout katmanında.

## Goal for next step

- Desktop shell solda navigation, ortada main content, sağda sticky TOC olacak.
- Header metadata stacked cards yerine kompakt meta rows olacak.
- Usage / Configurator / Examples yatay nefes alan docs akışına dönecek.
- Previous/Next ve TOC content flow içinden çıkarılıp right rail / footer sistemine oturtulacak.
