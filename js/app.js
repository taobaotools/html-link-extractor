// Global variables :O
var links = [];

/* Process after click on extract button */
function extract() {
    // Get the url, if it is invalid output a message
    var url = document.getElementById('url').value;
    if (url != '' && !isValidURL(url)) {
        setHTML('message', 'Please enter a valid URL!');
        document.getElementById('url').value = '';
        return;
    }

    if (url != '') {
        if (url.substring(0, 4) != 'http')
            url = 'http://' + url;
        setHTML('message', 'Getting HTML at the given URL. Please wait...');
        setDisplay('loading', true);
        $.ajax({
            url: url,
            type: 'GET',
            success: function(res) {
                // Call helper function with the response HTML
                setDisplay('loading', false);
                if (res.responseText == '') {
                    setHTML('message', 'URL couldn\'t be processed. Please extract by HTML.');
                } else {
                    helper(res.responseText);
                }
            }
        });
    } else {
        // Call helper function with given HTML in text area
        helper(document.getElementById('content').value);
    }
}

/* Main helper function */
function helper(html) {
    // Get HTML and create links list
    links = [];
    var httpOnly = document.getElementById('httpCheckbox').checked;
    var taobaoConvert = document.getElementById('taobaoCheckbox').checked;
    var filter = document.getElementById('filter').value;
    filter = filter.toLowerCase();
    matchHTML(html, httpOnly, filter);

    // Go through list and filter by http only
    if (httpOnly) {
        var httpLinks = [];
        for (var i = 0; i < links.length; i++) {
            if (links[i].substring(0, 4) == 'http')
                httpLinks.push(links[i]);
        }
        links = httpLinks;
    }

    // Go through list and filter by filter
    if (filter != '') {
        var filterLinks = [];
        for (var j = 0; j < links.length; j++) {
            if (links[j].indexOf(filter) != -1)
                filterLinks.push(links[j]);
        }
        links = filterLinks;
    }

    // Get Taobao Links from the current links
    if (taobaoConvert) {
        links = convertTaobao(links);
    }

    // Set message and set components if we have found at least one extracted link
    setHTML('message', 'Extracted ' + links.length + linkOrLinks(links.length));
    if (links.length > 0)
        setComponents();
}

/* Match the HTML and add the links to the links global variable */
function matchHTML(html) {
    // Go through whole HTML string, we match for "href="
    for (var i = 0; i + 5 < html.length; i++) {
        if (html.substring(i, i + 5) == "href=") {
            // Get index of start link and set end to start
            var start = i + 6;
            if (html.charAt(start) == '\'' || html.charAt(start) == '\"')
                start = i + 7;
            var end = start;

            // Find where string ends and add to links list
            while (end < html.length && html.charAt(end) != '\'' && html.charAt(end) != '\"')
                end++;

            // Avoid duplicate links
            var newLink = html.substring(start, end);
            if (!(links.indexOf(newLink) > -1))
                links.push(newLink);

            // Match rest of string for more links
            matchHTML(html.substring(end + 1, html.length));
            break;
        }
    }
}

/* Prepare components to show valid and invalid links */
function setComponents() {
    // Set display for components
    setDisplay('content', false);
    setDisplay('urlText', false);
    setDisplay('valid', true);
    setDisplay('valid' + '-copy', true);
    setHTML('valid' + '-copy', 'Copy to clipboard');

    // Build HTML
    var html = '<h3>Extracted Links</h3>';
    var link_html = [];
    for (var i = 0; i < links.length; i++) {
        link_html.push('<a class=\"link\" href=\'' + links[i] + '\' target=\'_blank\'>' + links[i] + '</a>');
    }

    // Set components
    setHTML('valid', html + link_html.join(''));
    setHTML('valid' + '-hidden', link_html.join('<br>')); // this is bad
    document.getElementById('actions').style.paddingTop = '15px';
}

/* Change inner html of a DOM element */
function setHTML(elementName, html) {
    document.getElementById(elementName).innerHTML = html;
}

/* Set display of html of a DOM element */
function setDisplay(elementName, visible) {
    document.getElementById(elementName).style.display = (visible ? 'unset' : 'none');
}

/* English Grammar */
function linkOrLinks(count) {
    return count == 1 ? ' link.' : ' links.';
}

/* Reset HTML elements */
function reset() {
    document.getElementById('url').value = '';
    document.getElementById('content').value = '';
    document.getElementById('filter').value = '';
    document.getElementById('filter').disabled = false;
    document.getElementById('httpCheckbox').checked = true;
    document.getElementById('taobaoCheckbox').checked = false;
    setDisplay('loading', false);
    setDisplay('urlText', true);
    setDisplay('content', true);
    setHTML('message', '');
    setDisplay('valid', false);
    setDisplay('valid-copy', false);
}

/* Handle checking of Taobao checkbox */
function taobaoChecked() {
    var bool = document.getElementById('taobaoCheckbox').checked;
    if (bool) {
        document.getElementById('filter').disabled = true;
        document.getElementById('filter').value = 'taobao';
    } else {
        document.getElementById('filter').disabled = false;
        document.getElementById('filter').value = '';
    }
}

/* Handle extract by URL or HTML */
function boxClicked(isURL) {
    if (isURL) {
        // Click on URL text box
        document.getElementById('content').value = '';
    } else {
        // CLick on HTML text area
        document.getElementById('url').value = ''
    }
}