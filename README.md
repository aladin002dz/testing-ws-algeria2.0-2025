# Vitest + React Testing Cheatsheet

This project uses **Vitest** for unit and component testing, along with **React Testing Library** for rendering and interacting with components.

## 🚀 Testing Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run tests in watch mode (default) |
| `npm run test:run` | Run tests once (CI mode) |
| `npm run test:coverage` | Run tests with coverage report (silent output) |
| `npm run test:ui` | Open Vitest UI for interactive debugging |

## 🧪 Core Concepts

### Rendering
Render your component into a virtual DOM for testing.
```tsx
import { render, screen } from '@testing-library/react';
import Home from './page';

render(<Home />);
```

### Querying Elements
Find elements rendered in the DOM.
- **`getBy...`**: Returns the element or throws an error if not found (use for assertions).
- **`queryBy...`**: Returns the element or `null` (use for checking non-existence).
- **`findBy...`**: Returns a Promise that resolves when the element is found (use for async).

**Common Queries:**
- `screen.getByText('Hello World')`
- `screen.getByRole('button', { name: /submit/i })`
- `screen.getByPlaceholderText('Enter your name')`

### User Interactions
Simulate user events like clicking and typing. Always use `userEvent.setup()`.
```tsx
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.type(screen.getByRole('textbox'), 'Hello');
await user.click(screen.getByRole('button'));
```

## ✅ Common Assertions
Using `jest-dom` matchers for readable assertions.

```tsx
expect(element).toBeInTheDocument();
expect(element).toHaveValue('Hello');
expect(element).toBeChecked();
expect(element).toHaveClass('active');
expect(element).toBeDisabled();
```

## ⏳ Async Testing
Wait for UI updates (e.g., after a state change or API call).

```tsx
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});
```

## 🎭 Mocking
Example: Mocking `localStorage`.

```tsx
const mockTodos = [{ id: 1, text: 'Buy milk', completed: false }];

// Setup before render
localStorage.setItem('todos', JSON.stringify(mockTodos));

// Verify after interaction
expect(JSON.parse(localStorage.getItem('todos'))).toHaveLength(1);
```

## 🐞 Debugging

- **`screen.debug()`**: Prints the current DOM state to the console.
- **Vitest UI**: Run `npm run test:ui` to see component state and logs visually.
