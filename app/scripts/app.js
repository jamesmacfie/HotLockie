/*global define*/
'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'router',
], function($, _, Backbone, Router){
	var initialize = function(){
		Router.initialize();
		bindEvents();
	};

	var bindEvents = function() {
		$(document).on('click', 'a[href^="/"]', function(event) {
			event.preventDefault();
			Backbone.history.navigate($(this).attr('href'), {trigger: true});
		});
	};

	return {
		initialize: initialize
	};
});