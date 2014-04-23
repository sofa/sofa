// Meta data used by the AngularJS docs app
angular.module('versionsData', [])
  .value('SOFA_VERSION', {$ doc.currentVersion | json $})
  .value('SOFA_VERSIONS', {$ doc.versions | json $});
