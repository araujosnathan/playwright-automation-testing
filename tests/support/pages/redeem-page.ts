import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class RedeemPage extends BasePage {

    private readonly locators = {
        enterCodeInput: this.page.locator('input[placeholder="Enter Code"]'),
        redeemButton: this.page.getByTestId('LeftPanelContainer').locator('button').filter({ hasText: 'Redeem' })
    }
    constructor(page: Page) {
        super(page);
    }

    async redeemCode(code: string){
        await this.locators.enterCodeInput.fill(code);
        await this.locators.redeemButton.click();

        
    }
   
}
