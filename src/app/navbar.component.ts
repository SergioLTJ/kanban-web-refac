import { Component } from '@angular/core';

import { IssueService } from './issue-service';

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
	issueName: string;

	constructor(private issueService: IssueService) { }

	criarIssue() {
		this.issueService
			.createIssue(this.issueName)
			.subscribe(response =>
			{
				if (!response.success) {
					// Deveria mostrar mensagem
				} else {
					// Também deveria mostrar mensagem
					
				}
			});
	}
}
