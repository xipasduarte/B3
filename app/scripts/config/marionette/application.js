/* global define */

define([
  'underscore',
  'backbone',
  'marionette'
], function (_, Backbone) {
  'use strict';

  _.extend(Backbone.Marionette.Application.prototype, {
    navigate: function (route, options) {
      options = options || {};
      Backbone.history.navigate(route, options);
    },

    getCurrentRoute: function() {
      var fragment = Backbone.history.fragment;
      return (_.isEmpty(fragment)) ? null : fragment;
    },

    startHistory: function (options) {
      if (Backbone.history) {
        options = options || {};
        Backbone.history.start(options);
      }
    },

    register: function (instance, id) {
      if (!this.registry) {
        this.registry = {};
      }

      this.registry[id] = instance;
    },

    unregister: function (instance, id) {
      delete this.registry[id];
    },

    resetRegistry: function() {
      _.each(this.registry, function(controller) {
        if (controller) { // it could be a child controller
          controller.region.reset();
        }
      });
    },

    getRegistry: function() {
      return this.registry;
    },

    _getRegistrySize: function() {
      return _.size(this.registry);
    }
  });
});
