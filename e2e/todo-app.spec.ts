import { test, expect } from '@playwright/test';

test.describe('Todo App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the todo app title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'My To-Do List' })).toBeVisible();
  });

  test('should show empty state message', async ({ page }) => {
    await expect(
      page.getByText('No tasks yet. Add one above to get started!')
    ).toBeVisible();
  });

  test('should add a new todo', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    await input.fill('Buy groceries');
    await addButton.click();

    await expect(page.getByText('Buy groceries')).toBeVisible();
    await expect(input).toHaveValue('');
  });

  test('should add todo when pressing Enter', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');

    await input.fill('Complete project');
    await input.press('Enter');

    await expect(page.getByText('Complete project')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    // Add a todo
    await input.fill('Test task');
    await addButton.click();

    const checkbox = page.getByRole('checkbox');
    const todoText = page.getByText('Test task');

    // Initially not completed
    await expect(checkbox).not.toBeChecked();
    await expect(todoText).not.toHaveCSS('text-decoration', /line-through/);

    // Toggle to completed
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await expect(todoText).toHaveCSS('text-decoration', /line-through/);

    // Toggle back to incomplete
    await checkbox.click();
    await expect(checkbox).not.toBeChecked();
  });

  test('should delete a todo', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    // Add two todos
    await input.fill('Task 1');
    await addButton.click();
    await input.fill('Task 2');
    await addButton.click();

    // Verify both are visible
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();

    // Delete first task
    const deleteButtons = page.getByRole('button', { name: 'Delete' });
    await deleteButtons.first().click();

    // Verify first task is deleted
    await expect(page.getByText('Task 1')).not.toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
  });

  test('should display completion stats', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    // Add three todos
    await input.fill('Task 1');
    await addButton.click();
    await input.fill('Task 2');
    await addButton.click();
    await input.fill('Task 3');
    await addButton.click();

    // Initially no stats (all incomplete)
    await expect(page.getByText(/of \d+ tasks completed/)).toBeVisible();
    await expect(page.getByText('0 of 3 tasks completed')).toBeVisible();

    // Complete one task
    const checkboxes = page.getByRole('checkbox');
    await checkboxes.first().click();

    // Stats should update
    await expect(page.getByText('1 of 3 tasks completed')).toBeVisible();
  });

  test('should persist todos in localStorage', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    // Add a todo
    await input.fill('Persistent task');
    await addButton.click();

    // Reload page
    await page.reload();

    // Todo should still be there
    await expect(page.getByText('Persistent task')).toBeVisible();
  });

  test('should not add empty todos', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    // Try to add empty todo
    await input.fill('   ');
    await addButton.click();

    // Should still show empty state
    await expect(
      page.getByText('No tasks yet. Add one above to get started!')
    ).toBeVisible();
  });

  test('should handle multiple todos', async ({ page }) => {
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    const tasks = ['Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5'];

    for (const task of tasks) {
      await input.fill(task);
      await addButton.click();
    }

    // Verify all tasks are visible
    for (const task of tasks) {
      await expect(page.getByText(task)).toBeVisible();
    }

    // Verify stats
    await expect(page.getByText(`0 of ${tasks.length} tasks completed`)).toBeVisible();
  });
});

