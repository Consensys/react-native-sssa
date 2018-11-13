import { getOptionsObject } from './remoteStorage.js';
describe('converts string  to form data to be  used in post with data of multi-form/form-data content type', () => {
  it('should  convert correctly', () => {
    expect(getOptionsObject('hadas').body._parts[0][1]).toBe('hadas');
  });
});
