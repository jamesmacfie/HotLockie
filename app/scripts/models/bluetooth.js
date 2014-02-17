/*global define*/

define([
		'jquery',
		'underscore',
		'backbone'
], function ($, _, Backbone) {
		'use strict';

		var BluetoothModel = Backbone.Model.extend({
			initialize: function(){
				this.set('connected', this.isConnected());
			},
			isConnected: function() {
				return true;
			}

		});

		return BluetoothModel;
});
