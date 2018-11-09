import {
  splitBitsToIntArray,
  convertIntArrayToBits,
  bytesToBits,
  bitsToBytes
} from '../utils';
describe('splits bit array to array of integers of given bit size', () => {
  it('should return an int array of the right size', () => {
    var bitArray = '0110100001100001';
    var unevenBitArray = bitArray + '1';
    expect(bitsToBytes(bitArray)).toEqual([97, 104]);
    expect(bitsToBytes(bytesToBits([97, 104]))).toEqual([97, 104]);
    expect(bytesToBits(bitsToBytes(bitArray))).toEqual(bitArray);
    expect(bitsToBytes(bytesToBits(bitsToBytes(unevenBitArray)))).toEqual(
      bitsToBytes(unevenBitArray)
    );
  });
});
describe('split bits to array of integers', () => {
  it('should split bits to array of integers and back', () => {
    var bitArray = '110011';
    var intArray = [3,6];
    expect(splitBitsToIntArray(bitArray, 3)).toEqual([3, 6]);
    expect(convertIntArrayToBits(intArray, 3)).toEqual('110011');
    expect(splitBitsToIntArray(convertIntArrayToBits([1,2,3,4],3),3)).toEqual([1,2,3,4]);
    let inconvenientBitArray = '1111000';
    expect(convertIntArrayToBits(splitBitsToIntArray(inconvenientBitArray,3),3)).toBe(inconvenientBitArray);
  });
});
