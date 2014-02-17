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
			notConnected: JST['app/scripts/templates/states/notConnected.ejs'],
			notSetup : JST['app/scripts/templates/states/notSetup.ejs'],
			lostConnection: JST['app/scripts/templates/states/lostConnection.ejs'],
			okTemp: JST['app/scripts/templates/states/okTemp.ejs'],
			coldTemp: JST['app/scripts/templates/states/coldTemp.ejs'],
			hotTemp: JST['app/scripts/templates/states/hotTemp.ejs'],
		},
		initialize: function() {
			this.listenTo(this.model, 'change', this.renderPage);
		},
		render: function() {
			this.renderNavigation();
			this.renderPage();
		},
		renderPage: function() {
			console.log('rendering state page');
			var currentState = this.model.getCurrentState() || 'default';
			this.$el.html(this.templates[currentState]);
		},
		renderNavigation: function() {
			var nav = new NavState();
			nav.render();
		}
	});

	return StateView;
});
