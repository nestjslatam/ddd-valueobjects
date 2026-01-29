import { DddValueObject } from '@nestjslatam/ddd-lib';
import { DescriptionValidator } from './description.validator';

interface DescriptionOptions {
  minLength: number;
  maxLength: number;
  allowEmpty: boolean;
}

/**
 * Description Value Object
 * Represents a text description with length constraints
 */
export class Description extends DddValueObject<string> {
  private constructor(
    value: string,
    private readonly options?: Partial<DescriptionOptions>,
  ) {
    super(value);
    this.addValidators();
  }

  /**
   * Creates a new Description with validation
   */
  static create(value: string, options?: Partial<DescriptionOptions>): Description {
    const description = new Description(value?.trim() || '', options);

    if (!description.isValid) {
      throw new Error('Invalid Description');
    }
    return description;
  }

  /**
   * Loads a Description from persisted data
   */
  static load(value: string, options?: Partial<DescriptionOptions>): Description {
    return new Description(value, options);
  }

  /**
   * Creates an empty description (only if allowEmpty is true)
   */
  static empty(options?: Partial<DescriptionOptions>): Description {
    const fullOptions: DescriptionOptions = {
      minLength: options?.minLength ?? 10,
      maxLength: options?.maxLength ?? 500,
      allowEmpty: true, // Force allowEmpty to true
    };
    return Description.create('', fullOptions);
  }

  get length(): number {
    return this.getValue().length;
  }

  getOptions(): DescriptionOptions {
    return {
      minLength: this.options?.minLength ?? 10,
      maxLength: this.options?.maxLength ?? 500,
      allowEmpty: this.options?.allowEmpty ?? false,
    };
  }

  isEmpty(): boolean {
    return this.getValue().trim().length === 0;
  }

  /**
   * Returns a preview of the description (first n characters)
   */
  preview(length: number = 100): string {
    const text = this.getValue();
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }

  /**
   * Count words in description
   */
  wordCount(): number {
    return this.getValue().trim().split(/\s+/).length;
  }

  public addValidators(): void {
    this.validatorRules.add(new DescriptionValidator(this, this.getOptions()));
  }

  protected getEqualityComponents(): Iterable<any> {
    return [this.getValue()];
  }

  toString(): string {
    return this.getValue();
  }

  toJSON(): string {
    return this.getValue();
  }
}
