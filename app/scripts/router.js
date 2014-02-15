'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'views/start',
	'views/state',
	'views/settings'
], function($, _, Backbone, StartView, StateView, SettingsView){
	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'start',
			'state': 'state',
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

		app_router.on('route:start', function(){
			var startView = new StartView();
			startView.render();
		});

		Backbone.history.start();
	};
	return {
		initialize: initialize
	};
});