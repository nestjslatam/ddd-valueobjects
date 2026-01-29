import { Email } from '../email.value-object';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create a valid email', () => {
      const result = Email.create('user@example.com');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('user@example.com');
    });

    it('should convert email to lowercase', () => {
      const result = Email.create('User@Example.COM');

      expect(result.isSuccess).toBe(true);
      expect(result.getValue().value).toBe('user@example.com');
    });

    it('should fail for email with leading/trailing whitespace', () => {
      const result = Email.create('  user@example.com  ');

      // Email regex validation happens before trim, so this fails
      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email format is invalid');
    });

    it('should fail for empty email', () => {
      const result = Email.create('');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email cannot be empty');
    });

    it('should fail for email without @', () => {
      const result = Email.create('userexample.com');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email format is invalid');
    });

    it('should fail for email without domain', () => {
      const result = Email.create('user@');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email format is invalid');
    });

    it('should fail for email without TLD', () => {
      const result = Email.create('user@example');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email format is invalid');
    });

    it('should fail for email with spaces', () => {
      const result = Email.create('user name@example.com');

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email format is invalid');
    });

    it('should fail for email that is too long', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      const result = Email.create(longEmail);

      expect(result.isFailure).toBe(true);
      expect(result.getError()).toBe('Email is too long');
    });

    it('should accept email with subdomain', () => {
      const result = Email.create('user@mail.example.com');

      expect(result.isSuccess).toBe(true);
    });

    it('should accept email with plus sign', () => {
      const result = Email.create('user+tag@example.com');

      expect(result.isSuccess).toBe(true);
    });

    it('should accept email with dots in local part', () => {
      const result = Email.create('user.name@example.com');

      expect(result.isSuccess).toBe(true);
    });
  });

  describe('equality', () => {
    it('should be equal for same emails', () => {
      const email1 = Email.create('user@example.com').getValue();
      const email2 = Email.create('user@example.com').getValue();

      expect(email1.equals(email2)).toBe(true);
    });

    it('should be equal regardless of case', () => {
      const email1 = Email.create('User@Example.com').getValue();
      const email2 = Email.create('user@example.com').getValue();

      expect(email1.equals(email2)).toBe(true);
    });

    it('should not be equal for different emails', () => {
      const email1 = Email.create('user1@example.com').getValue();
      const email2 = Email.create('user2@example.com').getValue();

      expect(email1.equals(email2)).toBe(false);
    });
  });
});
