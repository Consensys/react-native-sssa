/**@param {Array} files - an array of files to store to ipfs
 * @returns {Array} - an array of ipfs locations where the files were stored
 */
export async function storeToIPFS(files) {
  if (!files.length) {
    throw new Error('input must be an array of files');
  }
  let ipfsPromises = new Array();
  for (let i = 0; i < files.length; i++) {
    let ipfsPromise = await ipfsPost(files[i]);
    ipfsPromises.push(ipfsPromise);
  }
  try {
    let ipfsLocations = await Promise.all(ipfsPromises);
    return ipfsLocations;
  } catch (e) {
    return e;
  }
}
/**@param {Array} ipfsLocations - an array of IPFS locations
 * @returns {Array} files - an array of files
 */
export async function getFromIPFS(ipfsLocations) {
  if (!ipfsLocations.length) {
    throw new Error('input must be an array of IPFS locaitons');
  }
  let ipfsPromises = new Array();
  for (let i = 0; i < ipfsLocations.length; i++) {
    let ipfsPromise = await ipfsGet(ipfsLocations[i].Key);
    ipfsPromises.push(ipfsPromise);
  }
  try {
    let shares = await Promise.all(ipfsPromises);
    return shares;
  } catch (e) {
    return e;
  }
}
/**@param {string} ipfsLocation - a content-addressable id in IPFS
 * @returns {string} - the plaintext that was stored at the given location
 */
async function ipfsGet(ipfsLocation) {
  const url = constructIPFSGetUrl(ipfsLocation);
  try {
    let get = await fetch(url);
    return get.text();
  } catch (error) {
    return error;
  }
}
/**@param {string} str - plain text to store on IPFS
 * @returns {Object} - options object to put into IPFS post request
 */
export function getOptionsObject(str) {
  let formData = new FormData();
  formData.append('file1', str);
  return {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
}
/**@param {string} file - file to post to IPFS
 * @returns {Object} - response from IPFS post request - it is of the form {Key , Size}
 */
async function ipfsPost(file) {
  const url = 'https://ipfs.infura.io:5001/api/v0/block/put';
  try {
    let post = await fetch(url, getOptionsObject(file));
    return post.json();
  } catch (error) {
    return error;
  }
}
/**@param {string} ipfsLocation - a content addressable id on IPFS
 * @returns {string} - the url for IPFS get request
 */
function constructIPFSGetUrl(ipfsLocation) {
  const url =
    'https://ipfs.infura.io:5001/api/v0/block/get?' + 'arg=' + ipfsLocation;
  return url;
}
