import config from './config';

/**
 * class that represents polynomials as bit arrays
 */
export class Polynomial {
  /**@class
   * @param {number} value - integer to construct polynomial from
   */
  constructor(value) {
    this.value = value;
  }
  /**
   * returns the integer value of the polynomial
   *For example: If the value is 3, then the binary value is 011
   *and the polynomial is x+1
   *@returns {number} this.value
   */
  getValue() {
    return this.value;
  }

  /**@param {number} value - an integer, that when converted to binary represents a polynomial
   */
  setValue(value) {
    this.value = value;
  }
  /**@param {number} rightHandPolynomial - an integer whose binary form
   *represents a polynomial
   *@returns { Polynomial } - polynomial with given value
   */
  plus(rightHandPolynomial) {
    this.value = this.value ^ rightHandPolynomial;
    return this;
  }
  /**@param  {number} n - the degree of monomial to multiply the polonomial by
   * @returns {Polynomial} an instance of Polynomial class whose value is this.value << n
   */
  timesMonomialOfDegree(n) {
    this.value = this.value << n;
    return this;
  }
  /**@param {numer} n - the degree to subtract
   *@returns {Polynomial} - polynomial with computed value
   */
  subtractTermsAboveDegree(n) {
    this.value = this.value & (Math.pow(2, n + 1) - 1);
    return this;
  }
  /**@param {string} bitArray - polynomial in the form of a bit array to represent as an integer
   * @returns {number} - the integer form of the given bit array
   */
  static toIntegerForm(bitArray) {
    return parseInt(bitArray, 2);
  }
  /**@param {number} integer - the integer to convert to a bit array representing a polynomial
   * @returns {number} - bit array from given integer
   */
  static toPolynomialForm(integer) {
    return new Number(integer).toString(2);
  }
}
/** represents a characteristic two galois field
 */
export class CharacteristicTwoGaloisField {
  /** @class
   * @param {integer} numElements - the number of elements in the field
   */
  constructor(numElements) {
    this.n = Math.log2(numElements);
    if (
      this.n &&
      (this.n % 1 !== 0 || this.n < config.minBits || this.n > config.maxBits)
    ) {
      throw new Error(
        'Number of n must be an integer between ' +
          config.minBits +
          ' and ' +
          config.maxBits +
          ', inclusive.'
      );
    }
    this.numberOfElementsInField = numElements;
    this.computeLogAndExpTables();
  }
  /** @param {number} value - is an integer
   * @returns {boolean} - whether or not the field contains the given value
   */
  fieldContains(value) {
    return value < this.numberOfElementsInField;
  }
  /** @param {number} expOfCurrentDegree - exponent of current degree, used when calculated exponent tables
   * @returns {Polynomial} - polynomial with computed value
   */
  getExponentOfNextDegree(expOfCurrentDegree) {
    let primitivePolynomial = config.primitivepolynomials[this.n];
    var polynomial = expOfCurrentDegree.timesMonomialOfDegree(1);
    if (!this.fieldContains(polynomial.getValue())) {
      polynomial = polynomial
        .plus(primitivePolynomial)
        .subtractTermsAboveDegree(this.n - 1);
    }
    return polynomial;
  }
  /**computes log and exponent tables for the field GF(2^this.n)
   */
  computeLogAndExpTables() {
    this.exps = [];
    this.logs = [];
    let polynomial = new Polynomial(1);
    for (var i = 0; i < this.numberOfElementsInField; i++) {
      this.exps[i] = polynomial.getValue();
      this.logs[polynomial.getValue()] = i;
      polynomial = this.getExponentOfNextDegree(polynomial);
    }
  }
  /** @param {number} polynomialOne - the left hand assignment
   * @param {number} polynomialTwo  - the right hand assignment
   * @returns {Polynomial} - polynomial with given value
   */
  multiply(polynomialOne, polynomialTwo) {
    return new Polynomial(
      this.exps[
        (this.logs[polynomialOne] + this.logs[polynomialTwo]) %
          (this.numberOfElementsInField - 1)
      ]
    );
  }
}
