import {Injectable} from '@angular/core';
import {Issue} from './issue';

import {IExporter} from './iexporter';
import {HtmlExporter} from './html-exporter';
import {JsonExporter} from './json-exporter';

@Injectable()
export class ExportFactory {
	constructor(
		private htmlExporter : HtmlExporter,
		private jsonExporter : JsonExporter) { }

	createExporter(format: string) : IExporter {
		if (format == 'html') {
			return this.htmlExporter;
		}

		return this.jsonExporter;
	}
}
