export class Configuration {
	tamanhoP: number;
	tamanhoM: number;
	tamanhoG: number;

	constructor() {
		this.tamanhoP = 8;
		this.tamanhoM = 24;
		this.tamanhoG = 40;
	}

	getHours(size: string) {
		if (size == "P")
			return this.tamanhoP;
		if (size == "M")
			return this.tamanhoM;
		if (size == "G")
			return this.tamanhoG;

		return 0;
	}
}
