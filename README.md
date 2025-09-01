![banner](https://github.com/nappalm/builfast/raw/master/public/banner.jpg)

# BuildFast | AI-Driven Boilerplate for Faster Launch and Scale of Frontend SPAs

Welcome to Buildfast! This documentation will guide you through the core
concepts and features of the boilerplate.

## 1. About the project:

This project is intended to serve as a base codebase for Frontend projects using
the following technologies, with the aim of speeding up the development and
scaling of Single Page Applications (SPAs):

- React
- [React Router Dom](https://reactrouter.com/en/main): for application
  navigation
- Husky, Eslint, commit linter: tools for code quality and commit message review
- [Vitest](https://vitest.dev/): library for unit testing
- [React Query](https://tanstack.com/query/latest): library for API management
- [Chakra UI](https://chakra-ui.com/): component library for building accessible
  React applications
- [Axios](https://axios-http.com/): promise-based HTTP client for the browser
  and node.js
- [Supabase](https://supabase.com/): open-source Firebase alternative

## 2. Directory Organization

#### `src/app/`: Global application configuration

- **`main.js`**: Main entry point. Initializes the component tree and mounts the
  application to the DOM.
- **`providers.jsx`**: Composition of global context providers (React Query,
  Theme, Router, etc.).
- **`router.jsx`**: Main router definition using `react-router-dom`.
  Encapsulates root routes and global layouts.

#### `src/features/`: Self-contained modules representing domain functionalities

- **`__test__/`**: Feature-specific unit tests. Based on `Vitest` and `msw` for
  network mocking.
- **`components/`**: Reusable UI components within the feature's context.
- **`hooks/`**: Custom hooks that encapsulate reusable logic and act as an
  orchestration layer between components and services.
- **`pages/`**: High-level visual representations of the feature. Each page
  represents a specific route.
- **`router/`**: The feature's internal routing module.
  - **`paths.js`**: Centralized definition of the feature's relative routes.
  - **`router.jsx`**: Configuration of routes and associated components for
    `react-router-dom`.
- **`services/`**: Pure and asynchronous functions solely responsible for
  communication with external APIs.
- **`index.js`**: The feature's entry point. Exposes its public API for
  consumption by other parts of the application.

#### `src/lib/`: Configuration and adapters for third-party libraries

Contains instances, configurations, or extensions of external tools (e.g.,
Axios, React Query, MSW, etc.).

#### `src/shared/`: Reusable general-purpose code

Components, utilities, constants, helpers, and any other cross-cutting piece
that doesn't belong to a specific feature.

## 3. Screaming Architecture Rules

This is a set of rules and guidelines to maintain the project's architectural
integrity and scalability.

#### 1. Organize by Domain, not by Technical Type

The main code structure should be in the `src/features` folder. Each subfolder
represents a business capability (`products`, `auth`, `orders`), not a file type
(`pages`, `components`).

#### 2. Features are Vertical, Self-Contained Modules

Each feature folder should contain everything it needs to function: its own API,
components, hooks, routes, assets, and tests. A feature is a mini-application.

#### 3. Every Feature has a Public API (`index.js`)

Communication between features or from the application to a feature must occur
only through its `index.js` file, which acts as its facade or public contract.

#### 4. The Public API is Minimal and Deliberate

Only what is strictly necessary for external interaction should be exported. By
default, this is limited to:

- Data hooks (e.g., `useProducts`).
- Route definitions (e.g., `productRoutes`).
- Navigation constants (e.g., `PRODUCTS_PATHS`).
- "Widget" components explicitly designed to be shared.

#### 5. Implementation Details are Private

Fetcher functions (`getProductList`), internal components (`ProductCard`), and
internally used hooks should not be exported in the feature's public API.

#### 6. Shared Code (`@shared`) is for Generic Logic

Root-level folders like `src/components`, `src/hooks`, `src/lib`, and
`src/utils` are for code that is truly reusable and not tied to any specific
business logic.

#### 7. Dependency is Primarily Unidirectional

1. As a general rule, a feature can import and use code from the shared folders
   (`@shared`).
2. Code in `@shared` should not depend on the internal implementation details of
   a feature.

> **Key Exception**: High-level structural components in `@shared` (like a
> `MainLayout`) can and should consume hooks exposed in a feature's public API
> (e.g., `useAuth` from `features/auth`) to reflect a global application state.
> This is a controlled and acceptable dependency.

## 4. Running the project locally

The project requires an environment variable configuration file. This file must
be created in the project's root folder with the name **.env** and must contain
the variables specified in the **.env_example** file.

In the terminal, at the project's root level, run the following commands:

- `npm install` to install dependencies

- `npm run dev` to run the project locally

In the terminal, you will see the line indicating the URL where the application
is available, for example:

```bash
Local:    http://localhost:5173/
```
