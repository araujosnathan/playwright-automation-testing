export interface IssuePayload{
  fields: {
    project: { key: string };
    summary: string;
    description: {
      type: 'doc';
      version: number;
      content: Array<{
        type: string;
        content: Array<{ type: string; text: string }>;
      }>;
    };
    issuetype: { name: string };
  };
};