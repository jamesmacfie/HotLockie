/*global define*/

define([
		'jquery',
		'underscore',
		'backbone'
], function ($, _, Backbone) {
		'use strict';

		var BluetoothModel = Backbone.Model.extend({
			defaults: {
				enabled: false,
				btDevices: []
			},
			initialize: function(){
				this.setBluetoothSerial();
				this.on({
				  'change:enabled': this.enabledChangeHandler,
				  'change:btDevices': this.btDevicesChangeHandler,
				});
				this.startIntermitantChecks();
				this.bluetoothSerial.subscribe('\n', this.onMessage, this.onLostConnection);
			},
			setBluetoothSerial: function() {
				this.bluetoothSerial = window.bluetoothSerial;
			},
			startIntermitantChecks: function() {
				var me = this;

				this.set('lastMessageTimestamp', new Date());

				this.stateChecks();
				setInterval(function () {
					me.stateChecks();
				}.bind(this), 5000);
			},
			stateChecks: function() {
				this.activeCheck();
				this.setEnabled();
				this.setDevices();
			},
			activeCheck: function() {
				var currentTime = new Date(),
					difference = (currentTime - this.get('lastMessageTimestamp')) / 1000;

				if (difference >= 60) {
					this.onLostConnection();
				}
			},
			setEnabled: function() {
				var me = this;
				this.bluetoothSerial.isEnabled(function() {
					me.set('enabled', true);
				},function() {
					me.set('enabled', false);
				});
			},
			setDevices: function() {
				//Bit of a hack. Wipe current devices array
				this.set('btDevices', []);
				var me = this;
				this.bluetoothSerial.list(function(devices) {
					var deviceArray = [];
					devices.forEach(function(device) {
						deviceArray.push({
							address: device.address,
							displayName: device.name,
							something: 'something' + device.name
						});
	        });
					me.set('btDevices', deviceArray);
				});
			},
			enabledChangeHandler: function() {
				this.trigger('enabled', this.get('enabled'));
			},
			btDevicesChangeHandler: function() {
				this.trigger('btDevices', this.get('btDevices'));
			},
			onMessage: function(message) {
				this.set('lastMessageTimestamp', new Date());
				this.trigger('message', message);
			},
			onLostConnection: function() {
				this.set('lastMessageTimestamp', new Date());
				this.trigger('lostConnection');
			}
		});

		return BluetoothModel;
});
