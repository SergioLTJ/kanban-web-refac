import { Issue } from './issue';

export interface IIssueListener {
	issueChanged(old: Issue, changed: Issue);
}
