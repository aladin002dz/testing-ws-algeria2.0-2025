import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { setupLocalStorageMock, clearLocalStorage } from './utils/mockLocalStorage';

// Setup localStorage mock
setupLocalStorageMock();

// Cleanup after each test
afterEach(() => {
  cleanup();
  clearLocalStorage();
});

