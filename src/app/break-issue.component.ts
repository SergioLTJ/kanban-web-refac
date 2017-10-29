import { Component, OnInit } from '@angular/core';

import { Issue } from './issue';
import { IssueService } from './issue-service';

import { PopupEditComponent } from './popup-edit.component';

declare var $: any;

@Component({
  selector: 'break-issue',
  templateUrl: './break-issue.component.html',
  styleUrls: ['./break-issue.component.css']
})
export class BreakIssueComponent {
	issues: string[];
	parentIssue: Issue;

	constructor(private issueService: IssueService,) {
		this.parentIssue = new Issue();
		this.issues = [];
		this.issueService.breakIssue$.subscribe(issue => { this.mostrar(issue); });
	}

	mostrar(issue: Issue) {
		this.issues = [ '' ];
		this.parentIssue = issue;

		$("#modalQuebrar").modal('show');
	}

	currentIssueHasName() {
		return /\S/.test(this.issues[this.issues.length - 1]);
	}

	issueHasName(issue: string) {
		return /\S/.test(issue);
	}

	addIssue() {
		this.issues.push('');
	}

	allIssuesHaveNames() {
		for (var i = 0; i < this.issues.length; i++) {
			if (!/\S/.test(this.issues[i])) {
				return false;
			}
		}

		return true;
	}

	createIssues() {
		for (var i = 0; i < this.issues.length; i++) {
			this.issueService
				.createIssue(this.issues[i])
				.subscribe();
		}

		$("#modalQuebrar").modal('toggle');
	}

	trackByFn(index: any, item: any) {
   		return index;
	}
}
