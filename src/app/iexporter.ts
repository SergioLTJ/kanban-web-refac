import {Issue} from './issue';

export interface IExporter {
	export(issues: Issue[]);
}
