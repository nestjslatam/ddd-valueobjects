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
    // After base added default validator, update it to merged options
    const validator = this.validatorRules.findByType(DescriptionValidator) as
      | DescriptionValidator
      | undefined;
    if (validator) {
      validator.updateOptions(this.getOptions());
    } else {
      this.addValidators();
    }
  }

  /**
   * Creates a new Description with validation
   */
  static create(value: string, options?: Partial<DescriptionOptions>): Description {
    const description = new Description(value?.trim() ?? '', options);
    // Force revalidation now that options are set
    description.setValuePropertyChanged(description.getValue(), 'internalValue', true);
    if (!description.isValid) {
      throw new Error(`Invalid Description: ${description.brokenRules.getBrokenRulesAsString()}`);
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
    return Description.create('', { ...options, allowEmpty: true });
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
    // Add with defaults; will be updated in constructor with actual merged options
    this.validatorRules.add(
      new DescriptionValidator(this, { minLength: 10, maxLength: 500, allowEmpty: false }),
    );
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
