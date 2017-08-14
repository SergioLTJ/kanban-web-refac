import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';;
import { Issue } from './issue';
import { IssueList } from './issue-list';
import { IssueParameters } from './issue-parameters';
import { IIssueListener } from './iissue-listener';
import { Response } from './response';

import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class IssueService {

	listeners: IIssueListener[] = [];
	list: IssueList = new IssueList();

	editIssueSource = new Subject<Issue>();
	editIssue$ = this.editIssueSource.asObservable();

	constructor(private http: Http) { }

	addListener (listener: IIssueListener) {
		this.listeners.push(listener);
	}

	removeListener (listener: IIssueListener) {
		for (var i = 0; i < this.listeners.length; i++) {
			if (this.listeners[i] === listener) {
				this.listeners.splice(i, 1);
				return;
			}
		}
	}

	notify (old: Issue, changed: Issue) {
		for (var i = 0; i < this.listeners.length; i++) {
			this.listeners[i].issueChanged(old, changed);
		}
	}

	applyChanges (index: number, changed: IssueParameters) {
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
		if (changed.sprint)
			this.list.get(index).sprint = changed.sprint;
	}

	changeIssue (old: Issue, changed: IssueParameters) {
		var index = this.list.getIndex(old);
		if (index > -1) {
			var unchanged = old.copy();
			this.applyChanges(index, changed);
			this.notify(unchanged, this.list.get(index));
		}
	}

	getIssues(): Observable<Issue[]> {
		return this.http
			.get('http://pcbnu001921:8081/issues/project=SDE+AND+type+in+(Story,Bug)+AND+status+NOT+IN+(Done,Closed)+AND+((sprint+not+in+openSprints()+and+sprint+not+in+futureSprints())+or+sprint+IS+EMPTY)+ORDER+BY+RANK+ASC&fields=key,summary')
			.map(response =>
				{
					var retorno = response.json();
					var issues = [];
					for (var i = 0; i < retorno.issues.length; i++) {
						var returnedIssue = retorno.issues[i];
						issues.push(new Issue(returnedIssue.key, returnedIssue.fields.summary));
					}
					this.list.issues = issues;
					return issues;
				});
	}

	createIssue(description: string): Observable<Response> {
		return this.http
			.put('http://pcbnu001921:8081/issues', JSON.stringify({ description: description }))
			.map(response =>
				{
					var retorno = response.json();
					return new Response(retorno.success, retorno.message);
				});
	}

	announceEdit(issue: Issue) {
		this.editIssueSource.next(issue);
	}
}
