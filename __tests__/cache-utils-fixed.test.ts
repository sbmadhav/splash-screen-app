/**
 * @jest-environment jsdom
 */

import { CACHE_VERSION, getCacheBustedUrl, checkCacheVersion, reloadCriticalAssets } from '../lib/cache-utils';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock location.reload
Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn()
  },
  writable: true
});

// Mock navigator.serviceWorker
Object.defineProperty(window.navigator, 'serviceWorker', {
  value: {
    getRegistration: jest.fn()
  },
  writable: true
});

describe('Cache Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CACHE_VERSION', () => {
    it('should be defined as a string', () => {
      expect(typeof CACHE_VERSION).toBe('string');
      expect(CACHE_VERSION).toBe('1.1.0');
    });
  });

  describe('checkCacheVersion', () => {
    it('should return true when no stored version exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = checkCacheVersion();
      
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('app-cache-version');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app-cache-version', CACHE_VERSION);
    });

    it('should return false when stored version matches current version', () => {
      localStorageMock.getItem.mockReturnValue(CACHE_VERSION);
      
      const result = checkCacheVersion();
      
      expect(result).toBe(false);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('app-cache-version');
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('should return true when stored version is different', () => {
      localStorageMock.getItem.mockReturnValue('1.0.0');
      
      const result = checkCacheVersion();
      
      expect(result).toBe(true);
      expect(localStorageMock.getItem).toHaveBeenCalledWith('app-cache-version');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app-cache-version', CACHE_VERSION);
    });
  });

  describe('getCacheBustedUrl', () => {
    it('should append version parameter to URL without existing query params', () => {
      const url = '/api/test';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/api/test?v=${CACHE_VERSION}`);
    });

    it('should append version parameter to URL with existing query params', () => {
      const url = '/api/test?param=value';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/api/test?param=value&v=${CACHE_VERSION}`);
    });

    it('should handle URLs with fragments', () => {
      const url = '/api/test#section';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/api/test#section?v=${CACHE_VERSION}`);
    });

    it('should handle URLs with both query params and fragments', () => {
      const url = '/api/test?param=value#section';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/api/test?param=value#section&v=${CACHE_VERSION}`);
    });

    it('should handle empty URL', () => {
      const url = '';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`?v=${CACHE_VERSION}`);
    });

    it('should handle root URL', () => {
      const url = '/';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/?v=${CACHE_VERSION}`);
    });

    it('should handle relative URLs', () => {
      const url = 'image.jpg';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`image.jpg?v=${CACHE_VERSION}`);
    });

    it('should handle absolute URLs', () => {
      const url = 'https://example.com/api/data';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`https://example.com/api/data?v=${CACHE_VERSION}`);
    });

    it('should handle URLs with multiple query parameters', () => {
      const url = '/api/test?param1=value1&param2=value2';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/api/test?param1=value1&param2=value2&v=${CACHE_VERSION}`);
    });

    it('should handle special characters in URLs', () => {
      const url = '/api/test?query=hello%20world';
      const result = getCacheBustedUrl(url);
      
      expect(result).toBe(`/api/test?query=hello%20world&v=${CACHE_VERSION}`);
    });
  });

  describe('reloadCriticalAssets', () => {
    it('should handle environment without serviceWorker', async () => {
      // Mock environment without serviceWorker
      const originalServiceWorker = window.navigator.serviceWorker;
      delete (window.navigator as any).serviceWorker;

      await expect(reloadCriticalAssets()).resolves.toBeUndefined();
      expect(window.location.reload).toHaveBeenCalled();

      // Restore serviceWorker
      (window.navigator as any).serviceWorker = originalServiceWorker;
    });

    it('should unregister service worker and reload', async () => {
      const mockUnregister = jest.fn().mockResolvedValue(true);
      const mockRegistration = { unregister: mockUnregister };
      
      (window.navigator.serviceWorker.getRegistration as jest.Mock).mockResolvedValue(mockRegistration);

      await reloadCriticalAssets();

      expect(window.navigator.serviceWorker.getRegistration).toHaveBeenCalled();
      expect(mockUnregister).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should handle no registration found', async () => {
      (window.navigator.serviceWorker.getRegistration as jest.Mock).mockResolvedValue(null);

      await reloadCriticalAssets();

      expect(window.navigator.serviceWorker.getRegistration).toHaveBeenCalled();
      expect(window.location.reload).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (window.navigator.serviceWorker.getRegistration as jest.Mock).mockRejectedValue(new Error('Test error'));

      await reloadCriticalAssets();

      expect(consoleSpy).toHaveBeenCalledWith('Error reloading critical assets:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
