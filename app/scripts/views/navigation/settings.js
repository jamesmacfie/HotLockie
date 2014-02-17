'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
], function ($, _, Backbone, JST) {
	var NavSettingsView = Backbone.View.extend({
		el: '#nav',
		template: JST['app/scripts/templates/navigation/settings.ejs'],
		render: function() {
			this.$el.html(this.template());
		}
	});

	return NavSettingsView;
});