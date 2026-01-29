import { ValueObject } from '../../core/value-object.base';
import { Result } from '../../core/result';

interface UUIDProps {
  value: string;
}

/**
 * UUID Value Object
 * Ensures UUID validity
 */
export class UUID extends ValueObject<UUIDProps> {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UUIDProps) {
    super(props);
  }

  public static create(uuid: string): Result<UUID> {
    if (!uuid || uuid.trim().length === 0) {
      return Result.fail<UUID>('UUID cannot be empty');
    }

    if (!this.UUID_REGEX.test(uuid)) {
      return Result.fail<UUID>('UUID format is invalid');
    }

    return Result.ok<UUID>(new UUID({ value: uuid.toLowerCase() }));
  }

  public static generate(): UUID {
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return new UUID({ value: uuid });
  }
}
