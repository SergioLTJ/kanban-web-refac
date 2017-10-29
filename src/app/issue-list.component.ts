import { Component, OnInit } from '@angular/core';

import { Issue } from './issue';
import { IssueList } from './issue-list';
import { IssueService } from './issue-service';
import { IIssueListener } from './iissue-listener';

import { PopupEditComponent } from './popup-edit.component';

@Component({
  selector: 'issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.css']
})
export class IssueListComponent implements OnInit, IIssueListener {

	list: IssueList = new IssueList();

	loading: boolean;

	constructor(private issueService: IssueService) {
		this.issueService.addListener(this);
	}

	ngOnInit(): void {
		this.loading = true;
		this.getIssues();
	}

	getIssues(): void {
		this.issueService
			.getIssues()
			.subscribe(issues =>
				{
					this.list.issues = issues;
					this.loading = false;
				});
	}

	issueChanged (old: Issue, changed: Issue) {
		if (this.list.exists(changed)) {
			this.list.replace(changed);
		} else {
			this.list.add(changed);
		}
	}

	abrirPopup (issue: Issue) {
		this.issueService.announceEdit(issue);
	}

	quebrarIssue(issue: Issue) {
		this.issueService.breakIssueSource.next(issue);
	}

	moverIssue(evento: any, referencia: Issue) {
		var movida = evento.dragData;
		this.issueService.moveIssue(movida, referencia);
	}
}
