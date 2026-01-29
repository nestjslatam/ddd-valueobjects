import { Injectable } from '@nestjs/common';
import { Money } from '../implementations/money/money.value-object';

/**
 * Money Formatter
 * Handles presentation layer concerns for Money value objects
 * Separated from domain layer to respect SRP and SoC principles
 */
@Injectable()
export class MoneyFormatter {
  /**
   * Formats money with currency symbol
   * Example: $1,234.56
   */
  format(money: Money, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
    }).format(money.amount);
  }

  /**
   * Formats money without currency symbol
   * Example: 1,234.56
   */
  formatWithoutSymbol(money: Money, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(money.amount);
  }

  /**
   * Formats money with custom currency code
   * Example: 1,234.56 USD
   */
  formatWithCode(money: Money, locale: string = 'en-US'): string {
    return `${this.formatWithoutSymbol(money, locale)} ${money.currency}`;
  }

  /**
   * Formats money for accounting purposes (negative in parentheses)
   * Example: $1,234.56 or ($1,234.56)
   */
  formatAccounting(money: Money, locale: string = 'en-US'): string {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      signDisplay: 'never',
    }).format(Math.abs(money.amount));

    return money.isNegative() ? `(${formatted})` : formatted;
  }

  /**
   * Formats money in compact notation
   * Example: $1.2K, $1.5M
   */
  formatCompact(money: Money, locale: string = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: money.currency,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(money.amount);
  }

  /**
   * Formats money as words (English only)
   * Example: one thousand two hundred thirty-four dollars and fifty-six cents
   */
  formatAsWords(money: Money): string {
    const amount = money.amount;
    const dollars = Math.floor(amount);
    const cents = Math.round((amount - dollars) * 100);

    const dollarWords = this.numberToWords(dollars);
    const centsWords = this.numberToWords(cents);

    const currencyName = this.getCurrencyName(money.currency);
    const subunitName = this.getCurrencySubunitName(money.currency);

    if (cents === 0) {
      return `${dollarWords} ${currencyName}`;
    }

    return `${dollarWords} ${currencyName} and ${centsWords} ${subunitName}`;
  }

  /**
   * Converts a number to words (0-999999)
   */
  private numberToWords(num: number): string {
    if (num === 0) return 'zero';

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = [
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    const tens = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
    ];

    if (num < 10) return ones[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? '-' + ones[num % 10] : '');
    }
    if (num < 1000) {
      return (
        ones[Math.floor(num / 100)] +
        ' hundred' +
        (num % 100 !== 0 ? ' and ' + this.numberToWords(num % 100) : '')
      );
    }
    if (num < 1000000) {
      return (
        this.numberToWords(Math.floor(num / 1000)) +
        ' thousand' +
        (num % 1000 !== 0 ? ' ' + this.numberToWords(num % 1000) : '')
      );
    }

    return num.toString();
  }

  /**
   * Gets currency name in plural form
   */
  private getCurrencyName(currency: string): string {
    const names: Record<string, string> = {
      USD: 'dollars',
      EUR: 'euros',
      GBP: 'pounds',
      JPY: 'yen',
      CAD: 'dollars',
      AUD: 'dollars',
    };
    return names[currency] || currency.toLowerCase();
  }

  /**
   * Gets currency subunit name in plural form
   */
  private getCurrencySubunitName(currency: string): string {
    const subunits: Record<string, string> = {
      USD: 'cents',
      EUR: 'cents',
      GBP: 'pence',
      JPY: 'sen',
      CAD: 'cents',
      AUD: 'cents',
    };
    return subunits[currency] || 'cents';
  }
}
