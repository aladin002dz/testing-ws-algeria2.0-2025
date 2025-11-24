# Vitest + React + Next.js Testing Cheat‑Sheet

*Quick reference memo for writing and running tests in this project.*

---

## Table of Contents
- [Core Commands](#core-commands)
- [Vitest + React Testing Library Basics](#vitest--react-testing-library-basics)
- [Rendering a Component](#rendering-a-component)
- [Querying the DOM](#querying-the-dom)
- [Simulating User Interaction](#simulating-user-interaction)
- [Assertions (jest‑dom)](#assertions-jest-dom)
- [Async Testing](#async-testing)
- [Mocking & Stubbing](#mocking--stubbing)
- [Debugging](#debugging)
- [Vitest Limitations](#vitest-limitations)
- [Why Use Playwright alongside Vitest?](#why-use-playwright-alongside-vitest)
- [Next.js Specific Tips](#nextjs-specific-tips)

## Core Commands

| Command | What it does |
|---|---|
| `npm run test` | Run Vitest in watch mode (default). |
| `npm run test:run` | Run tests once – ideal for CI pipelines. |
| `npm run test:coverage` | Run with coverage report (silent output). |
| `npm run test:ui` | Launch Vitest UI for interactive debugging. |
| `npm run test:e2e` | Run Playwright end‑to‑end tests. |

---

## 🧩 Vitest + React Testing Library Basics

### Rendering a Component
```tsx
import { render } from '@testing-library/react';
import Home from './page';

render(<Home />);
```

### Querying the DOM
- **`screen.getBy…`** – throws if not found (use for assertions).
- **`screen.queryBy…`** – returns `null` (use for negative checks).
- **`screen.findBy…`** – returns a promise (use for async UI). 

**Common queries**
```tsx
screen.getByText('Hello World');
screen.getByRole('button', { name: /submit/i });
screen.getByPlaceholderText('Enter your name');
```

---

## 🎭 Simulating User Interaction
```tsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.type(screen.getByRole('textbox'), 'Hello');
await user.click(screen.getByRole('button'));
```

---

## ✅ Assertions (jest‑dom)
```tsx
expect(element).toBeInTheDocument();
expect(element).toHaveValue('Hello');
expect(element).toBeChecked();
expect(element).toHaveClass('active');
expect(element).toBeDisabled();
```

---

## ⏳ Async Testing
```tsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

---

## 🪝 Mocking & Stubbing
```tsx
// Example: mock localStorage
const mockTodos = [{ id: 1, text: 'Buy milk', completed: false }];
localStorage.setItem('todos', JSON.stringify(mockTodos));

// After interaction
expect(JSON.parse(localStorage.getItem('todos'))).toHaveLength(1);
```

---

## 🐞 Debugging
- `screen.debug()` – prints the current DOM snapshot to the console.
- **Vitest UI** – run `npm run test:ui` for visual component state and logs.

---

## ⚠️ Vitest Limitations

Vitest excels at **unit and component testing** but has clear boundaries. Understanding these limitations helps you choose the right tool for the right job.

### What Vitest Cannot Test

#### 1. **Real Browser Environment**
- Runs in **jsdom** or **happy-dom** (simulated DOM in Node.js)
- No actual browser rendering engine
- CSS layout, animations, and actual pixel rendering **not tested**
- Example: A CSS flexbox bug won't be caught by Vitest

#### 2. **Browser-Specific APIs**
APIs that require a real browser need mocking:
```tsx
// ❌ These don't exist in jsdom by default
window.matchMedia()
IntersectionObserver
ResizeObserver
window.scrollTo()
navigator.geolocation
WebGL / Canvas rendering
Service Workers
```

#### 3. **Network and Server Integration**
- Cannot test **actual Next.js server** (API routes, middleware, SSR in production)
- Fetch calls must be mocked (no real HTTP requests by default)
- Cannot validate CORS, cookies, or authentication flows end-to-end

#### 4. **User Journeys & Multi-Page Flows**
- No **real navigation** or browser history
- Cannot test: login → dashboard → profile flows
- No URL changes, redirects, or deep linking validation

#### 5. **Performance & Rendering**
- Cannot measure **real page load times**
- No Core Web Vitals (LCP, FID, CLS) measurement
- Cannot detect memory leaks in actual browser runtime

#### 6. **Next.js-Specific Limitations**
- **Static Generation (SSG)** – `getStaticProps` must be mocked
- **Server-Side Rendering (SSR)** – `getServerSideProps` execution not tested
- **Middleware** – Not tested in Vitest (runs in Edge runtime)
- **Image Optimization** – `next/image` behavior mocked, not validated

---

## 🎭 Why Use Playwright alongside Vitest?

**Vitest and Playwright are complementary, not competing.** Use both for a complete testing strategy:

| Aspect | Vitest | Playwright |
|--------|--------|------------|
| **Speed** | ⚡ Fast (milliseconds) | 🐢 Slower (seconds) |
| **Scope** | Unit & Component tests | End-to-End (E2E) tests |
| **Environment** | Simulated DOM (jsdom) | Real browsers (Chromium, Firefox, WebKit) |
| **Best For** | Testing isolated logic | Testing full user workflows |

### When to Use Playwright

#### ✅ Real Browser Validation
- Test in **actual Chromium, Firefox, and Safari (WebKit)**
- Validate CSS rendering, animations, and responsive design
- Catch browser-specific bugs (e.g., Safari date picker issues)

#### ✅ Full Stack Integration
```tsx
// Example: Test actual Next.js API routes
await page.goto('http://localhost:3000/api/users');
const response = await page.evaluate(() => fetch('/api/users'));
expect(response.status).toBe(200);
```

#### ✅ Complex User Flows
```tsx
// Example: Authentication flow
await page.fill('input[name="email"]', 'user@example.com');
await page.fill('input[name="password"]', 'securePass123');
await page.click('button[type="submit"]');
await expect(page).toHaveURL('/dashboard'); // Real navigation!
```

#### ✅ Network & Performance
- Intercept network requests (mock APIs for E2E)
- Simulate slow 3G, offline mode
- Measure real page load times and Core Web Vitals

#### ✅ Visual Testing
- Take screenshots for visual regression
- Record videos of test runs for debugging
- Generate traces for step-by-step inspection

### Recommended Testing Strategy

```
┌─────────────────────────────────────────────────┐
│  VITEST - Fast Feedback Loop                   │
│  • Business logic (utils, hooks)               │
│  • Component rendering & interactions          │
│  • Edge cases & error states                   │
│  Run on every save (watch mode)                 │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  PLAYWRIGHT - User Confidence                   │
│  • Critical user journeys (signup, checkout)    │
│  • Cross-browser compatibility                  │
│  • Server integration (API routes, SSR)         │
│  Run before deployment (CI/CD)                  │
└─────────────────────────────────────────────────┘
```

**Rule of thumb:**  
- 🟢 **Vitest** – "Does this function/component work correctly?"  
- 🔵 **Playwright** – "Can a user actually complete this task in a real browser?"

---

## 📚 Next.js Specific Tips
- **Testing pages** – Import the page component directly and render it with RTL; mock `next/router` when needed.
- **Static props** – Mock `getStaticProps`/`getServerSideProps` by providing the expected props to the component.
- **Environment variables** – Use `process.env.NEXT_PUBLIC_…` in tests; ensure they are defined in `vitest.config.ts`.

---

*This memo is intended as a quick‑look reference. For deeper explanations, see the official Vitest, React Testing Library, and Playwright documentation.*
