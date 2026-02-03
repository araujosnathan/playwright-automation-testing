export interface IssueChangelogAuthor {
  self: string;
  accountId: string;
  emailAddress: string;
  displayName: string;
  active: boolean;
  timeZone: string;
  accountType: string;
  avatarUrls: Record<string, string>;
}

export interface IssueChangelogItem {
  field: string;
  fieldtype: string;
  fieldId: string;
  from: string | null;
  fromString: string | null;
  to: string | null;
  toString: string | null;
}

export interface IssueChangelogValue {
  id: string;
  author: IssueChangelogAuthor;
  created: string;
  items: IssueChangelogItem[];
}

export interface IssueChangelogResponse {
  self: string;
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: IssueChangelogValue[];
}
