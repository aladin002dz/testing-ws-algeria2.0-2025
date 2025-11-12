export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

/**
 * Creates a new todo item
 */
export function createTodo(text: string): Todo {
  if (!text || text.trim() === '') {
    throw new Error('Todo text cannot be empty');
  }
  return {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
  };
}

/**
 * Toggles the completion status of a todo
 */
export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
}

/**
 * Deletes a todo by id
 */
export function deleteTodo(todos: Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}

/**
 * Gets the count of completed todos
 */
export function getCompletedCount(todos: Todo[]): number {
  return todos.filter((todo) => todo.completed).length;
}

/**
 * Gets the total count of todos
 */
export function getTotalCount(todos: Todo[]): number {
  return todos.length;
}

/**
 * Filters todos by completion status
 */
export function filterTodos(todos: Todo[], showCompleted: boolean): Todo[] {
  if (showCompleted) {
    return todos.filter((todo) => todo.completed);
  }
  return todos.filter((todo) => !todo.completed);
}

