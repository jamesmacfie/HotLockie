'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
], function ($, _, Backbone, JST) {
	var NavStateView = Backbone.View.extend({
		el: '#nav',
		template: JST['app/scripts/templates/navState.ejs'],
		render: function() {
			this.$el.html(this.template());
		}
	});

	return NavStateView;
});