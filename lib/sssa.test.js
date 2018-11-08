import { SSSA } from './sssa.js';
var sssa = new SSSA(3);
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
describe('create and find points on polynomial',()=>{
    it('should output numShares points on a new polynomial',()=>{
        var subShares = sssa.getPointsOnPolynomialFor(['111','100'],4,4);
        expect(subShares.length).toBe(4);
    });
})
describe('get transpose of the matrix',()=>{
    it('should return a transpose of the given matrix',()=>{
        var matrix = [[{x:1,y:1},{x:2,y:2},{x:3,y:2}],[{x:4,y:4},{x:5,y:5},{x:6,y:2}]];
        var transpose = [[1,4],[2,5],[2,2]];
        expect(sssa.createCrossSection(matrix).y).toEqual(transpose);
    })
})
describe('converts 2d array of integer to 1d array of bit sequences',()=>{
    it('should output an array where element i is a bit sequence of element i of input',()=>{
        var shares = {x:[1,2,3,4,5,6],y:[[1,4],[2,5],[2,2]]};
        var binArray = ['100001','101010','010010'];
        expect(sssa.sharesToBin(shares).y).toEqual(binArray);
    })
})

