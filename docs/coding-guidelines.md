# DesignFit Coding Guidelines

> Shared coding style and quality principles for the DesignFit furniture fit checker.

## Write for the next reader

Code should be easy to scan, explain, and change. Prefer small functions and components with one clear responsibility. Use names that describe the domain rather than the implementation, especially for measurements, fit results, warnings, and API responses. Keep control flow straightforward; when a condition or transformation is difficult to understand, extract it into a named function instead of hiding it behind clever syntax.

Keep comments focused on intent or a non-obvious constraint. Do not add comments that merely restate the code. Update documentation when a change alters a public endpoint, data shape, development command, or user-visible convention.

## Formatting and file structure

Use two spaces for indentation. Terminate JavaScript statements with semicolons and use single quotes for strings, matching the existing frontend and backend code. Keep lines and expressions readable rather than compressing unrelated operations onto one line. Use trailing commas where the surrounding code and formatter support them, and avoid drive-by formatting changes in files unrelated to the work.

Organize files according to the monorepo layout: React code belongs in `packages/frontend/src/`, Express code belongs in `packages/backend/src/`, and tests stay in the locations described by the testing guidelines. Keep component styles in their colocated CSS file. Follow the UI guidelines for design tokens, spacing, class naming, and accessibility instead of introducing one-off styling conventions.

## Imports and modules

Keep imports at the top of the file and group them in a readable order: external packages first, then application modules, then styles or other local assets. Remove unused imports promptly. In the frontend, follow the existing ES module style with `import` and `export`; in the backend, follow the existing Node.js CommonJS style with `require` and `module.exports` unless the package is deliberately migrated as a whole. Avoid circular dependencies and import only the symbols a module needs.

## Linting and feedback loops

The frontend uses the Create React App `react-app` and `react-app/jest` ESLint configuration. Treat lint warnings as work to resolve, not noise to suppress. During frontend development, use the package scripts and `npm run build --workspace=frontend` to surface compilation and lint problems; run a focused test while iterating and the full relevant suite before merging. The backend does not currently define a separate lint script, so keep its code consistent with the established style and rely on tests, review, and a future shared lint configuration rather than inventing package-specific rules.

Do not disable a lint rule inline unless there is a documented, justified exception. Prefer changing the code to satisfy the rule. When a recurring rule or convention is important to the whole repository, document or configure it centrally instead of relying on individual memory.

## Reuse without overengineering

Apply the DRY principle when duplication represents the same knowledge or behavior. Share validation, fit calculations, status mapping, and API contracts so that a rule has one authoritative implementation. Reuse existing helpers and component patterns before adding new abstractions.

DRY does not mean forcing unrelated code into a generic helper. A small amount of clear repetition is preferable to an abstraction with confusing parameters or hidden coupling. Extract code when it has a stable purpose, appears in multiple meaningful places, or makes a complex workflow easier to test and read.

## Correctness and boundaries

Validate user input at the boundary, including numeric ranges and required dimensions, and return consistent error responses from the API. Do not trust client-side validation alone. Keep calculations deterministic and make units explicit; measurements should not silently change units or precision. Handle expected failures deliberately and avoid exposing internal errors, stack traces, or implementation details to users.

Keep HTTP handlers thin: parse and validate the request, call the relevant domain logic, and shape the response. Put reusable business rules outside route registration so they can be tested independently. Avoid mutating shared state unexpectedly, especially the backend's in-memory data, and make ownership of state clear.

## React and accessibility

Prefer functional components and derive rendered output from props and state. Keep state as close as possible to the component that owns it, and avoid storing values that can be calculated from existing state. Give every form control a visible label, preserve keyboard access and focus indicators, and communicate status with text and appropriate semantics rather than colour alone. Follow the UI guidelines for validation timing, touch targets, loading states, and responsive behavior.

Avoid inline styles except for genuinely dynamic values. Use stable class names and the project CSS tokens. Buttons and interactive controls should have clear accessible names and should not cause layout shifts when their state changes.

## Tests and maintainability

Every new behavior should have a focused, deterministic test. Test observable behavior and public interfaces rather than private implementation details. Keep tests independent, use setup and teardown for resources, and give test names enough detail to explain the scenario and expected result. Use Jest for unit and integration tests, React Testing Library for frontend behavior, and Playwright with the Page Object Model for critical end-to-end journeys, following `docs/testing-guidelines.md`.

When fixing a bug, add a regression test that fails for the old behavior. Run the narrowest relevant test while developing, then run the applicable package suite before merging. A change is complete only when its implementation, tests, documentation, and error behavior agree.

## Review standard

Before opening a pull request, check the diff for accidental changes, dead code, duplicated logic, missing validation, and accessibility regressions. Keep commits and pull requests focused on one coherent change. Explain meaningful tradeoffs in the pull request description, especially when choosing a new dependency, changing an API contract, or making a deliberate exception to an existing guideline.
