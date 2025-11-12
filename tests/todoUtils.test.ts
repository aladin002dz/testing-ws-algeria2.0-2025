import { describe, it, expect } from 'vitest';
import {
  createTodo,
  toggleTodo,
  deleteTodo,
  getCompletedCount,
  getTotalCount,
  filterTodos,
  type Todo,
} from '../lib/todoUtils';

describe('Todo Utilities', () => {
  describe('createTodo', () => {
    it('should create a new todo with correct properties', () => {
      const todo = createTodo('Test todo');
      expect(todo.text).toBe('Test todo');
      expect(todo.completed).toBe(false);
      expect(todo.id).toBeDefined();
    });

    it('should trim whitespace from todo text', () => {
      const todo = createTodo('  Test todo  ');
      expect(todo.text).toBe('Test todo');
    });

    it('should throw error for empty text', () => {
      expect(() => createTodo('')).toThrow('Todo text cannot be empty');
      expect(() => createTodo('   ')).toThrow('Todo text cannot be empty');
    });
  });

  describe('toggleTodo', () => {
    const todos: Todo[] = [
      { id: '1', text: 'Todo 1', completed: false },
      { id: '2', text: 'Todo 2', completed: true },
    ];

    it('should toggle a todo from incomplete to complete', () => {
      const result = toggleTodo(todos, '1');
      expect(result[0].completed).toBe(true);
      expect(result[1].completed).toBe(true); // unchanged
    });

    it('should toggle a todo from complete to incomplete', () => {
      const result = toggleTodo(todos, '2');
      expect(result[0].completed).toBe(false); // unchanged
      expect(result[1].completed).toBe(false);
    });

    it('should not modify todos with different ids', () => {
      const result = toggleTodo(todos, '1');
      expect(result[1]).toEqual(todos[1]);
    });
  });

  describe('deleteTodo', () => {
    const todos: Todo[] = [
      { id: '1', text: 'Todo 1', completed: false },
      { id: '2', text: 'Todo 2', completed: true },
      { id: '3', text: 'Todo 3', completed: false },
    ];

    it('should delete a todo by id', () => {
      const result = deleteTodo(todos, '2');
      expect(result).toHaveLength(2);
      expect(result.find((t) => t.id === '2')).toBeUndefined();
    });

    it('should return all todos if id not found', () => {
      const result = deleteTodo(todos, '999');
      expect(result).toHaveLength(3);
      expect(result).toEqual(todos);
    });
  });

  describe('getCompletedCount', () => {
    it('should return correct count of completed todos', () => {
      const todos: Todo[] = [
        { id: '1', text: 'Todo 1', completed: true },
        { id: '2', text: 'Todo 2', completed: false },
        { id: '3', text: 'Todo 3', completed: true },
      ];
      expect(getCompletedCount(todos)).toBe(2);
    });

    it('should return 0 for empty array', () => {
      expect(getCompletedCount([])).toBe(0);
    });
  });

  describe('getTotalCount', () => {
    it('should return correct total count', () => {
      const todos: Todo[] = [
        { id: '1', text: 'Todo 1', completed: false },
        { id: '2', text: 'Todo 2', completed: true },
      ];
      expect(getTotalCount(todos)).toBe(2);
    });

    it('should return 0 for empty array', () => {
      expect(getTotalCount([])).toBe(0);
    });
  });

  describe('filterTodos', () => {
    const todos: Todo[] = [
      { id: '1', text: 'Todo 1', completed: false },
      { id: '2', text: 'Todo 2', completed: true },
      { id: '3', text: 'Todo 3', completed: false },
      { id: '4', text: 'Todo 4', completed: true },
    ];

    it('should filter to show only incomplete todos', () => {
      const result = filterTodos(todos, false);
      expect(result).toHaveLength(2);
      expect(result.every((t) => !t.completed)).toBe(true);
    });

    it('should filter to show only completed todos', () => {
      const result = filterTodos(todos, true);
      expect(result).toHaveLength(2);
      expect(result.every((t) => t.completed)).toBe(true);
    });
  });
});

