import SecureStorage, {
  ACCESS_CONTROL,
  ACCESSIBLE,
  AUTHENTICATION_TYPE
} from 'react-native-secure-storage';
import { NativeModules } from 'react-native';
let Aes = NativeModules.Aes;
const config = {
  accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
  accessible: ACCESSIBLE.WHEN_UNLOCKED,
  authenticationPrompt: 'Authenticate to access the vault',
  service: 'vault',
  authenticateType: AUTHENTICATION_TYPE.BIOMETRICS
};
const keyId = 'vault_key';
/**@returns {string} - newly generated 256 bit key to be used with AES encryption
 */
async function generateKey() {
  let key = '';
  try {
    key = await Aes.pbkdf2(
      'mnemonic could go here',
      'salt could go here',
      5000,
      256
    );
  } catch (e) {
    throw new Error(e);
  }
  return key;
}
/**@param {string} privateKey -
 * @returns {boolean} - true if the key was successfully stored, false otherwise
 */
async function storeKey(privateKey) {
  let result = '';
  try {
    result = await SecureStorage.setItem('vault_key', privateKey, config);
  } catch (e) {
    throw new Error(e);
  }
  return result;
}
/**@returns {boolean} - true if the key was successfully stored, false otherwise
 */
export async function generateAndStoreKey() {
  let privateKey = await generateKey();
  let result = await storeKey(privateKey);
  return result;
}

/**@returns {string} - the 256-bit key used for AES encryption
 */
export async function getKey() {
  const key = await SecureStorage.getItem(keyId, config);
  return key;
}
