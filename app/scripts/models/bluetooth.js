/*global define*/

define([
		'jquery',
		'underscore',
		'backbone'
], function ($, _, Backbone) {
		'use strict';

		var BluetoothModel = Backbone.Model.extend({
			initialize: function(){
				this.set('enabled', this.isEnabled());
				this.on({
				  'change:enabled': this.enabledChangeHandler,
				});
			},
			isEnabled: function() {
				return false;
			},
			isConnected: function() {
				return true;
			},
			enabledChangeHandler: function() {
				this.trigger('enabled', this.get('enabled'));
			}

		});

		return BluetoothModel;
});
