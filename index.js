jQuery.fn.scrollTo = function(elem, speed) {
    $(this).animate({
        scrollTop:  $(this).scrollTop() - $(this).offset().top + $(elem).offset().top
    }, speed == undefined ? 1000 : speed);
    return this;
};

var issueSelecionada;

function tratarArrastarIssue(e) {
  var elemento = e.srcElement;
  while (!elemento.id || (!elemento.id.startsWith('lst') && !elemento.id.startsWith('ilst'))) {
    elemento = elemento.parentNode;
  }
  issueSelecionada = elemento.id.substring(elemento.id.startsWith('lst') ? 4 : 5);

  event.dataTransfer.setData('text/plain', issueSelecionada);
  var elemento = document.createElement('div');
  elemento.style.border = '1px solid black';
  elemento.innerText = issueSelecionada;
  e.dataTransfer.setDragImage(elemento, 0, 0);
}

function focarIssue(issue) {
  $("#lstIssues").scrollTo("#lst-" + issue, 250);
  $("#lst-" + issue).effect('highlight', {} ,3000);
}

function verificarIssue(area, tam, con) {
  if (issueSelecionada && issueSelecionada != null) {
    $("#tam-" + issueSelecionada).text(tam);
    $("#con-" + issueSelecionada).text(con);
    $("#ilst-" + issueSelecionada).remove();

    var texto = $('#txt-' + issueSelecionada).text();

    area.append('<li id="ilst-' + issueSelecionada + '" class="list-group-item issue" style="overflow-x:hidden" ' +
                'draggable="true" ondragstart="tratarArrastarIssue(event)"' +
                'onclick="focarIssue(\'' + issueSelecionada + '\')">' + issueSelecionada + ' - ' + texto + '</li>');
    issueSelecionada = null;
  }
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

  var x = createCORSRequest('GET', 'http://localhost:1337');

  x.onloadend = function() {
    if (x.status === 200 && x.readyState === 4) {
      // Optional callback for when request completes
      var retorno = JSON.parse(x.responseText);
      var issues = retorno.issues;
      for (var i = 0; i < issues.length; i++) {
        var item =
          '<div id="lst-' + issues[i].key + '" class="list-group-item issue" draggable="true" ondragstart="tratarArrastarIssue(event)">' +
          '<h4 class="list-group-item-heading">' + issues[i].key + '</h4>' +
          '<p id="txt-' + issues[i].key + '" class="list-group-item-text">' + issues[i].fields.summary + '</p>' +
          '<div style="text-align:right">' +
          '<span id="tam-' + issues[i].key + '" class="label label-primary label-as-badge">?</span>' +
          '<span id="con-' + issues[i].key + '" class="label label-danger label-as-badge" style="margin-left: 2px">?</span>' +
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
  }

  inicializarAreasDrop();
});
