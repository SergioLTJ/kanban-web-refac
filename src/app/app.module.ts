import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { IssueListComponent } from './issue-list.component';
import { BoardTamanhoConhecimentoComponent } from './board-tamanho-conhecimento.component';
import { SprintComponent } from './sprint.component'
import { IssueService } from './issue-service';
import { ConfigurationService } from './configuration-service';
import { PopupEditComponent } from './popup-edit.component';
import { BreakIssueComponent } from './break-issue.component';
import { NavbarComponent } from './navbar.component';
import { HtmlExporter } from './html-exporter';
import { JsonExporter } from './json-exporter';
import { ExportFactory } from './export-factory';
import { FileService } from './file-service';

import { Ng2DragDropModule } from 'ng2-drag-drop';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
	declarations: [
		AppComponent,
		IssueListComponent,
		BoardTamanhoConhecimentoComponent,
		SprintComponent,
		PopupEditComponent,
		NavbarComponent,
		BreakIssueComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		Ng2DragDropModule.forRoot(),
		SimpleNotificationsModule.forRoot(),
	],
	providers: [
		IssueService,
		ConfigurationService,
		PopupEditComponent,
		HtmlExporter,
		JsonExporter,
		ExportFactory,
		FileService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
