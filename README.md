# 🎭 Playwright Testing Cheatsheet

A comprehensive guide to E2E testing with Playwright, including best practices for Vitest integration.

---

## 📋 Table of Contents

- [Installation & Setup](#installation--setup)
- [Basic Commands](#basic-commands)
- [Selectors & Locators](#selectors--locators)
- [User Interactions](#user-interactions)
- [Assertions](#assertions)
- [Navigation & Waiting](#navigation--waiting)
- [Advanced Techniques](#advanced-techniques)
- [Playwright with Vitest](#playwright-with-vitest)
- [Best Practices](#best-practices)
- [Debugging](#debugging)

---

## 🚀 Installation & Setup

### Installation

```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install

# Install with Vitest
npm install -D @playwright/test vitest
```

### Basic Configuration (`playwright.config.ts`)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 🎯 Basic Commands

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run tests in specific browser
npx playwright test --project=chromium

# Run specific test file
npx playwright test tests/login.spec.ts

# Run tests in debug mode
npx playwright test --debug

# Run tests with UI mode
npx playwright test --ui

# Generate test report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots
```

---

## 🔍 Selectors & Locators

### Recommended Locators (Priority Order)

```typescript
// 1. By Role (Best - Accessibility-friendly)
page.getByRole('button', { name: 'Submit' })
page.getByRole('heading', { name: 'Welcome' })
page.getByRole('textbox', { name: 'Email' })

// 2. By Label (Forms)
page.getByLabel('Email address')
page.getByLabel('Password')

// 3. By Placeholder
page.getByPlaceholder('Enter your email')

// 4. By Text
page.getByText('Click me')
page.getByText(/submit/i) // regex, case-insensitive

// 5. By Test ID (Custom attributes)
page.getByTestId('login-button')

// 6. By Title
page.getByTitle('Close dialog')

// 7. By Alt Text (Images)
page.getByAltText('Profile picture')
```

### CSS & XPath Selectors (Use sparingly)

```typescript
// CSS selectors
page.locator('button.primary')
page.locator('#submit-btn')
page.locator('[data-testid="user-menu"]')

// XPath
page.locator('xpath=//button[contains(text(), "Submit")]')

// Chaining locators
page.locator('.card').locator('button')

// Filtering
page.getByRole('button').filter({ hasText: 'Delete' })
page.getByRole('listitem').filter({ has: page.getByText('Active') })
```

---

## 🖱️ User Interactions

### Clicking

```typescript
// Basic click
await page.getByRole('button', { name: 'Submit' }).click()

// Double click
await page.getByRole('button').dblclick()

// Right click
await page.getByRole('button').click({ button: 'right' })

// Click with modifiers
await page.getByRole('button').click({ modifiers: ['Shift'] })

// Force click (bypass actionability checks)
await page.getByRole('button').click({ force: true })
```

### Typing

```typescript
// Type text
await page.getByLabel('Email').fill('user@example.com')

// Type character by character (slower)
await page.getByLabel('Email').type('user@example.com')

// Clear and type
await page.getByLabel('Email').clear()
await page.getByLabel('Email').fill('new@example.com')

// Press keys
await page.getByLabel('Search').press('Enter')
await page.keyboard.press('Control+A')
```

### Selecting

```typescript
// Select dropdown
await page.selectOption('select#country', 'US')
await page.selectOption('select#country', { label: 'United States' })

// Checkboxes & Radio buttons
await page.getByLabel('Accept terms').check()
await page.getByLabel('Decline').uncheck()
```

### File Uploads

```typescript
// Upload single file
await page.getByLabel('Upload').setInputFiles('path/to/file.pdf')

// Upload multiple files
await page.getByLabel('Upload').setInputFiles([
  'file1.jpg',
  'file2.jpg'
])

// Remove files
await page.getByLabel('Upload').setInputFiles([])
```

---

## ✅ Assertions

### Visibility & State

```typescript
// Visibility
await expect(page.getByText('Welcome')).toBeVisible()
await expect(page.getByText('Loading')).toBeHidden()

// Enabled/Disabled
await expect(page.getByRole('button')).toBeEnabled()
await expect(page.getByRole('button')).toBeDisabled()

// Checked
await expect(page.getByLabel('Terms')).toBeChecked()
await expect(page.getByLabel('Terms')).not.toBeChecked()

// Focused
await expect(page.getByLabel('Email')).toBeFocused()
```

### Content Assertions

```typescript
// Text content
await expect(page.getByRole('heading')).toHaveText('Welcome')
await expect(page.getByRole('heading')).toContainText('Wel')

// Multiple elements text
await expect(page.getByRole('listitem')).toHaveText(['Item 1', 'Item 2'])

// Attribute values
await expect(page.getByRole('link')).toHaveAttribute('href', '/about')

// CSS class
await expect(page.getByRole('button')).toHaveClass('btn-primary')
await expect(page.getByRole('button')).toHaveClass(/btn-/)

// Value (for inputs)
await expect(page.getByLabel('Email')).toHaveValue('user@example.com')
```

### Count & URL

```typescript
// Count elements
await expect(page.getByRole('listitem')).toHaveCount(5)

// URL assertions
await expect(page).toHaveURL('http://localhost:3000/dashboard')
await expect(page).toHaveURL(/dashboard/)

// Title
await expect(page).toHaveTitle('My Dashboard')
```

### Screenshots

```typescript
// Visual regression testing
await expect(page).toHaveScreenshot('homepage.png')
await expect(page.getByRole('dialog')).toHaveScreenshot('modal.png')
```

---

## 🌐 Navigation & Waiting

### Navigation

```typescript
// Go to URL
await page.goto('https://example.com')

// Navigate
await page.goBack()
await page.goForward()
await page.reload()

// Wait for navigation
await Promise.all([
  page.waitForNavigation(),
  page.getByRole('button').click()
])
```

### Waiting Strategies

```typescript
// Wait for element
await page.waitForSelector('button')

// Wait for element state
await page.getByRole('button').waitFor({ state: 'visible' })
await page.getByRole('button').waitFor({ state: 'hidden' })

// Wait for URL
await page.waitForURL('**/dashboard')

// Wait for network idle
await page.goto('/', { waitUntil: 'networkidle' })

// Wait for load state
await page.waitForLoadState('domcontentloaded')
await page.waitForLoadState('load')

// Custom timeout
await page.getByRole('button').click({ timeout: 5000 })

// Wait for response
const response = await page.waitForResponse(
  resp => resp.url().includes('api/users') && resp.status() === 200
)
```

---

## 🔥 Advanced Techniques

### Working with Multiple Elements

```typescript
// Get all matching elements
const items = await page.getByRole('listitem').all()
for (const item of items) {
  await item.click()
}

// Count elements
const count = await page.getByRole('button').count()

// nth element
await page.getByRole('button').nth(2).click()
await page.getByRole('button').first().click()
await page.getByRole('button').last().click()
```

### Frames & iframes

```typescript
// Access iframe by name/url
const frame = page.frameLocator('iframe[name="my-frame"]')
await frame.getByRole('button').click()

// Access nested frames
const childFrame = frame.frameLocator('iframe.nested')
```

### Dialogs & Alerts

```typescript
// Handle dialog
page.on('dialog', async dialog => {
  console.log(dialog.message())
  await dialog.accept()
  // or: await dialog.dismiss()
})

await page.getByRole('button', { name: 'Delete' }).click()
```

### Network Interception

```typescript
// Mock API response
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify([{ id: 1, name: 'John' }])
  })
})

// Abort images
await page.route('**/*.{png,jpg,jpeg}', route => route.abort())

// Monitor requests
page.on('request', request => console.log(request.url()))
page.on('response', response => console.log(response.status()))
```

### Local Storage & Cookies

```typescript
// Set local storage
await page.evaluate(() => {
  localStorage.setItem('token', 'abc123')
})

// Get local storage
const token = await page.evaluate(() => localStorage.getItem('token'))

// Cookies
await context.addCookies([{
  name: 'session',
  value: 'xyz789',
  domain: 'localhost',
  path: '/'
}])

const cookies = await context.cookies()
```

### Authentication State

```typescript
// Save auth state
await page.goto('/login')
await page.getByLabel('Email').fill('user@test.com')
await page.getByLabel('Password').fill('password')
await page.getByRole('button', { name: 'Login' }).click()
await page.context().storageState({ path: 'auth.json' })

// Reuse auth state
const context = await browser.newContext({
  storageState: 'auth.json'
})
```

---

## 🤝 Playwright with Vitest

### Setup Integration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Separate unit tests from E2E
    include: ['tests/**/*.{test,spec}.{js,ts}'],
    exclude: ['tests/e2e/**'],
  },
})
```

### Project Structure

```
tests/
├── unit/           # Vitest unit tests
│   ├── utils.test.ts
│   └── components.test.tsx
├── e2e/            # Playwright E2E tests
│   ├── login.spec.ts
│   └── checkout.spec.ts
└── fixtures/       # Shared test data
```

### Best Practices for Vitest + Playwright

#### 1. **Clear Separation of Concerns**

```typescript
// ✅ GOOD: Use Vitest for unit/integration
// tests/unit/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validateEmail } from '@/lib/validation'

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('user@test.com')).toBe(true)
  })
})

// ✅ GOOD: Use Playwright for E2E
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('user@test.com')
  await expect(page).toHaveURL('/dashboard')
})
```

#### 2. **Shared Test Utilities**

```typescript
// tests/utils/test-helpers.ts
export const TEST_USER = {
  email: 'test@example.com',
  password: 'Password123!'
}

// Use in Vitest
import { TEST_USER } from '@/tests/utils/test-helpers'

// Use in Playwright
import { TEST_USER } from '../utils/test-helpers'
```

#### 3. **Parallel Script Execution**

```json
// package.json
{
  "scripts": {
    "test:unit": "vitest",
    "test:e2e": "playwright test",
    "test:all": "vitest run && playwright test",
    "test:ui": "vitest --ui",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

#### 4. **Setup/Teardown Coordination**

```typescript
// tests/e2e/setup.ts - Playwright global setup
import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // Wait for Vitest to finish if needed
  // Start services, seed database, etc.
}

export default globalSetup
```

#### 5. **Shared Fixtures**

```typescript
// tests/fixtures/users.ts
export const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@test.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@test.com' },
]

// Vitest usage
import { mockUsers } from '../fixtures/users'
vi.mock('@/api/users', () => ({ getUsers: () => mockUsers }))

// Playwright usage
await page.route('**/api/users', route => {
  route.fulfill({ body: JSON.stringify(mockUsers) })
})
```

---

## 💎 Best Practices

### ✅ DO

- **Use role-based selectors** for better accessibility
- **Use `getByTestId`** only when semantic selectors aren't available
- **Wait for elements automatically** - Playwright auto-waits
- **Use soft assertions** for multiple checks that shouldn't stop execution
- **Keep tests independent** - each test should work standalone
- **Use page objects** for complex pages
- **Run tests in parallel** for faster execution
- **Use fixtures** for common setup/teardown

```typescript
// Soft assertions
await expect.soft(page.getByText('Error 1')).toBeVisible()
await expect.soft(page.getByText('Error 2')).toBeVisible()
// Both assertions run even if first fails

// Page Object Model
class LoginPage {
  constructor(private page: Page) {}
  
  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email)
    await this.page.getByLabel('Password').fill(password)
    await this.page.getByRole('button', { name: 'Login' }).click()
  }
}

// Custom fixtures
import { test as base } from '@playwright/test'

const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    // perform login...
    await use(page)
  }
})
```

### ❌ DON'T

```typescript
// ❌ Don't use arbitrary waits
await page.waitForTimeout(3000)

// ✅ Wait for specific conditions
await page.waitForResponse(resp => resp.url().includes('/api/data'))

// ❌ Don't use fragile XPath/CSS selectors
await page.locator('div > div > button:nth-child(3)').click()

// ✅ Use semantic selectors
await page.getByRole('button', { name: 'Submit' }).click()

// ❌ Don't test implementation details
await page.locator('.internal-class-name').click()

// ✅ Test user-visible behavior
await page.getByRole('button', { name: 'Add to Cart' }).click()
```

### Testing Pyramid with Vitest + Playwright

```
        /\
       /  \       E2E (Playwright)
      /____\      Critical user journeys only
     /      \
    /        \    Integration (Vitest + Testing Library)
   /__________\   Component interactions
  /            \
 /              \ Unit (Vitest)
/________________\ Business logic, utilities, pure functions
```

---

## 🐛 Debugging

### Debug Commands

```bash
# Run in debug mode
npx playwright test --debug

# Debug specific test
npx playwright test login.spec.ts --debug

# Run headed mode
npx playwright test --headed

# Slow down execution
npx playwright test --headed --slow-mo=1000
```

### Debug Tools

```typescript
// Pause execution
await page.pause()

// Screenshot
await page.screenshot({ path: 'screenshot.png' })
await page.screenshot({ path: 'screenshot.png', fullPage: true })

// Video recording (enabled in config)
use: {
  video: 'on',
  // or 'retain-on-failure', 'on-first-retry'
}

// Trace viewer
use: {
  trace: 'on-first-retry',
}

// Console logs
page.on('console', msg => console.log(msg.text()))

// Generate test code
npx playwright codegen http://localhost:3000
```

### VS Code Extension

Install the official **Playwright Test for VSCode** extension for:
- Run/debug tests from editor
- Test explorer sidebar
- Pick locators
- View trace files

---

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

---

## 📝 Quick Reference Card

| Task | Command |
|------|---------|
| Find by role | `page.getByRole('button', { name: 'Text' })` |
| Find by label | `page.getByLabel('Email')` |
| Find by text | `page.getByText('Click me')` |
| Click | `await element.click()` |
| Type | `await element.fill('text')` |
| Assert visible | `await expect(element).toBeVisible()` |
| Assert text | `await expect(element).toHaveText('text')` |
| Wait for element | `await element.waitFor()` |
| Navigate | `await page.goto('/path')` |
| Screenshot | `await page.screenshot({ path: 'file.png' })` |

---

**Happy Testing! 🎭✨**
