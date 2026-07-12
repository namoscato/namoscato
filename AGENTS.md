# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Purpose

This repo generates the `README.md` that renders on Nick Amoscato's GitHub profile
(`github.com/namoscato`). A scheduled GitHub Action runs the compiled program hourly, which
fetches "currently" data (running, reading, listening, etc.), renders it through a Mustache
template, and auto-commits the regenerated `README.md` back to `master`.

**`README.md` is a generated artifact — never hand-edit it.** Edit `README.md.tpl` instead.

## Commands

- `npm run compile` — TypeScript compile to `build/` (must run before `start`/`test`)
- `npm test` — compiles, runs Jest against `build/test/`, then lints (via `pretest`/`posttest` hooks)
- `npm start` — runs the generator, overwriting `README.md` (needs live network access)
- `npm run lint` / `npm run fix` — lint / auto-fix via `gts` (Google TypeScript Style)

Jest runs against **compiled JS in `build/test/`**, not the `.ts` sources. There is no
ts-jest/watch setup, so recompile before re-running. To run a single test:
`npm run compile && npx jest build/test/render.test.js -t 'render'`.

## Architecture

Data flow, all in `src/`:

1. `index.ts` — entry point. Calls `render()` and writes the result to `README.md`.
2. `render.ts` — the core. Fetches `current.json` from `storage.amoscato.com` (via axios),
   fetches the latest journal post from the `amoscato.com/journal` RSS feed (via `rss-parser`),
   merges them, and renders `README.md.tpl` with Mustache.

## Gotchas

- The Mustache template (`README.md.tpl`) reads several top-level keys (`journal`, `music`,
  `book`, `video`, `drink`), which arrive untyped from the remote JSON. Adding a new section
  means editing `README.md.tpl` and, where a value needs deriving before rendering, `render.ts`.
- The Jest test in `test/render.test.ts` mocks the HTTP calls with `axios-mock-adapter` and
  asserts against the fully rendered README block — update its fixtures when changing the template.

## Conventions

Code style is enforced by `gts` (Google TypeScript Style) + Prettier; run `npm run fix` rather
than adjusting formatting by hand. Node version is pinned in `.nvmrc` (24).
