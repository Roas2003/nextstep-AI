/**
 * Safe localStorage wrapper with error handling
 * Prevents crashes from quota exceeded, disabled storage, or JSON parsing errors
 */

export const safeLocalStorage = {
  /**
   * Get an item from localStorage with error handling
   * @param key - The localStorage key
   * @param defaultValue - Default value if key doesn't exist or error occurs
   * @returns The parsed value or default value
   */
  getItem: <T = any>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading "${key}" from localStorage:`, error);
      return defaultValue;
    }
  },

  /**
   * Set an item in localStorage with error handling
   * @param key - The localStorage key
   * @param value - The value to store (will be JSON stringified)
   * @returns true if successful, false otherwise
   */
  setItem: (key: string, value: any): boolean => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing "${key}" to localStorage:`, error);
      
      // If quota exceeded, try to clear old data
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider clearing old data.');
      }
      
      return false;
    }
  },

  /**
   * Remove an item from localStorage with error handling
   * @param key - The localStorage key to remove
   * @returns true if successful, false otherwise
   */
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing "${key}" from localStorage:`, error);
      return false;
    }
  },

  /**
   * Clear all localStorage data with error handling
   * @returns true if successful, false otherwise
   */
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   * @returns true if localStorage is available and working
   */
  isAvailable: (): boolean => {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get all keys from localStorage
   * @returns Array of all localStorage keys
   */
  getAllKeys: (): string[] => {
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  /**
   * Get the size of a localStorage item in bytes
   * @param key - The localStorage key
   * @returns Size in bytes, or 0 if error
   */
  getItemSize: (key: string): number => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return 0;
      return new Blob([item]).size;
    } catch (error) {
      console.error(`Error getting size of "${key}":`, error);
      return 0;
    }
  },

  /**
   * Get total localStorage usage in bytes
   * @returns Total size in bytes
   */
  getTotalSize: (): number => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const item = localStorage.getItem(key);
          if (item) {
            total += new Blob([item]).size;
          }
        }
      }
      return total;
    } catch (error) {
      console.error('Error calculating localStorage size:', error);
      return 0;
    }
  }
};
