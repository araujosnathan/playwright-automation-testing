import { test } from '../support/fixtures';

// Authentication is handled by global-setup.ts - tests start already logged in!
test.beforeEach(async ({ page }) => {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is required');
  }
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded',timeout: 60000 });
});

test('User should be receive an alert when he tryes to redeem a invalid promo code', async ({ dashboardPage, walletPage, redeemPage, toastPage }) => {
  test.info().annotations.push({ type: 'TestCaseId', description: '004' });
  
  //Arrange
  await dashboardPage.goToWallet();
  await walletPage.redeemPromoCode()
  
  //Act
  await redeemPage.redeemCode('PROMO_INVALID');

  //Assert
  await toastPage.verifyToastAlert('Failed!', 'Invalid promo code.')

});
