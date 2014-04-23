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
  "api/src/class/sofa.LocationService": {
    "docType": "class",
    "id": "class:sofa.LocationService",
    "name": "sofa.LocationService",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.LocationService.html",
    "path": "api/src/class/sofa.LocationService"
  },
  "api/src/model/sofa.models.BasketItem": {
    "docType": "model",
    "id": "module:src.model:sofa.models.BasketItem",
    "name": "sofa.models.BasketItem",
    "area": "api",
    "outputPath": "partials/api/src/model/sofa.models.BasketItem.html",
    "path": "api/src/model/sofa.models.BasketItem"
  },
  "api/src/model/sofa.models.Product": {
    "docType": "model",
    "id": "module:src.model:sofa.models.Product",
    "name": "sofa.models.Product",
    "area": "api",
    "outputPath": "partials/api/src/model/sofa.models.Product.html",
    "path": "api/src/model/sofa.models.Product"
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
  },
  "api/src/class/sofa.Util.Array": {
    "docType": "class",
    "id": "class:sofa.Util.Array",
    "name": "sofa.Util.Array",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.Util.Array.html",
    "path": "api/src/class/sofa.Util.Array"
  },
  "api/src/class/sofa.Util.TreeIterator": {
    "docType": "class",
    "id": "class:sofa.Util.TreeIterator",
    "name": "sofa.Util.TreeIterator",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.Util.TreeIterator.html",
    "path": "api/src/class/sofa.Util.TreeIterator"
  },
  "api/src/class/sofa.LoggingService": {
    "docType": "class",
    "id": "class:sofa.LoggingService",
    "name": "sofa.LoggingService",
    "area": "api",
    "outputPath": "partials/api/src/class/sofa.LoggingService.html",
    "path": "api/src/class/sofa.LoggingService"
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
        "name": "sofa.LocationService",
        "href": "api/src/class/sofa.LocationService",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.models.BasketItem",
        "href": "api/src/model/sofa.models.BasketItem",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.models.Product",
        "href": "api/src/model/sofa.models.Product",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.Util",
        "href": "api/src/class/sofa.Util",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.Util.Array",
        "href": "api/src/class/sofa.Util.Array",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.Util.TreeIterator",
        "href": "api/src/class/sofa.Util.TreeIterator",
        "type": "group",
        "navItems": []
      },
      {
        "name": "sofa.LoggingService",
        "href": "api/src/class/sofa.LoggingService",
        "type": "group",
        "navItems": []
      }
    ]
  }
});
