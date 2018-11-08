import {bytesToBits, bitToBytes} from '../utils';
describe('convert byte array to bit array', () => {
  it('should output the correct sequence of bytes', () => {
    var bitSequence = '0110100001100001';
    var byteArray = [104, 97];
    expect(bytesToBits(byteArray)).toBe(bitSequence);
    expect(bytesToBits(bitsToBytes(bitSequence))).toBe(bitSequence);
  });
});
