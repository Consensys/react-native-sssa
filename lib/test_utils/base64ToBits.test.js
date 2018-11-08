import {
  base64ToBits,
  bitsToBase64,
} from '../utils';

describe('convert base64 to bits and viceversa', () => {
  it('should convert base64 to bits and viceversa', () => {
    var base64 = 'aGFkYXM=';
    var expectedBits = '0110100001100001011001000110000101110011';
    expect(base64ToBits(base64)).toBe(expectedBits);
    expect(bitsToBase64(expectedBits)).toBe(base64);
//    expect(bitsToBase64(base64ToBits(base64))).toBe(base64);
//    expect(base64ToBits(bitsToBase64(expectedBits))).toBe(expectedBits);

  });
});
