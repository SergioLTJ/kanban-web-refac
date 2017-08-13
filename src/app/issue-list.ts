import { Issue } from './issue';

export class IssueList {
	issues: Issue[] = [];

	add(issue: Issue) {
		this.issues.push(issue);
	}

	remove(issue: Issue): boolean {
		var index = this.getIndex(issue);
		if (index > -1) {
			this.issues.splice(index, 1);
			return true;
		}
		return false;
	}

	addIfNotExists(issue: Issue): boolean {
		if (this.exists(issue)) {
			return false;
		}
		this.issues.push(issue);
		return true;
	}

	replace(changed: Issue) {
		var index = this.getIndex(changed);
		if (index > -1) {
			this.issues[index] = changed;
		}
	}

	getIndex(issue: Issue): number {
		for (var i = 0; i < this.issues.length; i++) {
			if (issue.id == this.issues[i].id) {
				return i;
			}
		}
		return -1;
	}

	getIndexById(fullIdentifier: string): number {
		for (var i = 0; i < this.issues.length; i++) {
			if (fullIdentifier == this.issues[i].fullIdentifier) {
				return i;
			}
		}
		return -1;
	}

	exists(issue: Issue) {
		var index = this.getIndex(issue);
		return index > -1;
	}

	existsId(fullIdentifier: string) {
		var index = this.getIndexById(fullIdentifier);
		return index > -1;
	}

	moveTo(changed: Issue, reference: Issue) {
		var index = this.getIndex(changed);
		var newIndex = this.getIndex(reference);

		if (index == newIndex) return;

		this.move(index, newIndex);
	}

	move (from: number, to: number) {
		this.issues.splice(to, 0, this.issues.splice(from, 1)[0]);
	};

	get(index: number) {
		return this.issues[index];
	}
}
