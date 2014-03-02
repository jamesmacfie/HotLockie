/*global define, alert*/

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
				this.set('btDevices', []);
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
				}.bind(this), 1000);
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
					console.log('No message in 1 minutes');
					this.onWeakConnection();
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
			connectToBluetooth: function(address, success, failure) {
				console.log('attempting to connect to ' + address);
				this.bluetoothSerial.connect(address, success, failure);
			},
			startListening: function(address) {
				this.set('btMacAddress', address);
				var me = this;

				var onMessageFn = this.onMessage.bind(this),
					onLostConnectionFn = this.onLostConnection.bind(this),
					connectFn = this.connectToBluetooth.bind(this);

				var	subscribeFn = function() {
					console.log('staring to subscribe for messages');
					this.bluetoothSerial.subscribe('\n', onMessageFn, onLostConnectionFn);
				}.bind(this);

				var retryFn = function() {
					console.log('No luck connecting. Trying again soon');
					setTimeout(function() {
						connectFn(me.get('btMacAddress'), subscribeFn, retryFn);
					}, 1000); //Retry connection in 1 second
				}.bind(this);

				this.connectToBluetooth(me.get('btMacAddress'), subscribeFn, retryFn);
			},
			enabledChangeHandler: function() {
				this.trigger('enabled', this.get('enabled'));
			},
			btDevicesChangeHandler: function() {
				this.trigger('btDevices', this.get('btDevices'));
			},
			onMessage: function(message) {
				console.log('Message received');
				this.set('lastMessageTimestamp', new Date());
				this.trigger('message', message);
			},
			onWeakConnection: function() {
				console.log('Weak connection');
				this.set('lastMessageTimestamp', new Date());
				this.trigger('weakConnection');
			},
			onLostConnection: function() {
				console.log('Lost connection');
				this.set('lastMessageTimestamp', new Date());
				this.trigger('lostConnection');
			}
		});

		return BluetoothModel;
});
