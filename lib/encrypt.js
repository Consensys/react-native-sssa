import { NativeModules } from 'react-native';
import { generateIV } from './randomBitGenerator';
let Aes = NativeModules.Aes;

/**@param {string} file -  block of text
 * @param {string} key - a 256 bit private key
 *@returns {string} - the encrypted file
 */
export async function encrypt(file, key) {
  let iv = await generateIV();
  let cipher = await Aes.encrypt(file, key, iv);
  return { cipher: cipher, iv: iv };
}
/**@param {string} encryptedFile - an AES encrypted file
 * @param {string} key - a 256 private key that was used when encrypting the file
 * @param {string} iv - a base64 string used as an initialization vector when encrypting the file
 */
export async function decrypt(encryptedFile, key, iv) {
  let decryptedFile = await Aes.decrypt(encryptedFile, key, iv);
  return decryptedFile;
}
