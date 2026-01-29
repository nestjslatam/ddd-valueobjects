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
  private readonly options: DescriptionOptions;

  private constructor(value: string, options: DescriptionOptions) {
    super(value);
    this.options = options;
  }

  /**
   * Creates a new Description with validation
   */
  static create(value: string, options?: Partial<DescriptionOptions>): Description {
    const fullOptions: DescriptionOptions = {
      minLength: options?.minLength ?? 10,
      maxLength: options?.maxLength ?? 500,
      allowEmpty: options?.allowEmpty ?? false,
    };
    const description = new Description(value?.trim() || '', fullOptions);

    // Ensure validators are added with correct options
    description.addValidators();

    if (!description.isValid) {
      throw new Error(`Invalid Description: ${description.brokenRules.getBrokenRulesAsString()}`);
    }

    return description;
  }

  /**
   * Loads a Description from persisted data
   */
  static load(value: string, options?: Partial<DescriptionOptions>): Description {
    const fullOptions: DescriptionOptions = {
      minLength: options?.minLength ?? 10,
      maxLength: options?.maxLength ?? 500,
      allowEmpty: options?.allowEmpty ?? false,
    };
    return new Description(value, fullOptions);
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
    // Return defaults if options not yet initialized (during construction)
    return this.options || { minLength: 10, maxLength: 500, allowEmpty: false };
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

  addValidators(): void {
    this.validatorRules.add(new DescriptionValidator(this));
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
