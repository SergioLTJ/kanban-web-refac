import {Injectable} from '@angular/core';

import {Issue} from './issue';
import {IExporter} from './iexporter';

import {FileService} from './file-service';

@Injectable()
export class HtmlExporter implements IExporter {

	constructor(private fileService: FileService) { }

	export(issues: Issue[]) {
	}
}
