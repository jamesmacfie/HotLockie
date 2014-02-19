'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'models/app',
	'views/state',
	'views/settings'
], function($, _, Backbone, AppModel, StateView, SettingsView){
	var AppRouter = Backbone.Router.extend({
		routes: {
			'': 'state',
			'settings': 'settings'
		}
	});

	var initialize = function(){
		var appRouter = new AppRouter(),
			appModel = new AppModel();

		appRouter.on('route:state', function(){
			var stateView = new StateView({
				model: appModel
			});
			stateView.render();
		});

		appRouter.on('route:settings', function(){
			var settingsView = new SettingsView({
				model: appModel
			});
			settingsView.render();
		});

		Backbone.history.start({
			pushState: true
		});
	};
	return {
		initialize: initialize
	};
});
