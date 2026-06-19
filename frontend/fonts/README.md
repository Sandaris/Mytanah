# Fonts

All three families load from Google Fonts via the `@import` at the top of
`colors_and_type.css`.

- **Cormorant Garamond** — display / headings (300, 400, 500, 600)
- **DM Sans** — body / UI (300, 400, 500)
- **JetBrains Mono** — numbers / data (400, 500, 600)

To self-host, add the .woff2 files here and replace the `@import` block
with `@font-face` declarations pointing at `/fonts/...`.
