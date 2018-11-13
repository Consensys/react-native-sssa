import { SSSA } from './sssa.js';
let gf256sssa = new SSSA(8);
let sssa = new SSSA(3);
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
describe('create and find points on polynomial', () => {
  it('should output numShares points on a new polynomial', () => {
    let pointsForChunk1 = sssa.getPointsOnPolynomialFor([3, 1, 5, 6], 4);
    let pointsForChunk2 = sssa.getPointsOnPolynomialFor([4, 1, 5, 6], 4);
    let chunks = sssa.getChunksFromPoints([pointsForChunk1, pointsForChunk2]);
    expect(chunks).toEqual([3, 4]);
  });
});
describe('get transpose of the matrix', () => {
  it('should return a transpose of the given matrix', () => {
    var matrix = [[1, 2, 2], [4, 5, 2]];
    var transpose = [[1, 4], [2, 5], [2, 2]];
    expect(sssa.createCrossSection(matrix)).toEqual(transpose);
  });
});
describe('converts 2d array of integer to 1d array of bit sequences', () => {
  it('should output an array where element i is a bit sequence of element i of input', () => {
    var shares = [[1, 4], [2, 5], [2, 2]];
    var binArray = ['100001', '101010', '010010'];
    expect(sssa.sharesToBin(shares)).toEqual(binArray);
  });
});
describe('splits up a secret into chunks and puts it back together', () => {
  var base64 = 'aaA=';
  var chunks = sssa.splitSecret(base64, 100);
  it('should output an integer array', () => {
    expect(typeof chunks[0]).toBe('number');
  });
  it('should output the original secret', () => {
    //composition only works one way

    expect(sssa.combineSecret(chunks)).toBe(base64);
    expect(gf256sssa.combineSecret(gf256sssa.splitSecret(base64))).toBe(base64);
  });
});
describe('takes publically shared strings and convert back to points', () => {
  it('should output correct points', () => {
    var points = [[1, 2, 2], [4, 5, 2]];
    var binArray = ['100001', '101010', '010010'];
    var publicShares = sssa.binarySharesToPublicShareString(binArray);
    expect(sssa.publicShareToPoints(publicShares)).toEqual(points);
  });
});

describe('horner and lagrange are inverses of eachother', () => {
  it('should output the 0th element of the coeffs arrray (which is also the 0th term of the polynomial represented by coeffs)', () => {
    let coeffs = [3, 5, 6, 2];
    let x = [1, 2, 3, 4, 5, 6];
    let y = [];
    y.push(sssa.horner(1, coeffs));
    y.push(sssa.horner(2, coeffs));
    y.push(sssa.horner(3, coeffs));
    y.push(sssa.horner(4, coeffs));
    y.push(sssa.horner(5, coeffs));
    y.push(sssa.horner(6, coeffs));
    let expectedSecret = sssa.lagrange(x, y);
    expect(expectedSecret).toBe(3);
  });
});
