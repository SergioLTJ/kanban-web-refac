export class Issue {
	id: number;
	fullIdentifier: string;
	description: string;
	sprint: number;
	size: string;
	hours: number;
	knowledge: string;

	constructor(fullIdentifier?: string, description?: string) {
		if (fullIdentifier) {
			this.fullIdentifier = fullIdentifier;
			var identifier: string = fullIdentifier.split("-")[1];
			this.id = +identifier;
		}
		if (description) {
			this.description = description;
		}
	}

	copy() {
		var copy = new Issue(this.fullIdentifier, this.description);
		copy.hours = this.hours;
		copy.sprint = this.sprint;
		copy.size = this.size;
		copy.knowledge = this.knowledge;
		return copy;
	}
}
