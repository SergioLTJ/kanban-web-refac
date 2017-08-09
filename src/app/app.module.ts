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
import { NavbarComponent } from './navbar.component';

import { Ng2DragDropModule } from 'ng2-drag-drop';

@NgModule({
	declarations: [
		AppComponent,
		IssueListComponent,
		BoardTamanhoConhecimentoComponent,
		SprintComponent,
		PopupEditComponent,
		NavbarComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		Ng2DragDropModule.forRoot(),
	],
	providers: [
		IssueService,
		ConfigurationService,
		PopupEditComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
