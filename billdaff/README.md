# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn typecheck`

Type-checks the app (`tsconfig.json`, covering `src/`) and the Playwright tests (`e2e/tsconfig.json`).\
API response types live in `src/types/api.ts` and are shared with the e2e fixtures.

### `yarn lint`

Runs ESLint over `src/`, `e2e/` and the Playwright configs, failing on any warning.

### `yarn test:e2e`

Runs the Playwright end-to-end tests in `e2e/` against the dev server (started automatically on port 3000, or reused if already running) in Chromium, Firefox, WebKit and a mobile Chrome viewport.\
The Drupal API (`https://drupal.billdaff.com/api`) is mocked from the hand-written fixtures in `e2e/fixtures/api`, so these tests do not need network access.

First-time setup: `yarn install && npx playwright install`.

- `yarn test:e2e --project=chromium` runs a single browser.
- `yarn test:e2e:ui` opens Playwright's interactive UI mode.
- `yarn test:e2e:report` opens the HTML report from the last run.
- `yarn test:e2e:live` runs the smoke tests in `e2e/live` against the real API. Set `E2E_BASE_URL=https://billdaff.com` to test the deployed site instead of the dev server.

Specs import `test` from `e2e/support/test.ts`, which mocks the API and fails the test on any uncaught page error. Use `test.use({ clockTime })` to run at a specific date, the `site` fixture (`e2e/support/SitePage.ts`) to navigate between sections, and `api.override(endpoint, handler)` to simulate API failures.\
On macOS 14, Playwright only provides an outdated WebKit build, so the `webkit` project fails to launch locally; it runs in CI (see `Jenkinsfile` at the repository root).

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
