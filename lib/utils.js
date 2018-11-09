import { fromByteArray, toByteArray } from 'base64-js';

export function splitBitsToIntArray(str, intSize, padLength) {
  let parts = [],
    i;
  //maybe take off trailing 0's?
  str = padLeft(str, padLength || intSize);

  for (i = str.length; i > intSize; i -= intSize) {
    parts.push(parseInt(str.slice(i - intSize, i), 2));
  }

  parts.push(parseInt(str.slice(0, i), 2));
  return parts;
}
export function convertIntArrayToBits(intArray, intSize) {
  let result = '';
  for (let i = 0; i < intArray.length; i++) {
    result = padLeft(intArray[i].toString(2), intSize) + result;
  }

  return result;
}
export function padLeft(str, endLength) {
  //default to one byte
  if (!endLength) {
    endLength = 8;
  }
  var missing;
  var pregenpadding = new Array(1024).join('0'); // Pre-generate a string of 1024 0's for use by padLeft().

  if (str) {
    missing = endLength - (str.length % endLength);
  }

  if (missing !== endLength) {
    return (pregenpadding + str).slice(-(missing + str.length));
  }

  return str;
}
export function base64ToBits(base64) {
  let byteArray = toByteArray(base64).reverse();
  return bytesToBits(byteArray);
}
export function bitsToBase64(bits) {
  var byteArray = bitsToBytes(bits).reverse();
  return fromByteArray(byteArray);
}
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
export function bitsToBytes(bits) {
  return splitBitsToIntArray(bits, 8);
}
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
