'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function StatsPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos);
      setTodos(parsedTodos);

      const completed = parsedTodos.filter((t: Todo) => t.completed).length;
      const total = parsedTodos.length;
      const pending = total - completed;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      setStats({
        total,
        completed,
        pending,
        completionRate,
      });
    }
  }, []);

  // Listen for storage changes (when todos are updated from other tabs/pages)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);

        const completed = parsedTodos.filter((t: Todo) => t.completed).length;
        const total = parsedTodos.length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        setStats({
          total,
          completed,
          pending,
          completionRate,
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-2xl px-4 py-8 sm:px-8">
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-zinc-900 sm:p-8">
          <h1 className="mb-8 text-4xl font-bold text-black dark:text-zinc-50" data-testid="stats-title">
            Todo Statistics
          </h1>

          {stats.total === 0 ? (
            <div className="py-8 text-center">
              <p className="text-zinc-500 dark:text-zinc-400" data-testid="stats-empty">
                No todos yet. Create some tasks to see statistics!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Total Tasks</div>
                  <div className="text-3xl font-bold text-black dark:text-zinc-50" data-testid="stat-total">
                    {stats.total}
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Completed</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="stat-completed">
                    {stats.completed}
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Pending</div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400" data-testid="stat-pending">
                    {stats.pending}
                  </div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">Completion Rate</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400" data-testid="stat-rate">
                    {stats.completionRate}%
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                <h2 className="mb-4 text-lg font-semibold text-black dark:text-zinc-50">Progress Bar</h2>
                <div className="h-4 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300 dark:bg-blue-500"
                    style={{ width: `${stats.completionRate}%` }}
                    data-testid="progress-bar"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

