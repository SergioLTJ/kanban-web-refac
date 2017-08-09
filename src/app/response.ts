export class Response {
	success: boolean;
	message: string;

	constructor(success: boolean, message?: string) {
		this.success = success;
		if (message) {
			this.message = message;
		}
	}
}
