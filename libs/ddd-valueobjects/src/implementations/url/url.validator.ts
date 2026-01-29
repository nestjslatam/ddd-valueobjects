import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Url } from './url.value-object';
import { URL_CONSTRAINTS } from '../../constants';

/**
 * Validator for URL Value Object
 */
export class UrlValidator extends AbstractRuleValidator<Url> {
  addRules(): void {
    const value = this.subject.getValue();
    const options = this.subject.getOptions();

    // Empty validation
    if (!value || value.trim().length === 0) {
      this.addBrokenRule('value', 'URL cannot be empty');
      return;
    }

    // URL format validation
    try {
      const url = new URL(value);

      // Protocol validation
      const protocol = url.protocol.replace(':', '');
      if (options.requireProtocol && !protocol) {
        this.addBrokenRule('value', 'URL must include a protocol (e.g., https://)');
      }

      if (protocol && !options.allowedProtocols.includes(protocol)) {
        this.addBrokenRule(
          'value',
          `URL protocol must be one of: ${options.allowedProtocols.join(', ')} (got: ${protocol})`,
        );
      }

      // Domain validation
      if (!url.hostname || url.hostname.length === 0) {
        this.addBrokenRule('value', 'URL must have a valid domain');
      }

      // Domain format validation
      if (url.hostname && !/^[a-zA-Z0-9-.]+$/.test(url.hostname)) {
        this.addBrokenRule('value', 'URL contains invalid domain format');
      }
    } catch {
      this.addBrokenRule('value', 'Invalid URL format');
    }

    // Length validation
    if (value.length > URL_CONSTRAINTS.MAX_LENGTH) {
      this.addBrokenRule('value', `URL cannot exceed ${URL_CONSTRAINTS.MAX_LENGTH} characters`);
    }
  }
}
