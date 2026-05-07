# Robust Local Remote Pages Asset Compare Report

Generated: 2026-05-07T17:08:11.4712504Z

Decision: FAIL_REMOTE_ASSET_IS_HTML_OLD_OR_MISMATCHED

## Checks

- Local asset src: /noctra/assets/index-Cm97Pnqq.js
- Local asset file: apps/docs/dist/assets/index-Cm97Pnqq.js
- Local asset hash: 95AB087876E299ACF6571618A6AC4CD2F998B3334F58349543AF5681DD000DAD
- Remote index URL: https://mrkwxopya.github.io/noctra/?assetCheck=20260507200810
- Remote index status: 200
- Remote asset src: /noctra/assets/index-DnmXOM5f.js
- Remote asset URL: https://mrkwxopya.github.io/noctra/assets/index-DnmXOM5f.js?assetCheck=20260507200810
- Remote asset status: 200
- Remote asset content-type: application/javascript; charset=utf-8
- Remote asset error: 
- Remote asset looks HTML: True
- Remote asset looks JS: True
- Remote asset hash: NO_REMOTE_JS_ASSET
- Local contains safeChildren: False
- Local contains resolveSafeTag: False
- Remote contains safeChildren: False
- Remote contains resolveSafeTag: False
- Browser reported old asset index-DnmXOM5f.js: true

## Problems

- Remote asset URL returned HTML fallback instead of JavaScript.
- Remote JavaScript asset was not saved because response is not valid JS.
- Remote index still points to the browser-reported crashing asset index-DnmXOM5f.js.

## Interpretation

- Eğer remote asset HTML döndürüyorsa sorun GitHub Pages asset path/artifact servisidir.
- Eğer remote asset eski index-DnmXOM5f.js ise tarayıcı doğru şekilde eski deploy'u görüyor.
- Eğer remote asset yeni ve safeChildren içeriyorsa crash başka bir React recursion kaynağından geliyor.
