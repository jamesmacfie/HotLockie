/*global define*/

define([
		'underscore',
		'backbone'
], function (_, Backbone) {
		'use strict';

		var AppModel = Backbone.Model.extend({
			/* Properties */
			defaults: {
				btMacAddress: null,
				btName: null,
				lowTemp: null,
				highTemp: null,
			},
			initialize: function(){
				this.bind('change', this.attributesChanged);
			},
			attributesChanged: function(){
				console.log('attributesChanged');
			},
			getCurrentState: function() {

			},
			isBluetoothActive: function() {

			}
		});

		return AppModel;
});
