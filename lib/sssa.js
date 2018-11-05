import { randomBitGenerator } from './randomBitGenerator';
import { Polynomial, CharacteristicTwoGaloisField } from './galoisField';
var isBase64 = require('is-base64');
import {
  splitBitsToIntArray,
  base64ToBits,
  padLeft,
  bin2hex
} from './utils.js';
export class SSSA {
  constructor(coeffLength) {
    this.fieldSize = Math.pow(2, coeffLength);
    this.char2GF = new CharacteristicTwoGaloisField(this.fieldSize);
    this.coeffLength = coeffLength;
  }
  // Polynomial evaluation at `x` using Horner's Method
  // NOTE: fx=fx * x + coeff[i] ->  exp(log(fx) + log(x)) + coeff[i],
  //       so if fx===0, just set fx to coeff[i] because
  //       using the exp/log form will result in incorrect value
  horner(x, coeffs) {
    var galoisField = this.char2GF;
    var fx = 0;

    for (var i = coeffs.length - 1; i >= 0; i--) {
      var coefficient = Polynomial.toIntegerForm(coeffs[i]);
      if (fx !== 0) {
        fx = galoisField
          .multiply(x, fx)
          .plus(coefficient)
          .getValue();
      } else {
        fx = coefficient;
      }
    }

    return fx;
  }

  getPointsOnPolynomialFor(secretByte, numShares, threshold) {
    var shares = [],
      coeffs = [secretByte],
      i,
      len;

    for (i = 1; i < threshold; i++) {
      coeffs[i] = randomBitGenerator(this.coeffLength, 2);
    }

    for (i = 1, len = numShares + 1; i < len; i++) {
      shares[i - 1] = {
        x: i,
        y: this.horner(i, coeffs)
      };
    }

    return shares;
  }

  generateShares(secret, numShares, threshold, padLength) {
    var neededBits,
      subShares,
      x = new Array(numShares),
      y = new Array(numShares),
      maxShares = this.fieldSize - 1,
      i,
      j,
      len;

    // Security:
    // For additional security, pad in multiples of 128 bits by default.
    // A small trade-off in larger share size to help prevent leakage of information
    // about small-ish secrets and increase the difficulty of attacking them.
    padLength = padLength || 128;

    if (typeof secret !== 'string') {
      throw new Error('Secret must be a string.');
    }

    if (typeof numShares !== 'number' || numShares % 1 !== 0 || numShares < 2) {
      throw new Error(
        'Number of shares must be an integer between 2 and  (' +
          this.fieldSize -
          1 +
          '), inclusive.'
      );
    }

    if (numShares > maxShares) {
      neededBits = Math.ceil(Math.log(numShares + 1) / Math.LN2);
      throw new Error(
        'Number of shares must be an integer between 2 and (' +
          this.fieldSize -
          1 +
          '), inclusive. To create ' +
          numShares +
          ' shares, use at least ' +
          neededBits +
          ' bits.'
      );
    }

    if (typeof threshold !== 'number' || threshold % 1 !== 0 || threshold < 2) {
      throw new Error(
        'Threshold number of shares must be an integer between 2 and 2^bits-1 (' +
          maxShares +
          '), inclusive.'
      );
    }

    if (threshold > maxShares) {
      neededBits = Math.ceil(Math.log(threshold + 1) / Math.LN2);
      throw new Error(
        'Threshold number of shares must be an integer between 2 and 2^bits-1 (' +
          maxShares +
          '), inclusive.  To use a threshold of ' +
          threshold +
          ', create an SSSA instance with a coefficient size of atleast' +
          neededBits +
          ' bits.'
      );
    }

    if (threshold > numShares) {
      throw new Error(
        'Threshold number of shares was ' +
          threshold +
          ' but must be less than or equal to the ' +
          numShares +
          ' shares specified as the total to generate.'
      );
    }

    if (
      typeof padLength !== 'number' ||
      padLength % 1 !== 0 ||
      padLength < 0 ||
      padLength > 1024
    ) {
      throw new Error(
        'Zero-pad length must be an integer between 0 and 1024 inclusive.'
      );
    }

    if (!isBase64(secret)) {
      throw new Error('secret but be base-64');
    }

    secret = '1' + base64ToBits(secret); // append a 1 as a marker so that we can preserve the correct number of leading zeros in our secret
    secret = splitBitsToIntArray(secret, padLength, this.coeffLength); //uses global coefficient length

    for (i = 0, len = secret.length; i < len; i++) {
      subShares = this.getPointsOnPolynomialFor(
        secret[i],
        numShares,
        threshold
      );
      for (j = 0; j < numShares; j++) {
        x[j] = x[j] || subShares[j].x;
        y[j] = padLeft(subShares[j].y.toString(2)) + (y[j] || '');
      }
    }

    for (i = 0; i < numShares; i++) {
      x[i] = this.constructPublicShareString(x[i], bin2hex(y[i])); //changed to hex so it can be used with RegEx
    }

    return x;
  }
  constructPublicShareString(id, data) {
    var idHex, idMax, idPaddingLen, newShareString;

    idMax = this.fieldSize - 1;
    idPaddingLen = idMax.toString(16).length;
    idHex = padLeft(id.toString(16), idPaddingLen);

    if (typeof id !== 'number' || id % 1 !== 0 || id < 1 || id > idMax) {
      throw new Error(
        'Share id must be an integer between 1 and ' + idMax + ', inclusive.'
      );
    }

    newShareString = idHex + data;

    return newShareString;
  }

  deconstructPublicShareString(share) {
    var bits,
      id,
      idLen,
      max,
      obj = {},
      regexStr,
      shareComponents;

    max = this.fieldSize - 1;

    // Determine the ID length which is variable and based on the bit count.
    idLen = max.toString(16).length;

    // Extract all the parts now that the segment sizes are known.
    regexStr = '^([a-fA-F0-9]{' + idLen + '})([a-fA-F0-9]+)$';
    shareComponents = new RegExp(regexStr).exec(share); //first element of output array is entire share, second element is the first part, up to idLen chars, and the third element is the second component (ie the data)

    // The ID is a Hex number and needs to be converted to an Integer
    if (shareComponents) {
      id = parseInt(shareComponents[1]);
    }

    if (typeof id !== 'number' || id % 1 !== 0 || id < 1 || id > max) {
      throw new Error(
        'Invalid share : Share id must be an integer between 1 and ' +
          max +
          ', inclusive.'
      );
    }

    if (shareComponents && shareComponents[2]) {
      obj.id = id;
      obj.data = shareComponents[2];
      return obj;
    }

    throw new Error('The share data provided is invalid : ' + share);
  }
}
