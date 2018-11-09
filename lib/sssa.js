import { generateCoefficients, randomBitGenerator } from './randomBitGenerator';
import { Polynomial, CharacteristicTwoGaloisField } from './galoisField';
var isBase64 = require('is-base64');
import {
  splitBitsToIntArray,
  base64ToBits,
  padLeft,
  hex2bin,
  bin2hex,
  bitsToBase64,
  convertIntArrayToBits
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
      shares[i - 1] = this.horner(i, coeffs);
    }

    return shares;
  }
  combine(shares) {
    let points = this.publicShareToPoints(shares);
    let secretChunks = this.getChunksFromPoints(points);
    return this.combineSecret(secretChunks);
  }

  lagrange(x, y) {
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
            if (x[j]===0) { // happens when computing a share that is in the list of shares used to compute it
                product = -1; // fix for a zero product term, after which the sum should be sum^0 = sum, not sum^1
                break;
            }
            product =
                product +
                galoisField.logs[0 ^ x[j]] -
                galoisField.logs[x[i] ^ x[j]] +
                (this.fieldSize -
                1) %
                (this.fieldSize - 1)
               // to make sure it's not negative
          }
        }

        // though exps[-1] === undefined and undefined ^ anything = anything in
        // chrome, this behavior may not hold everywhere, so do the check
        sum = product === -1 ? sum : sum ^ galoisField.exps[product];
      }
    }

    return sum;
  }
  splitSecret(secret) {
    let secretInBits = '1' + base64ToBits(secret); // append a 1 as a marker so that we can preserve the correct number of leading zeros in our secret
    let secretChunks = splitBitsToIntArray(secretInBits, this.coeffLength); //uses global coefficient length
    return secretChunks;
  }
  combineSecret(secretChunks) {
    let result = convertIntArrayToBits(secretChunks, this.coeffLength);
    result = result.slice(result.indexOf('1') + 1);
    return bitsToBase64(result);
  }
  async getPointsFromChunks(secretChunks, numShares, threshold) {
    let allPoints = [];
    for (i = 0, len = secretChunks.length; i < len; i++) {
      secretChunk = Polynomial.toPolynomialForm(secretChunks[i]);
      let polynomial = await generateCoefficients(
        secretChunk,
        threshold,
        this.coeffLength
      );
      subShares = this.getPointsOnPolynomialFor(
        polynomial,
        numShares,
        threshold
      );

      allPoints[i] = allPoints[i] || [];
      allPoints[i] = allPoints[i].concat(subShares);
    }
    return allPoints; //2-d array of integers, elements [i][j] os the jth point of the ith secret chunk
  }
  getChunksFromPoints(points) {
    let x = [...Array(points[0].length).keys()].map(x => x + 1);
    let secretChunks = [];
    for (var i = 0; i < points.length; i++) {
      secretChunks[i] = this.lagrange(x, points[i]);
    }
    return secretChunks;
  }
  createCrossSection(allPoints) {
    let y = [];
    numSecretChunks = allPoints.length;
    for (let i = 0; i < numSecretChunks; i++) {
      let subShares = allPoints[i];
      for (let j = 0; j < subShares.length; j++) {
        y[j] = y[j] || [];
        y[j].push(subShares[j]);
      }
    }
    return y;
  }
  sharesToBin(sharesMatrix) {
    if (!sharesMatrix.length && !sharesMatrix[0].length) {
      throw new Error(
        'input to sharesToBin is expected to be a 2-d arary, representing shamir shares'
      );
    }
    let output = [];
    let shares = sharesMatrix;
    for (var i = 0; i < shares.length; i++) {
      for (var j = 0; j < shares[i].length; j++) {
        output[i] =
          padLeft(shares[i][j].toString(2), this.coeffLength) +
          (output[i] || '');
      }
    }
    return output;
  }
  publicShareToPoints(shares) {
    let x = [],
      y = [];
    for (let i = 0, len = shares.length; i < len; i++) {
      share = this.deconstructPublicShareString(shares[i]);
      if (x.indexOf(share.id) === -1) {
        x.push(share.id);
        var binData = hex2bin(share.data);
        binData = binData.slice(binData.indexOf('1') + 1);
        splitShare = splitBitsToIntArray(binData, this.coeffLength);
        //each element of y is all the y components of each bit
        for (j = 0, len2 = splitShare.length; j < len2; j++) {
          y[j] = y[j] || [];
          y[j][x.length - 1] = splitShare[j];
        }
      }
    }
    return y;
  }
  binarySharesToPublicShareString(shares) {
    let x = [];
    for (let i = 0; i < shares.length; i++) {
      x[i] = this.constructPublicShareString(i + 1, bin2hex("1" + shares[i])); //changed to hex so it can be used with RegEx
    }
    return x;
  }
  async generateShares(secret, numShares, threshold, padLength) {
    var x = new Array(numShares),
      padLength = padLength || 128;
    var secretChunks = this.splitSecret(secret);
    let pointsFromChunks = await this.getPointsFromChunks(
      secretChunks,
      numShares,
      threshold
    );
    let crossSection = this.createCrossSection(pointsFromChunks);
    let shares = this.sharesToBin(crossSection);
    return this.binarySharesToPublicShareString(shares);
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
