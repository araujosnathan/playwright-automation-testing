import { test } from '../support/fixtures';
import { expect } from '@playwright/test';

const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL environment variable is required');
  }

test('User should be able to set/unset hidden mode', async ({ page, profileApi, dashboardPage, profileLeftMenuPage,  userInfoPage, toastPage }) => {
    test.info().annotations.push({ type: 'TestCaseId', description: '002' });

    //Arrange
    await profileApi.setHiddenMode(false);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await dashboardPage.openUserMenu();
    await profileLeftMenuPage.openProfile();
    await userInfoPage.waitForUserInfoBeDisplayed();
    const isChecked = await userInfoPage.verifyHideDetailsCheckboxIsChecked();
    expect(isChecked).toBe(false);

    //Act - Assert

    await userInfoPage.toggleHideDetailsCheckbox();
    await toastPage.verifyToastAlert('Success!', 'Hidden details mode enabled!');
    const isNowChecked = await userInfoPage.verifyHideDetailsCheckboxIsChecked();
    expect(isNowChecked).toBe(true);

    //Act - Assert: Revert back to original state
    await toastPage.waitForToastNotVisible('Hidden details mode enabled!');
    await userInfoPage.toggleHideDetailsCheckbox();
    await toastPage.verifyToastAlert('Success!', 'Hidden details mode disabled!');
    const isFinallyUnchecked = await userInfoPage.verifyHideDetailsCheckboxIsChecked();
    expect(isFinallyUnchecked).toBe(false);
});

test('User should be able to set/unset hidden statistics mode', async ({ page, profileApi, dashboardPage, userInfoPage, profileLeftMenuPage, toastPage }) => {
    test.info().annotations.push({ type: 'TestCaseId', description: '003' });

    //Arrange
    await profileApi.setHiddenStatistics(false);
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await dashboardPage.openUserMenu();
    await profileLeftMenuPage.openProfile();
    await userInfoPage.waitForUserInfoBeDisplayed();
    const isChecked = await userInfoPage.verifyHideStatisticsCheckboxIsChecked();
    expect(isChecked).toBe(false);

    //Act - Assert

    await userInfoPage.toggleHideStatisticsCheckbox();
    await toastPage.verifyToastAlert('Success!', 'Hidden statistics mode enabled!');
    const isNowChecked = await userInfoPage.verifyHideStatisticsCheckboxIsChecked();
    expect(isNowChecked).toBe(true);

    //Act - Assert: Revert back to original state
    await toastPage.waitForToastNotVisible('Hidden statistics mode enabled!');
    await userInfoPage.toggleHideStatisticsCheckbox();
    await toastPage.verifyToastAlert('Success!', 'Hidden statistics mode disabled!');
    const isFinallyUnchecked = await userInfoPage.verifyHideStatisticsCheckboxIsChecked();
    expect(isFinallyUnchecked).toBe(false);
});
