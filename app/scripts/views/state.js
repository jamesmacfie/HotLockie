'use strict';

define([
	'jquery',
	'underscore',
	'backbone',
	'templates'
], function ($, _, Backbone, JST) {
	var StateView = Backbone.View.extend({
		el: '#container',
		template: JST['app/scripts/templates/state.ejs'],
		render: function() {
			this.$el.html(this.template);
		}
	});

	return StateView;
});
