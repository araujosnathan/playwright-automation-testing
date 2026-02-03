export interface JiraTransition {
  id: string;
  name: string;
  to: {
    id: string;
    name: string;
    statusCategory: {
      id: number;
      key: string;
      name: string;
      colorName: string;
    };
  };
}

export interface JiraTransitionRequest {
  transition: {
    id: string;
  };
}

export interface JiraTransitionsResponse {
  transitions: JiraTransition[];
}
