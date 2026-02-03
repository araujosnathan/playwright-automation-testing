import { JSONSchemaType } from 'ajv';

type JiraIssueResponse = {
  id: string;
  key: string;
  self: string;
};

export const issueSchemaResponse: JSONSchemaType<JiraIssueResponse> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    key: { type: 'string' },
    self: { type: 'string' },
  },
  required: ['id', 'key', 'self'], // It could be improved by adding more required fields, but for this example, these are sufficient
  additionalProperties: true
};
