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
});
