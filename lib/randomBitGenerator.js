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
