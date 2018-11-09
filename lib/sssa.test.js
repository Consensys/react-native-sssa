import { SSSA } from './sssa.js';

describe('horner method of polynomial evaluation', () => {
  it('evaluates 7x + 1 at x=2 in GF(8)', () => {
    var sssa = new SSSA(3);
    var coeffs = ['111', '1'];
    var xCoordinate = 2;
    var expectedValue = 5;
    expect(sssa.horner(xCoordinate, coeffs)).toBe(expectedValue);
  });
  it('evalutes 5x^2 + 4x + 3 at x=3 in GF(8)', () => {
    var sssa = new SSSA(3);
    var coeffs = ['101', '100', '11'];
    var xCoordinate = 3;
    var expectedValue = 6;
    expect(sssa.horner(xCoordinate, coeffs)).toBe(expectedValue);
  });
});
describe('public share construction and deconstruction', () => {
  it('combines x-coordinate and corresponding data into one string', () => {
    var sssa = new SSSA(3);
    var xCoordinate = 1; //new Number(1).toString(16);
    var data = 'afd';
    var publicShareString = sssa.constructPublicShareString(xCoordinate, data);
    var deconstructedShareString = sssa.deconstructPublicShareString(
      publicShareString
    );
    expect(publicShareString.length).toBe(4);
    expect(deconstructedShareString.data).toBe(data);
    expect(deconstructedShareString.id).toBe(parseInt(xCoordinate, 16));
  });
});
