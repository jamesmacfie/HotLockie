'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'views/navigation/state',
], function ($, _, Backbone, JST, NavState) {
	var StateView = Backbone.View.extend({
		el: '#container',
		templates: {
			main: JST['app/scripts/templates/states/default.ejs'],
			notEnabled: JST['app/scripts/templates/states/notEnabled.ejs'],
			notSetup : JST['app/scripts/templates/states/notSetup.ejs'],
			lostConnection: JST['app/scripts/templates/states/lostConnection.ejs'],
			okTemp: JST['app/scripts/templates/states/okTemp.ejs'],
			coldTemp: JST['app/scripts/templates/states/coldTemp.ejs'],
			hotTemp: JST['app/scripts/templates/states/hotTemp.ejs'],
		},
		initialize: function() {
			this.listenTo(this.model, 'change', this.onModelChange);
		},
		render: function() {
			this.renderNavigation();
			this.renderPage();
		},
		renderPage: function() {
			var currentState = this.model.getCurrentState() || 'default';
			this.$el.html(this.templates[currentState](this.model.pick('currentTemp', 'hasConnection')));
		},
		renderNavigation: function() {
			var nav = new NavState();
			nav.render();
		},
		onModelChange: function() {
			if (Backbone.history.fragment === '') {
				this.renderPage();
			}
		}
	});

	return StateView;
});
