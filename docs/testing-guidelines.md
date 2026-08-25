# DesignFit Testing Guidelines

> Testing principles and conventions for the DesignFit furniture fit checker.

## Testing Principles

- All new features should include appropriate tests.
- Tests must be maintainable, focused, readable, and deterministic.
- All tests must be isolated and independent. Each test should create and clean up its own data rather than relying on another test or shared mutable state.
- Setup and teardown hooks are required wherever resources, application state, or test data need to be prepared or released. Tests must succeed on repeated runs.
- Prefer testing observable behavior and public interfaces over implementation details.
- Keep test names specific about the behavior and scenario being verified.

## Unit Tests

Use Jest to test individual functions and React components in isolation.

- Unit test files must use the naming convention `*.test.js` or `*.test.ts`.
- Backend unit tests belong in `packages/backend/__tests__/`.
- Frontend unit tests belong in `packages/frontend/src/__tests__/`.
- Name unit test files after the code they test. For example, `app.test.js` tests `app.js`.
- React component tests should verify rendered behavior and user-visible outcomes using the existing React Testing Library setup.
- Mock external services and network requests when testing a unit in isolation.

## Integration Tests

Use Jest and Supertest to test backend API endpoints with real HTTP requests against the application.

- Integration tests belong in `packages/backend/__tests__/integration/`.
- Integration test files must use the naming convention `*.test.js` or `*.test.ts`.
- Name integration test files intelligently based on the behavior or endpoint group they cover. For example, `designfit-api.test.js` tests  API endpoints.
- Verify complete request and response behavior, including status codes, response bodies, validation, and error handling.
- Keep integration test data independent between tests and reset in-memory state when necessary.

## End-to-End Tests

Use Playwright, the required E2E framework, to test complete UI workflows through browser automation.

- E2E tests belong in `tests/e2e/`.
- E2E test files must use the naming convention `*.spec.js` or `*.spec.ts`.
- Name E2E test files after the user journey they cover. For example, `designfit-workflow.spec.js` tests a  workflow.
- Playwright tests must use one browser only. Configure and run a single browser project, such as Chromium, to keep the suite focused and reliable.
- Playwright tests must use the Page Object Model (POM) pattern. Keep selectors and page interactions in page objects so workflows remain readable and changes to the UI are localized.
- Limit E2E coverage to 5-8 critical user journeys. Focus on happy paths and key edge cases rather than exhaustive coverage.
- Each E2E test must be isolated and independent, with its own setup and cleanup.
- Use setup and teardown hooks for browser, application, and test data lifecycle management.

## Port Configuration

Always use environment variables with sensible defaults for port configuration. This allows CI/CD workflows to dynamically detect and assign ports.

### Backend

```js
const PORT = process.env.PORT || 3030;
```

### Frontend

React's default development port is `3000`, but it can be overridden with the `PORT` environment variable.

For example:

```sh
PORT=3001 npm start
```

E2E configuration should use the same environment-driven port as the application under test rather than hard-coding a CI-only port.

## Running Tests

From the repository root:

```sh
npm test                 # Frontend and backend unit tests
npm run test:integration # Backend integration tests
npm run test:e2e         # Playwright E2E tests
npm run test:all         # Full test suite
```

When adding a feature, run the narrowest relevant test command during development, then run the full suite before merging.
