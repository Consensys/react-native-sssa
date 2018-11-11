import { fromByteArray, toByteArray } from 'base64-js';
/**@param {string} str - bit sequence
 * @param {number} intSize - bit size of ints in resulting array
 * @param {number} padLength - number of 0's to pad the bit sequence with. if padLength > intSize then there will be 0's at the end of the resultant int array
 * before converting it to an array of ints
 * @returns {Array} - an array of ints
 */
export function splitBitsToIntArray(str, intSize, padLength) {
  let parts = [],
    i;

  str = padLeft(str, padLength || intSize);

  for (i = str.length; i > intSize; i -= intSize) {
    parts.push(parseInt(str.slice(i - intSize, i), 2));
  }

  parts.push(parseInt(str.slice(0, i), 2));
  return parts;
}
/**@param {Array} intArray - the array of integers to convert to bits
 * @param {number} numBits - the number of bits to convert each integer to
 * @returns {string} - bit sequence
 */
export function convertIntArrayToBits(intArray, numBits) {
  let result = '';
  for (let i = 0; i < intArray.length; i++) {
    result = padLeft(intArray[i].toString(2), numBits) + result;
  }

  return result;
}
/**@param {string} str - the string of bits to pad left with 0's
 * @param {number} lengthMultiple - string is padded left until it reaches a multiple of lengthMultiple
 * @returns {string} - padded bit sequence
 */
export function padLeft(str, lengthMultiple) {
  //default to one byte
  if (!lengthMultiple) {
    lengthMultiple = 8;
  }
  var missing;
  var pregenpadding = new Array(1024).join('0'); // Pre-generate a string of 1024 0's for use by padLeft().

  if (str) {
    missing = lengthMultiple - (str.length % lengthMultiple);
  }

  if (missing !== lengthMultiple) {
    return (pregenpadding + str).slice(-(missing + str.length));
  }

  return str;
}
/**@param {string} base64 - a base64 string
 * @returns {string} - a sequence of bits
 */
export function base64ToBits(base64) {
  let byteArray = toByteArray(base64).reverse();
  return bytesToBits(byteArray);
}
/**@param {string} bits - a string of bits
 *@returns {string} - base64 string representing bits
 */
export function bitsToBase64(bits) {
  var byteArray = bitsToBytes(bits).reverse();
  return fromByteArray(byteArray);
}
/**@param {Array} byteArray - an array of bytes (integers from 0 to 255)
 * @returns {string} - sequence of bits
 */
export function bytesToBits(byteArray) {
  let i = 0,
    len,
    str = '';

  if (byteArray) {
    len = byteArray.length;
  }

  while (i < len) {
    //converts it to a byte array and pads left with up to 8 0's
    //make sure we are adding increments of 8 bits
    str = padLeft(byteArray[i].toString(2), 8) + str;
    i++;
  }

  // return null so this result can be re-processed if the result is all 0's.
  if ((str.match(/0/g) || []).length === str.length) {
    return null;
  }
  return str;
}
/**@param {string} bits - bit sequence
 * @returns {Array} array of integers from 0 to 255
 */
export function bitsToBytes(bits) {
  return splitBitsToIntArray(bits, 8);
}
/**@param {string} str - a hex string
 * @returns {string} - a binary sequence
 */
export function hex2bin(str) {
  let bin = '',
    num,
    i;

  for (i = str.length - 1; i >= 0; i--) {
    num = parseInt(str[i], 16);

    if (isNaN(num)) {
      throw new Error('Invalid hex character.');
    }

    bin = padLeft(num.toString(2), 4) + bin;
  }
  return bin;
}
/**@param {string} str - a binary sequence
 * @returns {string} - a hex sequence
 */
export function bin2hex(str) {
  let hex = '',
    num,
    i;

  str = padLeft(str, 4);
  for (i = str.length; i >= 4; i -= 4) {
    num = parseInt(str.slice(i - 4, i), 2);
    if (isNaN(num)) {
      throw new Error('Invalid binary character. ' + num);
    }
    hex = num.toString(16) + hex;
  }

  return hex;
}
/**@param {string} bits - a bit sequence
 * @returns {string} - bits with 1 on the front
 */
export function markPadding(bits) {
  return '1' + bits;
}
/**@param {string} bits - a bit sequence with padding
 * @returns {string} - a bit sequence without the padding
 */
export function removePadding(bits) {
  return bits.slice(bits.indexOf('1') + 1);
}
