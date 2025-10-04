Project: Speck-It MCP Server Documentation

Purpose:
Create a comprehensive MCP server documentation site with examples, code snippets, and templates for Speck-It; prioritize TypeScript + shadcn UI, efficient reusable components, strong typing, and Zustand where state is needed.

Core Principles:
1. Language & Stack: Use TypeScript as the primary language for all new code and examples. Prefer modern TypeScript features and strict compiler settings to maximize type-safety and clarity.
2. UI: Use shadcn/ui for design system components. Components must be accessible, themeable, and composed from small primitives.
3. Reusability & Efficiency: Author small, well-factored, and reusable components and utilities. Favor composition over duplication and adhere to DRY principles.
4. Strong Typing: Expose and enforce explicit, well-documented types for public APIs, component props, and library boundaries. Prefer typed interfaces and generics where appropriate.
5. State: When client/state management is required, prefer Zustand for local/global state. Keep state trees minimal and well-documented.
6. Testing & Quality: Provide tests (unit/integration) for library logic and key components. Use automated linters, formatters, and type checks in CI.
7. Documentation & Examples: Ship each feature with clear README, runnable examples, and minimal reproduction snippets. Provide copy-paste-ready code and small runnable sandboxes where possible.
8. Accessibility & UX: Follow WCAG basics for interactive components. Document accessibility considerations for each component and example.
9. API Design & Stability: Design simple, predictable, and well-documented APIs. Maintain backward-compatibility where possible; use semver for public releases.
10. Performance: Prefer lightweight implementations; avoid premature optimization but measure and document performance-sensitive areas.
11. Developer Experience: Provide clear developer guides, contribution guidelines, coding conventions, and a recommended project layout for examples and templates.
12. CI / Automation: Enforce typecheck, lint, test, and build steps in CI. Provide a reproducible local dev experience (scripts / pnpm / Node version guidance).
13. Licensing & Attribution: Include license and attribution for third-party libraries, and document any special legal or compatibility notes.

Conventions & Layout (high-level):
- Use a consistent folder layout for docs, examples, and reference implementations.
- Provide a directory for small, focused example servers and a templates directory for reusable bootstraps.
- Use clear commit messages and PR templates for changes to examples or docs.

Acceptance Criteria for Feature Artifacts:
- Each feature must include: spec, implementation code (TypeScript), example usage, tests, and a README explaining design decisions.
- All artifacts should be stored under the registered project root for feature artifacts and follow the project conventions.

This constitution is authoritative for subsequent planning, task generation, and feature implementation steps for the "Speck-It MCP Server Documentation" project.
