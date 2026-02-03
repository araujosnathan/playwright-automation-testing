/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { test } from '../support/fixtures';
import { expect } from '@playwright/test';
import { IssueBuilder } from '../support/builder/issue-builder';
import { issueSchemaResponse } from '../support/schema/issue-response-schema';
import { validateSchema } from '../support/schema/validate-schema';
import { IssueChangelogItem, IssueChangelogResponse, IssueChangelogValue } from '../support/interfaces/issue-change-log';
import { JiraTransition } from '../support/interfaces/issue-transation';
const createdIssues: string[] = [];

test('Should create an issue successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0001',
    });
    //Arrange
    const issuePayload = new IssueBuilder().build();

    //Act
    const response = await apiClient.createIssue(issuePayload);

    //Assert
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    createdIssues.push(responseBody.key);

    //Assert schema
    validateSchema(responseBody, issueSchemaResponse);
});

test('Should get an issue by key after creating it successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0002',
    });
    //Arrange
    const issuePayload = new IssueBuilder().build();
    const createResponse = await apiClient.createIssue(issuePayload);
    expect(createResponse.status()).toBe(201);

    const createdIssue = await createResponse.json();
    const issueKey = createdIssue.key;
    createdIssues.push(issueKey);

    //Act
    const getResponse = await apiClient.getIssue(issueKey);

    //Assert
    expect(getResponse.status()).toBe(200);

    //Assert schema
    const responseBody = await getResponse.json();
    validateSchema(responseBody, issueSchemaResponse);

    expect(responseBody.fields.summary).toBe(issuePayload.fields.summary);
    expect(responseBody.fields.issuetype.name).toBe(issuePayload.fields.issuetype.name);
    expect(responseBody.fields.project.key).toBe('DEV');
});

test('Should update an existing issue successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0003',
    });
    //Arrange
    const issuePayload = new IssueBuilder().build();
    const createResponse = await apiClient.createIssue(issuePayload);
    expect(createResponse.status()).toBe(201);

    const createdIssue = await createResponse.json();
    const issueKey = createdIssue.key;
    createdIssues.push(issueKey);

    //Act
    const updatedSummary = `Updated summary - ${Date.now()}`;
    const updatedFields = {
        summary: updatedSummary,
    };
    const updateResponse = await apiClient.updateIssue(issueKey, updatedFields);
    expect(updateResponse.status()).toBe(204);

    //Assert
    const getResponse = await apiClient.getIssue(issueKey);
    expect(getResponse.status()).toBe(200);
    const responseBody = await getResponse.json();

    //Assert schema
    validateSchema(responseBody, issueSchemaResponse);
    expect(responseBody.fields.summary).toBe(updatedSummary);
    expect(responseBody.fields.issuetype.name).toBe(issuePayload.fields.issuetype.name);
    expect(responseBody.fields.project.key).toBe('DEV');
});

test('Should delete an existing issue successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0004',
    });
    //Arrange
    const issuePayload = new IssueBuilder().build();
    const createResponse = await apiClient.createIssue(issuePayload);
    expect(createResponse.status()).toBe(201);
    const createdIssue = await createResponse.json();
    const issueKey = createdIssue.key;

    //Act
    const deleteResponse = await apiClient.deleteIssue(issueKey);

    //Assert
    expect(deleteResponse.status()).toBe(204);
    const getResponse = await apiClient.getIssue(issueKey);
    expect(getResponse.status()).toBe(404);
});

test('Should bulk create issues successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0005',
    });
    //Arrange
    const issuesPayload = Array.from({ length: 7 }, () => new IssueBuilder().build());

    //Act
    const response = await apiClient.bulkCreateIssue(issuesPayload);
    expect(response.status()).toBe(201);
    const responseBody = await response.json();

    for (const issue of responseBody.issues) {
        createdIssues.push(issue.key);
        validateSchema(issue, issueSchemaResponse);
    }
});

test('Should bulk fetch issues successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0006',
    });
    //Arrange
    const issuesPayload = Array.from({ length: 3 }, () => new IssueBuilder().build());
    const issuesToGet: string[] = [];
    for (const payload of issuesPayload) {
        const createResponse = await apiClient.createIssue(payload);
        expect(createResponse.status()).toBe(201);

        const createdIssue = await createResponse.json();
        createdIssues.push(createdIssue.key);
        issuesToGet.push(createdIssue.key);
    }

    //Act
    const bulkFetchResponse = await apiClient.getBulkIssue(issuesToGet);

    //Assert
    expect(bulkFetchResponse.status()).toBe(200);

    const fetchedIssues = await bulkFetchResponse.json();
    expect(fetchedIssues.issues.length).toBe(3);

    for (let i = 0; i < fetchedIssues.issues.length; i++) {
        const issue = fetchedIssues.issues[i];
        const originalPayload = issuesPayload[i];

        //Assert schema
        validateSchema(issue, issueSchemaResponse);
        expect(issue.fields.summary).toBe(originalPayload.fields.summary);
        expect(issue.fields.issuetype.name).toBe(originalPayload.fields.issuetype.name);
        expect(issue.fields.project.key).toBe('DEV');
    }
});

test('Should get the issue changelog', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0007',
    });
    //Arrange - Create issue
    const issuePayload = new IssueBuilder().build();
    const createResponse = await apiClient.createIssue(issuePayload);
    expect(createResponse.status()).toBe(201);

    const createdIssue = await createResponse.json();
    const issueKey = createdIssue.key;
    createdIssues.push(issueKey);

    //Arrrange - Update issue twice
    const firstUpdate = { summary: `${issuePayload.fields.summary} - update 1` };
    const updateResponse1 = await apiClient.updateIssue(issueKey, firstUpdate);
    expect(updateResponse1.status()).toBe(204);
    const secondUpdate = { summary: `${issuePayload.fields.summary} - update 2` };
    const updateResponse2 = await apiClient.updateIssue(issueKey, secondUpdate);
    expect(updateResponse2.status()).toBe(204);

    //Act
    const changelogResponse = await apiClient.getIssueChangeLog(issueKey);
    expect(changelogResponse.status()).toBe(200);

    //Assert
    const changelogBody = await changelogResponse.json();
    expect(changelogResponse.status()).toBe(200);
    expect(changelogBody.values.length).toBeGreaterThanOrEqual(2);

    const summaryChanges: IssueChangelogItem[]= changelogBody.values
        .map((value: IssueChangelogValue) => value.items)
        .flat()
        .filter((item: IssueChangelogItem) => item.field === 'summary');

    expect(summaryChanges.length).toBeGreaterThanOrEqual(2);

    //Assert summary changes
    expect(summaryChanges[0].fromString).toBe(issuePayload.fields.summary);
    expect(summaryChanges[0].toString).toBe(firstUpdate.summary);

    expect(summaryChanges[1].fromString).toBe(firstUpdate.summary);
    expect(summaryChanges[1].toString).toBe(secondUpdate.summary);
});

test('Should transition an issue to In Progress successfully', async ({ apiClient }) => {
    test.info().annotations.push({
        type: 'TestCaseId',
        description: 'JIRA-0008',
    });
    //Arrange - Create issue
    const issuePayload = new IssueBuilder().build();
    const createResponse = await apiClient.createIssue(issuePayload);
    expect(createResponse.status()).toBe(201);

    const createdIssue = await createResponse.json();
    const issueKey = createdIssue.key;
    createdIssues.push(issueKey);

    //Arrange - Get available transitions
    const transitionsResponse = await apiClient.getTransitions(issueKey);
    expect(transitionsResponse.status()).toBe(200);
    const transitionsBody = await transitionsResponse.json();
    const transitions = transitionsBody.transitions as JiraTransition[];
    const inProgress = transitions.find(t => t.to.name === 'In Progress');
    expect(inProgress, 'No transition to In Progress available').toBeDefined();

    //Act - Do the transition
    const transitionResponse = await apiClient.doTransition(issueKey, inProgress!.id);
    expect(transitionResponse.status()).toBe(204);

    //Assert - Verify the issue status
    const issueAfterTransition = await apiClient.getIssue(issueKey);
    const issueBody = await issueAfterTransition.json();
    expect(issueBody.fields.status.name).toBe('In Progress');

    //Assert - Verify the changelog for the status change
    const changelogResponse = await apiClient.getIssueChangeLog(issueKey);
    expect(changelogResponse.status()).toBe(200);
    const changelogBody: IssueChangelogResponse = await changelogResponse.json();
    const statusChanges: IssueChangelogItem[] = changelogBody.values
        .map((value: IssueChangelogValue) => value.items)
        .flat()
        .filter((item: IssueChangelogItem) => item.field === 'status');

    expect(statusChanges.length).toBeGreaterThanOrEqual(1);

    const latestStatusChange = statusChanges[statusChanges.length - 1];
    expect(latestStatusChange.toString).toBe('In Progress');

});

test.afterAll(async ({ apiClient }) => {
    for (const issueKey of createdIssues) {
        const response = await apiClient.deleteIssue(issueKey);
        if(response.status() === 204){
            console.log(`Issue ${issueKey} deleted successfully.`);
        } else {
            console.warn(`Failed to delete issue ${issueKey}. Status: ${response.status()}`);
        }
    }
});
