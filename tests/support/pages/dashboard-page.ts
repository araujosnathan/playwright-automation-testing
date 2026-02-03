import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class DashboardPage extends BasePage {

    private readonly locators = {
        welcomeTitle: this.page.locator('.MuiTypography-title'),
        walletButton: this.page.getByTestId('headerWalletButton'),
        burgerMenuButton: this.page.getByTestId('headerContainer').getByRole('button').filter({ hasText: /^$/ }),
        userAvaterButton: this.page.getByTestId('userAvatarWithMenu'),
    }

    constructor(page: Page) {
        super(page);
    }

    getWelcomeTitle(){
        return this.locators.welcomeTitle;
    }

    async goToWallet(){
        await this.locators.walletButton.click();
    }
   
    async openLeftSideMenu(){
        await this.locators.burgerMenuButton.click();
    }

    async openUserMenu(){
        await this.locators.userAvaterButton.click();
    }
}
