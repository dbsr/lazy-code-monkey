// ==UserScript==
// @name         BitBucket PR Groups
// @namespace    dbsr.github.com
// @version      0.1
// @description  try to take over the world!
// @author       dydrmntion@gmail
// @match        https://bitbucket.twobridges.io/*/pull-requests?create*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.5.1/lodash.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @updateURL    https://raw.githubusercontent.com/dbsr/lazy-code-monkey/master/bitbucket-pr-groups.user.js
// @downloadURL  https://raw.githubusercontent.com/dbsr/lazy-code-monkey/master/bitbucket-pr-groups.user.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

const CONTAINER_ID = '#s2id_reviewers';
const SAVE_GROUP_BUTTON_CONTAINER_CLASS = '.pull-request-reviewers';
const REVIEWERS_CLASS = '.select2-search-choice';
const CSS_BUTTON_CLASS = 'aui-button';

const STORE_KEY = 'jira-groups';

const $container = $(CONTAINER_ID);

function Store(storeKey) {
	var self = this;
	self.storeKey = storeKey;
}

Store.prototype.load = function() {
	var self = this;
	var schema = {
		"groups": {}
	};
	var data = GM_getValue(this.storeKey);

	return data ? JSON.parse(data) : schema;
}

Store.prototype.save = function(data) {
	var self = this;
	
	return GM_setValue(self.storeKey, JSON.stringify(data));
}

Store.prototype.truncate = function() {
	var self = this;
	
	GM_deleteValue(self.storeKey);
}


const dataStore = new Store(STORE_KEY);

//dataStore.truncate();



function main() {
	
	initSaveGroupComponent();
	refresh();
	
	


}

function initSaveGroupComponent() {
	var  parent = $('<div />')
	    .attr('id', 'save-group-container')
	    .css({
			padding: '1em 0',
			'vertical-align': 'middle'
		})
	.append(
		$('<input type="text" />')
	        .attr('id', 'save-group-name-input')
	        .css({
				'margin-right': '1em',
				'line-height': '1.75em',
				'font-size': '1em',

			}))
	.append(createButton('Save group', onClickSaveGroup));
	
	$(SAVE_GROUP_BUTTON_CONTAINER_CLASS).append(parent);
	

}

		
	   

function refresh() {
	var data = dataStore.load();
	var $parent = $('#save-group-container');
	
	$parent.find('.save-group').remove();

	_.forEach(data.groups, function(reviewers, groupName) {
		$parent.append(createButton(groupName, function(e) {
			e.preventDefault();
			if (e.shiftKey) {
				delete data.groups[groupName];
				dataStore.save(data);
				refresh();
				return;
			}
			loadGroup(groupName);
		}, 'save-group'));

		
		

	});
}

function loadGroup(groupName) {
	var data = dataStore.load();
	var group = data.groups[groupName];
	
	$('.select2-search-choice').remove();
	
	
	
	$('.select2-choices').prepend(group);
	
	var reviewers = $('.select2-choices .aui-avatar')
	.map(function(_, reviewer) {
		console.log(reviewer);
		return $(reviewer).data('username');
	})
	.toArray()
	.join('|!|');
	
	$('#reviewers').val(reviewers);
	
	

}
function onClickSaveGroup(e) {

	
	var data = dataStore.load();
	var groups = data.groups;
	var groupName = $('#save-group-name-input').val();
	
	if (!groupName.length || groups[groupName]) {
		return false;
	}
	
	var reviewers = $(REVIEWERS_CLASS);
	
	if (!reviewers.length) {
		return;
	}
	
	
	
	
	data.groups[groupName] = $(reviewers)
	    .parent()
	    .html();
	
	dataStore.save(data);
	refresh();
}

function createButton(name, onClick, className) {
	return $('<button/>')
		.addClass(CSS_BUTTON_CLASS)
		.click(onClick)
	    .addClass(className)
		.html(name);
}


main();

