import { expect, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class MinesGamePage extends BasePage {

    private readonly locators = {
        minesTileButton: (tileNumber: number) => this.page.getByTestId(`mines-tile-${tileNumber}`),
        startPlaingButton: this.page.getByTestId('mines-manual-start')
    }
    constructor(page: Page) {
        super(page);
    }

    async waitForMinesTitleButtonLoaded(){
        await this.locators.minesTileButton(1).waitFor({state: 'visible'});

    }

    async startPlayng(){
        await expect(this.locators.startPlaingButton).toBeEnabled();
        await this.locators.startPlaingButton.click();
    }
   
}
