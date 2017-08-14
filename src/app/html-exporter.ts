import {Injectable} from '@angular/core';

import {Issue} from './issue';
import {IExporter} from './iexporter';

import {FileService} from './file-service';

@Injectable()
export class HtmlExporter implements IExporter {

	constructor(private fileService: FileService) { }

	export(issues: Issue[]) {
		var html = `<head>
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
		</head>
		<body>
			<div class="container">`;

		html += this.gerarIssuesSprint(issues, 1);
		html += this.gerarIssuesSprint(issues, 2);
		html += this.gerarIssuesSprint(issues, 3);
		html += this.gerarIssuesSprint(issues, 4);
		html += this.gerarIssuesSprint(issues, 5);
		html += this.gerarIssuesSprint(issues, 6);

		var issuesSemSprint = this.obterIssuesSemSprint(issues);
		html += `<h3>Issues sem Sprint</h3>`;
		html += this.gerarTabelaIssues(issuesSemSprint);

		html += `
			</div>
		</body>`

		this.fileService.downloadFile(html, 'issues.html', 'text/html');
	}

	gerarIssuesSprint(issues: Issue[], sprint: number): string {
		var issuesSprint = this.obterIssuesPorSprint(issues, sprint);
		var html = `
		<h3>Sprint ${sprint}</h3>`;
		html += this.gerarTabelaIssues(issuesSprint);
		return html;
	}

	gerarTabelaIssues(issues: Issue[]): string {
		var htmlIssues = `
		<table class="table table-bordered">
		<tr>
			<th>ID</th>
			<th>Título</th>
			<th>Sprint</th>
			<th>Tamanho</th>
			<th>CT</th>
			<th>Horas</th>
		</tr>`;

		for (var i = 0; i < issues.length; i++) {
			var item = issues[i];
			htmlIssues += `
			<tr>
				<td>${item.fullIdentifier}</td>
				<td>${item.description}</td>
				<td>SP${item.sprint}</td>
				<td>${item.size}</td>
				<td>${item.knowledge}</td>
				<td>${item.hours}hrs</td>
			</tr>`;
		}

		htmlIssues += `
		</table>`;

		return htmlIssues;
	}

	obterIssuesPorSprint(issues: Issue[], sprint: number): Issue[] {
		var issuesSprint = [];
		for (var i = 0; i < issues.length; i++) {
			if (issues[i].sprint == sprint) {
				issuesSprint.push(issues[i]);
			}
		}
		return issuesSprint;
	}

	obterIssuesSemSprint(issues: Issue[]): Issue[] {
		var issuesSemSprint = [];
		for (var i = 0; i < issues.length; i++) {
			if (!issues[i].sprint ||
				issues[i].sprint == null) {
				issuesSemSprint.push(issues[i]);
			}
		}
		return issuesSemSprint;
	}
}
