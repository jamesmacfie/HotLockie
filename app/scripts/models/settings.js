'use strict';

define([
  'underscore',
  'backbone'
], function(_, Backbone){
  var SettingsModel = Backbone.Model.extend({
    defaults: {
      low: '',
      high: '',
      device: ''
    }
  });
  return SettingsModel;
});