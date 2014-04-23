angular.module('docsApp', [
  'ngRoute',
  'ngCookies',
  'DocsController',
  'versionsData',
  'pagesData',
  'directives',
  'examples',
  'search',
  'tutorials',
  'versions'
])


.config(function($locationProvider) {
  $locationProvider.html5Mode(false).hashPrefix('!');
});
