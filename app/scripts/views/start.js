'use strict';

define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/start.html'
], function($, _, Backbone, startTemplate){
  var StartView = Backbone.View.extend({
    el: $('#container'),
    render: function(){
      var data = {};
      var compiledTemplate = _.template( startTemplate, data );
    
      this.$el.html( compiledTemplate );
    }
  });

  return StartView;
});