import { generateSecureRandom } from '../RNSecureRandom/index';
import { bytesToBits } from './utils';

export async function randomBitGenerator(numBits) {
  var numBytes,
    str = null;

  numBytes = Math.ceil(numBits / 8);
  while (str === null) {
    let uIntByteArr = await generateSecureRandom(numBytes);
    str = bytesToBits(uIntByteArr);
  }
  str = str.substr(-numBits);
  return str;
}

export async function generateCoefficients(secretChunk,numCoefficients,coefficientLength){
  let coeffs = [secretChunk];
  for (i = 1; i < numCoefficients; i++) {
    coeffs[i] = await randomBitGenerator(coefficientLength);
  }
  return coeffs;
}
