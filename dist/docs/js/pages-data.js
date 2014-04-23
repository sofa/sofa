angular.module('pagesData', [])
  .value('SOFA_PAGES', {
  "api/src/class/sofa": {
    "docType": "class",
    "id": "class:sofa",
    "name": "sofa",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.html",
    "path": "api/src/class/sofa"
  },
  "api/src/class/sofa.ConfigService": {
    "docType": "class",
    "id": "class:sofa.ConfigService",
    "name": "sofa.ConfigService",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.ConfigService.html",
    "path": "api/src/class/sofa.ConfigService"
  },
  "api/src/class/sofa.Util": {
    "docType": "class",
    "id": "class:sofa.Util",
    "name": "sofa.Util",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.Util.html",
    "path": "api/src/class/sofa.Util"
  },
  "api/src/method/isToFixedBroken": {
    "docType": "method",
    "id": "module:src.method:isToFixedBroken",
    "name": "isToFixedBroken",
    "area": "api",
    "outputPath": "partials/api/src/method/isToFixedBroken.html",
    "path": "api/src/method/isToFixedBroken"
  }
})
  .value('SOFA_NAVIGATION', {
  "api": {
    "id": "api",
    "name": "API",
    "navGroups": [
      {
        "name": "sofa",
        "href": "api/src/class/sofa",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.ConfigService",
        "href": "api/src/class/sofa.ConfigService",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.Util",
        "href": "api/src/class/sofa.Util",
        "type": "group",
        "navItems": []
      }
    ]
  }
});
