import {
  base64ToBits,
  bitsToBase64,
  splitBitsToIntArray,
  convertIntArrayToBits,
  bitsToBytes,
  bytesToBits,
  markPadding,
  removePadding
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

describe('integration tests between different conversion functions', () => {
  it('should output original input', () => {
    var secret = 'aaA=';
    var secretInBytes = toByteArray(secret);
    var secretInBits = bytesToBits(secretInBytes);

    //now convert it to an int array of n in field GF(2^n)
    var secretInIntArray = splitBitsToIntArray(markPadding(secretInBits), 3);
    var intArrayToBits = removePadding(
      convertIntArrayToBits(secretInIntArray, 3)
    );

    var bits_to_bytes = bitsToBytes(intArrayToBits);
    var bytesToSecret = fromByteArray(bits_to_bytes);
    expect(secret).toBe(bytesToSecret);
    expect(intArrayToBits).toBe(secretInBits);
  });
});
