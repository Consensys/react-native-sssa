import { SSSA } from './lib/sssa.js';
import { encrypt, decrypt } from './lib/encrypt.js';
import { getKey, generateAndStoreKey } from './lib/privateKey.js';
/**@param {string} secret - plain text to be privately and securely stored
 * @param {number} numShares - number of shares you want to "split" the secret into
 * @param {number} threshold - minimum number of shares needed to reconstruct the secret
 */
export async function encryptAndSplitSecret(secret, numShares, threshold) {
  let sssa = new SSSA(3);
  let key = await getKey();
  if (!key) {
    let isStored = await generateAndStoreKey();
    if (isStored) {
      key = await getKey();
    }
  }
  let resultObj = await encrypt(secret, key);
  let encryptedFile = resultObj.cipher;
  let shares = await sssa.generateShares(encryptedFile, numShares, threshold);

  return { shares: shares, iv: resultObj.iv };
}
/**@param {Array} shares - an array of shares from which to construct the secret
 * @param {string} iv - a base64 string used as an initialization vector when encrypting the file
 */
export async function combineAndDecryptSecret(shares, iv) {
  let key = await getKey();
  let sssa = new SSSA(3);
  let encryptedSecret = sssa.combine(shares);
  let secret = await decrypt(encryptedSecret, key, iv);
  return secret;
}
