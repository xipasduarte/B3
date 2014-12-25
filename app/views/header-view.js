/* global define */

define([
  'backbone',
  'models/settings-model',
  'buses/event-bus',
  'behaviors/display-home-behavior',
  'templates/header-template'
], function (Backbone, Settings, EventBus) {
  'use strict';

  var HeaderView = Backbone.Marionette.LayoutView.extend({
    template: 'header-template.dust',

    ui: {
      'homeLink': '.navbar-brand'
    },

    behaviors: {
      DisplayHome: {}
    },

    regions: {
      search: '#search-region',
      menu:   '#menu-region'
    },

    serializeData: function () {
      return { name: Settings.get('name') };
    }
  });

  return HeaderView;
});
