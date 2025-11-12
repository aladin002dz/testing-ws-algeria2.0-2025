/**
 * localStorage mock utility for tests
 * Provides helper functions to manage localStorage state in tests
 */

interface Storage {
  [key: string]: string;
}

class LocalStorageMock {
  private store: Storage = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] || null;
  }
}

/**
 * Setup localStorage mock for tests
 */
export function setupLocalStorageMock(): void {
  const localStorageMock = new LocalStorageMock();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
}

/**
 * Clear localStorage
 */
export function clearLocalStorage(): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.clear();
  }
}

/**
 * Set localStorage item with JSON serialization
 */
export function setLocalStorageItem(key: string, value: unknown): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

/**
 * Get localStorage item with JSON deserialization
 */
export function getLocalStorageItem<T>(key: string): T | null {
  if (typeof window !== 'undefined' && window.localStorage) {
    const item = window.localStorage.getItem(key);
    if (item === null) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Remove localStorage item
 */
export function removeLocalStorageItem(key: string): void {
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
  }
}

