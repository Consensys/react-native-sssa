import { generateSecureRandom } from 'react-native-securerandom';
import { bytesToBits } from './utils';
/**@param {number} numBits - the length of bits the randomly generated sequence of
 * bits should be
 */
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
/**@param {number} secretChunk - integer representing one chunk of the secret
 * @param {number} numCoefficients - number of coefficients to generate, should correspond to threshold in sssa.generateShares function
 * @param {number} coefficientLength - bit length that the coefficients should be, should correspond to coefficient length passed into instance of sssa
 */
export async function generateCoefficients(
  secretChunk,
  numCoefficients,
  coefficientLength
) {
  let coeffs = [secretChunk];
  for (let i = 1; i < numCoefficients; i++) {
    coeffs[i] = await randomBitGenerator(coefficientLength);
  }
  return coeffs;
}
