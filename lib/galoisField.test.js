import { Polynomial, CharacteristicTwoGaloisField } from './galoisField';
//Testing Polynomial Class
describe('adds two polynomials in galois field of characteristic two', () => {
  it('should output the correct XOR value of two polynomials represened as bit arrays', () => {
    var polynomialOne = Polynomial.toIntegerForm('1010'); //equivelent of x^3 + x (^ is exponent in this context)
    var polynomialTwo = Polynomial.toIntegerForm('0110'); //equivelent of x^2 + x
    var expectedResult = Polynomial.toIntegerForm('1100'); //equivelent of x^3 + x^2
    var actualResult = new Polynomial(polynomialOne).plus(polynomialTwo);
    expect(expectedResult).toBe(actualResult.getValue());
    expect(4).toBe(new Polynomial(1).plus(5).getValue());
  });
});

describe('multiplies a polynomial by a monomial of the given degree', () => {
  it('should multiply the valueToMultiply by monomial', () => {
    var valueToMultiply = Polynomial.toIntegerForm('11100'); //x^4 + x^3 + x^2 in polynomial form, and 28 in integer form
    var monomial = '10'; //equivelently x^1 in polynomial form and 2 in integer form
    var degreeOfMonomial = Math.log2(Polynomial.toIntegerForm(monomial)); //degree is 1
    var expectedResult = Polynomial.toIntegerForm('111000');
    var actualResult = new Polynomial(valueToMultiply).timesMonomialOfDegree(
      degreeOfMonomial
    );
    expect(expectedResult).toBe(actualResult.getValue());
  });
});

describe('subtract terms above degree', () => {
  it('bitwise AND with bit array containing all 1 values up to given degree', () => {
    var polynomialWithBigDegree = Polynomial.toIntegerForm('11100');
    var expectedResult = Polynomial.toIntegerForm('100');
    var actualResult = new Polynomial(
      polynomialWithBigDegree
    ).subtractTermsAboveDegree(2);
    expect(expectedResult).toBe(actualResult.getValue());
  });
});

//Testing ChracteristicTwoGaloisField class
describe('determines if an element is contained within the field', () => {
  it('should return false if the degree of the element is above n in 2^n', () => {
    var polynomial = Polynomial.toIntegerForm('1111110');
    var gf = new CharacteristicTwoGaloisField(Math.pow(2, 5));
    var expectedResult = false;
    var actualResult = gf.fieldContains(polynomial);
    expect(expectedResult).toBe(actualResult);
  });
});
describe('create exponent and log tables for the field', () => {
  it('should output the correct exp and log tables for GF(2^3)', () => {
    var gf = new CharacteristicTwoGaloisField(Math.pow(2, 3));
    expect(gf.exps[0]).toBe(1);
    expect(gf.exps[1]).toBe(2);
    expect(gf.exps[2]).toBe(4);
    expect(gf.exps[3]).toBe(3);
    expect(gf.exps[4]).toBe(6);
    expect(gf.exps[5]).toBe(7);
    expect(gf.exps[6]).toBe(5);
    expect(gf.exps[7]).toBe(1);
    for (var i = 1; i < Math.pow(2, 3); i++) {
      expect(gf.exps[gf.logs[i]]).toBe(i);
    }
    expect(gf.logs[1]).toBe(7);
    expect(gf.logs[0]).toBeFalsy();
  });
});
