/* global define */

define([
  'marionette',
  'controllers/base-controller',
  'controllers/pagination-controller',
  'views/archive-view',
  'helpers/post-filter',
  'collections/post-collection',
  'buses/event-bus',
  'buses/request-bus',
  'buses/navigator',
  'config/routes'
], function (Marionette, BaseController, PaginationController, ArchiveView, PostFilter, Posts, EventBus, RequestBus, Navigator, Routes) {
  'use strict';

  var ArchiveController = BaseController.extend({
    busEvents: {
      'archive:show':                  'showArchive',
      'pagination:previous:page':      'showPage',
      'pagination:next:page':          'showPage',
      'pagination:select:page':        'showPage'
    },

    childControllers: {
      pagination: 'paginationController'
    },

    initialize: function (options) {
      this.page     = options.page || 1;
      this.filter   = options.filter || new PostFilter();
      this.posts    = options.posts || new Posts(null, { filter: this.filter });
      this.template = options.template || 'archive/archive-template.dust';
    },

    /**
     * Display the posts archive.
     *
     * @param {params} Object Object containing a given taxonomy.
     */
    showArchive: function (options) {
      options = options || {};
      this.show(null, {
        loading: {
          entities: [this.posts],
          done: function (collection, status, jqXHR) {
            var totalPages = parseInt(jqXHR.getResponseHeader('X-WP-TotalPages'), 10);
            this.showView(totalPages, options);
          }.bind(this),

          fail: function () {
            this.show(this.notFoundView()); // we need to change this
          }.bind(this)
        }
      });
    },

    /**
     * Displays a given page
     * @param  {Object} params Object containing the paged parameter
     */
    showPage: function (options) {
      if (this.page !== options.page) {
        this.page = options.page;
        this.filter.onPage(this.page);
        this.show(null, {
          loading: {
            style:    'opacity',
            entities: [this.posts],
            done: function () {
              $('body,html').animate({ scrollTop: 0 }, 800);
              var route = Routes.getPagedRoute(this.filter, this.page);
              Navigator.navigate(route, false);
            }.bind(this),

            fail: function () {
              this.show(this.notFoundView()); // we need to change this
            }.bind(this)
          }
        });
      }
    },

    /**
     * Display the archive view and the pagination
     * @param  {int} pages   the number of pages to display
     * @param  {Object} options the options indicating information about the archive
     */
    showView: function (pages, options) {
      this.show(this._archiveView(this.posts, options, this.template), { region: this.region });

      // there's some weird bug in this region, haven't figured it out yet.
      var region = this.mainView.pagination || new Marionette.Region({ el: '#pagination' });
      this.pagination.showPagination({ region: region, page: this.page, pages: pages, include: true });
    },

    paginationController: function () {
      return new PaginationController();
    },

    /**
     * Creates a new ArchiveView instance for a post list.
     *
     * @param  {array}       posts Post collection to display.
     * @param  {Object}      model The model containing the information about the archive
     * @param  {String}      template The template for the view
     * @return {ArchiveView}       New archive view instance.
     */
    _archiveView: function (posts, options, template) {
      return new ArchiveView({ collection: posts, options: options, template: template });
    }
  });

  return ArchiveController;
});
