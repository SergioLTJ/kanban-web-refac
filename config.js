var config = {
	TAM_P: 8,
	TAM_M: 24,
	TAM_G: 40,

	PROJETO: 'SDE',
	//QUERY_BACKLOG: 'project=' + PROJETO + '+AND+type+in+(Story,Bug)+AND+status+NOT+IN+(Done,Closed)+AND+((sprint+not+in+openSprints()+and+sprint+not+in+futureSprints())+or+sprint+IS+EMPTY)+ORDER+BY+RANK+ASC&fields=key,summary',
	QUERY_BACKLOG: 'project=JSWSERVER+AND+component=AgileBoard&fields=key,summary',
	SERVER_JIRA: 'jira.senior.com.br'
};
