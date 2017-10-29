import { Component } from '@angular/core';

import { IssueService } from './issue-service';
import { FileService } from './file-service';

import { Issue } from './issue';

@Component({
	selector: 'navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
	issueName: string;

	constructor(
		private issueService: IssueService,
		private fileService: FileService) { }

	criarIssue() {
		this.issueService
			.createIssue(this.issueName)
			.subscribe();
	}

	recarregarIssues() {
		this.issueService.getIssues().subscribe();
	}

	exportarBoard(formato: string) {
		this.issueService.export(formato);
	}

	importar($event) {
		var inputValue = $event.target;
		var file: File = inputValue.files[0];
		var myReader: FileReader = new FileReader();

		var that = this;

		myReader.onloadend = function(e) {
			var issues = JSON.parse(myReader.result);
			that.issueService.import(issues);
		}

		myReader.readAsText(file);
	}

	zueira() {
		window.open("https://media.giphy.com/media/LXONhtCmN32YU/giphy.gif");
	}
}
