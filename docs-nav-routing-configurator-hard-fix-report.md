# Docs Nav Routing Configurator Hard Fix Report

Generated: 2026-05-07T21:20:57.455Z

UniversalComponentDocPage changed: yes
NoctraStaticDocsPage changed: yes
NoctraRuntimeMock changed: no
docsRouting changed: no
docsSidebarLinks changed: no
docs.css changed: yes
fallback generator changed: yes
Problems found: 0

## Problems

- None

## Applied

- Docs left menu now visually keeps only Overview in the Docs section.
- Component list remains visible.
- Static docs shell docsLinks now only contains Overview.
- Configurator ControlGroup now supports string/object options and multiple change callback names.
- BooleanControl now supports onChange, onCheckedChange and setChecked.
- Runtime mock keeps variant/tone/size/radius/loading/disabled/fullWidth state classes and data attributes.
- Internal docsHref output remains canonical trailing slash.
- Component slug parser strips trailing slash before alias normalization.
- Static route fallback generator includes general docs and component routes.
