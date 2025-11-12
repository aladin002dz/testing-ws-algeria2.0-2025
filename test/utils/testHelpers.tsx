import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ReactNode } from 'react';

/**
 * Todo interface for test data
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Create a mock todo object
 */
export function createMockTodo(overrides?: Partial<Todo>): Todo {
  return {
    id: Date.now().toString(),
    text: 'Test todo',
    completed: false,
    ...overrides,
  };
}

/**
 * Create multiple mock todos
 */
export function createMockTodos(count: number, overrides?: Partial<Todo>): Todo[] {
  return Array.from({ length: count }, (_, index) =>
    createMockTodo({
      id: `todo-${index + 1}`,
      text: `Test todo ${index + 1}`,
      ...overrides,
    })
  );
}

/**
 * Custom render function with providers
 * This can be extended with context providers if needed in the future
 */
function AllTheProviders({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

/**
 * Re-export everything from testing-library
 */
export * from '@testing-library/react';

/**
 * Override render method
 */
export { customRender as render };

