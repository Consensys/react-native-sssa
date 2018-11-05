import config from './config';

//class that represents polynomials as bit arrays
export class Polynomial {
  constructor(value) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
  setValue(value) {
    this.value = value;
  }
  plus(rightHandPolynomial) {
    this.value = this.value ^ rightHandPolynomial;
    return this;
  }
  timesMonomialOfDegree(n) {
    this.value = this.value << n;
    return this;
  }
  subtractTermsAboveDegree(n) {
    this.value = this.value & (Math.pow(2, n + 1) - 1);
    return this;
  }
  static toIntegerForm(bitArray) {
    return parseInt(bitArray, 2);
  }
  static toPolynomialForm(integer) {
    return new Number(integer).toString(2);
  }
}

export class CharacteristicTwoGaloisField {
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
  fieldContains(value) {
    return value < this.numberOfElementsInField;
  }
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
  multiply(polynomialOne, polynomialTwo) {
    return new Polynomial(
      this.exps[
        (this.logs[polynomialOne] + this.logs[polynomialTwo]) %
          (this.numberOfElementsInField - 1)
      ]
    );
  }
}
