import { test as base } from '@playwright/test';
import { HomePage } from './pages/home-page';
import { SignInPage } from './pages/sign-in-page';
import { DashboardPage } from './pages/dashboard-page';
import { WalletPage } from './pages/wallet-page';
import { RedeemPage } from './pages/redeem-page';
import { ToastPage } from './pages/toast-page';
import { LeftSideMenuPage } from './pages/left-side-menu-page.ts';
import { MinesGamePage } from './pages/mines-game-page';
import { ProfileApi } from './services/profile-api';
import { UserInfoPage } from './pages/user-info-page';
import { ApiClient } from './services/api-client';
import { ProfileLeftMenuPage } from './pages/profile-left-menu-page';

type CustomFixtures = {
    homePage: HomePage;
    signInPage: SignInPage;
    dashboardPage: DashboardPage;
    walletPage: WalletPage;
    redeemPage: RedeemPage;
    toastPage: ToastPage;
    leftSideMenuPage: LeftSideMenuPage,
    minesGamePage: MinesGamePage,
    userInfoPage: UserInfoPage,
    profileLeftMenuPage: ProfileLeftMenuPage,
    profileApi: ProfileApi
    apiClient: ApiClient

};

export const test = base.extend<CustomFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    walletPage: async ({ page }, use) => {
        await use(new WalletPage(page));
    },
    redeemPage: async ({ page }, use) => {
        await use(new RedeemPage(page));
    },
    toastPage: async ({ page }, use) => {
        await use(new ToastPage(page));
    },
    leftSideMenuPage: async ({ page }, use) => {
        await use(new LeftSideMenuPage(page));
    },
    minesGamePage: async ({ page }, use) => {
        await use(new MinesGamePage(page));
    },
    profileApi: async ({ page }, use) => {
        const service = new ProfileApi(page);
        await use(service);
    },
    userInfoPage: async ({ page }, use) => {
        await use(new UserInfoPage(page));
    },
    // eslint-disable-next-line no-empty-pattern
    apiClient: async ({}, use) => {
        await use(await ApiClient.create());
    },
    profileLeftMenuPage: async ({ page }, use) => {
        await use(new ProfileLeftMenuPage(page));
    }
});

