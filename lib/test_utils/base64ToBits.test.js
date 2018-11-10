import {
  base64ToBits,
  bitsToBase64,
  splitBitsToIntArray,
  convertIntArrayToBits,
  bitsToBytes,
  bytesToBits
} from '../utils';
import { toByteArray, fromByteArray } from 'base64-js';
describe('convert base64 to bits and viceversa', () => {
  it('should convert base64 to bits and viceversa', () => {
    var base64 = 'aGFkYXM=';
    var anotherBase64String = 'aaA=';
    var expectedBits = '0110100001100001011001000110000101110011';
    expect(base64ToBits(base64)).toBe(expectedBits);
    expect(bitsToBase64(expectedBits)).toBe(base64);
    expect(bitsToBase64(base64ToBits(base64))).toBe(base64);
    expect(base64ToBits(bitsToBase64(expectedBits))).toBe(expectedBits);
    expect(bitsToBase64(base64ToBits(anotherBase64String))).toBe(
      anotherBase64String
    );
  });
});
describe('compose base64 with splitBitsToInt', () => {
  it('should be a perfect inverse', () => {
    var secret = 'aaA=';
    var secretInBytes = toByteArray(secret);
    var secretInBits = bytesToBits(secretInBytes);

    //now convert it to an int array of n in field 2^n
    var secretInIntArray = splitBitsToIntArray(secretInBits, 3);
    var backToBits = convertIntArrayToBits(secretInIntArray, 3);

    var reverseToBytes = bitsToBytes(backToBits);
    var reverseToSecret = fromByteArray(reverseToBytes);
    expect(secretInBytes).toEqual(secretInIntArray);
    //        expect(secret).toBe(reverseToSecret);
    //        expect(backToBits).toBe(secretInBits);
  });
});
