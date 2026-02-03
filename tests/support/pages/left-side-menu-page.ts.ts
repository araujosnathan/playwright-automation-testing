import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { OriginalGames } from '../enum/original-games';

export class LeftSideMenuPage extends BasePage {

    private readonly locators = {
        gameTitle: (gameTitle: OriginalGames) => this.page.locator('.MuiTypography-gameTitle').filter({hasText: gameTitle})
    }
    constructor(page: Page) {
        super(page);
    }

    async openOriginalGame(gameTitle: OriginalGames){
        await this.locators.gameTitle(gameTitle).click();

    }
   
}
