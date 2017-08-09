import { Component, Input } from '@angular/core';

import { Issue } from './issue';
import { IssueList } from './issue-list';
import { IssueService } from './issue-service';
import { IIssueListener } from './iissue-listener';

@Component({
	selector: 'sprint',
	templateUrl: './sprint.component.html',
	styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements IIssueListener {
	@Input()
	sprintNumber: number;
	list: IssueList = new IssueList();
	total: number;

	constructor(private issueService: IssueService) {
		this.total = 0;
		this.issueService.addListener(this);
	}

	onIssueDrop(e: any) {
		var issue = e.dragData;

		if (!issue.hours ||
			issue.hours <= 0) {
			this.issueService.announceEdit(issue);
			return;
		}

		if (this.list.exists(issue)) {
			return;
		}

		this.issueService.changeIssue(issue, {
			sprint: this.sprintNumber
		});
	}

	editIssue (issue: Issue) {
		this.issueService.announceEdit(issue);
	}

	issueChanged(old: Issue, changed: Issue) {
		if (!changed.hours ||
			changed.hours <= 0) {
			return;
		}

		if (old.sprint == this.sprintNumber && changed.sprint != this.sprintNumber) {
			if (this.list.remove(old)) {
				this.total -= old.hours;
			}
		}

		if (changed.sprint == this.sprintNumber) {
			if (old.sprint != this.sprintNumber) {
				this.list.add(changed);
				this.total += +changed.hours;
			} else {
				this.total -= old.hours;
				this.total += changed.hours;
			}
		}
	}
}
