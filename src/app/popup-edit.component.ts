import { Component } from '@angular/core';

import { Issue } from './issue';
import { IssueService } from './issue-service';
import { ConfigurationService } from './configuration-service';
import { Configuration } from './configuration';

declare var $: any;

@Component({
	selector: 'popup-edit',
	templateUrl: './popup-edit.component.html',
	styleUrls: ['./popup-edit.component.css']
})
export class PopupEditComponent {

	issue: Issue;
	unchanged: Issue;
	config: Configuration;

	constructor(private issueService: IssueService,
				private configurationService: ConfigurationService)
	{
		this.issue = new Issue();
		this.issueService.editIssue$.subscribe(issue => { this.mostrar(issue); });
		this.config = this.configurationService.getConfiguration();
	}

	mostrar(issue: Issue) {
		this.unchanged = issue.copy();
		this.issue = issue;
		$("#modalEdicao").modal('show');
	}

	salvarIssue() {
		this.issueService.notify(this.unchanged, this.issue);
		$("#modalEdicao").modal('toggle');
	}

	trocarHoras() {
		switch (this.issue.size) {
			case 'P':
				this.issue.hours = this.config.tamanhoP;
				break;
			case 'M':
				this.issue.hours = this.config.tamanhoM;
				break;
			case 'G':
				this.issue.hours = this.config.tamanhoG;
				break;
		}
	}

	trocarTamanho() {
		var hours = this.issue.hours;
		if (hours <= 0) {
			this.issue.size = 'P';
		} else {
			var diferencaP = Math.abs(hours - this.config.tamanhoP);
			var diferencaM = Math.abs(hours - this.config.tamanhoM);
			var diferencaG = Math.abs(hours - this.config.tamanhoG);
			if (diferencaP < diferencaM) {
				this.issue.size = 'P';
			} else if (diferencaM < diferencaG) {
				this.issue.size = 'M';
			} else {
				this.issue.size = 'G';
			}
		}
	}
}
