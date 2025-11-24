'use client';

import { useEffect, useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      console.log('📢 Current todos: ', JSON.parse(savedTodos));
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log('📢 Current todos: ', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
      };
      console.log('📢 New todo: ', newTodo);
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    console.log('📢 todo deleted: ', id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-4 py-8 sm:px-8">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 sm:p-8">
          <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50">
            My To-Do List
          </h1>

          {/* Input Section */}
          <div className="mb-6 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new task..."
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-3 text-black placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
            <button
              onClick={addTodo}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Add
            </button>
          </div>

          {/* Stats */}
          {totalCount > 0 && (
            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              {completedCount} of {totalCount} tasks completed
            </div>
          )}

          {/* Todo List */}
          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                No tasks yet. Add one above to get started!
              </p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors dark:border-zinc-700 dark:bg-zinc-800"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 cursor-pointer rounded border-zinc-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-zinc-600"
                  />
                  <span
                    className={`flex-1 ${todo.completed
                      ? 'text-zinc-500 line-through dark:text-zinc-500'
                      : 'text-black dark:text-zinc-50'
                      }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="rounded px-3 py-1 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    aria-label="Delete task"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
