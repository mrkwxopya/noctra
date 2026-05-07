# TOC Preview Universal System Fix Report

Generated: 2026-05-07T18:05:38.784Z

NoctraMantineDocs changed: yes
UniversalComponentDocPage changed: yes
Runtime mock changed: no
CSS changed: yes
Problems found: 1

## Problems

- Runtime mock still renders description small text.

## Applied

- Fixed right Table of contents clicks with real smooth scrolling.
- Rendered Documentation / Props / Styles sections in DOM so TOC can scroll to all of them.
- Removed preview description text from runtime mock.
- Sanitized invalid labels like {item}.
- Forced MantineStyleComponentDocs to use UniversalComponentDocPage.
- Re-applied state classes/data attributes for all component previews.
