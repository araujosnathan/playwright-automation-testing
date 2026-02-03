import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { ProfileLeftMenu } from '../enum/profile-left-menu';

export class ProfileLeftMenuPage extends BasePage {

    private profileLeftMenu = this.page.getByTestId('profileLeftMenu');
    private readonly locators = {
        menu: (menu: string) => this.profileLeftMenu.locator('p').filter({ hasText: menu }),

    }
    constructor(page: Page) {
        super(page);
    }

    async openProfile(){
        await this.locators.menu(ProfileLeftMenu.Profile).waitFor({ state: 'visible', timeout: 30000 })
        await this.locators.menu(ProfileLeftMenu.Profile).click();
    }

}
