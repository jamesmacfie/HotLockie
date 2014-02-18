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
				btMacAddress: null,
				lowTemp: null,
				highTemp: null,
				btDevices: []
			},
			initialize: function(){
				//TEMP
				window.testModel = this;

				this.bluetooth = new Bluetooth();

				this.setInitialData();

				this.set('btConnected', this.isBluetoothConnected());
				this.bind('change', this.attributesChanged);
				this.bindBluetoothEvents();
			},
			bindBluetoothEvents: function() {
				this.listenTo(this.bluetooth, 'connected', this.bluetoothConnected);
				this.listenTo(this.bluetooth, 'disconnected', this.bluetoothDisconnected);
				this.listenTo(this.bluetooth, 'lostConnection', this.bluetoothLostConnection);
			},
			attributesChanged: function(){
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
				delete objectToSave.btConnected;
				delete objectToSave.currentTemp;

				localStorage.setItem('hotLockie', JSON.stringify(objectToSave));
			},
			getCurrentState: function() {
				if (!this.isBluetoothConnected()) {
					return 'notConnected';
				} else if (!this.isSetup()) {
					return 'notSetup';
				} else {
					return this.getCurrentTempState();
				}
			},
			getCurrentTempState: function() {
				var currentTemp = this.get('currentTemp');
				if (typeof currentTemp === 'undefined' || currentTemp === null) {
					return 'lostConnection';
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
			isBluetoothConnected: function() {
				return this.bluetooth.get('connected');
			},
			bluetoothConnected: function() {
				console.log('bluetooth connected');
				this.set('btConnected', true);
			},
			bluetoothDisconnected: function() {
				console.log('bluetooth disconnected');
				this.set('btConnected', false);
			},
			bluetoothLostConnection: function() {
				console.log('bluetooth lost connection');
				this.set('btConnected', false);
			}
		});

		return AppModel;
});
