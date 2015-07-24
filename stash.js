// ==UserScript==
// @name         Infostrada Stash Utils
// @namespace    http://stash.infostrada.com
// @version      0.2
// @description  A collection of tools for lazy programmers
// @author       Daan Mathot <daanmathot@gmail.com>
// @match        http://stash.infostrada.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @updateURL    https://raw.githubusercontent.com/dbsr/lazy-code-monkey/master/stash.js
// ==/UserScript==


var enabledUtils = [injectCss, addCopyBranchNameToClipboardButton];

// init utils
enabledUtils.forEach(function(util) {
    util();
});


/** SHARED **/

function notify(msg) {
    var $notification = $('<span/>', {'class': 'notification', text: msg});
    $notification.hide();
    $('body').append($notification);
    $notification.fadeIn();
    setTimeout(function() {
        $notification.fadeOut('slow', function() {
            $notification.remove();
        });

    }, 1500);

}

function injectCss() {
    var css  = '.notification { display: block; position: absolute; width: 24%; background: #eee; z-index: 9999; top: 5%;' +
        'left: 38%; border: 1px solid #ccc; text-align: center; color: #4c4c4c; padding: 0.5% 0;  font-size: 115%; font-weight: bold; }';

    GM_addStyle(css);
}


/** UTILS **/

function addCopyBranchNameToClipboardButton() {
    var $button = $('<button/>', {
        text: 'Copy branch name to clipboard',
        'class': 'aui-button'
    })
    $button.click(function() {
        var branchName = document.querySelector('span[data-id]').getAttribute('title');
        GM_setClipboard(branchName, false);

        notify("copied branch name!");
    });

    $('.find-files').append($button);
}

