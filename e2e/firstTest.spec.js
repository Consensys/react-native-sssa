describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should have the correct length', async () => {
    await expect(element(by.id('randombits'))).toHaveText('14');
  });
  it('will output an array of shares', async () => {
    await expect(element(by.id('shares'))).toHaveText('7');
  });
   it('will output the correct length', async () => {
    await expect(element(by.id('oneShare'))).toHaveText('true');
  });
});

