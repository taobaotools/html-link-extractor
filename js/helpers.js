/* Change inner html of a DOM element */
function setHTML(elementName, html) {
    document.getElementById(elementName).innerHTML = html;
}

/* Set message */
function setMessage(text) {
    document.getElementById('message').style.color = 'black';
    setDisplay('message', true);
    setHTML('message', text);
}

/* Set error message */
function setError(text) {
    setDisplay('loading', false);
    setMessage(text);
    document.getElementById('message').style.color = 'red';
}

/* English Grammar */
function linkOrLinks(count) {
    return count == 1 ? ' link.' : ' links.';
}

function isValidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return pattern.test(str);
}

function setDisplay(name, visibility) {
    document.getElementById(name).style.display = visibility ? 'unset' : 'none';
}

function getErrorMessage(jqXHR, exception) {
    var message = '';
    if (jqXHR.status === 0) {
        message = 'Could not connect - please try extract by HTML.';
    } else if (jqXHR.status == 404) {
        message = 'Content not found (404).';
    } else if (jqXHR.status == 500) {
        message = 'Internal Server Error (500).';
    } else if (exception === 'parsererror') {
        message = 'Requested JSON parse failed.';
    } else if (exception === 'timeout') {
        message = 'Time out error.';
    } else if (exception === 'abort') {
        message = 'Ajax request aborted.';
    } else {
        message = 'Uncaught Error. ' + jqXHR.responseText;
    }
    return message;
}


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
