# Noctra Docs Runtime Table/CodeBlock Crash Fix Report

Generated: 2026-05-07T14:20:58.605Z

Changed: yes
Problems found: 0

## Problems

- None

## Fixed

- Noctra docs table wrapper now passes columns / rows / data to runtime Table.
- Native table fallback still exists if Noctra Table is unavailable.
- Noctra code block wrapper now passes code and value props.
- Props table and Styles API table use the same safe table adapter.
