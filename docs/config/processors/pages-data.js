var _ = require('lodash');
var path = require('canonical-path');
var log = require('winston');

var AREA_NAMES = {
  api: 'API',
  guide: 'Developer Guide',
  misc: 'Miscellaneous',
  tutorial: 'Tutorial',
  error: 'Error Reference'
};

function getNavGroup(pages, area, pageSorter, pageMapper) {

  var navItems = _(pages)
    // We don't want the child to include the index page as this is already catered for
    .omit(function(page) { return page.id === 'index'; })

    // Apply the supplied sorting function
    .sortBy(pageSorter)

    // Apply the supplied mapping function
    .map(pageMapper)

    .value();

  return {
    name: area.name,
    type: 'group',
    href: area.id,
    navItems: navItems
  };
}


var navGroupMappers = {
  api: function(areaPages, area) {

    function filterComponentsByType(docs, type) {
        return _(docs)
            .filter(function (doc) {
                return doc.docType === type;
            })
            .groupBy(function (doc) {
                return doc.name;
            })
            .map(function (pages, name) {

                var componentPage;

                _(pages)
                    .groupBy('docType')
                    .tap(function (docTypes) {
                        componentPage = docTypes[type][0];
                        delete docTypes[type];
                    });
                return {
                    name: name,
                    href: componentPage.path,
                    type: 'group',
                    // navItems: navItems
                };
            }).value();
    }

    var classes = filterComponentsByType(areaPages, 'class');
    var models = filterComponentsByType(areaPages, 'model');

    var navGroups = [
        {
            name: 'Sofa',
            components: [
                { 
                    name: 'Classes',
                    components: classes
                },
                { 
                    name: 'Models',
                    components: models
                }
            ]
        }
        // {
        //     name: 'Angular Sofa',
        //     components: []
        // }
    ];


    return navGroups;
  },

  pages: function(pages, area) {
    return [getNavGroup(pages, area, 'path', function(page) {
      return {
        name: page.name,
        href: page.path,
        type: 'page'
      };
    })];
  }
};

var outputFolder;

module.exports = {
  name: 'pages-data',
  description: 'This plugin will create a new doc that will be rendered as an angularjs module ' +
               'which will contain meta information about the pages and navigation',
  runAfter: ['adding-extra-docs', 'component-groups-generate'],
  runBefore: ['extra-docs-added'],
  init: function(config) {
    outputFolder = config.rendering.outputFolder;
  },
  process: function(docs) {
    _(docs)
    .filter(function(doc) { return doc.area === 'api'; })
    .filter(function(doc) { return doc.docType === 'module' || doc.docType === 'class'; })
    .forEach(function(doc) { if ( !doc.path ) {
      log.warn('Missing path property for ', doc.id);
    }})
    .map(function(doc) { return _.pick(doc, ['id', 'module', 'docType', 'area', 'class']); })
    .tap(function(docs) {
      log.debug(docs);
    });

    // We are only interested in docs that are in a area and not landing pages
    var navPages = _.filter(docs, function(page) {
      return page.area &&
        page.docType != 'componentGroup';
    });

    // Generate an object collection of pages that is grouped by area e.g.
    // - area "api"
    //  - group "ng"
    //    - section "directive"
    //    - ngApp
    //    - ngBind
    //    - section "global"
    //    - angular.element
    //    - angular.bootstrap
    //    - section "service"
    //    - $compile
    //  - group "ngRoute"
    //    - section "directive"
    //    - ngView
    //    - section "service"
    //    - $route
    //
    var areas = {};

    // console.log(navPages);
    _(navPages)
      .groupBy('area')
      .forEach(function(pages, areaId) {

        var area = {
          id: areaId,
          name: AREA_NAMES[areaId]
        };
        areas[areaId] = area;

        var navGroupMapper = navGroupMappers[area.id] || navGroupMappers['pages'];
        area.navGroups = navGroupMapper(pages, area);
      });

    // Extract a list of basic page information for mapping paths to paritals and for client side searching
    var pages = _(docs)
      .map(function(doc) {
        var page = _.pick(doc, [
          'docType', 'id', 'name', 'area', 'outputPath', 'path', 'searchTerms'
        ]);
        return page;
      })
      .indexBy('path')
      .value();


    var docData = {
      docType: 'pages-data',
      id: 'pages-data',
      template: 'pages-data.template.js',
      outputPath: 'js/pages-data.js',

      areas: areas,
      pages: pages
    };
    docs.push(docData);
  }
};
