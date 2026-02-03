import { randomUUID } from "crypto";
import { IssuePayload } from "../interfaces/issue-payload";

export class IssueBuilder {
  private payload: IssuePayload;

  constructor() {
    this.payload = {
      fields: {
        project: { key: 'DEV' },
        summary: `Issue created - ${randomUUID()}`,
        description: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This issue was created for testing purposes.',
                },
              ],
            },
          ],
        },
        issuetype: { name: 'Task' },
      },
    };
  }

  withProjectKey(key: string) {
    this.payload.fields.project.key = key;
    return this;
  }

  withSummary(summary: string) {
    this.payload.fields.summary = summary;
    return this;
  }

  withDescription(text: string) {
    this.payload.fields.description.content = [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text,
          },
        ],
      },
    ];
    return this;
  }

  withIssueType(name: string) {
    this.payload.fields.issuetype.name = name;
    return this;
  }

  build(): IssuePayload {
    return this.payload;
  }
}