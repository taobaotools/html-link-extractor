// Global variables :O
var links = [];

/* Process after click on extract button */
function extract() {
    var url = document.getElementById('url').value;
    if (url !== '' && !isValidURL(url)) {
        // Invalid URL
        setError('Please enter a valid URL!');
        document.getElementById('url').value = '';
    } else if (url !== '') {
        // Valid URL
        if (url.substring(0, 4) != 'http')
            url = 'http://' + url;

        setMessage('Requesting web page...');
        setDisplay('loading', true);

        $.ajax({
            dataType: 'html',
            url: url,
            type: 'GET',
            data: '',
            success: function (result) {
                helper(result);
            },
            error: function (jqXHR, exception) {
                // Get error message and set it
                setError(getErrorMessage(jqXHR, exception));
            }
        });
    } else {
        // Extract by HTML
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
    if (taobaoConvert)
        links = convertURLs(links);

    // Set Error
    if (links.length === 0)
        setError('Extracted 0 links.');

    // Set message and set components if we have found at least one extracted link
    setMessage('Extracted ' + links.length + linkOrLinks(links.length));
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
    setDisplay('htmlExtract', false);
    setDisplay('urlExtract', false);
    setDisplay('valid', true);
    setDisplay('filters', false);

    // Build HTML
    var html = '<h3>Extracted Links</h3>';
    var link_html = [];
    for (var i = 0; i < links.length; i++) {
        link_html.push('<a class=\"link\" href=\'' + links[i] + '\' target=\'_blank\'>' + links[i] + '</a>');
    }

    // Set components
    setHTML('valid-content', html + link_html.join('<br>'));
    setHTML('valid-hidden', link_html.join('<br>'));
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
    setDisplay('urlExtract', true);
    setDisplay('htmlExtract', true);
    setDisplay('filters', true);
    setMessage('');
    setDisplay('valid', false);
}

/* Handle checking of Taobao checkbox */
function taobaoChecked(checkbox) {
    if (checkbox.checked) {
        document.getElementById('filter').disabled = true;
        document.getElementById('filter').value = 'taobao.com';
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
        // Click on HTML text area
        document.getElementById('url').value = ''
    }
}

// Trigger when window is loaded
window.onload = function () {
    $('#bottom-link').click(function () {
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top
        }, 600);

        if ($('#bottom-link').attr('href') === '#bottom') {
            $('#bottom-link').attr('href', '#top');
            $('#bottom-link').text('↑');
        } else {
            $('#bottom-link').attr('href', '#bottom');
            $('#bottom-link').text('↓');
        }
        return false;
    });
};
