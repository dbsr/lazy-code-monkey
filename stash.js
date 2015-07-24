// ==UserScript==
// @name         Infostrada Stash Utils
// @namespace    http://stash.infostrada.com
// @version      0.1
// @description  A collection of tools for lazy programmers
// @author       Daan Mathot <daanmathot@gmail.com>
// @match        http://stash.infostrada.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant        GM_setClipboard
// ==/UserScript==


var enabledUtils = [injectCss, addCopyBranchNameToClipboardButton];

enabledUtils.forEach(function(util) {
    util();
});

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
    var style = document.createElement('style');
    style.innerHTML = css;

    document.querySelector('body').insertBefore(style, document.body.firstChild);
}

function addCopyBranchNameToClipboardButton() {

    var button = document.createElement('button');
    button.innerHTML = 'Copy branch name';
    button.setAttribute('class', 'aui-button');
    button.addEventListener('click', function() {
        var branchName = document.querySelector('span[data-id]').getAttribute('title');
        GM_setClipboard(branchName);

        notify("copied branch name!");
    });

    document.querySelector('.aui-buttons.find-files').appendChild(button);
}
