import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { createMockTodo, createMockTodos, render, screen, waitFor } from '../test/utils/testHelpers';
import Home from './page';

describe('Home Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('Rendering tests', () => {
    it('should render initial empty state', () => {
      console.log('📢 LOUD LOG: This should be hidden by --silent');
      console.error('❌ ERROR LOG: This should also be hidden by --silent');
      render(<Home />);

      expect(screen.getByText('My To-Do List')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
      expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
    });

    it('should render todos from localStorage on mount', () => {
      const mockTodos = createMockTodos(2);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      expect(screen.getByText(mockTodos[0].text)).toBeInTheDocument();
      expect(screen.getByText(mockTodos[1].text)).toBeInTheDocument();
      expect(screen.queryByText('No tasks yet. Add one above to get started!')).not.toBeInTheDocument();
    });

    it('should display stats when todos exist', () => {
      const mockTodos = [
        createMockTodo({ text: 'Todo 1', completed: true }),
        createMockTodo({ text: 'Todo 2', completed: false }),
      ];
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      expect(screen.getByText('1 of 2 tasks completed')).toBeInTheDocument();
    });

    it('should not display stats when no todos exist', () => {
      render(<Home />);

      expect(screen.queryByText(/tasks completed/i)).not.toBeInTheDocument();
    });
  });

  describe('User interaction tests', () => {
    it('should add a new todo via input and button', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'New todo item');
      await user.click(addButton);

      expect(screen.getByText('New todo item')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should add a todo via Enter key', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');

      await user.type(input, 'New todo item');
      await user.keyboard('{Enter}');

      expect(screen.getByText('New todo item')).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should prevent empty todo creation', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const addButton = screen.getByRole('button', { name: /add/i });

      await user.click(addButton);

      expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
    });

    it('should prevent whitespace-only todo creation', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, '   ');
      await user.click(addButton);

      expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
      expect(input).toHaveValue('   ');
    });

    it('should trim whitespace from todo text', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, '  Todo with spaces  ');
      await user.click(addButton);

      expect(screen.getByText('Todo with spaces')).toBeInTheDocument();
    });

    it('should toggle todo completion status', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Test todo', completed: false });
      localStorage.setItem('todos', JSON.stringify([mockTodo]));

      render(<Home />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);

      await waitFor(() => {
        expect(checkbox).toBeChecked();
      });

      const todoText = screen.getByText('Test todo');
      expect(todoText).toHaveClass('line-through');
    });

    it('should delete a todo', async () => {
      const user = userEvent.setup();
      const mockTodos = createMockTodos(2);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      expect(screen.getByText(mockTodos[0].text)).toBeInTheDocument();
      expect(screen.getByText(mockTodos[1].text)).toBeInTheDocument();

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText(mockTodos[0].text)).not.toBeInTheDocument();
      });
      expect(screen.getByText(mockTodos[1].text)).toBeInTheDocument();
    });

    it('should delete all todos', async () => {
      const user = userEvent.setup();
      const mockTodos = createMockTodos(2);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

      await user.click(deleteButtons[0]);
      await user.click(deleteButtons[1]);

      await waitFor(() => {
        expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
      });
    });

    it('should toggle multiple todos', async () => {
      const user = userEvent.setup();
      const mockTodos = createMockTodos(3);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      const checkboxes = screen.getAllByRole('checkbox');

      await user.click(checkboxes[0]);
      await user.click(checkboxes[1]);

      await waitFor(() => {
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).toBeChecked();
        expect(checkboxes[2]).not.toBeChecked();
      });

      expect(screen.getByText('2 of 3 tasks completed')).toBeInTheDocument();
    });
  });

  describe('localStorage integration tests', () => {
    it('should save todos to localStorage on add', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'New todo');
      await user.click(addButton);

      await waitFor(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(savedTodos).toHaveLength(1);
        expect(savedTodos[0].text).toBe('New todo');
        expect(savedTodos[0].completed).toBe(false);
      });
    });

    it('should load todos from localStorage on mount', () => {
      const mockTodos = createMockTodos(2);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      expect(screen.getByText(mockTodos[0].text)).toBeInTheDocument();
      expect(screen.getByText(mockTodos[1].text)).toBeInTheDocument();
    });

    it('should persist todos across component updates', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, 'First todo');
      await user.click(addButton);

      await user.type(input, 'Second todo');
      await user.click(addButton);

      await waitFor(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(savedTodos).toHaveLength(2);
        expect(savedTodos[0].text).toBe('First todo');
        expect(savedTodos[1].text).toBe('Second todo');
      });
    });

    it('should update localStorage when toggling todo', async () => {
      const user = userEvent.setup();
      const mockTodo = createMockTodo({ text: 'Test todo', completed: false });
      localStorage.setItem('todos', JSON.stringify([mockTodo]));

      render(<Home />);

      const checkbox = screen.getByRole('checkbox');
      await user.click(checkbox);

      await waitFor(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(savedTodos[0].completed).toBe(true);
      });
    });

    it('should update localStorage when deleting todo', async () => {
      const user = userEvent.setup();
      const mockTodos = createMockTodos(2);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(savedTodos).toHaveLength(1);
        expect(savedTodos[0].text).toBe(mockTodos[1].text);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty input gracefully', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const addButton = screen.getByRole('button', { name: /add/i });

      // Click add button without typing anything (input is already empty)
      await user.click(addButton);

      // Verify empty state is still shown
      expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
    });

    it('should handle whitespace-only input', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByPlaceholderText('Add a new task...');
      const addButton = screen.getByRole('button', { name: /add/i });

      await user.type(input, '     ');
      await user.click(addButton);

      expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
    });

    it('should handle toggling all todos to completed', async () => {
      const user = userEvent.setup();
      const mockTodos = createMockTodos(3);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      const checkboxes = screen.getAllByRole('checkbox');

      for (const checkbox of checkboxes) {
        await user.click(checkbox);
      }

      await waitFor(() => {
        expect(screen.getByText('3 of 3 tasks completed')).toBeInTheDocument();
      });

      checkboxes.forEach((checkbox) => {
        expect(checkbox).toBeChecked();
      });
    });

    it('should handle deleting all todos', async () => {
      const user = userEvent.setup();
      const mockTodos = createMockTodos(2);
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });

      for (const button of deleteButtons) {
        await user.click(button);
      }

      await waitFor(() => {
        expect(screen.getByText('No tasks yet. Add one above to get started!')).toBeInTheDocument();
        const savedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
        expect(savedTodos).toHaveLength(0);
      });
    });

    it('should update stats correctly when todos are completed', async () => {
      const user = userEvent.setup();
      // Create todos with unique IDs to avoid conflicts
      const mockTodos = [
        { id: '1', text: 'Todo 1', completed: false },
        { id: '2', text: 'Todo 2', completed: false },
        { id: '3', text: 'Todo 3', completed: false },
      ];
      localStorage.setItem('todos', JSON.stringify(mockTodos));

      render(<Home />);

      // Wait for component to load from localStorage
      await waitFor(() => {
        expect(screen.getByText('Todo 1')).toBeInTheDocument();
        expect(screen.getByText('0 of 3 tasks completed')).toBeInTheDocument();
      });

      // Get all checkboxes (only the todo checkboxes, not input)
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);

      // Click first checkbox
      await user.click(checkboxes[0]);

      await waitFor(() => {
        expect(screen.getByText('1 of 3 tasks completed')).toBeInTheDocument();
      });

      // Click second checkbox
      await user.click(checkboxes[1]);

      await waitFor(() => {
        expect(screen.getByText('2 of 3 tasks completed')).toBeInTheDocument();
      });
    });
  });
});

