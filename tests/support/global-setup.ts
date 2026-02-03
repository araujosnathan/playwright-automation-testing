import { chromium, FullConfig, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { HomePage } from './pages/home-page';
import { SignInPage } from './pages/sign-in-page';
import { DashboardPage } from './pages/dashboard-page';

async function globalSetup(config: FullConfig) {
  if (!process.argv.some(arg => arg.includes('e2e'))) {
    console.log('Skipping global setup because this is not E2E');
    return;
  }

  const { baseURL } = config.projects[0].use;
  
  if (!process.env.USERNAME || !process.env.PASSWORD) {
    throw new Error('USERNAME and PASSWORD environment variables are required');
  }
  
  if (!baseURL) {
    throw new Error('BASE_URL is not configured in playwright.config.ts');
  }
  
  const users = [
    {
      name: 'default',
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      authFile: path.join(__dirname, '../../.auth/user.json')
    }
  ];

  console.log('Running global authentication setup...');

  for (const user of users) {
    console.log(`Authenticating user: ${user.name} (${user.username})...`);
    const authDir = path.dirname(user.authFile);
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
      console.log(`Created directory: ${authDir}`);
    }

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      locale: 'en-US',
      timezoneId: 'America/New_York',
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    try {
      
      await page.addInitScript(() => {
        // eslint-disable-next-line no-undef
        localStorage.setItem('hasAcceptedCookies', 'true');
      });
      console.log(`Navigating to: ${baseURL}`);
      await page.goto(baseURL, { timeout: 120000, waitUntil: 'domcontentloaded' });
      
      const homePage = new HomePage(page);
      const signInPage = new SignInPage(page);
      const dashboardPage = new DashboardPage(page);
      
      console.log('Starting login process...');
      
      const beforeLoginScreenshot = path.join(__dirname, '../../test-results/before-login.png');
      await page.screenshot({ path: beforeLoginScreenshot, fullPage: true });
      console.log(`Before login screenshot saved to: ${beforeLoginScreenshot}`);
      await homePage.waitForHomeBeDisplayed();
      await homePage.goToSignForm();
      await signInPage.doLogin({ username: user.username, password: user.password });
      page.on('response', async response => {
        if (response.url().includes('/login') && response.request().method() === 'POST') {
          console.log('Login response status:', response.status()); 
          const body = await response.json().catch(() => null);
          console.log('Body da resposta:', body);
      
          if (response.status() >= 400 || body?.error) {
            console.log('Login failed!');
          } else {
            console.log('Login successful!');
          }
        }
      });
      await expect(dashboardPage.getWelcomeTitle().getByText('Welcome back')).toBeVisible({timeout: 60000});
      await expect(dashboardPage.getWelcomeTitle().getByText(`${user.username}!`)).toBeVisible();
      
      console.log(`Authentication successful for ${user.name}!`);
      
      await context.storageState({ path: user.authFile });
      console.log(`Authentication state saved to: ${user.authFile}`);

    } catch (error) {
      console.error(`Authentication failed for ${user.name}:`, error);
      
      try {
        const screenshotsDir = path.join(__dirname, '../../test-results');
        if (!fs.existsSync(screenshotsDir)) {
          fs.mkdirSync(screenshotsDir, { recursive: true });
        }
        
        const failureScreenshot = path.join(screenshotsDir, 'auth-failure.png');
        await page.screenshot({ path: failureScreenshot, fullPage: true });
        console.log(`Failure screenshot saved to: ${failureScreenshot}`);
        
        const htmlPath = path.join(screenshotsDir, 'auth-failure.html');
        const htmlContent = await page.content();
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`Page HTML saved to: ${htmlPath}`);
        
        const urlPath = path.join(screenshotsDir, 'auth-failure-url.txt');
        fs.writeFileSync(urlPath, `URL: ${page.url()}\nError: ${error}`);
        console.log(`URL saved to: ${urlPath}`);
        
      } catch (debugError) {
        console.error('Failed to capture debug info:', debugError);
      }
      
      throw error;
    } finally {
      await context.close();
      await browser.close();
    }
  }

  console.log(' All users authenticated successfully!');
}

export default globalSetup;
