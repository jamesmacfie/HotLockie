'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'views/state',
	'views/settings'
], function($, _, Backbone, StateView, SettingsView){
	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'state',
			'settings': 'settings'
		}
	});

	var initialize = function(){
		var app_router = new AppRouter();
		app_router.on('route:state', function(){
			var stateView = new StateView();
			stateView.render();
		});

		app_router.on('route:settings', function(){
			var settingsView = new SettingsView();
			settingsView.render();
		});

		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});