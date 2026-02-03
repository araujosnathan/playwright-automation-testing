import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class UserInfoPage extends BasePage {

    private readonly locators = {
        profileHideDetailsCheckbox: this.page.getByTestId('profileHideDetails').locator('input[type="checkbox"]'),
        profileHideStatisticsCheckbox: this.page.getByTestId('profileHideStatistics').locator('input[type="checkbox"]'),
    }
    constructor(page: Page) {
        super(page);
    }

    async waitForUserInfoBeDisplayed(){
         await this.locators.profileHideDetailsCheckbox.waitFor({ state: 'visible', timeout: 10000 });
    }

    async verifyHideDetailsCheckboxIsChecked(){
        return await this.locators.profileHideDetailsCheckbox.isChecked();
    }

    async toggleHideDetailsCheckbox(){
        await this.locators.profileHideDetailsCheckbox.click();
    }

    async verifyHideStatisticsCheckboxIsChecked(){
        return await this.locators.profileHideStatisticsCheckbox.isChecked();
    }

    async toggleHideStatisticsCheckbox(){
        await this.locators.profileHideStatisticsCheckbox.click();
    }

   
}
