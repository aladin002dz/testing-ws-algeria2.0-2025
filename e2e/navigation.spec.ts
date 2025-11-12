import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display navigation bar on all pages', async ({ page }) => {
    // Check navigation is visible on home page
    await expect(page.getByTestId('nav-logo')).toBeVisible();
    await expect(page.getByTestId('nav-link-home')).toBeVisible();
    await expect(page.getByTestId('nav-link-stats')).toBeVisible();
    await expect(page.getByTestId('nav-link-about')).toBeVisible();

    // Navigate to stats page
    await page.getByTestId('nav-link-stats').click();
    await expect(page).toHaveURL('/stats');
    await expect(page.getByTestId('nav-logo')).toBeVisible();

    // Navigate to about page
    await page.getByTestId('nav-link-about').click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByTestId('nav-logo')).toBeVisible();
  });

  test('should navigate to home page', async ({ page }) => {
    // Start on home
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'My To-Do List' })).toBeVisible();

    // Navigate away
    await page.getByTestId('nav-link-about').click();
    await expect(page).toHaveURL('/about');

    // Navigate back to home
    await page.getByTestId('nav-link-home').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'My To-Do List' })).toBeVisible();
  });

  test('should navigate to stats page', async ({ page }) => {
    await page.getByTestId('nav-link-stats').click();
    
    await expect(page).toHaveURL('/stats');
    await expect(page.getByTestId('stats-title')).toBeVisible();
    await expect(page.getByText('Todo Statistics')).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.getByTestId('nav-link-about').click();
    
    await expect(page).toHaveURL('/about');
    await expect(page.getByTestId('about-title')).toBeVisible();
    await expect(page.getByText('About This App')).toBeVisible();
  });

  test('should highlight active page in navigation', async ({ page }) => {
    // Home should be active initially
    const homeLink = page.getByTestId('nav-link-home');
    await expect(homeLink).toHaveClass(/bg-blue-100/);

    // Navigate to stats
    await page.getByTestId('nav-link-stats').click();
    await expect(page).toHaveURL('/stats');
    const statsLink = page.getByTestId('nav-link-stats');
    await expect(statsLink).toHaveClass(/bg-blue-100/);
    await expect(homeLink).not.toHaveClass(/bg-blue-100/);

    // Navigate to about
    await page.getByTestId('nav-link-about').click();
    await expect(page).toHaveURL('/about');
    const aboutLink = page.getByTestId('nav-link-about');
    await expect(aboutLink).toHaveClass(/bg-blue-100/);
    await expect(statsLink).not.toHaveClass(/bg-blue-100/);
  });

  test('should navigate using logo', async ({ page }) => {
    // Navigate to about page
    await page.getByTestId('nav-link-about').click();
    await expect(page).toHaveURL('/about');

    // Click logo to go home
    await page.getByTestId('nav-logo').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'My To-Do List' })).toBeVisible();
  });

  test('should maintain state when navigating between pages', async ({ page }) => {
    // Add todos on home page
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    await input.fill('Task 1');
    await addButton.click();
    await input.fill('Task 2');
    await addButton.click();

    // Navigate to stats page
    await page.getByTestId('nav-link-stats').click();
    await expect(page.getByTestId('stat-total')).toHaveText('2');
    await expect(page.getByTestId('stat-completed')).toHaveText('0');
    await expect(page.getByTestId('stat-pending')).toHaveText('2');

    // Navigate back to home
    await page.getByTestId('nav-link-home').click();
    
    // Todos should still be there
    await expect(page.getByText('Task 1')).toBeVisible();
    await expect(page.getByText('Task 2')).toBeVisible();
  });

  test('should update stats page when todos change', async ({ page }) => {
    // Add todos on home page
    const input = page.getByPlaceholder('Add a new task...');
    const addButton = page.getByRole('button', { name: 'Add' });

    await input.fill('Task 1');
    await addButton.click();
    await input.fill('Task 2');
    await addButton.click();

    // Navigate to stats
    await page.getByTestId('nav-link-stats').click();
    await expect(page.getByTestId('stat-total')).toHaveText('2');

    // Go back and complete a task
    await page.getByTestId('nav-link-home').click();
    const checkbox = page.getByRole('checkbox').first();
    await checkbox.click();

    // Go back to stats - should show updated stats
    await page.getByTestId('nav-link-stats').click();
    await expect(page.getByTestId('stat-completed')).toHaveText('1');
    await expect(page.getByTestId('stat-pending')).toHaveText('1');
    await expect(page.getByTestId('stat-rate')).toHaveText('50%');
  });

  test('should show empty stats message when no todos exist', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Navigate to stats
    await page.getByTestId('nav-link-stats').click();
    await expect(page.getByTestId('stats-empty')).toBeVisible();
    await expect(page.getByText('No todos yet. Create some tasks to see statistics!')).toBeVisible();
  });

  test('should navigate through all pages in sequence', async ({ page }) => {
    // Home -> Stats -> About -> Home
    await expect(page).toHaveURL('/');
    
    await page.getByTestId('nav-link-stats').click();
    await expect(page).toHaveURL('/stats');
    await expect(page.getByTestId('stats-title')).toBeVisible();
    
    await page.getByTestId('nav-link-about').click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByTestId('about-title')).toBeVisible();
    
    await page.getByTestId('nav-link-home').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'My To-Do List' })).toBeVisible();
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate to stats
    await page.getByTestId('nav-link-stats').click();
    await expect(page).toHaveURL('/stats');

    // Navigate to about
    await page.getByTestId('nav-link-about').click();
    await expect(page).toHaveURL('/about');

    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/stats');
    await expect(page.getByTestId('stats-title')).toBeVisible();

    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/about');
    await expect(page.getByTestId('about-title')).toBeVisible();

    // Back to home
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

