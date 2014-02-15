'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates'
], function ($, _, Backbone, JST) {
	var SettingsView = Backbone.View.extend({
		el: '#container',
		template: JST['app/scripts/templates/settings.ejs'],
		render: function() {
			this.$el.html(this.template());
		}
	});

	return SettingsView;
});