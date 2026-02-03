import { test } from '../support/fixtures';
import { OriginalGames } from '../support/enum/original-games';

// Authentication is handled by global-setup.ts - tests start already logged in!
test.beforeEach(async ({ page }) => {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is required');
  }
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded',timeout: 60000 });
});

test('User should be receive an alert when he tryes play Mines without money', async ({dashboardPage, leftSideMenuPage, minesGamePage, toastPage }) => {
  test.info().annotations.push({ type: 'TestCaseId', description: '001' });
  
  //Arrange
  await dashboardPage.openLeftSideMenu()
  
  //Act
  await leftSideMenuPage.openOriginalGame(OriginalGames.Mines);
  await minesGamePage.waitForMinesTitleButtonLoaded();
  await minesGamePage.startPlayng();

  //Assert
  await toastPage.verifyToastFailed('Failed', 'Not enough money')

});
