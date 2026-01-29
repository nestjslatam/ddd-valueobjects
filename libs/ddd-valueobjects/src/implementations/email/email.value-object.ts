import { ValueObject } from '../../core/value-object.base';
import { Result } from '../../core/result';

interface EmailProps {
  value: string;
}

/**
 * Email Value Object
 * Ensures email validity through domain rules
 */
export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: EmailProps) {
    super(props);
  }

  public static create(email: string): Result<Email> {
    if (!email || email.trim().length === 0) {
      return Result.fail<Email>('Email cannot be empty');
    }

    if (!this.EMAIL_REGEX.test(email)) {
      return Result.fail<Email>('Email format is invalid');
    }

    if (email.length > 255) {
      return Result.fail<Email>('Email is too long');
    }

    return Result.ok<Email>(new Email({ value: email.toLowerCase().trim() }));
  }
}
