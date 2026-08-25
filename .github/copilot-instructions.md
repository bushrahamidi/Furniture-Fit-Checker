# GitHub Copilot Instructions

> **Note**: This file is located at `.github/copilot-instructions.md` and is used by GitHub Copilot to understand project context.

This file contains high-level instructions for GitHub Copilot to follow when generating code for this project. For detailed guidance, refer to the documentation files in the `docs/` directory.

## Application

- Application name: DesignFit Furniture Fit Checker.

## Stack

- Frontend: React, JavaScript, and Vite.
- Backend: Node.js and Express 4.

## Architecture

- Use the flow: React -> REST API -> Express -> Services.

## Development Principles

- Keep the MVP simple.
- Avoid overengineering.
- Use functional React components.
- Use React hooks.
- Keep business logic out of routes.
- Put furniture calculations in `fitService`.
- Use inches internally for all calculations.
- Validate all dimensions.
- Require dimensions to be greater than zero.
- APIs should return meaningful errors.

## Testing

- Unit test all calculation logic.
- Test boundary conditions.
- Run existing tests before completing a change.

## Agent Behavior

Before coding:

1. Review the existing implementation.
2. Explain proposed changes.
3. Identify files being modified.

After coding:

1. Run tests.
2. Investigate failures.
3. Correct failures.
4. Check for regressions.
5. Summarize changes.

## Do Not

- Introduce TypeScript.
- Introduce authentication.
- Add unnecessary packages.
- Add a database unless requested.
- Add AI APIs unless requested.
- Rewrite working code unnecessarily.

## Documentation Overview

The project documentation will be built during the bootcamp sessions.

- [Project Overview](../docs/project-overview.md) - Overview of the project
- [Development Plan](../docs/DEVELOPMENT_PLAN.md) - MVP architecture, data model, fit engine, and build phases
- [Coding Guidelines](../docs/coding-guidelines.md) - Coding style, quality principles, and review standards
- [UI Guidelines](../docs/ui-guidelines.md) - Design tokens, component standards, and accessibility requirements
- [Testing Guidelines](../docs/testing-guidelines.md) - Testing principles, conventions, and required test frameworks
