# GitHub Pages Base Path Fix Report

Generated: 2026-05-07T05:14:29+03:00

## Problem

The deployed docs tried to load assets from:

`	ext
https://mrkwxopya.github.io/assets/...
``

But the repository Pages URL is:

`	ext
https://mrkwxopya.github.io/noctra/
`

So Vite must build assets with:

`	ext
/noctra/assets/...
`

## Fix

* Replaced pps/docs/vite.config.ts
* Forced GitHub Pages base to /noctra/
* Updated workflow build env:

  * GITHUB_PAGES_BASE=/noctra/
* Added workflow verification:

  * grep -q '"/noctra/assets/' apps/docs/dist/index.html
* Added 404.html copy for SPA fallback

## Note

The Node.js 20 annotations in GitHub Actions are warnings, not the reason for the blank/404 docs page.