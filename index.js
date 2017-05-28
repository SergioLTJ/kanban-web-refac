// https://tc39.github.io/ecma262/#sec-array.prototype.includes
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function(searchElement, fromIndex) {

      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        // c. Increase k by 1.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }

      // 8. Return false
      return false;
    }
  });
}

var issueSelecionada;
var issues = {};
var issuesSprint = [
	null,
	[ ],
	[ ],
	[ ],
	[ ],
	[ ],
	[ ]
];

function tratarArrastarIssue(e) {
	var elemento = e.srcElement;

	while (!elemento.id || (!elemento.id.startsWith('lst') && !elemento.id.startsWith('ilst'))) {
		elemento = elemento.parentNode;
	}

	issueSelecionada = elemento.id.substring(elemento.id.startsWith('lst') ? 4 : 5);

	event.dataTransfer.setData('text/plain', issueSelecionada);

	var divExterna = document.createElement('div');
	divExterna.id = 'del-' + issueSelecionada;
	divExterna.style.width = '300px';
	divExterna.style.textAlign = 'center';
	var listaExterna = document.createElement('ul');
	listaExterna.classList.add('list-group');
	listaExterna.classList.add('full-height');
	divExterna.append(listaExterna);
	var elemento = document.createElement('li');
	elemento.classList.add('list-group-item');
	elemento.classList.add('issue');
	elemento.innerText = issueSelecionada;
	listaExterna.append(elemento);

	document.body.append(divExterna);
	e.dataTransfer.setDragImage(divExterna, 140, 20);
}

function focarIssue(issue) {
	$("#lstIssues").scrollTo("#lst-" + issue, 250);
	$("#lst-" + issue).effect('highlight', {}, 3000);
}

function verificarIssue(area, con, tam, horas) {
	if (issueSelecionada != null) {
		var tempo = horas != null ? parseInt(horas) : config['TAM_' + tam];

		$("#tam-" + issueSelecionada).text(tam);
		$("#hor-" + issueSelecionada).text(tempo + 'h');
		$("#con-" + issueSelecionada).text(con);
		$("#ilst-" + issueSelecionada).remove();

		if (!issues[issueSelecionada]) issues[issueSelecionada] = {};
		issues[issueSelecionada].tempo = tempo;

		var texto = $('#txt-' + issueSelecionada).text();

		area.append(
			'<li id="ilst-' + issueSelecionada + '" class="list-group-item issue" style="overflow-x:hidden" ' +
			'draggable="true" ondragstart="tratarArrastarIssue(event)"' +
			'onclick="abrirModalEdicao(\'' + issueSelecionada + '\')">' + issueSelecionada + ' - ' + texto + '</li>');

		$("#del-" + issueSelecionada).remove();

		if (issues[issueSelecionada].sprint) {
			atualizarSprint(issues[issueSelecionada].sprint);
		}

		issueSelecionada = null;
	}
}

function adicionarIssueSprint(sprint, issue) {
	if (issue && issue != null && !issuesSprint[sprint].includes(issue)) {
		if (!issues[issue]) {
			abrirModalEdicao(issue);
			return;
		}

		var sprintAnterior = issues[issue].sprint;
		issuesSprint[sprint].push(issue);
		issues[issue].sprint = sprint;
		$("#spr-" + issue).text('SP' + sprint);
		atualizarSprint(sprint);

		if (sprintAnterior) {
			var indice = issuesSprint[sprintAnterior].indexOf(sprint);
			issuesSprint[sprintAnterior].splice(indice, 1);
			atualizarSprint(sprintAnterior);
		}

		$("#del-" + issue).remove();
	}
}

function atualizarSprint(sprint) {
	let issuesSprintEditada = issuesSprint[sprint];

	var tbody = $("#tblS" + sprint + " tbody");
	tbody.empty();

	var totalizador = 0;

	for (var i = 0; i < issuesSprintEditada.length; i++) {
		var issue = issuesSprintEditada[i];
		var texto =  $('#txt-' + issue).text();
		var tempo = issues[issue].tempo;

		totalizador += tempo;

		tbody.append(
			'<tr><td style="cursor: pointer" onclick="abrirModalEdicao(\'' + issue + '\')">' + issue + ' - ' + texto +  '</td><td>' + tempo  + 'h</td></tr>');
	}

	tbody.append('<tr><td>Total</td><td>' + totalizador + 'h</td></tr>');
}

function abrirModalEdicao(issue) {
	var tamanhoIssue = $("#tam-" + issue).text();
	var conhecimentoIssue = $("#con-" + issue).text();
	var horasIssue = $("#hor-" + issue).text().replace('h', '');

	$("#modalTituloIssue").text(issue);

	if (tamanhoIssue != '?') selecionarRadioTamanho(tamanhoIssue);
	if (conhecimentoIssue != '?') selecionarRadioConhecimento(conhecimentoIssue);
	if (horasIssue != '?') $("#modalHoras").val(horasIssue);

	for (var i = 1; i < issuesSprint.length; i++) {
		if (issuesSprint[i].includes(issue)) {
			$("#modalSprint").val(i);
		}
	}

	$("#modalEdicao").modal('show');
}

function selecionarRadioTamanho(tamanho) {
	$("#modalTamP").prop('checked', false);
	$("#modalTamM").prop('checked', false);
	$("#modalTamG").prop('checked', false);

	$("#modalTam" + tamanho).prop('checked', true);
}

function selecionarRadioConhecimento(conhecimento) {
	$("#modalConA").prop('checked', false);
	$("#modalConM").prop('checked', false);
	$("#modalConB").prop('checked', false);

	$("#modalCon" + conhecimento).prop('checked', true);
}

function atualizarHoras(tamanho) {
	$("#modalHoras").val(config['TAM_' + tamanho]);
}

function atualizarTamanho() {
	var tamanhoP = config.TAM_P;
	var tamanhoM = config.TAM_M;
	var tamanhoG = config.TAM_G;

	var horas = $("#modalHoras").val();

	if (horas == '') {
		selecionarRadioTamanho('P');
	} else {
		var diferencaP = Math.abs(horas - tamanhoP);
		var diferencaM = Math.abs(horas - tamanhoM);
		var diferencaG = Math.abs(horas - tamanhoG);
		if (diferencaP <  diferencaM) {
			selecionarRadioTamanho('P');
		} else if (diferencaM < diferencaG) {
			selecionarRadioTamanho('M');
		} else {
			selecionarRadioTamanho('G');
		}
	}
}

function salvarIssue() {
	var horas = $("#modalHoras").val();
	if (horas != '' && horas != 0) {
		var issue = $("#modalTituloIssue").text();
		var tamanho = $("input[name='modalTam']:checked").val();
		var conhecimento = $("input[name='modalCon']:checked").val();
		var sprint = $("#modalSprint").val();
		atualizarIssue(issue, tamanho, conhecimento, horas, sprint);
		reiniciarModal();
		$("#modalEdicao").modal('toggle');
	}
}

function reiniciarModal() {
	selecionarRadioTamanho('P');
	selecionarRadioConhecimento('A');
	$("#modalHoras").val(0);
	$("#modalSprint").val('1');
}

function atualizarIssue(issue, tamanho, conhecimento, horas, sprint) {
	issueSelecionada = issue;

	var sprintAnterior;
	if (issues[issue]) {
		sprintAnterior = issues[issue].sprint;
	}

	var listaIssue = $("#lstCon" + conhecimento + "Tam"  + tamanho);

	verificarIssue(listaIssue, conhecimento, tamanho, horas);

	if (sprintAnterior) {
		var indice = issuesSprint[sprintAnterior].indexOf(issue);
		issuesSprint[sprintAnterior].splice(indice, 1);
		atualizarSprint(sprintAnterior);
	}

	adicionarIssueSprint(sprint, issue);
}

$(function() {

	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {

			// Check if the XMLHttpRequest object has a "withCredentials" property.
			// "withCredentials" only exists on XMLHTTPRequest2 objects.
			xhr.open(method, url, true);

		} else if (typeof XDomainRequest != "undefined") {

			// Otherwise, check if XDomainRequest.
			// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
			xhr = new XDomainRequest();
			xhr.open(method, url);

		} else {

			// Otherwise, CORS is not supported by the browser.
			xhr = null;

		}
		return xhr;
	}

	var x = createCORSRequest('GET', 'http://localhost:8081/issues/' + config.QUERY_BACKLOG);

	x.onloadend = function() {
		if (x.status === 200 && x.readyState === 4) {
			// Optional callback for when request completes
			var retorno = JSON.parse(x.responseText);
			var issues = retorno.issues;
			for (var i = 0; i < issues.length; i++) {
				var item =
					'<div id="lst-' + issues[i].key + '" class="list-group-item issue" draggable="true" onclick="abrirModalEdicao(\'' + issues[i].key + '\')" ondragstart="tratarArrastarIssue(event)">' +
					'<h4 class="list-group-item-heading">' + issues[i].key + '</h4>' +
					'<p id="txt-' + issues[i].key + '" class="list-group-item-text">' + issues[i].fields.summary + '</p>' +
					'<div style="text-align:right">' +
					'<span id="con-' + issues[i].key + '" class="label label-danger label-as-badge">?</span>' +
					'<span id="tam-' + issues[i].key + '" class="label label-primary label-as-badge" style="margin-left: 2px">?</span>' +
					'<span id="hor-' + issues[i].key + '" class="label label-info label-as-badge" style="margin-left: 2px">?</span>' +
					'<span id="spr-' + issues[i].key + '" class="label label-success label-as-badge" style="margin-left: 2px">?</span>' +
					'</div>' +
					'</div>';
				$("div.list-group").append(item);
			}
		}
	}

	x.send();

	function inicializarAreasDrop() {
		$(".dropIssue").each(function(index) {
			$(this).on('dragover', false);
		});

		$("#conATamP").on('drop', function(event) {
			verificarIssue($('#lstConATamP'), 'A', 'P');
		});
		$("#conATamM").on('drop', function(event) {
			verificarIssue($('#lstConATamM'), 'A', 'M');
		});
		$("#conATamG").on('drop', function(event) {
			verificarIssue($('#lstConATamG'), 'A', 'G');
		});
		$("#conMTamP").on('drop', function(event) {
			verificarIssue($('#lstConMTamP'), 'M', 'P');
		});
		$("#conMTamM").on('drop', function(event) {
			verificarIssue($('#lstConMTamM'), 'M', 'M');
		});
		$("#conMTamG").on('drop', function(event) {
			verificarIssue($('#lstConMTamG'), 'M', 'G');
		});
		$("#conBTamP").on('drop', function(event) {
			verificarIssue($('#lstConBTamP'), 'B', 'P');
		});
		$("#conBTamM").on('drop', function(event) {
			verificarIssue($('#lstConBTamM'), 'B', 'M');
		});
		$("#conBTamG").on('drop', function(event) {
			verificarIssue($('#lstConBTamG'), 'B', 'G');
		});

		$("#S1").on('drop', function(event) {
			adicionarIssueSprint(1, issueSelecionada);
		});
		$("#S2").on('drop', function(event) {
			adicionarIssueSprint(2, issueSelecionada);
		});
		$("#S3").on('drop', function(event) {
			adicionarIssueSprint(3, issueSelecionada);
		});
		$("#S4").on('drop', function(event) {
			adicionarIssueSprint(4, issueSelecionada);
		});
		$("#S5").on('drop', function(event) {
			adicionarIssueSprint(5, issueSelecionada);
		});
		$("#S6").on('drop', function(event) {
			adicionarIssueSprint(6, issueSelecionada);
		});
	}

	inicializarAreasDrop();
});
