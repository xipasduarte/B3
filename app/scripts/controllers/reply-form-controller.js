/* global define */

define([
  'controllers/base-controller',
  'views/reply-form-view',
  'buses/command-bus',
  'buses/event-bus',
  'models/comment-model'
], function (BaseController, ReplyFormView, CommandBus, EventBus, Comment) {
  'use strict';

  var ReplyFormController = BaseController.extend({
    busEvents: {
      'replyform:view:cancel': 'cancelReply',
      'replyform:view:reply':  'sendReply'
    },

    initialize: function (options) {
      this.options = options;
    },

    showForm: function () {
      this.show(this._getReplyFormView());
    },

    cancelReply: function () {
      EventBus.trigger('replyform:cancel', { id: this.options.parentId });
    },

    sendReply: function (options) {
      this.comment = new Comment(options);
      this.show(null, {
        loading: {
          operation: 'save',
          entities:  [this.comment],
          style:     'opacity',
          done:      this.onDone.bind(this),
          fail:      this.onFail.bind(this)
        }
      });
    },

    onDone: function () {
      EventBus.trigger('comment:create', this.comment);
      this.mainView.destroy();
    },

    onFail: function (err) {
      var message = err.responseJSON[0].message;
      this.mainView.displayWarning(message || 'Could not reply to comment');
    },

    _getReplyFormView: function () {
      return new ReplyFormView(this.options);
    }
  });

  CommandBus.setHandler('reply:form:show', function (options) {
    new ReplyFormController(options).showForm();
  });

  return ReplyFormController;
});