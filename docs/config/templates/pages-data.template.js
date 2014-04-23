angular.module('pagesData', [])
  .value('SOFA_PAGES', {$ doc.pages | json $})
  .value('SOFA_NAVIGATION', {$ doc.areas | json $});
