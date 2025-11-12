# Testing Setup - Vitest & Playwright

This project showcases both **Vitest** (unit testing) and **Playwright** (end-to-end testing) frameworks.

## 📦 What's Included

### Vitest (Unit Testing)
- **Location**: `tests/` directory
- **Configuration**: `vitest.config.ts`
- **Test Files**:
  - `tests/todoUtils.test.ts` - Tests for pure utility functions (fast, isolated unit tests)

### Playwright (E2E Testing)
- **Location**: `e2e/` directory
- **Configuration**: `playwright.config.ts`
- **Test Files**:
  - `e2e/todo-app.spec.ts` - End-to-end tests for todo functionality
  - `e2e/navigation.spec.ts` - Navigation testing between pages (Home, Stats, About)

## 🚀 Running Tests

### Vitest Commands

```bash
# Run tests in watch mode (default)
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests once (CI mode)
pnpm test:run

# Run tests with coverage
pnpm test:coverage
```

### Playwright Commands

```bash
# Run E2E tests (starts dev server automatically)
pnpm test:e2e

# Run E2E tests with UI mode
pnpm test:e2e:ui

# Run E2E tests in headed mode (see browser)
pnpm test:e2e:headed
```

## 📝 Test Examples

### Vitest Example (Unit Test)
```typescript
import { describe, it, expect } from 'vitest';
import { createTodo } from '../lib/todoUtils';

describe('createTodo', () => {
  it('should create a new todo', () => {
    const todo = createTodo('Test task');
    expect(todo.text).toBe('Test task');
    expect(todo.completed).toBe(false);
  });
});
```

### Playwright Example (E2E Test)
```typescript
import { test, expect } from '@playwright/test';

test('should add a new todo', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder('Add a new task...').fill('Buy groceries');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Buy groceries')).toBeVisible();
});
```

### Playwright Navigation Example
```typescript
import { test, expect } from '@playwright/test';

test('should navigate between pages', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('nav-link-stats').click();
  await expect(page).toHaveURL('/stats');
  await expect(page.getByTestId('stats-title')).toBeVisible();
});
```

## 🎯 Key Differences & Why Both?

| Feature | Vitest | Playwright |
|---------|--------|------------|
| **Type** | Unit Testing | End-to-End Testing |
| **Speed** | Fast (milliseconds) | Slower (seconds, runs browser) |
| **Scope** | Pure functions, utilities | Full Application |
| **Environment** | Node.js (jsdom) | Real Browser |
| **Use Case** | Test business logic, edge cases | Test user workflows, navigation, real interactions |
| **Example** | `createTodo()`, `toggleTodo()` functions | Adding todos via UI, page navigation, localStorage persistence |

### Why Both?

- **Vitest** tests pure utility functions in isolation - fast feedback on business logic
- **Playwright** tests the actual app from a user's perspective - ensures everything works together

This avoids redundancy: Vitest tests the logic, Playwright tests the integration.

## 🧭 Multi-Page App Structure

The app includes multiple pages to showcase navigation testing:

- **Home** (`/`) - Main todo list page
- **Stats** (`/stats`) - Statistics and progress tracking
- **About** (`/about`) - Information about the app

All pages share a common navigation bar, and Playwright tests verify:
- Navigation between pages
- Active page highlighting
- State persistence across navigation
- Browser back/forward button handling

## 📚 Learn More

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

