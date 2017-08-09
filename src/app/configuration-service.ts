import { Injectable } from '@angular/core';

import { Configuration } from './configuration';

@Injectable()
export class ConfigurationService {
	getConfiguration() {
		return new Configuration();
	}	
}
