import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ToastPage extends BasePage {

    private readonly locators = {
        acceptButton: this.page.getByRole('button').getByText('Accept')
    }
    constructor(page: Page) {
        super(page);
    }

    async acceptCookies(){
        await this.locators.acceptButton.isVisible();
    }
   
}
