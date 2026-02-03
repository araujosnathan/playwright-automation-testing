import { APIRequestContext, request } from '@playwright/test';
import { IssuePayload } from '../interfaces/issue-payload';

const authToken = process.env.JIRA_AUTH_TOKEN || '';
const apiBaseURL = process.env.JIRA_BASE_URL || 'https://autoapi.atlassian.net';


export class ApiClient {
  private apiContext: APIRequestContext;

    private constructor(apiContext: APIRequestContext) {
        this.apiContext = apiContext;
    }

    static async create(): Promise<ApiClient> {
        const client = await request.newContext({
        baseURL: apiBaseURL,
        extraHTTPHeaders: {
            Authorization: `Basic ${authToken}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        });

        return new ApiClient(client);
    }

    async createIssue(issuePayload: IssuePayload) {
        return await this.apiContext.post('/rest/api/3/issue', { data: issuePayload });
    }

    async bulkCreateIssue(issuesPayload: IssuePayload[]) {
        return await this.apiContext.post('/rest/api/3/issue/bulk', { data: { issueUpdates: issuesPayload } });
    }

    async getIssue(issueKey: string) {
        return await this.apiContext.get(`/rest/api/3/issue/${issueKey}`);
    }

    async getBulkIssue(issueKeys: string[]) {
        return await this.apiContext.post('/rest/api/3/issue/bulkfetch', { data: { issueIdsOrKeys: issueKeys } });
    }

    async updateIssue(issueKey: string, fields: object) {
        return await this.apiContext.put(`/rest/api/3/issue/${issueKey}`, {
        data: { fields },
        });
    }

    async deleteIssue(issueKey: string) {
        return await this.apiContext.delete(`/rest/api/3/issue/${issueKey}`);
    }

    async getIssueChangeLog(issueKey: string) {
        return await this.apiContext.get(`/rest/api/3/issue/${issueKey}/changelog`);
    }

    async getTransitions(issueKey: string) {
        return await this.apiContext.get(`/rest/api/3/issue/${issueKey}/transitions`);
    }

    async doTransition(issueKey: string, transitionId: string) {
        return await this.apiContext.post(`/rest/api/3/issue/${issueKey}/transitions`, {
            data: { transition: { id: transitionId } },
        });
    }
}
