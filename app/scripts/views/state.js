'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'views/nav/navState',
], function ($, _, Backbone, JST, NavState) {
	var StateView = Backbone.View.extend({
		el: '#container',
		template: JST['app/scripts/templates/state.ejs'],
		initialize: function() {
			this.listenTo(this.model, 'change', this.renderPage);
		},
		render: function() {
			this.renderNavigation();
			this.renderPage();
		},
		renderPage: function() {
			this.$el.html(this.template(this.model.pick('lowTemp', 'highTemp')));
		},
		renderNavigation: function() {
			var nav = new NavState();
			nav.render();
		}
	});

	return StateView;
});
