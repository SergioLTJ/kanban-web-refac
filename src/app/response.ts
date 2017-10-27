export class Response {
	success: boolean;
	message: string;
	issueName: string;

	constructor(success: boolean, message?: string, issueName?: string) {
		this.success = success;
		if (message) {
			this.message = message;
		}
		if (issueName) {
			this.issueName = issueName;
		}			
	}
}
