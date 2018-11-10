import {
  padLeft,
  splitBitsToIntArray,
  hex2bin,
  bin2hex,
  bytesToBits,
  bitsToBytes
} from './utils';

describe('pads bits left with specified amount of 0s', () => {
  it('should pad left with correct amount of zeros', () => {
    var someInt = 6;
    var paddedInt = padLeft('6', 5);
    expect(paddedInt.length).toBe(5);
    var paddedIntInBin = padLeft(someInt.toString(2), 6);
    expect(paddedIntInBin.length).toBe(6);
  });
});

describe('convert binary to hex and back', () => {
  it('should successfully convert between binary and hex', () => {
    var bitSequence = '00011010000110000111';
    var tooManyBits = '01001';
    var hex = 'af94';
    expect(hex2bin(bin2hex(bitSequence))).toBe(bitSequence);
    expect(bin2hex(hex2bin(hex))).toBe(hex);
    expect(hex2bin(bin2hex(tooManyBits))).toBe(padLeft(tooManyBits, 4));
  });
});
