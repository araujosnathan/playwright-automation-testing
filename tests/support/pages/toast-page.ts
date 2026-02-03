import { expect, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ToastPage extends BasePage {
    private toastBody = this.page.locator('.Toastify__toast-body')
    private readonly locators = {
        toastTitle:  this.toastBody.getByTestId('toastTitle'),
        toastSubTitle: this.toastBody.getByTestId('toastSubTitle'),
        toastFailedTitle: this.page.getByTestId('Failed!-toast-title'),
        toastFailedSubTitle: this.page.getByTestId('undefined-toast-subtitle'),
    }
    constructor(page: Page) {
        super(page);
    }

    async verifyToastAlert(title: string, subtitle: string, timeout: number = 20000) {
    await this.toastBody.waitFor({ state: 'visible', timeout });
    await expect.soft(this.locators.toastTitle).toHaveText(title, { timeout });
    await expect.soft(this.locators.toastSubTitle).toHaveText(subtitle, { timeout });

}


    async verifyToastFailed(title: string, subtitle: string, timeout: number = 20000){
        await expect.soft(this.locators.toastFailedTitle).toContainText(title, { timeout: timeout })
        await expect.soft(this.locators.toastFailedSubTitle).toContainText(subtitle, { timeout: timeout })
    }

    async waitForToastNotVisible(subtitle?: string , timeout: number = 10000){
        await this.locators.toastSubTitle.filter({ hasText: subtitle }).waitFor({ state: 'hidden', timeout: timeout });
    }



   
}
