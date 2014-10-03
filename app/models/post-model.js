/* global define */

define([
  'underscore',
  'backbone',
  'models/base-model',
  'models/user-model',
  'models/settings-model',
], function (_, Backbone, BaseModel, User, Settings) {
  'use strict';

  var Post = BaseModel.extend({
    defaults: {
      ID             : null,
      title          : '',
      status         : 'draft',
      type           : 'post',
      parent         : 0,
      author         : new User(),
      content        : '',
      link           : '',
      date           : new Date(),
      date_gmt       : new Date(),
      modified       : new Date(),
      format         : 'standard',
      slug           : '',
      guid           : '',
      excerpt        : '',
      menu_order     : 0,
      comment_status : 'open',
      ping_status    : 'open',
      sticky         : false,
      date_tz        : 'Etc/UTC',
      modified_tz    : 'Etc/UTC',
      featured_image : null,
      terms          : {},
      post_meta      : {},
      meta           : {}
    },

    idAttribute: 'ID',
    urlRoot: Settings.get('api_url') + '/posts',

    url: function () {
      var query = '';

      if (this.get('ID')) {
        query = '/' + this.get('ID');
      } else {
        query = '/b3:slug:' + this.get('slug');
      }

      return this.urlRoot + query;
    }
  });

  return Post;
});
