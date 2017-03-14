/**
 * The JavaScript for everything :)
 */
function convertTaobao(links) {
    var validLinks = [];
    // Go through given links, convert and add to relevant array
    for (var i = 0; i < links.length; i++) {
        var current = links[i];
        if (isTaobaoURL(current)) {
            // Convert URL based on type and clean it up
            validLinks.push(cleanURL(convertURL(current)));
        }
    }
    return validLinks;
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

/* Checks if string is valid URL and that it contains 'taobao.com' */
function isTaobaoURL(str) {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');
    return urlPattern.test(str) && str.indexOf('taobao.com') != -1;
}

/* Converts the Taobao URL */
function convertURL(str) {
    if (str.indexOf('m.intl.taobao.com') != -1) {
        // General mobile item
        return str.replace('m.intl', 'item').replace('detail/detail', 'item').replace('detail/desc', 'item');
    } else if (str.indexOf('h5.m.taobao.com') != -1) {
        // Mobile app item, substring to get item ID and build new URL
        var start = str.indexOf('?id=') + 4;
        // Default end just length of url, loop to find alternatives
        var end = str.length;
        for (var i = start; i < str.length; i++) {
            if (!isDigit(str.charAt(i))) {
                end = i;
                break;
            }
        }
        var item_id = str.substring(start, end);
        return "https://item.taobao.com/item.htm?id=" + item_id;
    } else if (str.indexOf('m.taobao.com') != -1) {
        if (str.indexOf('shop.m.taobao.com') != -1) {
            // Weird mobile stores - e.g. shop.m.taobao.com/shop/....shop_id
            var start = str.indexOf('shop_id=') + 8;
            // Default end is length of URL
            var end = str.length;
            // Go through rest of URL, stop when we find non-digit
            for (var i = start; i < str.length; i++) {
                if (!isDigit(str.charAt(i))) {
                    end = i;
                    break;
                }
            }
            var shopID = str.substring(start, end);
            return 'https://shop' + shopID + '.taobao.com';
        } else if (str.indexOf('item') == -1) {
            // Most mobile stores
            return str.replace('m.taobao', 'taobao');
        } else {
            // Already valid Taobao URL
            var start = str.indexOf('id=') + 3;
            // Default end is length of URL
            var end = str.length;
            // Go through rest of URL, stop when we find non-digit
            for (var i = start; i < str.length; i++) {
                if (!isDigit(str.charAt(i))) {
                    end = i;
                    break;
                }
            }
            var id = str.substring(start, end);
            return 'https://item.taobao.com/item.htm?id=' + id;
        }
    } else if (str.indexOf('world.taobao.com') != -1) {
        if (str.indexOf('item') != -1) {
            // World item, we substring to get the item ID and then build the new URL
            var start = str.indexOf('item/') + 5;
            var end = str.indexOf('.htm');
            var itemID = str.substring(start, end);
            return 'https://item.taobao.com/item.htm?id=' + itemID;
        } else {
            // General world store
            return str.replace('world.taobao', 'taobao');
        }
    } else {
        // Already valid Taobao URL
        var start = str.indexOf('id=') + 3;
        // Default end is length of URL
        var end = str.length;
        // Go through rest of URL, stop when we find non-digit
        for (var i = start; i < str.length; i++) {
            if (!isDigit(str.charAt(i))) {
                end = i;
                break;
            }
        }
        var id = str.substring(start, end);
        return 'https://item.taobao.com/item.htm?id=' + id;
    }
}

/* Cleans up a URL - FIXME THIS IS REALLY BAD! */
function cleanURL(str) {
    var builder = '';
    var encounteredQuestion = false;
    for (var j = 0; j < str.length; j++) {
        if (str.charAt(j) == '?' && encounteredQuestion) {
            builder += '&';
        } else if (str.charAt(j) == '?') {
            builder += '?';
            encounteredQuestion = true;
        } else {
            builder += str.charAt(j);
        }
    }
    return builder;
}

/* Check if char is digit */
function isDigit(char) {
    return char == '0' || char == '1' || char == '2' || char == '3' || char == '4' ||
        char == '5' || char == '6' || char == '7' || char == '8' || char == '9';
}