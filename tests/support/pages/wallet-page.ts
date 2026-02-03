import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class WalletPage extends BasePage {

    private readonly locators = {
        redeemTabButton: this.page.getByTestId('redeemButton')
    }
    constructor(page: Page) {
        super(page);
    }

    async redeemPromoCode(){
        await this.locators.redeemTabButton.click();

    }
   
}
