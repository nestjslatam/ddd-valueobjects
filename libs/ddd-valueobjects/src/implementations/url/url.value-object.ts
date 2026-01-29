import { DddValueObject } from '@nestjslatam/ddd-lib';
import { UrlValidator } from './url.validator';

interface UrlOptions {
  requireProtocol: boolean;
  allowedProtocols: string[];
}

/**
 * URL Value Object
 * Represents a valid URL with protocol and domain validation
 */
export class Url extends DddValueObject<string> {
  private readonly options: UrlOptions;

  private constructor(value: string, options: UrlOptions) {
    super(value);
    this.options = options;
  }

  /**
   * Creates a new URL with validation
   */
  static create(value: string, options?: Partial<UrlOptions>): Url {
    const fullOptions: UrlOptions = {
      requireProtocol: options?.requireProtocol ?? true,
      allowedProtocols: options?.allowedProtocols ?? ['http', 'https'],
    };
    const url = new Url(value?.trim() || '', fullOptions);

    // Ensure validators are added with correct options
    url.addValidators();

    if (!url.isValid) {
      throw new Error(`Invalid URL: ${url.brokenRules.getBrokenRulesAsString()}`);
    }

    return url;
  }

  /**
   * Loads a URL from persisted data
   */
  static load(value: string, options?: Partial<UrlOptions>): Url {
    const fullOptions: UrlOptions = {
      requireProtocol: options?.requireProtocol ?? true,
      allowedProtocols: options?.allowedProtocols ?? ['http', 'https'],
    };
    return new Url(value, fullOptions);
  }

  getOptions(): UrlOptions {
    // Return defaults if options not yet initialized (during construction)
    return this.options || { requireProtocol: true, allowedProtocols: ['http', 'https'] };
  }

  /**
   * Returns the protocol (e.g., "https")
   */
  getProtocol(): string | null {
    try {
      return new URL(this.getValue()).protocol.replace(':', '');
    } catch {
      return null;
    }
  }

  /**
   * Returns the domain (e.g., "example.com")
   */
  getDomain(): string | null {
    try {
      return new URL(this.getValue()).hostname;
    } catch {
      return null;
    }
  }

  /**
   * Returns the path (e.g., "/api/users")
   */
  getPath(): string | null {
    try {
      return new URL(this.getValue()).pathname;
    } catch {
      return null;
    }
  }

  /**
   * Returns query parameters as object
   */
  getQueryParams(): Record<string, string> {
    try {
      const url = new URL(this.getValue());
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      return params;
    } catch {
      return {};
    }
  }

  /**
   * Checks if URL is secure (https)
   */
  isSecure(): boolean {
    return this.getProtocol() === 'https';
  }

  addValidators(): void {
    this.validatorRules.add(new UrlValidator(this));
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
