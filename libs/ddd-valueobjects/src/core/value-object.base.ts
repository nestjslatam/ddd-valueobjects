/**
 * Base Value Object abstract class
 * Implements equality comparison and immutability patterns for DDD Value Objects
 */
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  /**
   * Check equality between two value objects
   */
  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }

  /**
   * Get the underlying value
   */
  public getValue(): T {
    return this.props;
  }
}
