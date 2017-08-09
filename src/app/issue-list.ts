import { Issue } from './issue';

export class IssueList {
	issues: Issue[] = [];

	add (issue: Issue) {
		this.issues.push(issue);
	}

	remove (issue: Issue) : boolean {
		var index = this.getIndex(issue);
		if (index > -1) {
			this.issues.splice(index, 1);
			return true;
		}
		return false;
	}

	addIfNotExists (issue: Issue) : boolean {
		if (this.exists(issue)) {
			return false;
		}
		this.issues.push(issue);
		return true;
	}

	replace (old: Issue, changed: Issue) {
		var index = this.getIndex(old);
		if (index > -1) {
			this.issues[index] = changed;
		}
	}

	getIndex (issue: Issue) : number {
		for (var i = 0; i < this.issues.length; i++) {
			if (issue.id == this.issues[i].id) {
				return i;
			}
		}
		return -1;
	}

	exists (issue: Issue) {
		var index = this.getIndex(issue);
		return index > -1;
	}

	get (index: number) {
		return this.issues[index];
	}

	removeById (id: number) {
		var issue = new Issue();
	}
}
