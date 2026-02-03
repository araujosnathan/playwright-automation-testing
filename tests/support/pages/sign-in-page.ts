import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { UserCredentials } from '../interfaces/user-credentials';

export class SignInPage extends BasePage {

    private readonly locators = {
        formLogin: this.page.getByTestId('form-login'),
        usernameInput: this.page.locator('input[name="username"]'),
        passwordInput: this.page.locator('input[name="password"]'),
        startPlayingButton: this.page.getByTestId('start-playing-login'),
        
    }
    constructor(page: Page) {
        super(page);
    }

    async doLogin(UserCredentials: UserCredentials){
        await this.locators.formLogin.waitFor({state: 'visible'});
        await this.locators.usernameInput.fill(UserCredentials.username);
        await this.locators.passwordInput.fill(UserCredentials.password);
        await this.locators.startPlayingButton.click();
        
    }
   
}
