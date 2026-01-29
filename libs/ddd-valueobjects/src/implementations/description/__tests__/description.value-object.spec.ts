import { Description } from '../description.value-object';

describe('Description Value Object', () => {
  describe('create', () => {
    it('should create a valid description with default options', () => {
      const text = 'This is a valid description with enough characters.';
      const description = Description.create(text);

      expect(description).toBeDefined();
      expect(description.getValue()).toBe(text);
      expect(description.length).toBe(text.length);
    });

    it('should create a valid description with custom options', () => {
      const text = 'Short';
      const description = Description.create(text, { minLength: 3, maxLength: 10 });

      expect(description.getValue()).toBe(text);
      expect(description.getOptions().minLength).toBe(3);
      expect(description.getOptions().maxLength).toBe(10);
    });

    it('should trim whitespace from description', () => {
      const description = Description.create('  Valid description text  ');

      expect(description.getValue()).toBe('Valid description text');
    });

    it('should throw error for description that is too short', () => {
      expect(() => Description.create('Short')).toThrow('Invalid Description');
    });

    it('should throw error for description that is too long', () => {
      const longText = 'A'.repeat(501);
      expect(() => Description.create(longText)).toThrow('Invalid Description');
    });

    it('should throw error for empty description by default', () => {
      expect(() => Description.create('')).toThrow('Invalid Description');
    });

    it('should throw error for whitespace-only description', () => {
      expect(() => Description.create('   ')).toThrow('Invalid Description');
    });

    it('should respect custom min length', () => {
      const text = 'Hi';
      expect(() => Description.create(text, { minLength: 5 })).toThrow('Invalid Description');
    });

    it('should respect custom max length', () => {
      const text = 'This is a long text';
      expect(() => Description.create(text, { maxLength: 10 })).toThrow('Invalid Description');
    });
  });

  describe('empty', () => {
    it('should create an empty description when allowEmpty is true', () => {
      const description = Description.create('', { allowEmpty: true });

      expect(description.getValue()).toBe('');
      expect(description.isEmpty()).toBe(true);
    });

    it('should allow empty description with custom options', () => {
      const description = Description.create('', {
        allowEmpty: true,
        minLength: 5,
        maxLength: 100,
      });

      expect(description.getValue()).toBe('');
      expect(description.getOptions().allowEmpty).toBe(true);
    });
  });

  describe('load', () => {
    it('should load a description with any value', () => {
      const description = Description.load('Short text here', { minLength: 50 }); // Longer min than actual

      expect(description.getValue()).toBe('Short text here');
    });

    it('should load an empty description', () => {
      const description = Description.load('', { allowEmpty: true });

      expect(description.getValue()).toBe('');
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty description', () => {
      const description = Description.create('', { allowEmpty: true });

      expect(description.isEmpty()).toBe(true);
    });

    it('should return false for non-empty description', () => {
      const description = Description.create('This is a valid description.');

      expect(description.isEmpty()).toBe(false);
    });
  });

  describe('preview', () => {
    it('should return full text if shorter than preview length', () => {
      const text = 'This is a short description.';
      const description = Description.create(text);

      expect(description.preview(100)).toBe(text);
    });

    it('should return truncated text with ellipsis', () => {
      const text =
        'This is a very long description that should be truncated when we request a preview.';
      const description = Description.create(text);

      const preview = description.preview(20);
      expect(preview).toBe('This is a very long ...');
      expect(preview.length).toBe(23); // 20 chars + '...'
    });

    it('should use default preview length of 100', () => {
      const text = 'A'.repeat(150);
      const description = Description.create(text, { minLength: 10, maxLength: 200 });

      const preview = description.preview();
      expect(preview.length).toBe(103); // 100 chars + '...'
    });
  });

  describe('wordCount', () => {
    it('should count words correctly', () => {
      const description = Description.create('This is a test description.');

      expect(description.wordCount()).toBe(5);
    });

    it('should handle multiple spaces', () => {
      const description = Description.create('This  has   multiple    spaces.');

      expect(description.wordCount()).toBe(4);
    });

    it('should return 1 for single word', () => {
      const description = Description.create('SingleWord');

      expect(description.wordCount()).toBe(1);
    });
  });

  describe('equality', () => {
    it('should be equal for same descriptions', () => {
      const desc1 = Description.create('This is a test description.');
      const desc2 = Description.create('This is a test description.');

      expect(desc1.equals(desc2)).toBe(true);
    });

    it('should not be equal for different descriptions', () => {
      const desc1 = Description.create('This is a test description.');
      const desc2 = Description.create('This is another test description.');

      expect(desc1.equals(desc2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('should return description text', () => {
      const text = 'This is a test description.';
      const description = Description.create(text);

      expect(description.toString()).toBe(text);
    });
  });

  describe('toJSON', () => {
    it('should return description text', () => {
      const text = 'This is a test description.';
      const description = Description.create(text);

      expect(description.toJSON()).toBe(text);
    });
  });
});
