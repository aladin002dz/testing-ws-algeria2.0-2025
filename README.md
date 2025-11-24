# Vitest Cheatsheet & Testing Memo

> Quick reference guide for unit testing with Vitest — common techniques, practices, and patterns

---

## Table of Contents
- [Setup & Configuration](#setup--configuration)
- [Basic Test Structure](#basic-test-structure)
- [Assertions & Matchers](#assertions--matchers)
- [Async Testing](#async-testing)
- [Mocking](#mocking)
- [Testing React Components](#testing-react-components)
- [Code Coverage](#code-coverage)
- [Best Practices](#best-practices)
- [Common Commands](#common-commands)

---

## Setup & Configuration

### Installation
```bash
npm install -D vitest
# or
pnpm add -D vitest
```

### Basic `vitest.config.js`
```javascript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,           // Use global test APIs (describe, it, expect)
    environment: 'node',     // or 'jsdom' for browser environment
    coverage: {
      provider: 'v8',        // or 'istanbul'
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Basic Test Structure

### Simple Test Suite
```javascript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('Math utilities', () => {
  beforeEach(() => {
    // Setup before each test
  })

  afterEach(() => {
    // Cleanup after each test
  })

  it('should add two numbers', () => {
    expect(1 + 1).toBe(2)
  })

  it.skip('skips this test', () => {
    // This test will be skipped
  })

  it.only('runs only this test', () => {
    // Only this test will run
  })

  it.todo('implement this test later')
})
```

### Test Hooks
```javascript
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

beforeAll(() => {
  // Runs once before all tests in this file
})

afterAll(() => {
  // Runs once after all tests in this file
})

beforeEach(() => {
  // Runs before each test
})

afterEach(() => {
  // Runs after each test
})
```

---

## Assertions & Matchers

### Common Matchers
```javascript
// Equality
expect(value).toBe(42)                    // Strict equality (===)
expect(value).toEqual({ a: 1 })           // Deep equality
expect(value).not.toBe(null)              // Negation

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(10)
expect(value).toBeGreaterThanOrEqual(10)
expect(value).toBeLessThan(10)
expect(value).toBeLessThanOrEqual(10)
expect(0.1 + 0.2).toBeCloseTo(0.3)        // Floating point

// Strings
expect(str).toMatch(/regex/)
expect(str).toContain('substring')

// Arrays & Objects
expect(array).toContain(item)
expect(array).toHaveLength(3)
expect(obj).toHaveProperty('key', 'value')
expect(obj).toMatchObject({ a: 1 })

// Functions
expect(fn).toThrow()
expect(fn).toThrow('error message')
expect(fn).toThrow(TypeError)
expect(fn).toHaveBeenCalled()
expect(fn).toHaveBeenCalledWith(arg1, arg2)
expect(fn).toHaveBeenCalledTimes(2)
```

### Snapshot Testing
```javascript
import { expect } from 'vitest'

it('matches snapshot', () => {
  const data = { name: 'John', age: 30 }
  expect(data).toMatchSnapshot()
})

// Inline snapshots
it('matches inline snapshot', () => {
  expect({ foo: 'bar' }).toMatchInlineSnapshot(`
    {
      "foo": "bar",
    }
  `)
})
```

---

## Async Testing

### Promises
```javascript
import { it, expect } from 'vitest'

// Using async/await
it('fetches data', async () => {
  const data = await fetchData()
  expect(data).toBe('peanut butter')
})

// Using return
it('fetches data', () => {
  return fetchData().then(data => {
    expect(data).toBe('peanut butter')
  })
})

// Testing rejections
it('handles errors', async () => {
  await expect(fetchData()).rejects.toThrow('error')
})

it('resolves successfully', async () => {
  await expect(fetchData()).resolves.toBe('data')
})
```

### Timers
```javascript
import { vi, it, expect } from 'vitest'

it('uses fake timers', () => {
  vi.useFakeTimers()
  
  const callback = vi.fn()
  setTimeout(callback, 1000)
  
  vi.advanceTimersByTime(1000)
  expect(callback).toHaveBeenCalled()
  
  vi.useRealTimers()
})

// Run all timers
vi.runAllTimers()

// Run pending timers
vi.runOnlyPendingTimers()

// Advance by time
vi.advanceTimersByTime(1000)
```

---

## Mocking

### Mock Functions
```javascript
import { vi, it, expect } from 'vitest'

// Create a mock function
const mockFn = vi.fn()
mockFn('arg1', 'arg2')

// Assertions
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(1)
expect(mockFn.mock.calls[0][0]).toBe('arg1')

// Mock return values
mockFn.mockReturnValue(42)
mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2)

// Mock implementations
mockFn.mockImplementation((x) => x * 2)
mockFn.mockImplementationOnce((x) => x + 1)

// Mock resolved/rejected values
mockFn.mockResolvedValue('success')
mockFn.mockRejectedValue(new Error('failed'))

// Clear mock data
mockFn.mockClear()      // Clear call history
mockFn.mockReset()      // Clear calls + return values
mockFn.mockRestore()    // Restore original implementation
```

### Module Mocking
```javascript
import { vi } from 'vitest'

// Mock entire module
vi.mock('./utils', () => ({
  getName: vi.fn(() => 'mocked name'),
  getAge: vi.fn(() => 25)
}))

// Partial module mock
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils')
  return {
    ...actual,
    getName: vi.fn(() => 'mocked name')
  }
})

// Mock specific exports
import { getName } from './utils'
vi.mocked(getName).mockReturnValue('test')

// Unmock
vi.unmock('./utils')
```

### Spying
```javascript
import { vi } from 'vitest'

const obj = {
  method: (x) => x * 2
}

// Spy on method
const spy = vi.spyOn(obj, 'method')
obj.method(5)

expect(spy).toHaveBeenCalledWith(5)
expect(spy).toHaveReturnedWith(10)

// Spy with mock implementation
vi.spyOn(obj, 'method').mockImplementation(() => 100)
```

### Global Mocks
```javascript
import { vi } from 'vitest'

// Mock global functions
global.fetch = vi.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked' })
  })
)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = localStorageMock

// Mock console
vi.spyOn(console, 'log').mockImplementation(() => {})
```

---

## Testing React Components

### Setup for React Testing
```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

### Basic Component Test
```javascript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeDefined()
  })

  it('applies custom className', () => {
    render(<Button className="custom">Text</Button>)
    expect(screen.getByText('Text')).toHaveClass('custom')
  })
})
```

### User Interactions
```javascript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

it('handles click events', async () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  
  await userEvent.click(screen.getByText('Click'))
  expect(handleClick).toHaveBeenCalledTimes(1)
})

it('handles input changes', async () => {
  render(<input data-testid="input" />)
  const input = screen.getByTestId('input')
  
  await userEvent.type(input, 'Hello')
  expect(input).toHaveValue('Hello')
})
```

### Querying Elements
```javascript
import { render, screen } from '@testing-library/react'

// Preferred queries (fail if not found)
screen.getByRole('button', { name: /submit/i })
screen.getByLabelText(/username/i)
screen.getByPlaceholderText(/search/i)
screen.getByText(/hello world/i)
screen.getByDisplayValue('current value')
screen.getByTestId('custom-element')

// Query variants
screen.queryByText('might not exist')  // Returns null if not found
screen.findByText('async element')     // Returns promise (for async)

// Multiple elements
screen.getAllByRole('listitem')
screen.queryAllByText(/item/i)
screen.findAllByRole('button')
```

### Testing Hooks
```javascript
import { renderHook, act } from '@testing-library/react'
import { useCounter } from './useCounter'

it('increments counter', () => {
  const { result } = renderHook(() => useCounter())
  
  expect(result.current.count).toBe(0)
  
  act(() => {
    result.current.increment()
  })
  
  expect(result.current.count).toBe(1)
})
```

---

## Code Coverage

### Configuration
```javascript
// vitest.config.js
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.js',
        '**/*.test.js'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80
      }
    }
  }
})
```

### Running Coverage
```bash
# Generate coverage report
vitest run --coverage

# Watch mode with coverage
vitest --coverage
```

---

## Best Practices

### ✅ DO

- **Test behavior, not implementation**
  ```javascript
  // Good: Tests what the user sees
  it('displays error message on invalid input', () => {
    render(<Form />)
    userEvent.type(screen.getByLabelText('Email'), 'invalid')
    expect(screen.getByText('Invalid email')).toBeDefined()
  })
  
  // Bad: Tests internal state
  it('sets error state', () => {
    const { result } = renderHook(() => useForm())
    act(() => result.current.setEmail('invalid'))
    expect(result.current.error).toBe(true)
  })
  ```

- **Use descriptive test names**
  ```javascript
  // Good
  it('shows "No results" when search returns empty array', () => {})
  
  // Bad
  it('works correctly', () => {})
  ```

- **Follow AAA pattern (Arrange, Act, Assert)**
  ```javascript
  it('calculates total price', () => {
    // Arrange
    const items = [{ price: 10 }, { price: 20 }]
    
    // Act
    const total = calculateTotal(items)
    
    // Assert
    expect(total).toBe(30)
  })
  ```

- **Keep tests isolated and independent**
  ```javascript
  // Each test should be able to run in any order
  describe('User service', () => {
    let service
    
    beforeEach(() => {
      service = new UserService() // Fresh instance each test
    })
    
    it('creates user', () => {
      const user = service.create({ name: 'John' })
      expect(user).toBeDefined()
    })
  })
  ```

### ❌ DON'T

- **Don't test implementation details**
  ```javascript
  // Bad: Testing internal method
  expect(component.internalHelperMethod()).toBe(true)
  
  // Good: Test the observable outcome
  expect(screen.getByText('Success message')).toBeDefined()
  ```

- **Don't create brittle tests**
  ```javascript
  // Bad: Relies on specific DOM structure
  expect(container.firstChild.children[2].textContent).toBe('text')
  
  // Good: Uses semantic queries
  expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('text')
  ```

- **Don't make tests interdependent**
  ```javascript
  // Bad: Tests depend on execution order
  let sharedData
  it('sets data', () => { sharedData = 'value' })
  it('uses data', () => { expect(sharedData).toBe('value') })
  
  // Good: Each test is independent
  it('processes data', () => {
    const data = 'value'
    expect(processData(data)).toBeDefined()
  })
  ```

### Test Organization

```javascript
describe('Component/Feature Name', () => {
  describe('rendering', () => {
    it('renders correctly with default props', () => {})
    it('renders with custom props', () => {})
  })
  
  describe('user interactions', () => {
    it('handles button click', () => {})
    it('submits form on enter key', () => {})
  })
  
  describe('edge cases', () => {
    it('handles empty data', () => {})
    it('handles error state', () => {})
  })
})
```

---

## Common Commands

```bash
# Run tests
vitest                          # Watch mode
vitest run                      # Run once
vitest --ui                     # Interactive UI
vitest --reporter=verbose       # Detailed output

# Run specific tests
vitest src/utils                # Test specific directory
vitest auth.test.js             # Test specific file
vitest -t "test name pattern"   # Test matching pattern

# Coverage
vitest run --coverage           # Generate coverage
vitest --coverage.enabled --coverage.all  # All files

# Update snapshots
vitest -u                       # Update snapshots
vitest --update                 # Same as -u

# Other options
vitest --watch=false            # Disable watch mode
vitest --silent                 # Suppress output
vitest --bail=1                 # Stop on first failure
vitest --threads=false          # Disable multithreading
```

---

## Quick Reference Card

| Task | Code |
|------|------|
| Basic assertion | `expect(value).toBe(expected)` |
| Deep equality | `expect(obj).toEqual({ key: 'value' })` |
| Mock function | `const fn = vi.fn()` |
| Mock module | `vi.mock('./module')` |
| Spy on method | `vi.spyOn(obj, 'method')` |
| Async test | `await expect(promise).resolves.toBe(value)` |
| Test hook | `beforeEach(() => { /* setup */ })` |
| Skip test | `it.skip('test', () => {})` |
| Only test | `it.only('test', () => {})` |
| Render component | `render(<Component />)` |
| Query element | `screen.getByRole('button')` |
| User event | `await userEvent.click(element)` |
| Fake timers | `vi.useFakeTimers()` |
| Coverage | `vitest run --coverage` |

---

## Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [Vitest API Reference](https://vitest.dev/api/)
- [Common Testing Patterns](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

**💡 Pro Tip:** Write tests that give you confidence your code works, not tests that just increase coverage numbers!
