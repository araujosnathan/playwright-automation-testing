import { Page } from '@playwright/test';
import { BasePage } from '../pages/base-page';

export class ProfileApi extends BasePage {
  private apiBaseUrl: string;

  constructor(page: Page) {
    super(page);
    this.apiBaseUrl = process.env.API_BASE_URL || '';
  }


  private async getCookies() {
    return await this.page.context().cookies();
  }

  async setHiddenMode(isHidden: boolean) {
    console.log(`ProfileApi: Setting hidden mode to: ${isHidden}`);

    try {
      const cookies = await this.getCookies();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (cookies.length > 0) {
        const cookieHeader = cookies
          .map(cookie => `${cookie.name}=${cookie.value}`)
          .join('; ');
        headers['Cookie'] = cookieHeader;
        console.log(`ProfileApi: Using ${cookies.length} cookies from authenticated session`);
      } else {
        throw new Error('ProfileApi: No cookies found in session. User must be authenticated before calling API methods.');
      }

      const response = await this.page.request.post(
        `${this.apiBaseUrl}/profile/setHiddenMode`,
        {
          data: JSON.stringify(isHidden),
          headers,
        }
      );

      if (!response.ok()) {
        const text = await response.text();
        console.error(
          `ProfileApi: setHiddenMode failed with status ${response.status()}: ${text.substring(0, 200)}`
        );
        throw new Error(`setHiddenMode failed: ${response.status()} ${response.statusText()}`);
      }

      console.log(`ProfileApi: ✓ Hidden mode set to ${isHidden}`);
      
      return await response.json();

    } catch (error) {
      console.error('ProfileApi: setHiddenMode error:', error);
      throw error;
    }
  }

  async setHiddenStatistics(isHidden: boolean) {
    console.log(`ProfileApi: Setting hidden statistics to: ${isHidden}`);

    try {
      const cookies = await this.getCookies();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (cookies.length > 0) {
        const cookieHeader = cookies
          .map(cookie => `${cookie.name}=${cookie.value}`)
          .join('; ');
        headers['Cookie'] = cookieHeader;
        console.log(`ProfileApi: Using ${cookies.length} cookies from authenticated session`);
      } else {
        throw new Error('ProfileApi: No cookies found in session. User must be authenticated before calling API methods.');
      }

      const response = await this.page.request.post(
        `${this.apiBaseUrl}/profile/setHiddenStatistics`,
        {
          data: JSON.stringify(isHidden),
          headers,
        }
      );

      if (!response.ok()) {
        const text = await response.text();
        console.error(
          `ProfileApi: setHiddenStatistics failed with status ${response.status()}: ${text.substring(0, 200)}`
        );
        throw new Error(`setHiddenStatistics failed: ${response.status()} ${response.statusText()}`);
      }

      console.log(`ProfileApi: ✓ Hidden statistics set to ${isHidden}`);
    
      return await response.json();
      
    } catch (error) {
      console.error('ProfileApi: setHiddenStatistics error:', error);
      throw error;
    }
  }
}
