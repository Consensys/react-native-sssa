import {
  bitsToBytes,
  bytesToBits,
  base64ToBits,
  bitsToBase64,
  padLeft,
  splitBitsToIntArray,
  hex2bin,
  bin2hex
} from './utils';
describe('splits bit array to array of integers of given bit size', () => {
  it('should return an int array of the right size', () => {
    var str = '101011';
    var padLength = 4;//00101011 - 1,2,3
    var intSize = 3;
    var intArray = splitBitsToIntArray(str, intSize);
    expect(intArray).toEqual([5, 3]);
    expect(intArray.length).toBe(Math.ceil(str.length / 3));
    intArray = splitBitsToIntArray(str, intSize, padLength);
    expect(intArray).toEqual([1,2,3]);
    var bitArray = '0110100001100001';
    expect(splitBitsToIntArray(bitArray, 8, 8)).toEqual([104, 97]);
  });
});
describe('pads bits left with specified amount of 0s', () => {
  it('should pad left with correct amount of zeros', () => {
    var someInt = 6;
    var paddedInt = padLeft('6', 5);
    expect(paddedInt.length).toBe(5);
    var paddedIntInBin = padLeft(someInt.toString(2), 6);
    expect(paddedIntInBin.length).toBe(6);
  });
});
describe('convert byte array to bit array', () => {
  it('should output the correct sequence of bytes', () => {
    var bitSequence = '0110100001100001';
    var byteArray = [104, 97];
    expect(bytesToBits(byteArray)).toBe(bitSequence);
    expect(bytesToBits(bitsToBytes(bitSequence))).toBe(bitSequence);
  });
});
describe('convert base64 to bits and viceversa', () => {
  it('should convert base64 to bits and viceversa', () => {
    var base64 = 'aGFkYXM=';
    var expectedBits = '0110100001100001011001000110000101110011';
    expect(base64ToBits(base64)).toBe(expectedBits);
    expect(bitsToBase64(expectedBits)).toBe(base64);
    expect(bitsToBase64(base64ToBits(base64))).toBe(base64);
    expect(base64ToBits(bitsToBase64(expectedBits))).toBe(expectedBits);
  });
});
describe('convert binary to hex and back',()=>{
    it('should successfully convert between binary and hex',()=>{
        var bitSequence = '011010000110000111';
        expect(hex2bin(bin2hex(bitSequence))).toBe(padLeft(bitSequence,4));
    })
})
