'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates',
	'views/navigation/settings'
], function ($, _, Backbone, JST, NavSettings) {
	var SettingsView = Backbone.View.extend({
		el: '#container',
		template: JST['app/scripts/templates/settings.ejs'],
		events: {
			'change input': 'onInputChanged'
		},
		initialize: function() {
			this.listenTo(this.model, 'change', this.renderPage);
		},
		render: function() {
			this.renderNavigation();
			this.renderPage();
		},
		renderPage: function() {
			this.$el.html(this.template(this.model.pick('lowTemp', 'highTemp', 'btMacAddress')));
		},
		renderNavigation: function() {
			var nav = new NavSettings();
			nav.render();
		},
		onInputChanged: function(event) {
			var $target = $(event.target),
				inputName = $target.attr('name'),
				inputVal = $target.val();

			this.model.set(inputName, inputVal);
		}
	});

	return SettingsView;
});