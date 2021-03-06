/*global define*/

define([
		'underscore',
		'backbone',
		'models/bluetooth'
], function (_, Backbone, Bluetooth) {
		'use strict';

		var AppModel = Backbone.Model.extend({
			/* Properties */
			defaults: {
				hasConnection: false,
				btMacAddress: null,
				lowTemp: null,
				highTemp: null,
				btDevices: [],
				currentTemp: null
			},
			initialize: function(){
				this.bluetooth = new Bluetooth();

				this.setInitialData();

				this.set('btEnabled', this.isBluetoothEnabled());
				this.bind('change', this.attributesChanged);
				this.bindBluetoothEvents();
				if (this.get('btMacAddress') && this.get('btEnabled')) {
					this.startListening(this.get('btMacAddress'));
				}
			},
			bindBluetoothEvents: function() {
				this.listenTo(this.bluetooth, 'enabled', this.bluetoothEnabledChangeHandler);
				this.listenTo(this.bluetooth, 'message', this.bluetoothMessageReceivedHandler);
				this.listenTo(this.bluetooth, 'btDevices', this.bluetoothDevicesChangeHandler);
				this.listenTo(this.bluetooth, 'lostConnection', this.bluetoothLostConnection);
				this.listenTo(this.bluetooth, 'weakConnection', this.bluetoothWeakConnection);
			},
			attributesChanged: function(event){
				if (event.changed.btMacAddress) {
					this.startListening(event.changed.btMacAddress);
				}
				this.saveToLocalStorage();
			},
			setInitialData: function() {
				var local = localStorage.getItem('hotLockie');
				if (local === 'undefined') {
					return;
				}

				var data = JSON.parse(local);
				if (data) {
					_.each(data, function(value, key) {
						this.set(key, value);
					}.bind(this));
				}
			},
			saveToLocalStorage: function() {
				var objectToSave = jQuery.extend({}, this.attributes);
				delete objectToSave.btEnabled;
				delete objectToSave.currentTemp;

				localStorage.setItem('hotLockie', JSON.stringify(objectToSave));
			},
			getCurrentState: function() {
				if (!this.isBluetoothEnabled()) {
					return 'notEnabled';
				} else if (!this.isSetup()) {
					return 'notSetup';
				} else {
					return this.getCurrentTempState();
				}
			},
			getCurrentTempState: function() {
				var currentTemp = this.get('currentTemp');
				if (typeof currentTemp === 'undefined' || currentTemp === null) {
					return this.hasConnection ? 'weakConnection' : 'lostConnection';
				}
				if (this.isTempOk(currentTemp)) {
					return 'okTemp';
				}
				if (this.isTempCold(currentTemp)) {
					return 'coldTemp';
				}
				if (this.isTempHot(currentTemp)) {
					return 'hotTemp';
				}
			},
			startListening: function(address) {
				this.bluetooth.startListening(address);
			},
			isTempOk: function(currentTemp) {
				return (this.get('lowTemp') < currentTemp &&
					currentTemp < this.get('highTemp'));
			},
			isTempCold: function(currentTemp) {
				return (this.get('lowTemp') > currentTemp);
			},
			isTempHot: function(currentTemp) {
				return (this.get('highTemp') < currentTemp);
			},
			isSetup: function() {
				if (!this.get('btMacAddress') ||
					 !this.get('lowTemp') ||
					 !this.get('highTemp')) {
					return false;
				}
				return true;
			},
			isBluetoothEnabled: function() {
				return this.bluetooth.get('enabled');
			},
			bluetoothEnabledChangeHandler: function(state) {
				console.log('bluetooth enabled/disabled', state);
				this.set('btEnabled', state);
				if (state) {
					this.startListening(this.get('btMacAddress'));
				}
			},
			bluetoothDevicesChangeHandler: function(devices) {
				this.set('btDevices', devices);
			},
			bluetoothLostConnection: function() {
				this.set('hasConnection', false);
			},
			bluetoothWeakConnection: function() {
				this.set('hasConnection', true);
				this.set('currentTemp', null);
			},
			bluetoothMessageReceivedHandler: function(message) {
				this.set('hasConnection', true);
				this.set('currentTemp', message);
			}
		});

		return AppModel;
});
