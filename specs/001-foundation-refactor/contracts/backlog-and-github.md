# Contract: Backlog document and GitHub sync

## `docs/backlog.md` structure

1. **Summary**: date, number of open items per priority, link to the GitHub issue list.
2. **Recommended spec order**: numbered list of future specs, each naming the backlog items it
   covers and its dependencies.
3. **Items**: one section per item, sorted by priority, with:

```markdown
### #20 Persist theme in a cookie (no flash after reload)
- Type: bug · Priority: high · Status: not started
- Done: –
- Remaining: store theme in a cookie, read it on the server, migrate localStorage once
- Depends on: –
- Source: GitHub #20 · Suggested spec: 002
```

4. **Follow-ups from spec 001**: items with id `F-n` (placeholders, security findings, test
   database, database field renaming, invalid theme classes, Tailwind class sorting), each with the
   reason it was left out.
5. **Proposed GitHub changes**: a table that the maintainer approves before anything is applied:

| # | Issue | Change | Reason | Approved |
|---|---|---|---|---|
| 1 | #13 | (already closed) – | – | – |
| 2 | #11 | tick "Add a theme switcher"; add `priority: medium` | done in code | ☐ |

6. **Applied changes log**: one line per applied change with timestamp; used to resume a partial
   run without duplicates.

## GitHub rules

- Labels to create (if missing): `priority: high`, `priority: medium`, `priority: low`.
- Closing an issue always adds a comment explaining what in the code completes it.
- Translating an issue rewrites title/body in English; the original text is kept in a collapsed
  `<details>` block.
- New follow-up issues get the matching type label, a priority label and a link back to
  `docs/backlog.md`.
- Nothing is changed on GitHub until every row to apply is approved by the maintainer (FR-023b).
