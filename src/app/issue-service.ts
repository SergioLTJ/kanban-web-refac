import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';;
import { Issue } from './issue';
import { IssueList } from './issue-list';
import { IssueParameters } from './issue-parameters';
import { IIssueListener } from './iissue-listener';
import { Response } from './response';

import { FileService } from './file-service';
import { ExportFactory } from './export-factory';

import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class IssueService {

	listeners: IIssueListener[] = [];
	list: IssueList = new IssueList();

	editIssueSource = new Subject<Issue>();
	editIssue$ = this.editIssueSource.asObservable();

	query = 'http://localhost:8081/issues/project=JSWSERVER+AND+type+in+(Story,Bug)+AND+status+NOT+IN+(Done,Closed)+AND+((sprint+not+in+openSprints()+and+sprint+not+in+futureSprints())+or+sprint+IS+EMPTY)+ORDER+BY+RANK+ASC&fields=key,summary,description&expand=renderedFields';

	constructor(private http: Http,
		private exportFactory: ExportFactory) { }

	addListener(listener: IIssueListener) {
		this.listeners.push(listener);
	}

	removeListener(listener: IIssueListener) {
		for (var i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] === listener) {
				this.listeners.splice(i, 1);
				return;
			}
		}
	}

	notify(old: Issue, changed: Issue) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].issueChanged(old, changed);
		}
	}

	applyChanges(index: number, changed: IssueParameters) {
		if (changed.id)
			this.list.get(index).id = changed.id;
		if (changed.description)
			this.list.get(index).description = changed.description;
		if (changed.fullIdentifier)
			this.list.get(index).fullIdentifier = changed.fullIdentifier;
		if (changed.hours)
			this.list.get(index).hours = changed.hours;
		if (changed.knowledge)
			this.list.get(index).knowledge = changed.knowledge;
		if (changed.size)
			this.list.get(index).size = changed.size;
		if (changed.sprint) {
			this.list.get(index).sprint = changed.sprint == -1 ? null : changed.sprint;
		}
	}

	changeIssue(old: Issue, changed: IssueParameters) {
		var index = this.list.getIndex(old);
		if (index > -1) {
			var unchanged = old.copy();
			this.applyChanges(index, changed);
			this.notify(unchanged, this.list.get(index));
		}
	}

	getIssues(): Observable<Issue[]> {
		return this.http
			.get(this.query)
			.map(response => {
				var retorno = response.json();
				var issues = [];
				for (var i = 0; i < retorno.issues.length; i++) {
					var returnedIssue = retorno.issues[i];
					issues.push(new Issue(returnedIssue.key, returnedIssue.fields.summary, returnedIssue.renderedFields.description));
				}
				this.list.issues = issues;
				return issues;
			});
	}

	updateIssues(): Observable<Issue[]> {
		return this.http
			.get(this.query)
			.map(response => {
				var retorno = response.json();
				var currentIssues = this.list;
				this.list = new IssueList();
				var newIssues = [];
				for (var i = 0; i < retorno.issues.length; i++) {
					var returnedIssue = retorno.issues[i];
					if (currentIssues.existsId(returnedIssue.key)) {
						newIssues.push(currentIssues.getById(returnedIssue.key));
					} else {
						var newIssue = new Issue(returnedIssue.key, returnedIssue.fields.summary, returnedIssue.renderedFields.description);
						this.list.add(newIssue)
						newIssues.push(newIssue);
						this.notify(new Issue(), newIssue);
					}
				}
				this.list.issues = newIssues;

				return newIssues;
			});
	}

	createIssue(description: string): Observable<Response> {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http
			.put('http://localhost:8081/issues', JSON.stringify({ description: description }), { headers: headers })
			.map(response => {
				var retorno = response.json();
				return new Response(retorno.success, retorno.message);
			});
	}

	moveIssue(changed: Issue, reference: Issue) {
		this.list.moveTo(changed, reference);
	}

	announceEdit(issue: Issue) {
		this.editIssueSource.next(issue);
	}

	export(format: string) {
		var exporter = this.exportFactory.createExporter(format);
		exporter.export(this.list.issues);
	}

	import(issues: Issue[]) {
		this.list.issues = [];
		var baseIssue = new Issue();
		for (var i = 0; i < issues.length; i++) {
			var imported = issues[i];
			var newIssue = new Issue(imported.fullIdentifier, imported.description);
			newIssue.sprint = imported.sprint;
			newIssue.size = imported.size;
			newIssue.hours = imported.hours;
			newIssue.knowledge = imported.knowledge;
			this.list.issues.push(newIssue);
			this.notify(baseIssue, newIssue);
		}
	}
}
