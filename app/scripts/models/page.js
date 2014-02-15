/*global define*/

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    var PageModel = Backbone.Model.extend({
        defaults: {
        }
    });

    return PageModel;
});
