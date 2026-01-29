import { Url } from '../url.value-object';

describe('Url Value Object', () => {
  describe('create', () => {
    it('should create a valid URL with https protocol', () => {
      const url = Url.create('https://example.com');

      expect(url).toBeDefined();
      expect(url.getValue()).toBe('https://example.com');
    });

    it('should create a valid URL with http protocol', () => {
      const url = Url.create('http://example.com');

      expect(url.getValue()).toBe('http://example.com');
    });

    it('should create a valid URL with path', () => {
      const url = Url.create('https://example.com/api/users');

      expect(url.getValue()).toBe('https://example.com/api/users');
    });

    it('should create a valid URL with query parameters', () => {
      const url = Url.create('https://example.com/search?q=test&page=1');

      expect(url.getValue()).toBe('https://example.com/search?q=test&page=1');
    });

    it('should trim whitespace from URL', () => {
      const url = Url.create('  https://example.com  ');

      expect(url.getValue()).toBe('https://example.com');
    });

    it('should throw error for invalid URL format', () => {
      expect(() => Url.create('not-a-url')).toThrow('Invalid URL');
    });

    it('should throw error for URL without protocol when required', () => {
      expect(() => Url.create('example.com')).toThrow('Invalid URL');
    });

    it('should throw error for empty URL', () => {
      expect(() => Url.create('')).toThrow('Invalid URL');
    });

    it('should throw error for URL that is too long', () => {
      const longUrl = 'https://example.com/' + 'a'.repeat(2100);
      expect(() => Url.create(longUrl)).toThrow('Invalid URL');
    });

    it('should allow URL without protocol when not required', () => {
      const url = Url.create('example.com', { requireProtocol: false });

      expect(url.getValue()).toBe('example.com');
    });

    it('should throw error for disallowed protocol', () => {
      expect(() =>
        Url.create('ftp://example.com', { allowedProtocols: ['http', 'https'] }),
      ).toThrow('Invalid URL');
    });

    it('should allow custom protocols', () => {
      const url = Url.create('ftp://example.com', { allowedProtocols: ['ftp'] });

      expect(url.getValue()).toBe('ftp://example.com');
    });
  });

  describe('load', () => {
    it('should load a URL without validation', () => {
      const url = Url.load('invalid'); // Would fail with create()

      expect(url.getValue()).toBe('invalid');
    });

    it('should load a URL with custom options', () => {
      const url = Url.load('https://example.com', { requireProtocol: false });

      expect(url.getValue()).toBe('https://example.com');
    });
  });

  describe('getProtocol', () => {
    it('should return https protocol', () => {
      const url = Url.create('https://example.com');

      expect(url.getProtocol()).toBe('https');
    });

    it('should return http protocol', () => {
      const url = Url.create('http://example.com');

      expect(url.getProtocol()).toBe('http');
    });

    it('should return null for invalid URL', () => {
      const url = Url.load('invalid');

      expect(url.getProtocol()).toBeNull();
    });
  });

  describe('getDomain', () => {
    it('should return domain without www', () => {
      const url = Url.create('https://example.com');

      expect(url.getDomain()).toBe('example.com');
    });

    it('should return domain with www', () => {
      const url = Url.create('https://www.example.com');

      expect(url.getDomain()).toBe('www.example.com');
    });

    it('should return domain with subdomain', () => {
      const url = Url.create('https://api.example.com');

      expect(url.getDomain()).toBe('api.example.com');
    });

    it('should return null for invalid URL', () => {
      const url = Url.load('invalid');

      expect(url.getDomain()).toBeNull();
    });
  });

  describe('getPath', () => {
    it('should return root path', () => {
      const url = Url.create('https://example.com');

      expect(url.getPath()).toBe('/');
    });

    it('should return path', () => {
      const url = Url.create('https://example.com/api/users');

      expect(url.getPath()).toBe('/api/users');
    });

    it('should return path with trailing slash', () => {
      const url = Url.create('https://example.com/api/');

      expect(url.getPath()).toBe('/api/');
    });

    it('should return null for invalid URL', () => {
      const url = Url.load('invalid');

      expect(url.getPath()).toBeNull();
    });
  });

  describe('getQueryParams', () => {
    it('should return empty object for URL without query', () => {
      const url = Url.create('https://example.com');

      expect(url.getQueryParams()).toEqual({});
    });

    it('should return query parameters', () => {
      const url = Url.create('https://example.com?foo=bar&page=1');

      expect(url.getQueryParams()).toEqual({
        foo: 'bar',
        page: '1',
      });
    });

    it('should handle multiple query parameters', () => {
      const url = Url.create('https://example.com/search?q=test&category=books&page=2');

      expect(url.getQueryParams()).toEqual({
        q: 'test',
        category: 'books',
        page: '2',
      });
    });

    it('should return empty object for invalid URL', () => {
      const url = Url.load('invalid');

      expect(url.getQueryParams()).toEqual({});
    });
  });

  describe('isSecure', () => {
    it('should return true for https URL', () => {
      const url = Url.create('https://example.com');

      expect(url.isSecure()).toBe(true);
    });

    it('should return false for http URL', () => {
      const url = Url.create('http://example.com');

      expect(url.isSecure()).toBe(false);
    });

    it('should return false for invalid URL', () => {
      const url = Url.load('invalid');

      expect(url.isSecure()).toBe(false);
    });
  });

  describe('equality', () => {
    it('should be equal for same URLs', () => {
      const url1 = Url.create('https://example.com');
      const url2 = Url.create('https://example.com');

      expect(url1.equals(url2)).toBe(true);
    });

    it('should not be equal for different URLs', () => {
      const url1 = Url.create('https://example.com');
      const url2 = Url.create('https://different.com');

      expect(url1.equals(url2)).toBe(false);
    });

    it('should not be equal for different protocols', () => {
      const url1 = Url.create('https://example.com');
      const url2 = Url.create('http://example.com');

      expect(url1.equals(url2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return URL string', () => {
      const url = Url.create('https://example.com/api');

      expect(url.toString()).toBe('https://example.com/api');
    });
  });

  describe('toJSON', () => {
    it('should return URL string', () => {
      const url = Url.create('https://example.com/api');

      expect(url.toJSON()).toBe('https://example.com/api');
    });
  });
});
