# E2E Testing Guidelines

See `@docs/guidance/playwright.md` for Playwright best practices (auto-loaded for `*.spec.ts`).

## Directory Structure

- `assets/` - Test data (JSON workflows, fixtures)
- `fixtures/` - ComfyPage, ComfyMouse, and component fixtures
- `helpers/` - Shared test utilities
- Tests use premade JSON workflows to load desired graph state

## Skill Documentation

A Playwright test-writing skill exists at `.claude/skills/writing-playwright-tests/`.

**When modifying test infrastructure** (fixtures, helpers, ComfyPage methods, etc.), update the corresponding skill documentation:

| Changed                      | Update                                            |
| ---------------------------- | ------------------------------------------------- |
| `fixtures/ComfyPage.ts`      | `reference/fixtures.md`                           |
| `fixtures/ComfyMouse.ts`     | `reference/fixtures.md`                           |
| `fixtures/components/*`      | `reference/fixtures.md`                           |
| `fixtures/VueNodeHelpers.ts` | `features/vue-nodes.md`                           |
| New test patterns            | Relevant `core/`, `testing/`, or `features/` file |
| New assets structure         | `testing/assets.md`                               |

This ensures agents can write tests correctly without needing to reverse-engineer the fixtures.
