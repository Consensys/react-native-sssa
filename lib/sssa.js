import { generateCoefficients, randomBitGenerator } from './randomBitGenerator';
import { Polynomial, CharacteristicTwoGaloisField } from './galoisField';
var isBase64 = require('is-base64');
import {
  splitBitsToIntArray,
  base64ToBits,
  padLeft,
  hex2bin,
  bin2hex,
  bitsToBase64
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

  getPointsOnPolynomialFor(coeffs, numShares, threshold) {
    var shares = [],
      i,
      len;

    for (i = 1, len = numShares + 1; i < len; i++) {
      shares[i - 1] = {
        x: i,
        y: this.horner(i, coeffs)
      };
    }

    return shares;
  }
  combine(shares) {
    let i,
      j,
      len,
      len2,
      result = '',
      setBits,
      share,
      splitShare,
      x = [],
      y = [];

    for (i = 0, len = shares.length; i < len; i++) {
      share = this.deconstructPublicShareString(shares[i]);
      if (x.indexOf(share.id) === -1) {
        x.push(share.id);
        splitShare = splitBitsToIntArray(hex2bin(share.data),this.coeffLength);
        //each element of y is all the y components of each bit
        for (j = 0, len2 = splitShare.length; j < len2; j++) {
          y[j] = y[j] || [];
          y[j][x.length - 1] = splitShare[j];
        }
      }
    }
    // Extract the secret from the 'rotated' share data and return a
    // string of Binary digits which represent the secret directly. or in the
    // case of a newShare() return the binary string representing just that
    // new share.

    for (i = 0, len = y.length; i < len; i++) {
      //warneach iteration represents one byte


      var secretChunk = this.lagrange( x, y[i]);

      result = padLeft(secretChunk.toString(2),this.coeffLength) + result;
    }

    // If 'at' is non-zero combine() was called from newShare(). In this
    // case return the result (the new share data) directly.
    //
    // Otherwise find the first '1' which was added in the share() function as a padding marker
    // and return only the data after the padding and the marker. Convert this Binary string
    // to hex, which represents the final secret result (which can be converted from hex back
    // to the original string in user space using `hex2str()`).
    return bitsToBase64(result.slice(result.indexOf('1') + 1));
  }

  lagrange( x, y) {
    let sum = 0,
      len,
      product,
      i,
      j,
      galoisField = this.char2GF;

    for (i = 0, len = x.length; i < len; i++) {
      if (y[i]) {
        product = galoisField.logs[y[i]];

        for (j = 0; j < len; j++) {
          if (i !== j) {
            product =
              (product +
                galoisField.logs[x[j]] -
                galoisField.logs[x[i] ^ x[j]] +
                this.fieldSize - 1) %
              this.fieldSize - 1; // to make sure it's not negative
          }
        }

        // though exps[-1] === undefined and undefined ^ anything = anything in
        // chrome, this behavior may not hold everywhere, so do the check
        sum = product === -1 ? sum : sum ^ galoisField.exps[product];
      }
    }


    return sum;
  }
  async generateShares(secret, numShares, threshold, padLength) {
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

    secret = '1' +  base64ToBits(secret); // append a 1 as a marker so that we can preserve the correct number of leading zeros in our secret
    secret = splitBitsToIntArray(secret, this.coeffLength); //uses global coefficient length
    for (i = 0, len = secret.length; i < len; i++) {
      secret[i] = Polynomial.toPolynomialForm(secret[i]);
      let polynomial = await generateCoefficients(secret[i],threshold, this.coeffLength);
      subShares = this.getPointsOnPolynomialFor(
        polynomial,
        numShares,
        threshold
      );
    //inverse of line 67 - 78 of combine(subshares should be equal to y)

      //each chunk of the secret has it's own numShares shares, needed to generate that chunk
      //y[j] is the y coordinate of the jth share for each chunk concatenated together
      //x[j] is similar but only contains one x-coordinate, rather than a concatentation, since x-coordinates for each chunk are the same

      for (j = 0; j < numShares; j++) {
        x[j] = x[j] || subShares[j].x;
        y[j] =
          padLeft(subShares[j].y.toString(2), this.coeffLength) + (y[j] || '');

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
    var id,
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

  verifyInput(secret, numShares, threshold, padLength) {
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
    if (numShares > this.fieldSize - 1) {
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
          this.fieldSize -
          1 +
          '), inclusive.'
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
  }
}
