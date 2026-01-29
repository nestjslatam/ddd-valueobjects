import { AbstractRuleValidator } from '@nestjslatam/ddd-lib';
import { Money } from './money.value-object';
import { MONETARY_CONSTANTS } from '../../constants';

/**
 * Validator for Money Value Object
 */
export class MoneyValidator extends AbstractRuleValidator<Money> {
  // ISO 4217 currency codes (common ones)
  private readonly VALID_CURRENCIES = [
    'USD',
    'EUR',
    'GBP',
    'JPY',
    'AUD',
    'CAD',
    'CHF',
    'CNY',
    'SEK',
    'NZD',
    'MXN',
    'SGD',
    'HKD',
    'NOK',
    'KRW',
    'TRY',
    'RUB',
    'INR',
    'BRL',
    'ZAR',
    'ARS',
    'CLP',
    'COP',
    'PEN',
    'UYU',
    'VES',
  ];

  addRules(): void {
    const props = this.subject.getValue();
    const { amount, currency } = props;

    // Amount validation
    if (amount === null || amount === undefined) {
      this.addBrokenRule('amount', 'Amount cannot be null or undefined');
    } else if (typeof amount !== 'number' || isNaN(amount)) {
      this.addBrokenRule('amount', 'Amount must be a valid number');
    } else if (!isFinite(amount)) {
      this.addBrokenRule('amount', 'Amount must be finite');
    } else {
      // Check decimal places (max 2 for most currencies, except JPY which has 0)
      const decimalPlaces = (amount.toString().split('.')[1] || '').length;
      const maxDecimals = currency === 'JPY' ? 0 : MONETARY_CONSTANTS.STANDARD_DECIMAL_PLACES;

      if (decimalPlaces > maxDecimals) {
        this.addBrokenRule(
          'amount',
          `Amount cannot have more than ${maxDecimals} decimal places for ${currency}`,
        );
      }
    }

    // Currency validation
    if (!currency || currency.trim().length === 0) {
      this.addBrokenRule('currency', 'Currency code cannot be empty');
    } else if (currency.length !== 3) {
      this.addBrokenRule('currency', 'Currency code must be exactly 3 characters (ISO 4217)');
    } else if (!/^[A-Z]{3}$/.test(currency)) {
      this.addBrokenRule('currency', 'Currency code must be 3 uppercase letters');
    } else if (!this.VALID_CURRENCIES.includes(currency)) {
      // Warning, not error - allow unknown currencies
      this.addBrokenRule(
        'currency',
        `Currency code '${currency}' is not a commonly recognized ISO 4217 code`,
      );
    }
  }
}
