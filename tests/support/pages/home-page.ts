import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HomePage extends BasePage {

    private readonly locators = {
        pageContentAnimate: this.page.getByTestId('page-container-animate'),
        signInButton: this.page.getByTestId('signin-nav'),
        buttonGotIt: this.page.locator('button').filter({ hasText: 'Got it!' }),

    }
    constructor(page: Page) {
        super(page);
    }

    async waitForHomeBeDisplayed(){
        await this.locators.pageContentAnimate.waitFor({ state: 'visible', timeout: 30000 })
        if (await this.locators.buttonGotIt.isVisible({ timeout: 5000 })) {
            await this.locators.buttonGotIt.click();
        }
    }

    async goToSignForm(){
        await this.locators.signInButton.click();
    }
   
}
