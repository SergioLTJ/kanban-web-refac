import { Component } from '@angular/core';

import { Issue } from './issue';
import { IssueList } from './issue-list';
import { IIssueListener } from './iissue-listener';
import { IssueService } from './issue-service';
import { ConfigurationService } from './configuration-service';

@Component({
	selector: 'board-tamanho-conhecimento',
	templateUrl: './board-tamanho-conhecimento.component.html',
	styleUrls: ['./board-tamanho-conhecimento.component.css']
})
export class BoardTamanhoConhecimentoComponent implements IIssueListener {
	boards: any;

	constructor (private issueService: IssueService,
	             private configurationService: ConfigurationService) {
		this.boards = {};
		this.boards.P = this.inicializarLinha();
		this.boards.M = this.inicializarLinha();
		this.boards.G = this.inicializarLinha();
		this.issueService.addListener(this);
	}

	inicializarLinha () {
		var linha: any;
		linha = {};
		linha.A = new IssueList();
		linha.M = new IssueList();
		linha.B = new IssueList();
		return linha;
	}

	validarRemocaoExistente (idIssue: number, tamanho: string, conhecimentoTecnico: string) {
		if (tamanho && conhecimentoTecnico) {
			var lista = this.boards[tamanho][conhecimentoTecnico];
			lista.removeById(idIssue);
		}
	}

	onItemDrop (e: any, tamanho: string, conhecimentoTecnico: string) {
		var configuration = this.configurationService.getConfiguration();

		var issue = e.dragData;
		this.validarRemocaoExistente(issue.id, issue.size, issue.knowledge);
		this.issueService.changeIssue(issue, {
			knowledge: conhecimentoTecnico,
			size: tamanho,
			hours: configuration.getHours(tamanho)
		});

		var lista = this.boards[tamanho][conhecimentoTecnico];
		lista.addIfNotExists(issue);
	}

	editIssue (issue: Issue) {
		this.issueService.announceEdit(issue);
	}

	issueChanged (old: Issue, changed: Issue) {
		if (old.size && old.knowledge) {
			var listaAtual = this.boards[old.size][old.knowledge];
			listaAtual.remove(old);
		}

		this.boards[changed.size][changed.knowledge].add(changed);
	}
}
