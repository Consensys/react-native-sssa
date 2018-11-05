import { toByteArray } from 'base64-js';

export function splitBitsToIntArray(str, padLength, intSize) {
  var parts = [],
    i;

  if (padLength) {
    str = padLeft(str, padLength);
  }

  for (i = str.length; i > intSize; i -= intSize) {
    parts.push(parseInt(str.slice(i - intSize, i), 2));
  }

  parts.push(parseInt(str.slice(0, i), 2));

  return parts;
}
export function padLeft(str, endLength) {
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
  return bytesToBits(toByteArray(base64));
}
export function bytesToBits(byteArray) {
  var i = 0,
    len,
    str = '',
    parsedInt;

  if (byteArray) {
    len = byteArray.length;
  }

  while (i < len) {
    //converts it to a byte array and pads left with up to 8 0's
    //make sure we are adding increments of 8 bits
    str = str + padLeft(byteArray[i].toString(2), 8);
    i++;
  }

  // return null so this result can be re-processed if the result is all 0's.
  if ((str.match(/0/g) || []).length === str.length) {
    return null;
  }
  return str;
}

export function bin2hex(str) {
  var hex = '',
    num,
    i;

  str = padLeft(str, 4);

  for (i = str.length; i >= 4; i -= 4) {
    num = parseInt(str.slice(i - 4, i), 2);
    if (isNaN(num)) {
      throw new Error('Invalid binary character.');
    }
    hex = num.toString(16) + hex;
  }

  return hex;
}
