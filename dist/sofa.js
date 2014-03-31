/**
 * sofa-core - v0.6.1 - 2014-03-31
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (window, undefined) {

'use strict';
/**
 * @module sofa
 *
 * @description
 * The web app SDK module contains all SDK components you need to build your
 * custom mobile shop based on CouchCommerce API's.
 */

/**
 * @name sofa
 * @class
 * @global
 * @static
 * @namespace sofa
 *
 * @description
 * The global `sofa` object is a static instance that provides a basic API to create
 * for example namespaces as well as methods for creating inheritance.
 * In general you'd never use this object directly, since the SDK takes care of
 * that for you.
 */
var cc = window.cc = {};
var sofa = window.sofa = cc;

/**
 * @method namespace
 * @memberof sofa
 * @public
 *
 * @description
 * Creates the given namespace within the 'sofa' namespace. The method returns
 * a `namespaceObject` that contains information about the namespace.
 *
 * Simply pass a string that represents a namespace using the dot notation.
 * So a valid namespace would be 'foo.bar.bazinga' as well as 'foo'.
 *
 * It's not required to mention 'sofa' as root in the namespace, since this
 * method creates the given namespace automatically under 'sofa' namespace.
 *
 * In case 'sofa' is given as root namespace, it gets stripped out, so its more
 * a kind of syntactic sugar to mention 'sofa' namespace.
 *
 * @example
 * // creates a namespace for `sofa.services.FooService`
 * sofa.namespace('sofa.services.FooService');
 *
 * @example
 * // also creates a namespace for `sofa.services.FooService`
 * sofa.namespace('services.FooService');
 *
 * @param {string} namespaceString A namespace string e.g. 'sofa.services.FooService'.
 * @returns {namespaceObject} A namespace object containing information about the current
 * and parent targets.
 */
sofa.namespace = function (namespaceString) {
    var parts = namespaceString.split('.'), parent = sofa, i;

    //strip redundant leading global
    if (parts[0] === 'cc' || parts[0] === 'sofa') {
        parts = parts.slice(1);
    }

    var targetParent = sofa,
        targetName;

    for (i = 0; i < parts.length; i++) {
        //create a propery if it doesn't exist
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {};
        }

        if (i === parts.length - 2) {
            targetParent = parent[parts[i]];
        }

        targetName = parts[i];

        parent = parent[parts[i]];
    }

    /**
    * @typdef namespaceObject
    * @type {object}
    * @property {object} targetParent - Parent namespace object.
    * @property {string} targetName - Current namespace name.
    * @property {function} bind - A convenient function to bind a value to the namespace.
    */
    return {
        targetParent: targetParent,
        targetName: targetName,
        bind: function (target) {
            targetParent[targetName] = target;
        }
    };
};

/**
 * @method define
 * @memberof sofa
 * @public
 *
 * @description
 * This method delegates to [sofa.namespace]{@link sofa#namespace} and binds a new
 * value to it's given namespace. Because of delegation, rules for the given
 * namespace are the same as for `sofa.namespace`.
 *
 * As second argument you have to provide a constructor function that will be
 * bound to the given namespace.
 *
 * @example
 * // defining constructor for 'foo.bar'
 * sofa.define('foo.bar', function () {
 *  // some logic
 * });
 *
 * @example
 * // of course it's also possible to use named functions
 * var Greeter = function () {
 *  return {
 *    sayHello: function () {
 *      console.log('hello');
 *    }
 *  };
 * };
 *
 * sofa.define('greeter', Greeter);
 *
 * @param {string} namespace A namespace string e.g. 'sofa.services.FooService".
 * @param {function} fn A constructor function that will be bound to the namespace.
 */
sofa.define = function (namespace, fn) {
    sofa.namespace(namespace).bind(fn);
};

/**
 * @method inherits
 * @memberof sofa
 * @public
 *
 * @description
 * Sets up an inheritance chain between two objects
 * (See {@link https://github.com/isaacs/inherits/blob/master/inherits.js}).
 *
 * @example
 * // creating a constructor
 * function Child () {
 *   Child.super.call(this)
 *   console.error([this
 *                ,this.constructor
 *                ,this.constructor === Child
 *                ,this.constructor.super === Parent
 *                ,Object.getPrototypeOf(this) === Child.prototype
 *                ,Object.getPrototypeOf(Object.getPrototypeOf(this))
 *                 === Parent.prototype
 *                ,this instanceof Child
 *                ,this instanceof Parent])
 * }
 *
 * // creating another constructor
 * function Parent () {}
 *
 * sofa.inherits(Child, Parent)
 * // getting an instance
 * new Child
 *
 * @param {object} c Child constructor.
 * @param {object} p Parent constructor.
 * @param {object} proto Prototype object.
 */

 /*jshint asi: true*/
sofa.inherits = function (c, p, proto) {
    //this code uses a shitty form of semicolon less
    //writing. We just copied it from:
    //https://github.com/isaacs/inherits/blob/master/inherits.js

    proto = proto || {};
    var e = {};
    
    [c.prototype, proto].forEach(function (s) {
        Object.getOwnPropertyNames(s).forEach(function (k) {
            e[k] = Object.getOwnPropertyDescriptor(s, k);
        });
    });
    c.prototype = Object.create(p.prototype, e);
    c.super = p
};
/*jshint asi: false*/

'use strict';
/**
 * @name ConfigService
 * @class
 * @namespace sofa.ConfigService
 *
 * @description
 * General configuration service which kind of behaves as a registry
 * pattern to make configurations available on all layers.
 */
sofa.define('sofa.ConfigService', function () {

    var self = {};

    sofa.Config = sofa.Config || {};

    /**
     * @method getSupportedCountries
     * @memberof sofa.ConfigService
     *
     * @description
     * Gets an array of supported countries for shipping and invoicing.
     *
     * @example
     * // returns supported countries
     * sofa.ConfigService.getSupportedCountries();
     *
     * @return {array} Returns an array of strings for supported countries.
     */
    self.getSupportedCountries = function () {
        if (!sofa.Config.countries) {
            //should we rather throw an exception here?
            return [];
        }

        return sofa.Config.countries;
    };

    /**
     * @method getDefaultCountry
     * @memberof sofa.ConfigService
     *
     * @description
     * Gets the default country for shipping and invoicing.
     *
     * @example
     * // returns default country
     * sofa.ConfigService.getDefaultCountry();
     *
     * @return {string} Default country.
     */
    self.getDefaultCountry = function () {
        var countries = self.getSupportedCountries();
        return countries.length === 0 ? null : countries[0];
    };

    /**
     * @method getLocalizedPayPalButtonClass
     * @memberof sofa.ConfigService
     *
     * @description
     * Returns a localized paypal button css class.
     *
     * @example
     * sofa.ConfigService.getLocalizedPayPalButtonClass();
     *
     * @return {string} PayPal button class.
     */
    self.getLocalizedPayPalButtonClass = function (disabled) {
        return !disabled ? 'cc-paypal-button--' + self.get('locale') :
                           'cc-paypal-button--' + self.get('locale') + '--disabled';
    };

    /**
     * @method get
     * @memberof sofa.ConfigService
     *
     * @description
     * Generic getter function that returns a config value by a given key.
     * If a default value is passed and no config setting with the given key
     * exists, it is returned.
     *
     * @example
     * // returns config setting for 'foo'
     * sofa.ConfigService.get('foo');
     *
     * @example
     * // returns 5 if config for 'foo' doesn't exist
     * sofa.ConfigService.get('foo', 5);
     *
     * @param {string} key Key for a certain config value.
     * @param {object} defaultValue A default value which will be returned
     * if given key doesn't exist in config.
     *
     * @return {object} Associative object for `key`.
     */
    self.get = function (key, defaultValue) {

        var value = sofa.Config[key];

        if (sofa.Util.isUndefined(value) && !sofa.Util.isUndefined(defaultValue)) {
            return defaultValue;
        }

        return value;
    };

    return self;
});

'use strict';
/**
 * @name LocationService
 * @class
 * @namespace sofa.LocationService
 *
 * @description
 * Service to work with the browsers location.
 */
sofa.define('sofa.LocationService', function () {

    return {
        /**
         * @method path
         * @memberof sofa.LocationService
         *
         * @description
         * Return the location href
         *
         * @return {string} href
         */
        path: function () {
            return window.location.href;
        }
    };
});

'use strict';
/**
 * @name BasketItem
 * @namespace sofa.models.BasketItem
 *
 * @description
 * A basket item model that represents basket items. This model provides some methods
 * to access information about the basket item such as the price or the variant id.
 */
sofa.define('sofa.models.BasketItem', function () {

    var self = this;

    self.quantity = 0;

    return self;
});

/**
 * @method getPrice
 * @memberof sofa.models.BasketItem
 *
 * @description
 * Returns the price of the basket item depending on the variant.
 *
 * @return {float} Price
 */
sofa.models.BasketItem.prototype.getPrice = function () {
    return this.variant && sofa.Util.isNumeric(this.variant.price) ? this.variant.price : this.product.price;
};

/**
 * @method getTotal
 * @memberof sofa.models.BasketItem
 *
 * @description
 * Returns the total price of the basket item considering the quantity.
 *
 * @return {float} Total price
 */
sofa.models.BasketItem.prototype.getTotal = function () {
    return sofa.Util.round(this.quantity * this.getPrice(), 2);
};

/**
 * @method getVariantID
 * @memberof sofa.models.BasketItem
 *
 * @description
 * Returns the variant id of the basket item if it exists.
 *
 * @return {int} Variant id.
 */
sofa.models.BasketItem.prototype.getVariantID = function () {
    return this.variant ? this.variant.variantID : null;
};

/**
 * @method getOptionID
 * @memberof sofa.models.BasketItem
 *
 * @description
 * Returns the option id of the basket item if it exists.
 *
 * @return {int} Option id.
 */
sofa.models.BasketItem.prototype.getOptionID = function () {
    return this.variant ? this.variant.optionID : null;
};

'use strict';
/**
 * @name Product
 * @namespace sofa.models.Product
 *
 * @description
 * A model that represents a Product object and adds convenient methods to it.
 */
sofa.define('sofa.models.Product', function () {});

/**
 * @method getImage
 * @memberof sofa.models.Product
 *
 * @description
 * Returns the url to the product image by a given size. If no image exists in that
 * size, it returns a placeholder image url.
 *
 * @param {string} size Image size identifier.
 *
 * @return {string} Image url.
 */
sofa.models.Product.prototype.getImage = function (size) {
    for (var i = 0; i < this.images.length; i++) {
        if (this.images[i].sizeName.toLowerCase() === size) {
            return this.images[i].url;
        }
    }

    return sofa.Config.mediaPlaceholder;
};

/**
 * @method getAllImages
 * @memberof sofa.models.Product
 *
 * @description
 * Returns all images of the product in size 'large'.
 *
 * @return {array} Arraz of image urls.
 */
sofa.models.Product.prototype.getAllImages = function () {

    if (!this._allImages) {
        this._allImages = [{ url: this.getImage('large') }].concat(this.imagesAlt);
    }

    return this._allImages;
};

/**
 * @method hasMultipleImages
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if a product supports multiple images.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasMultipleImages = function () {
    return this.getAllImages().length > 0;
};

/**
 * @method hasBasePrice
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if a product has a base price.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasBasePrice = function () {
    return this.custom1 > 0;
};

/**
 * @method getBasePrice
 * @memberof sofa.models.Product
 *
 * @description
 * Returns the base price per unit
 *
 * @return {Number}
 */
sofa.models.Product.prototype.getBasePriceStr = function () {
    return sofa.Util.toFixed(this.custom1, 2);
};

/**
 * @method hasUnit
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if a product has unit defined
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasUnit = function () {
    return sofa.Util.isString(this.custom3) && this.custom3.length > 0;
};

/**
 * @method getUnit
 * @memberof sofa.models.Product
 *
 * @description
 * Returns the unit of the product
 *
 * @return {String}
 */
sofa.models.Product.prototype.getUnit = function () {
    return this.custom3;
};

/**
 * @method hasOldPrice
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product has an old price.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasOldPrice = function () {
    return sofa.Util.isNumeric(this.priceOld) && this.priceOld > 0;
};

/**
 * @method hasVariants
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product supports variants.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasVariants = function () {
    return !!(this.variants && this.variants.length > 0);
};

/**
 * @method isOutOfStock
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product is currently out of stock.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.isOutOfStock = function () {

    //this means, it's always in stock
    if (this.qty === undefined || this.qty === null) {
        return false;
    }

    // a product is considered out of stock if:

    // -it has no variants and the qty is less or equal zero
    // -it has variants and all of them have a stock of less or equal zero

    return (!this.hasVariants() && this.qty <= 0) || this.areAllVariantsOutOfStock();
};

/**
 * @method areAllVariantsOutOfStock
 * @memberof sofa.models.Product
 *
 * @description
 * Requests if all variants of the product are out of stock.
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.areAllVariantsOutOfStock = function () {
    if (this.hasVariants()) {
        return sofa.Util.every(this.variants, function (variant) {
            return variant.stock <= 0;
        });
    }

    return false;
};

/**
 * @method hasAttributes
 * @memberof sofa.models.Product
 *
 * @description
 * Returns true if the product has at least one attribute key
 *
 * @return {boolean}
 */
sofa.models.Product.prototype.hasAttributes = function () {
    return this.attributes && Object.keys(this.attributes).length > 0;
};

'use strict';
/**
 * @name Observable
 * @namespace sofa.Observable
 *
 * @description
 *
 */
sofa.define('sofa.Observable', function () {

    var self = {
        mixin: function (obj, handlers) {
            // we store the list of handlers as a local variable inside the scope
            // so that we don't have to add random properties to the object we are
            // converting. (prefixing variables in the object with an underscore or
            // two is an ugly solution)
            //      we declare the variable in the function definition to use two less
            //      characters (as opposed to using 'var ').  I consider this an inelegant
            //      solution since smokesignals.convert.length now returns 2 when it is
            //      really 1, but doing this doesn't otherwise change the functionallity of
            //      this module, so we'll go with it for now
            handlers = {};

            // add a listener
            obj.on = function (eventName, handler) {
                // either use the existing array or create a new one for this event
                //      this isn't the most efficient way to do this, but is the shorter
                //      than other more efficient ways, so we'll go with it for now.
                (handlers[eventName] = handlers[eventName] || [])
                    // add the handler to the array
                    .push(handler);

                return obj;
            };

            // add a listener that will only be called once
            obj.once = function (eventName, handler) {
                // create a wrapper listener, that will remove itself after it is called
                function wrappedHandler() {
                    // remove ourself, and then call the real handler with the args
                    // passed to this wrapper
                    handler.apply(obj.off(eventName, wrappedHandler), arguments);
                }
                // in order to allow that these wrapped handlers can be removed by
                // removing the original function, we save a reference to the original
                // function
                wrappedHandler.h = handler;

                // call the regular add listener function with our new wrapper
                return obj.on(eventName, wrappedHandler);
            };

            // remove a listener
            obj.off = function (eventName, handler) {
                // loop through all handlers for this eventName, assuming a handler
                // was passed in, to see if the handler passed in was any of them so
                // we can remove it
                //      it would be more efficient to stash the length and compare i
                //      to that, but that is longer so we'll go with this.
                for (var list = handlers[eventName], i = 0; handler && list && list[i]; i++) {
                    // either this item is the handler passed in, or this item is a
                    // wrapper for the handler passed in.  See the 'once' function
                    /*jshint expr: true */
                    list[i] !== handler && list[i].h !== handler || list.splice(i--, 1);
                    /*jshint expr: false */
                }
                // if i is 0 (i.e. falsy), then there are no items in the array for this
                // event name (or the array doesn't exist)
                if (!i) {
                    // remove the array for this eventname (if it doesn't exist then
                    // this isn't really hurting anything)
                    delete handlers[eventName];
                }
                return obj;
            };

            obj.emit = function (eventName) {
                // loop through all handlers for this event name and call them all
                //      it would be more efficient to stash the length and compare i
                //      to that, but that is longer so we'll go with this.
                for (var list = handlers[eventName], i = 0; list && list[i];) {
                    list[i++].apply(obj, list.slice.call(arguments, 1));
                }
                return obj;
            };

            return obj;
        }
    };

    return self;
});

sofa.observable = new sofa.Observable();

'use strict';
/* global document: true */
/* global keys: true */
/* global toString: true */
/* global isEqual: true */

function isArrayLike(obj) {
    if (obj === null || isWindow(obj)) {
        return false;
    }

    var length = obj.length;

    if (obj.nodeType === 1 && length) {
        return true;
    }

    return sofa.Util.isString(obj) || sofa.Util.isArray(obj) || length === 0 ||
            typeof length === 'number' && length > 0 && (length - 1) in obj;
}

function isWindow(obj) {
    return obj && obj.document && obj.location && obj.alert && obj.setInterval;
}
/**
 * @name Util
 * @namespace sofa.Util
 *
 * @description
 * Namespace containing utility functions for compatibility stuff etc.
 *
 */
sofa.Util = {
    /**
     * @method isToFixedBroken
     * @memberof sofa.Util
     *
     * @description
     * Checks if the <code>toFixed()</code> function in the current JavaScript
     * environment is broken or not. For more info see {@link http://docs.sencha.com/touch/2.2.0/source/Number2.html#Ext-Number-method-toFixed }.
     *
     * @return {boolean} Whether its broken or not.
     */
    isToFixedBroken: (0.9).toFixed() !== '1',
    indicatorObject: {},

    /**
     * @member {object} objectTypes
     * @memberof sofa.Util
     *
     * @description
     * Used to determine if values are of the language type Object
     */
    objectTypes: {
        'boolean': false,
        'function': true,
        'object': true,
        'number': false,
        'string': false,
        'undefined': false
    },

    /**
     * @method domReady
     * @memberof sofa.Util
     *
     * @description
     * Takes a function and executes it if the document is ready at this point.
     * If its not, it registers the given function as callback.
     *
     * @param {function} fn Callback function to execute once DOM is ready.
     */
    domReady: function (fn) {
        if (document.readyState === 'complete') {
            fn();
        }
        else {
            window.addEventListener('load', fn, false);
        }
    },
    /**
     * @method round
     * @memberof sofa.Util
     *
     * @description
     * Rounds a given value by a number of given places and returns it.
     *
     * @param {(float|number)} value Value to be round.
     * @param {int} places Number of places to round the value.
     *
     * @return {float} Rounded value
     */
    round: function (value, places) {
        var multiplier = Math.pow(10, places);
        return (Math.round(value * multiplier) / multiplier);
    },
    /**
     * @method toFixed
     * @memberof sofa.Util
     *
     * @description
     * Transformes a given value to a string with a fixed value by a given precision.
     *
     * @param {(number|float)} value Value to fix.
     * @param {number} precision Precision.
     *
     * @return {String} Transformed fixed value.
     */
    toFixed: function (value, precision) {

        value = sofa.Util.isString(value) ? parseFloat(value) : value;

        if (sofa.Util.isToFixedBroken) {
            precision = precision || 0;
            var pow = Math.pow(10, precision);
            return (Math.round(value * pow) / pow).toFixed(precision);
        }

        return value.toFixed(precision);
    },
    /**
     * @method clone
     * @memberof sofa.Util
     *
     * @description
     * This method is useful for cloning complex (read: nested) objects without
     * having references from the clone to the original object.
     * (See {@link http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object}).
     *
     * @param {object} obj Object to clone.
     * @return {object} A clone of the given object.
     */
    clone: function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null === obj || 'object' !== typeof obj) {
            return obj;
        }

        var copy;
        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) {
                    copy[attr] = this.clone(obj[attr]);
                }
            }
            return copy;
        }

        throw new Error('Unable to copy obj! Its type isn\'t supported.');
    },
    /**
     * @method extend
     * @memberof sofa.Util
     *
     * @description
     * Extends the given object by members of additional given objects.
     *
     * @param {object} dst Destination object to extend.
     *
     * @return {object} Extended destination object.
     */
    extend: function (dst) {
        //strange thing, we can't use forOwn here because
        //phantomjs raises TypeErrors that don't happen in the browser
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            if (obj !== dst) {
                for (var key in obj) {
                    dst[key] = obj[key];
                }
            }
        }
        return dst;
    },
    /*jshint eqeqeq:true */
    //this method is ripped out from lo-dash
    /*jshint eqeqeq:false*/
    createCallback: function (func, thisArg, argCount) {
        var type = typeof func;
        if (type !== 'function') {
            if (type !== 'object') {
                return function (object) {
                    return object[func];
                };
            }
            var props = keys(func);
            return function (object) {
                var length = props.length,
                    result = false;
                while (length--) {
                    if (!(result = isEqual(object[props[length]], func[props[length]], sofa.Util.indicatorObject))) {
                        break;
                    }
                }
                return result;
            };
        }
        if (typeof thisArg == 'undefined') {
            return func;
        }
        if (argCount === 1) {
            return function (value) {
                return func.call(thisArg, value);
            };
        }
        if (argCount === 2) {
            return function (a, b) {
                return func.call(thisArg, a, b);
            };
        }
        if (argCount === 4) {
            return function (accumulator, value, index, collection) {
                return func.call(thisArg, accumulator, value, index, collection);
            };
        }
        return function (value, index, collection) {
            return func.call(thisArg, value, index, collection);
        };
    },
    /*jshint eqeqeq:true*/
    //this method is ripped out from lo-dash
    findKey: function (object, callback, thisArg) {
        var result;
        callback = sofa.Util.createCallback(callback, thisArg);
        sofa.Util.forOwn(object, function (value, key, object) {
            if (callback(value, key, object)) {
                result = key;
                return false;
            }
        });
        return result;
    },
    find: function (object, callback, thisArg) {
        var result;
        callback = sofa.Util.createCallback(callback, thisArg);
        sofa.Util.forOwn(object, function (value, key, object) {
            if (callback(value, key, object)) {
                result = value;
                return false;
            }
        });
        return result;
    },
    every: function (collection, callback, thisArg) {
        var result = true;

        callback = sofa.Util.createCallback(callback, thisArg);

        sofa.Util.forOwn(collection, function (value, key, object) {
            if (!callback(value, key, object)) {
                result = false;
                return false;
            }
        });

        return result;
    },
    //this method is ripped out from lo-dash
    forOwn: function (collection, callback) {
        var index,
            iterable = collection,
            result = iterable;

        if (!iterable) {
            return result;
        }

        if (!sofa.Util.objectTypes[typeof iterable]) {
            return result;
        }

        for (index in iterable) {
            if (Object.prototype.hasOwnProperty.call(iterable, index)) {
                if (callback(iterable[index], index, collection) === false) {
                    return result;
                }
            }
        }
        return result;
    },
    debounce: function (func, wait, immediate) {
        var timeout, result;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) {
                    result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                result = func.apply(context, args);
            }
            return result;
        };
    },
    isObject: function (value) {
        return typeof value === 'object';
    },
    isNumber: function (value) {
        return typeof value === 'number';
    },
    isNumeric: function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    },
    isArray: function (value) {
        return toString.call(value) === '[object Array]';
    },
    isFunction: function (value) {
        return typeof value === 'function';
    },
    isString: function (value) {
        return typeof  value === 'string';
    },
    isUndefined: function (value) {
        return typeof value === 'undefined';
    },
    createGuid: function () {
      //http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            /*jshint bitwise: false */
            var r = Math.random() * 16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    },
    capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    Array: {
        /**
        * @method remove
        * @public
        *
        * @description
        * Removes a given item from a given array and returns the manipulated
        * array.
        *
        * @example
        * var arr = ['foo', 'bar'];
        *
        * var newArr = sofa.Util.Array.remove(arr, 'foo');
        *
        * @param {array} arr An array.
        * @param {object} item The item to remove from the array.
        *
        * @return {array} Manipulated array.
        */
        remove: function (arr, item) {
            var index = arr.indexOf(item);
            arr.splice(index, 1);
            return arr;
        }
    },

    // The backend is not returning valid JSON.
    // It sends it wrapped with parenthesis.
    //
    // This function will become obselete soon,
    // see https://github.com/couchcommerce/checkout-api/issues/2
    toJson: function (str) {

        if (!str || !str.length || str.length < 2) {
            return null;
        }

        var jsonStr = str.substring(1, str.length - 1);

        return JSON.parse(jsonStr);
    },

    toFormData: function (obj) {
        var str = [];
        for (var p in obj) {
            str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
        }
        return str.join('&');
    },


    forEach: function (obj, iterator, context) {
        var key;
        if (obj) {
            if (sofa.Util.isFunction(obj)) {
                for (key in obj) {
                    // Need to check if hasOwnProperty exists,
                    // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key);
                    }
                }
            } else if (obj.forEach && obj.forEach !== sofa.Util.forEach) {
                obj.forEach(iterator, context);
            } else if (isArrayLike(obj)) {
                for (key = 0; key < obj.length; key++) {
                    iterator.call(context, obj[key], key);
                }
            } else {
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        iterator.call(context, obj[key], key);
                    }
                }
            }
        }
        return obj;
    }
};

'use strict';
/**
 * @name TreeIterator
 * @namespace sofa.helper.TreeIterator
 *
 * @description
 * We only use the TreeIterator to built a HashMap for fast lookups.
 * So it doesn't really care if we use a depth first or a breadth first approach.
 */
sofa.define('sofa.util.TreeIterator', function (tree, childNodeProperty) {

    var me = this,
        continueIteration = true;

    /**
     * @method iterateChildren
     * @memberof sofa.helper.TreeIterator
     *
     * @description
     * Iterates over a tree of children and applies a given function to
     * each node.
     *
     * @param {function} fn Map function
     */
    me.iterateChildren = function (fn) {
        continueIteration = true;
        return _iterateChildren(tree, fn);
    };

    var _iterateChildren = function (rootCategory, fn, parent) {
        continueIteration = fn(rootCategory, parent);

        if (rootCategory[childNodeProperty] && continueIteration !== false) {
            rootCategory[childNodeProperty].forEach(function (category) {
                if (continueIteration !== false) {
                    _iterateChildren(category, fn, rootCategory);
                }
            });
        }
    };
});

}(window));

/**
 * sofa-basket-service - v0.1.3 - 2014-03-19
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, undefined) {

'use strict';
/* global sofa */
/**
 * @name BasketService
 * @class
 * @namespace sofa.BasketService
 *
 * @description
 * `sofa.BasketService` is the interface to interact with a shopping cart. It provides
 * methods to add, remove or update basket items. It also takes care of writing
 * updates to an available storage service.
 */
sofa.define('sofa.BasketService', function (storageService, configService, options) {

    var self = {},
        storePrefix = 'basketService_',
        storeItemsName = storePrefix + 'items',
        storeCouponsName = storePrefix + 'coupons',
        items = sanitizeSavedData(storageService.get(storeItemsName)) || [],
        activeCoupons = sanitizeSavedData(storageService.get(storeCouponsName)) || [],
        productIdentityFn = options && cc.Util.isFunction(options.productIdentityFn) ?
            options.productIdentityFn : function (productA, productAVariant, productB, productBVariant) {

                var productAVariantID = productAVariant && productAVariant.variantID,
                    productBVariantID = productBVariant && productBVariant.variantID,
                    productAOptionID  = productAVariant && productAVariant.optionID,
                    productBOptionID  = productBVariant && productBVariant.optionID;

                return productA.id === productB.id &&
                       productAVariantID === productBVariantID &&
                       productAOptionID === productBOptionID;
            };


    var SHIPPING_COST       = configService.get('shippingCost'),
        SHIPPING_TAX        = configService.get('shippingTax'),
        FREE_SHIPPING_FROM  = configService.get('freeShippingFrom');


    //allow this service to raise events
    sofa.observable.mixin(self);

    //http://mutablethought.com/2013/04/25/angular-js-ng-repeat-no-longer-allowing-duplicates/
    function sanitizeSavedData(data) {
        if (!data) {
            return data;
        }

        return data.map(function (val) {
            delete val.$$hashKey;

            //on serialization all functions go away. That means, we basically
            //have to create a fresh instance again, once we deserialize again
            var item = sofa.Util.extend(new sofa.models.BasketItem(), val);

            if (item.product) {
                item.product = sofa.Util.extend(new sofa.models.Product(), item.product);
            }

            return item;
        });
    }

    var writeToStore = function () {
        storageService.set(storeItemsName, items);
        storageService.set(storeCouponsName, activeCoupons);
    };

    writeToStore();

    /**
     * @method addItem
     * @memberof sofa.BasketService
     *
     * @description
     * Adds an item to the basket. Returns the added basket item.
     *
     * @example
     * basketService.addItem(product, 1, variants.selectedVariant);
     *
     * @param {object} product The product object itself.
     * @param {number} quantity The number of times the product should be added.
     * @param {object} variant The variant the product should be added with.
     * @param {int} optionId The optionId the product should be added with.
     *
     * @return {object} The added basket item.
     */
    self.addItem = function (product, quantity, variant) {

        if (product.isOutOfStock()) {
            throw new Error('product out of stock');
        }

        var basketItem = self.find(createProductPredicate(product, variant)),
            exists = !sofa.Util.isUndefined(basketItem);

        if (!exists) {
            basketItem = new sofa.models.BasketItem();
            items.push(basketItem);
        }

        basketItem.product = product;
        basketItem.quantity = basketItem.quantity + quantity;
        basketItem.variant = variant;

        writeToStore();

        self.emit('itemAdded', self, basketItem);

        return basketItem;
    };

    /**
     * @method addCoupon
     * @memberof cc.BasketService
     *
     * @description
     * Adds a coupon to the basket.
     *
     * @example
     * basketService.addCoupon(couponData);
     *
     * @param {object} couponData An object which contains coupon metadata such as name, amount and description.
     */
    self.addCoupon = function (couponData) {
        var foundCoupon = cc.Util.find(activeCoupons, function (activeCoupon) {
            return activeCoupon.code === couponData.code;
        });

        if (!foundCoupon) {
            activeCoupons.push(couponData);
            writeToStore();

            self.emit('couponAdded', self, couponData);
        }
    };

    /**
     * @method removeCoupon
     * @memberof cc.BasketService
     *
     * @description
     * Removes a coupon which is currently active in the basket.
     *
     * @example
     * basketService.removeCoupon(couponCode);
     *
     * @param {object} couponCode The code of the coupon to remove
     */
    self.removeCoupon = function (couponCode) {
        var couponToBeRemoved = cc.Util.find(activeCoupons, function (activeCoupon) {
            return activeCoupon.code === couponCode;
        });
        cc.Util.Array.remove(activeCoupons, couponToBeRemoved);

        writeToStore();

        self.emit('couponRemoved', self, couponToBeRemoved);
    };

    /**
     * @method getActiveCoupons
     * @memberof cc.BasketService
     *
     * @description
     * Gets the coupons which are currently active in the basket.
     *
     * @example
     * basketService.getActiveCoupons();
     *
     * @return {object} basketItem An array of objects that contain coupon data
     */
    self.getActiveCoupons = function () {
        return activeCoupons;
    };

    /**
     * @method increaseOne
     * @memberof sofa.BasketService
     *
     * @description
     * This is actually a shorthand for {@link sofa.BasketService#increase sofa.BasketService.increase}. It increases the amount of given basket item by one.
     *
     * @example
     * sofa.BasketService.increaseOne(basketItem);
     * // is equivalent to
     * sofa.BasketService.increase(basketItem, 1);
     *
     * @param {object} basketItem The basketItem that should be increased by one.
     *
     * @return {object} basketItem Updated basket item.
     */
    self.increaseOne = function (basketItem) {
        return self.increase(basketItem, 1);
    };

    /**
     * @method increase
     * @memberof sofa.BasketService
     *
     * @description
     * Increases the quantity of a given basket item by a given value. Increases
     * by one should be done with {@link sofa.BasketService#increaseOne sofa.BasketService.increaseOne}.
     *
     * Behind the scenes, this method is actually a shorthand for
     * `basketService.addItem()` with a particular configuration. Therefore this
     * method returns the updated basket item for post processing.
     *
     * @example
     * // getting an item
     * var item = / *** /;
     * // update item
     * item = basetService.increase(item, 3);
     *
     * @param {object} basketItem Basket item to increase.
     * @param {number} number Number to increase.
     *
     * @return {object} Updated basket item.
     */
    self.increase = function (basketItem, number) {
        return self.addItem(basketItem.product, number, basketItem.variant);
    };

    /**
     * @method exists
     * @memberof sofa.BasketService
     *
     * @description
     * Checks if an product exists in the basket. You have to pass the product to
     * check for. Optionally you can pass a product variant and an option id.
     * Returns `true` or `false` accordingly.
     *
     * @example
     * if (basketService.exists(productX, variantA, optionB)) {
     *  // do sth. with it.
     * }
     *
     * @param {object} product The Product object itself.
     * @param {object} variant The variant the basket should be checked for.
     * @param {int} The optionId the basket should be checked for.
     *
     * @return {bool} True whether the product exists or not.
     */
    self.exists = function (product, variant) {
        var basketItem = self.find(createProductPredicate(product, variant));
        return !sofa.Util.isUndefined(basketItem);
    };

    var createProductPredicate = function (productA, productAVariant) {
        return function (item) {
            return productIdentityFn(productA, productAVariant, item.product, item.variant);
        };
    };

    /**
     * @method removeItem
     * @memberof sofa.BasketService
     *
     * @description
     * Removes an item from the basket.
     *
     * @example
     * basketService.removeItem(product, 1, foo, 3);
     *
     * @param {object} product The Product that should be removed from the basket.
     * @param {number} quantity The quantity that should be removed from the basket.
     * @param {object} variant The variant that should be removed from the basket.
     *
     * @return {object} Removed basket item.
     */
    self.removeItem = function (product, quantity, variant) {
        var basketItem = self.find(createProductPredicate(product, variant));

        if (!basketItem) {
            throw new Error('Product id: ' + product.id +
                ' , variant: ' + variant +
                '  does not exist in the basket');
        }

        if (basketItem.quantity < quantity) {
            throw new Error('remove quantity is higher than existing quantity');
        }

        basketItem.quantity = basketItem.quantity - quantity;

        if (basketItem.quantity === 0) {
            sofa.Util.Array.remove(items, basketItem);
        }

        writeToStore();

        self.emit('itemRemoved', self, basketItem);

        return basketItem;
    };

    /**
     * @method decreaseOne
     * @memberof sofa.BasketService
     *
     * @description
     * Decreases the quantity of a given basket item by one. This is a shorthand
     * method for {@link sofa.BasketService#decrease sofa.BasketService.decrease} and
     * returns the updated basket item.
     *
     * @example
     * var updatedItem = basketService.decreaseOne(item);
     *
     * @param {object} basketItem The basket item that should be decreased by one
     *
     * @return {object} The updated basket item.
     */
    self.decreaseOne = function (basketItem) {
        return self.decrease(basketItem, 1);
    };

    /**
     * @method decrease
     * @memberof sofa.BasketService
     *
     * @description
     * Decreases that quantity of a given basket item by a given number. This is
     * shorthand method for {@link sofa.BasketService#removeItem sofa.BasketItem.removeItem}
     * and therefore returns the updated basket item.
     *
     * @example
     * var item = basketItem.decrease(item, 2);
     *
     * @param {object} basketItem The basketItem that should be decreased by one.
     * @param {number} number Number to decrease.
     *
     * @return {object} Updated basket item.
     */
    self.decrease = function (basketItem, number) {
        return self.removeItem(basketItem.product, number, basketItem.variant);
    };

    /**
     * @method clear
     * @memberof sofa.BasketService
     *
     * @description
     * Removes all items from the basket.
     *
     * @example
     * basketService.clear();
     *
     * @return {object} BasketService instance for method chaining.
     */
    self.clear = function () {

        items.length = 0;
        activeCoupons.length = 0;

        writeToStore();

        self.emit('cleared', self);

        //return self for chaining
        return self;
    };

    /**
     * @method clearCoupons
     * @memberof cc.BasketService
     *
     * @description
     * Removes all active coupons from the basket.
     *
     * @example
     * basketService.clearCoupons();
     *
     * @return {object} BasketService instance for method chaining.
     */
    self.clearCoupons = function () {

        activeCoupons.length = 0;

        writeToStore();

        self.emit('clearedCoupons', self);

        //return self for chaining
        return self;
    };

    /**
     * @method find
     * @memberof sofa.BasketService
     *
     * @description
     * Finds a basket item by the given predicate function.
     *
     * @example
     * var needle = basketService.find(function () [
     *
     * });
     *
     * @param {function} predicate Function to test the basketItem against.
     *
     * @return {object} Found basket item.
     */
    self.find = function (predicate) {
        return sofa.Util.find(items, predicate);
    };


    /**
     * @method getItems
     * @memberof sofa.BasketService
     *
     * @description
     * Returns all basket items.
     *
     * @example
     * var items = basketItem.getItems();
     *
     * @return {array} Basket items.
     */
    self.getItems = function () {
        return items;
    };

    /**
     * @method isEmpty
     * @memberof cc.BasketService
     *
     * @description
     * Returns true if the basket is Empty.
     *
     * @return {boolean} empty state.
     */
    self.isEmpty = function () {
        return items.length === 0;
    };

    /**
     * @method getSummary
     * @memberof sofa.BasketService
     *
     * @description
     * Returns a summary object of the current basket state.
     *
     * @param {object} options Options object.
     *
     * @return {object} Summary object.
     */
    self.getSummary = function (options) {
        var shipping             = SHIPPING_COST || 0,
            shippingTax          = SHIPPING_TAX,
            freeShippingFrom     = FREE_SHIPPING_FROM,
            quantity             = 0,
            sum                  = 0,
            vat                  = 0,
            discount             = 0,
            /* jshint camelcase: false */
            surcharge            =  options && options.paymentMethod &&
                                    sofa.Util.isNumber(options.paymentMethod.surcharge) ?
                                    options.paymentMethod.surcharge : 0,
            surcharge_percentage =  options && options.paymentMethod &&
                                    sofa.Util.isNumber(options.paymentMethod.surcharge_percentage) ?
                                    options.paymentMethod.surcharge_percentage : 0,
            total                = 0;
            /* jshint camelcase: true */
        items.forEach(function (item) {
            var itemQuantity = parseInt(item.quantity, 10);
            var product = item.product;
            //attention this doesn't take variants into account yet!
            var price = item.getPrice();
            var tax = parseInt(product.tax, 10);
            quantity += itemQuantity;
            sum += price * itemQuantity;
            vat += parseFloat(Math.round((price * tax / (100 + tax)) * 100) / 100) * itemQuantity;
        });
        //set the shipping to zero if the sum is above the configured free shipping value
        shipping = freeShippingFrom !== null && freeShippingFrom !== undefined && sum >= freeShippingFrom ? 0 : shipping;

        //if a valid shipping method is provided, use the price and completely ignore
        //the freeShippingFrom config as it's the backend's responsability to check that.
        if (options && options.shippingMethod && sofa.Util.isNumber(options.shippingMethod.price)) {
            shipping = options.shippingMethod.price;
        }

        total = sum + discount;

        /* jshint camelcase: false */
        if (surcharge_percentage) {
            surcharge = total * (surcharge_percentage / 100.0);
        }
        /* jshint camelcase: true */

        total += shipping + surcharge;

        // For each coupon, subtract the discount value
        activeCoupons.forEach(function (coupon) {
            total -= parseFloat(coupon.amount);
        });

        vat += parseFloat(Math.round((shipping * shippingTax / (100 + shippingTax)) * 100) / 100);

        var summary = {
            quantity: quantity,
            sum: sum,
            sumStr: sum.toFixed(2),
            vat: vat,
            vatStr: vat.toFixed(2),
            shipping: shipping,
            shippingStr: shipping.toFixed(2),
            surcharge: surcharge,
            surchargeStr: surcharge.toFixed(2),
            discount: discount,
            total: total,
            totalStr: total.toFixed(2),
            shippingTax: shippingTax
        };

        return summary;
    };
    return self;
});

}(sofa));

/**
 * sofa-checkout-service - v0.1.0 - 2014-03-27
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa,undefined) {

'use strict';
/* global sofa */
/**
 * @name CheckoutService
 * @namespace sofa.CheckoutService
 *
 * @description
 * The `sofa.CheckoutService` provides methods to perform checkouts as well as giving
 * you information about used and last used payment or shipping methods. There are
 * several checkout types supported, all built behind a clean API.
 */
sofa.define('sofa.CheckoutService', function ($http, $q, basketService, loggingService, configService) {

    var self = {};

    var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
        CHECKOUT_URL      = configService.get('checkoutUrl'),
        FULL_CHECKOUT_URL = configService.get('checkoutUrl') + 'ajax.php';

    var lastUsedPaymentMethod,
        lastUsedShippingMethod,
        lastSummaryResponse;

    var redirect = null;

    //allow this service to raise events
    sofa.observable.mixin(self);

    self.createQuoteData = function () {

        var data = basketService
                    .getItems()
                    .map(function (item) {
                        return {
                            // we always want the productId to be a string and this method
                            // has a safer handling of undefined and null values
                            productID: item.product.id + '',
                            qty: item.quantity,
                            variantID: item.getVariantID(),
                            optionID: item.getOptionID()
                        };
                    });

        return data;
    };

    //we need to transform the checkoutModel into something the backend understands
    var createRequestData = function (checkoutModel) {

        if (!checkoutModel) {
            return null;
        }

        var modelCopy = sofa.Util.clone(checkoutModel);
        var requestModel = {};

        if (modelCopy.billingAddress && modelCopy.billingAddress.country) {
            modelCopy.billingAddress.country = checkoutModel.billingAddress.country.value;
            modelCopy.billingAddress.countryLabel = checkoutModel.billingAddress.country.label;
            requestModel.invoiceAddress = JSON.stringify(modelCopy.billingAddress);
        }

        if (modelCopy.shippingAddress && modelCopy.shippingAddress.country) {
            modelCopy.shippingAddress.country = checkoutModel.shippingAddress.country.value;
            modelCopy.shippingAddress.countryLabel = checkoutModel.shippingAddress.country.label;
            requestModel.shippingAddress = JSON.stringify(modelCopy.shippingAddress);
        }

        if (modelCopy.selectedPaymentMethod && modelCopy.selectedPaymentMethod.method) {
            requestModel.paymentMethod = modelCopy.selectedPaymentMethod.method;
        } else {
            requestModel.paymentMethod = modelCopy.selectedPaymentMethod;
        }

        if (modelCopy.selectedShippingMethod && modelCopy.selectedShippingMethod.method) {
            requestModel.shippingMethod = modelCopy.selectedShippingMethod.method;
        }

        requestModel.quote = JSON.stringify(self.createQuoteData());

        var coupons = basketService.getActiveCoupons().map(function (coupon) {
            return coupon.code;
        });
        requestModel.coupons = JSON.stringify(coupons);

        return requestModel;
    };

    /**
     * @method getLastUsedPaymentMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the last used payment method.
     *
     * @example
     * checkoutService.getLastUsedPaymentMethod();
     *
     * @return {object} Last used payment method.
     */
    self.getLastUsedPaymentMethod = function () {
        return lastUsedPaymentMethod || null;
    };

    /**
     * @method getLastUsedShippingMethod
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns the last used shipping method.
     *
     * @example
     * checkoutService.getLastUsedShippingMethod()
     *
     * @return {object} Last used shipping method.
     */
    self.getLastUsedShippingMethod = function () {
        return lastUsedShippingMethod || null;
    };

    /**
     * @method getShippingMethodsForPayPal
     * @memberof sofa.CheckoutService
     *
     * @description
     * This method delegates to {@link sofa.CheckoutService#getSupportedCheckoutMethods sofa.CheckoutService.getSupportedCheckoutMethods} end returns the supported shipping
     * methods for PayPal. One has to pass a shipping country to determine the
     * supported shipping methods.
     *
     * @example
     * var methods = checkoutService.getShippingMethodsForPayPal(shippingCountry);
     *
     * @param {int} shippingCountry Shipping country id.
     *
     * @return {object} A promise.
     */
    self.getShippingMethodsForPayPal = function (shippingCountry) {
        var checkoutModel = {
            billingAddress: {
                country: shippingCountry || configService.getDefaultCountry()
            },
            shippingAddress: {
                country: shippingCountry || configService.getDefaultCountry()
            },
            selectedPaymentMethod: 'paypal_express'
        };

        return self.getSupportedCheckoutMethods(checkoutModel);
    };

    /**
     * @method getSupportedCheckoutMethods
     * @memberof sofa.CheckoutService
     *
     * @description
     * Returns supported checkout methods by a given checkout model.
     *
     * @param {object} checkoutModel A full featured checkout model.
     *
     * @return {object} A promise.
     */
    self.getSupportedCheckoutMethods = function (checkoutModel) {

        assureCorrectShippingAddress(checkoutModel);

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'GETPAYMENTMETHODS';

        if (sofa.Util.isObject(checkoutModel.selectedPaymentMethod)) {
            lastUsedPaymentMethod = checkoutModel.selectedPaymentMethod;
        }

        if (sofa.Util.isObject(checkoutModel.selectedShippingMethod)) {
            lastUsedShippingMethod = checkoutModel.selectedShippingMethod;
        }

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: cc.Util.toFormData,
            data: requestModel
        })
        .then(function (response) {
            var data = null;

            if (response.data) {
                data = sofa.Util.toJson(response.data);

                if (data) {

                    //We need to fix some types. It's a bug in the backend
                    //https://github.com/couchcommerce/admin/issues/42

                    data.paymentMethods = data.paymentMethods
                                            .map(function (method) {
                                                method.surcharge = parseFloat(method.surcharge);
                                                /* jshint ignore: start */
                                                if (method.surcharge_percentage) {
                                                    method.surcharge_percentage = parseFloat(method.surcharge_percentage);
                                                }
                                                /* jshint ignore: end */
                                                return method;
                                            });

                    data.shippingMethods = data.shippingMethods
                                            .map(function (method) {
                                                method.price = parseFloat(method.price);
                                                return method;
                                            });
                }
            }

            return data;
        }, function (fail) {
            loggingService.error([
                '[CheckoutService: getSupportedCheckoutMethods]',
                '[Request Data]',
                checkoutModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    /**
     * @method checkoutWithCouchCommerce
     * @memberof sofa.CheckoutService
     *
     * @return {object} A promise.
     */
    self.checkoutWithCouchCommerce = function (checkoutModel) {

        assureCorrectShippingAddress(checkoutModel);

        if (checkoutModel.addressEqual) {
            checkoutModel.shippingAddress = checkoutModel.billingAddress;
        }

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'CHECKOUT';

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: cc.Util.toFormData,
            data: requestModel
        })
        .then(function (response) {
            var data = null;
            if (response.data) {
                data = sofa.Util.toJson(response.data);
                data = data.token || null;
            }
            return data;
        }, function (fail) {
            loggingService.error([
                '[CheckoutService: checkoutWithCouchCommerce]',
                '[Request Data]',
                checkoutModel,
                '[Service answer]',
                fail
            ]);

            return $q.reject(fail);
        });
    };

    /**
     * @method checkoutWithPayPal
     * @memberof sofa.CheckoutService
     *
     * @param {object} shippingMethod Shipping method object.
     * @param {object) shippingCountry Country to ship.
     */
    self.checkoutWithPayPal = function (shippingMethod, shippingCountry) {

        var checkoutModel = {
            selectedShippingMethod: shippingMethod,
            selectedPaymentMethod: { method: 'paypal' },
            shippingAddress: {
                country: shippingCountry
            },
            billingAddress: {
                country: shippingCountry
            }
        };

        var requestModel = createRequestData(checkoutModel);
        requestModel.task = 'UPDATEQUOTEPP';

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: cc.Util.toFormData,
            data: requestModel
        })
        .then(function (response) {
            /*jslint eqeq: true*/
            if (response.data == 1) {
                //we set the browser to this backend url and the backend in turn
                //redirects the browser to PayPal. Not sure why we don't redirect the
                //browser directly.
                //TODO: ask Felix
                window.location.href = configService.get('checkoutUrl');
            } else {
                return $q.reject(new Error('invalid server response'));
            }
        })
        .then(null, function (fail) {
            loggingService.error([
                '[CheckoutService: checkoutWithPayPal]',
                '[Request Data]',
                requestModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    var safeUse = function (property) {
        return property === undefined || property === null ? '' : property;
    };

    //unfortunately the backend uses all sorts of different address formats
    //this one converts an address coming from a summary response to the
    //generic app address format.
    var convertAddress = function (backendAddress) {

        backendAddress = backendAddress || {};

        var country = {
            value: safeUse(backendAddress.country),
            label: safeUse(backendAddress.countryname)
        };

        return {
            company:            safeUse(backendAddress.company),
            salutation:         safeUse(backendAddress.salutation),
            surname:            safeUse(backendAddress.lastname),
            name:               safeUse(backendAddress.firstname),
            street:             safeUse(backendAddress.street1),
            zip:                safeUse(backendAddress.zip),
            city:               safeUse(backendAddress.city),
            country:            !country.value ? null : country,
            email:              safeUse(backendAddress.email),
            telephone:          safeUse(backendAddress.telephone)
        };
    };

    //we want to make sure that the server returned summary can be used
    //out of the box to work with our summary templates/directives, hence
    //we have to convert it (similar to how we do it for the addresses).
    var convertSummary = function (backendSummary) {
        backendSummary = backendSummary || {};

        return {
            sum:            safeUse(backendSummary.subtotal),
            shipping:       safeUse(backendSummary.shipping),
            surcharge:      safeUse(backendSummary.surcharge),
            vat:            safeUse(backendSummary.vat),
            total:          safeUse(backendSummary.grandtotal)
        };
    };

    /**
     * @method getSummary
     * @memberof sofa.CheckoutService
     *
     * @return {object} A promise.
     */
    self.getSummary = function (token) {
        return $http({
            method: 'POST',
            url: CHECKOUT_URL + 'summaryst.php',
            headers: FORM_DATA_HEADERS,
            transformRequest: cc.Util.toFormData,
            data: {
                details: 'get',
                token: token
            }
        })
        .then(function (response) {
            var data = {};
            data.response = sofa.Util.toJson(response.data);
            data.invoiceAddress = convertAddress(data.response.billing);
            data.shippingAddress = convertAddress(data.response.shipping);
            data.summary = convertSummary(data.response.totals);
            data.token = token;

            lastSummaryResponse = data;

            // For providers such as CouchPay
            if (data.response.redirect) {
                redirect = { token: token, redirect: data.response.redirect };
            } else {
                redirect = null;
            }

            return data;
        });
    };

    /**
     * @method getLastSummary
     * @memberof sofa.CheckoutService
     *
     * @return {object} Last summary response.
     */
    self.getLastSummary = function () {
        return lastSummaryResponse;
    };

    /**
     * @method activateOrder
     * @memberof sofa.CheckoutService
     *
     * @return {object} A promise.
     */
    //that's the final step to actually create the order on the backend
    self.activateOrder = function (token) {

        // docheckoutst.php cannot be called here if a payment method redirects us
        // as the backend needs to finalize the order
        if (redirect && redirect.token === token) {
            window.location.href = configService.get('checkoutUrl') + redirect.redirect + '?token=' + token;
            throw 'stop execution';
        }

        return $http({
            method: 'POST',
            url: CHECKOUT_URL + 'docheckoutst.php',
            headers: FORM_DATA_HEADERS,
            transformRequest: cc.Util.toFormData,
            data: {
                details: 'get',
                token: token
            }
        })
        .then(function (response) {
            var json = sofa.Util.toJson(response.data);

            return json;
        }, function (fail) {
            loggingService.error([
                '[CheckoutService: checkoutWithCouchCommerce]',
                '[Request Data]',
                token,
                '[Service answer]',
                fail
            ]);

            return $q.reject(fail);
        });
    };

    var assureCorrectShippingAddress = function (checkoutModel) {
        if (checkoutModel.addressEqual) {
            checkoutModel.shippingAddress = checkoutModel.billingAddress;
        }
        return checkoutModel;
    };

    return self;
});

} (sofa));

/**
 * sofa-couch-service - v0.1.0 - 2014-03-26
 * 
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, undefined) {

'use strict';
/* global sofa */
/**
 * @name CouchService
 * @namespace sofa.CouchService
 *
 * @description
 * `CouchService` let's you interact with the CouchCommerce API. It provides methods
 * to get products, get preview data or handling with categories.
 */
sofa.define('sofa.CouchService', function ($http, $q, configService) {

    var self = {},
        products = {},
        productComparer = new sofa.comparer.ProductComparer(),
        categoryMap = null,
        inFlightCategories = null;

    var MEDIA_FOLDER        = configService.get('mediaFolder'),
        MEDIA_IMG_EXTENSION = configService.get('mediaImgExtension'),
        API_URL             = configService.get('apiUrl'),
        //this is not exposed to the SAAS hosted product, hence the default value
        API_HTTP_METHOD     = configService.get('apiHttpMethod', 'jsonp'),
        STORE_CODE          = configService.get('storeCode'),
        CATEGORY_JSON       = configService.get('categoryJson');

    /**
     * @method isAChildAliasOfB
     * @memberof sofa.CouchService
     *
     * @description
     * Checks whether a given category a exists as an child
     * on another category b. Taking only direct childs into account.
     *
     * @param {object} a Category a.
     * @param {object} b Category b.
     *
     * @return {boolean}
     */
    self.isAChildAliasOfB = function (categoryA, categoryB) {
        if (!categoryB.children || categoryB.children.length === 0) {
            return false;
        }

        var alias = sofa.Util.find(categoryB.children, function (child) {
            return child.urlId === categoryA.urlId;
        });

        return !sofa.Util.isUndefined(alias);
    };

    /**
     * @method isAParentOfB
     * @memberof sofa.CouchService
     *
     * @description
     * Checks whether a given category is the parent of another category taking
     * n hops into account.
     *
     * @param {object} a Category a.
     * @param {object} b Category b.
     *
     * @return {boolean}
     */
    self.isAParentOfB = function (categoryA, categoryB) {
        //short circuit if it's a direct parent, if not recursively check
        return categoryB.parent === categoryA ||
               (categoryB.parent && self.isAParentOfB(categoryA, categoryB.parent)) === true;
    };

    /**
     * @method isAChildOfB
     * @memberof sofa.CouchService
     *
     * @description
     * Checks whether a given category is the child
     * of another category taking n hops into account.
     *
     * @param {object} a Category a.
     * @param {object} b Category b.
     *
     * @return {boolean}
     */
    self.isAChildOfB = function (categoryA, categoryB) {
        return self.isAParentOfB(categoryB, categoryA);
    };

    /**
     * @method getCategory
     * @memberof sofa.CouchService
     *
     * @description
     * Fetches the category with the given `categoryUrlId` If no category is
     * specified, the method defaults to the root category.
     *
     * @param {object} categoryUrlId The category to be fetched.
     * @return {Promise} A promise.
     */
    self.getCategory = function (category) {
        if (!category && !categoryMap) {
            return fetchAllCategories();
        } else if (!category && categoryMap) {
            return $q.when(categoryMap.rootCategory);
        } else if (category && category.length > 0 && !categoryMap) {
            return fetchAllCategories().then(function () {
                return categoryMap.getCategory(category);
            });
        } else if (category && category.length > 0 && categoryMap) {
            return $q.when(categoryMap.getCategory(category));
        }
    };

    /**
     * @method getProducts
     * @memberof sofa.CouchService
     *
     * @description
     * Fetches all products of a given category.
     *
     * @param {int} categoryUrlId The urlId of the category to fetch the products from.
     * @preturn {Promise} A promise that gets resolved with products.
     */
    self.getProducts = function (categoryUrlId) {

        if (!products[categoryUrlId]) {
            return $http({
                method: API_HTTP_METHOD,
                url: API_URL +
                '?&stid=' +
                STORE_CODE +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK'
            }).then(function (data) {
                var tempProducts = augmentProducts(data.data.products, categoryUrlId);
                //FixMe we are effectively creating a memory leak here by caching all
                //seen products forever. This needs to be more sophisticated
                products[categoryUrlId] = tempProducts;
                return tempProducts;
            });
        }
        return $q.when(products[categoryUrlId]);
    };

    //it's a bit akward that we need to do that. It should be adressed
    //directly on our server API so that this extra processing can be removed.
    var augmentProducts = function (products, categoryUrlId) {
        return products.map(function (product) {
            product.categoryUrlId = categoryUrlId;
            // the backend is sending us prices as strings.
            // we need to fix that up for sorting and other things to work
            product.price = parseFloat(product.price, 10);
            return sofa.Util.extend(new sofa.models.Product(), product);
        });
    };

    /**
     * @method getNextProduct
     * @memberof sofa.CouchService
     *
     * @description
     * Fetches the next product within the product's category.
     *
     * @param {object} product The product to find the neighbour of.
     * @return {object} Next product.
     */
    self.getNextProduct = function (product, circle) {

        var getTargetProduct = function (categoryProducts) {
            var index = getIndexOfProduct(categoryProducts, product);
            if (index > -1) {
                var nextProduct = categoryProducts[index + 1];
                var targetProduct = !nextProduct && circle ?
                                    categoryProducts[0] : nextProduct || null;

                return targetProduct;
            }
        };

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    /**
     * @method getPreviousProduct
     * @memberof sofa.CouchService
     *
     * @description
     * Fetches the previous product within the product's category.
     *
     * @param {object} product The product to find the neighbour of.
     * @return {object} Previous product.
     */
    self.getPreviousProduct = function (product, circle) {

        var getTargetProduct = function (categoryProducts, baseProduct) {
            var index = getIndexOfProduct(categoryProducts, baseProduct);
            if (index > -1) {
                var previousProduct = categoryProducts[index - 1];
                var targetProduct = !previousProduct && circle ?
                                    categoryProducts[categoryProducts.length - 1] :
                                    previousProduct || null;

                return targetProduct;
            }
        };

        return getPreviousOrNextProduct(product, circle, getTargetProduct);
    };

    var getPreviousOrNextProduct = function (product, circle, productFindFn) {
        var cachedProducts = products[product.categoryUrlId];

        if (cachedProducts) {
            return $q.when(productFindFn(cachedProducts, product));
        } else {
            return  self.getProducts(product.categoryUrlId).then(function (catProducts) {
                return productFindFn(catProducts, product);
            });
        }
    };

    var getIndexOfProduct = function (productTable, product) {
        for (var i = 0; i < productTable.length; i++) {
            if (productComparer(productTable[i], product)) {
                return i;
            }
        }
        return -1;
    };


    /**
     * @method getProduct
     * @memberof sofa.CouchService
     *
     * @description
     * Fetches a single product. Notice that both the `categoryUrlId`
     * and the `productUrlId` need to be specified in order to get the product.
     *
     * @param {int} categoryUrlId The urlId of the category the product belongs to.
     * @param {int} productUrlId The urlId of the product itself.
     *
     * @return {object} product
     */
    self.getProduct = function (categoryUrlId, productUrlId) {
        if (!products[categoryUrlId]) {
            return  self.getProducts(categoryUrlId).then(function (data) {
                return getProduct(data, productUrlId);
            });
        }
        return $q.when(getProduct(products[categoryUrlId], productUrlId));
    };

    var getProduct = function (products, productUrlId) {
        for (var i = 0; i < products.length; i++) {
            var product = products[i];
            if (product.urlKey === productUrlId) {
                return product;
            }
        }
        return null;
    };

    var fetchAllCategories = function () {
        //if multiple parties cause fetching all categories at startup
        //we need to make sure they actually only cause loading the categories
        //ONCE! Otherwise we end up with multiple instances of our category tree
        //and hell breaks loose.
        //TODO: at tests for this!

        if (!inFlightCategories) {
            inFlightCategories = $http({
                method: 'get',
                url: CATEGORY_JSON
            }).then(function (data) {
                var rootCategory = data.data;
                categoryMap = new sofa.util.CategoryMap();
                categoryMap.rootCategory = rootCategory;
                augmentCategories(rootCategory);
                return rootCategory;
            });
        }

        return inFlightCategories;
    };

    var augmentCategories = function (categories) {
        //we need to fix the urlId for the rootCategory to be empty
        categories.urlId = '';
        categories.isRoot = true;
        var iterator = new sofa.util.TreeIterator(categories, 'children');
        iterator.iterateChildren(function (category, parent) {
            category.isRoot = category.isRoot || false;
            category.parent = parent;
            category.image = MEDIA_FOLDER + category.urlId + '.' + MEDIA_IMG_EXTENSION;
            category.hasChildren = category.children && category.children.length > 0;
            categoryMap.addCategory(category);
        });
    };

    return self;
});

'use strict';
/* global sofa */
/**
 * @name ProductComparer
 * @namespace cc.comparer.ProductComparer
 *
 * @description
 *
 */
sofa.define('sofa.comparer.ProductComparer', function () {
    return function (a, b) {

        //either compare products by object identity, urlKey identity or id identity
        return  a === b ||
                a.urlKey && b.urlKey && a.urlKey === b.urlKey ||
                a.id && b.id && a.id === b.id;
    };
});

'use strict';
/* global sofa */
/**
 * @name CategoryMap
 * @namespace sofa.helper.CategoryMap
 *
 * @description
 * Category mapping service that sets up mappings between category urls and category
 * objects.
 */
sofa.define('sofa.util.CategoryMap', function () {


    var self = {};

    var map = {};

    /**
     * @method addCategory
     * @memberof sofa.helper.CategoryMap
     *
     * @description
     * Adds a new category to the map.
     *
     * @param {object} category A category object
     */
    self.addCategory = function (category) {
        if (!map[category.urlId]) {
            map[category.urlId] = category;
        } else {
            //if we had this category before but now have another one aliased with the same id
            //we have to look if this one has children. If it has children, than it should have
            //precedence

            if (category.children && category.children.length > 0) {
                map[category.urlId] = category;
            }
        }
    };

    /**
     * @method getCategory
     * @memberof sofa.CategoryMap
     *
     * @description
     * Returns a category by a given `urlId` from the map.
     *
     * @param {int} urlId Category url id.
     *
     * @return {object} Category object.
     */
    self.getCategory = function (urlId) {
        return map[urlId];
    };

    return self;

});

} (sofa));

/**
 * sofa-coupon-service - v0.1.0 - 2014-03-28
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, undefined) {

'use strict';
/* global sofa */
/**
 * @name CouponService
 * @namespace sofa.CouponService
 *
 * @description
 * A service that allows you to validate coupon codes against the backend.
 */
sofa.define('sofa.CouponService', function ($http, $q, basketService, checkoutService, loggingService, configService) {

    var self = {};

    var FORM_DATA_HEADERS = {'Content-Type': 'application/x-www-form-urlencoded'},
        CHECKOUT_URL      = configService.get('checkoutUrl'),
        FULL_CHECKOUT_URL = CHECKOUT_URL + 'coupon.php';

    /**
     * @method submitCode
     * @memberof sofa.CouponService
     *
     * @description
     * Validates a coupon code against the backend.
     *
     * @example
     * couponService.submitCode(couponCode);
     *
     * @param {object} couponCode The code of the coupon to validate
     */
    self.submitCode = function (couponCode) {

        if (!couponCode) {
            return $q.reject(new Error('No couponCode given!'));
        }

        var couponModel = {
            task: 'INFO',
            coupon: couponCode,
            quote: JSON.stringify(checkoutService.createQuoteData())
        };

        return $http({
            method: 'POST',
            url: FULL_CHECKOUT_URL,
            headers: FORM_DATA_HEADERS,
            transformRequest: sofa.Util.toFormData,
            data: couponModel
        }).then(function (response) {
            if (response.data.error) {
                return $q.reject(response.data.error);
            }
            basketService.addCoupon(response.data);
            return response.data;
        }, function (fail) {
            loggingService.error([
                '[CouponService: submitCode]',
                '[Request Data]',
                couponModel,
                '[Service answer]',
                fail
            ]);
            return $q.reject(fail);
        });
    };

    // When the cart changes, refresh the values of the coupons
    // by sending them to the backend along with the new cart
    var updateCoupons = function () {
        var activeCoupons = basketService.getActiveCoupons();

        var oldCouponCodes = activeCoupons.map(function (activeCoupon) {
            return activeCoupon.code;
        });

        basketService.clearCoupons();

        oldCouponCodes.forEach(function (couponCode) {
            self.submitCode(couponCode);
        });
    };

    basketService
        .on('itemAdded', updateCoupons)
        .on('itemRemoved', updateCoupons)
        .on('clear', updateCoupons);

    return self;
});

} (sofa));

;(function (sofa, document, undefined) {

'use strict';
/* global navigator */
/* global document */
/* global sofa */
/**
 * @name DeviceService
 * @namespace sofa.DeviceService
 *
 * @description
 * This is a helper service that gives you methods to check for certain contexts
 * on touch devices etc.. It determines the state for the usage of flexbox as well
 * as things like overflow:scroll support.
 */
sofa.define('sofa.DeviceService', function ($window) {
    var self = {};

    var ua = navigator.userAgent,
        htmlTag,
        isIpadOnIos7,
        uaindex,
        userOS,
        userOSver;

    var MODERN_FLEXBOX_SUPPORT = 'cc-modern-flexbox',
        NO_MODERN_FLEXBOX_SUPPORT = 'cc-no-modern-flexbox',
        IPAD_ON_IOS_7 = 'cc-ipad-ios-7';

    /**
     * @method getHtmlTag
     * @memberof cc.DeviceService
     *
     * @description
     * Returns an HTMLDomObject for HTML.
     *
     * @return {object} HTMLDomObject
     */
    self.getHtmlTag = function () {
        htmlTag = htmlTag || document.getElementsByTagName('html')[0];
        return htmlTag;
    };

    // determine OS
    if (ua.match(/iPad/i) || ua.match(/iPhone/i)) {
        userOS = 'iOS';
        uaindex = ua.indexOf('OS ');
    }
    else if (ua.match(/Android/i)) {
        userOS = 'Android';
        uaindex = ua.indexOf('Android ');
    }
    else {
        userOS = 'unknown';
    }

    // determine version
    if (userOS === 'iOS'  &&  uaindex > -1) {
        userOSver = ua.substr(uaindex + 3, 3).replace('_', '.');
    } else if (userOS === 'Android'  &&  uaindex > -1) {
        userOSver = ua.substr(uaindex + 8, 3);
    } else {
        userOSver = 'unknown';
    }

    // determine iPad + iOS7 (for landscape innerHeight bug, see flagIpadOnIos7() )
    isIpadOnIos7 = ua.match(/iPad/i) && userOSver.substr(0, 1) === '7';

    /**
     * @method isIpadOnIos7
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a boolean indicating whether the device is an iPad running iOS7 or not.
     *
     * @return {boolean}
     */
    self.isIpadOnIos7 = function () {
        return isIpadOnIos7;
    };

    var dimensions = {};

    var updateDimension = function () {
        dimensions.width = $window.innerWidth;
        dimensions.height = $window.innerHeight;
    };

    updateDimension();

    $window.addEventListener('orientationchange', updateDimension, false);

    var versionStartsWith = function (str) {
        var version = self.getOsVersion();
        return version.indexOf(str) === 0;
    };

    /**
     * @method getViewportDimensions
     * @memberof cc.DeviceService
     *
     * @description
     * Returns the height of the viewport
     *
     * @return {int}
     */
    self.getViewportDimensions = function () {
        return dimensions;
    };

    /**
     * @method isInPortraitMode
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a bool indicating whether the decice is held in portrait mode.
     *
     * @return {bool} boolean
     */
    self.isInPortraitMode = function () {
        return dimensions.height > dimensions.width;
    };

    /**
     * @method isLandscapeMode
     * @memberof cc.DeviceService
     *
     * @description
     * Returns a bool indicating whether the decice is held in landscape mode.
     *
     * @return {boolean}
     */
    self.isInLandscapeMode = function () {
        return !self.isInPortraitMode();
    };

    /**
     * @method isTabletSiye
     * @memberof sofa.DeviceService
     *
     * @description
     * Returns true if the current device is in "TabletSize". See SO link for more
     * information (http://stackoverflow.com/questions/6370690/media-queries-how-to-target-desktop-tablet-and-mobile).
     *
     * @return {boolean} Whether the device is in tablet size or not.
     */
    self.isTabletSize = function () {
        return $window.screen.width > 641;
    };

    /**
     * @method isStockAndroidBrowser
     * @memberof sofa.DeviceService
     *
     * @description
     * Checks if browser is stock android browser or not.
     *
     * @return {boolean}
     */
    self.isStockAndroidBrowser = function () {
        return userOS === 'Android' && ua.indexOf('Chrome') < 0;
    };

    /**
     * @method flagOs
     * @memberof sofa.DeviceService
     *
     * @description
     * Flags the current document with an SDK specific class depending on the OS
     * of the device.
     */
    self.flagOs = function () {
        var htmlTag = self.getHtmlTag();
        var version = self.getOsVersion();
        var majorVersion = version.length > 0 ? version[0] : '0';
        htmlTag.className += ' cc-os-' + self.getOs().toLowerCase() + ' cc-osv-' + majorVersion;
    };

    /**
     * @method flagOverflowSupport
     * @memberof sofa.DeviceService
     *
     * @description
     * Flags the current document with an SDK specific class depending on given
     * overflow:scroll support.
     */
    self.flagOverflowSupport = function () {
        var htmlTag = self.getHtmlTag();
        htmlTag.className += self.hasOverflowSupport() ? ' cc-has-overflow-support' : ' cc-has-no-overflow-support';
    };

     /**
      * @method getUserAgent
      * @memberof sofa.DeviceService
      *
      * @description
      *
      * @example
      *
      * @return {string} User agent currently in use
      */
    self.getUserAgent = function () {
        return ua;
    };

    /**
     * @method getOs
     * @memberof sofa.DeviceService
     *
     * @description
     * Returns OS string.
     *
     * @return {string} Name of OS.
     */
    self.getOs = function () {
        return userOS;
    };

    /**
     * @method getOsVersion
     * @memberof sofa.DeviceService
     *
     * @description
     * Returns OS version string.
     *
     * @return {string} Version of OS.
     */
    self.getOsVersion = function () {
        return userOSver;
    };

    /**
     * @method isAndroid2x
     * @memberof sofa.DeviceService
     *
     * @description
     * Returns true if device os is Android and version starts with '2'.
     *
     * @return {bool}
     */
    self.isAndroid2x = function () {
        return self.getOs() === 'Android' && versionStartsWith('2');
    };

    /**
     * @method hasOverflowSupport
     * @memberof sofa.DeviceService
     *
     * @description
     * Checks if the current device is blacklisted as such with no overflow:scroll support
     *
     * @return {boolean}
     */
    self.hasOverflowSupport = function () {
        if (self.getOs() === 'Android') {
            return !versionStartsWith('2');
        } else if (self.getOs() === 'iOS') {
            return  !versionStartsWith('1') &&
                    !versionStartsWith('2') &&
                    !versionStartsWith('3') &&
                    !versionStartsWith('4');
        }
    };

    /**
     * @method hasModernFlexboxSupport
     * @memberof sofa.DeviceService
     *
     * @description
     * Checks if the browser has modern flexbox support or not.
     *
     * @return {boolean}
     */
    self.hasModernFlexboxSupport = function () {

        // Firefox currently has a flexbox bug
        // See http://stackoverflow.com/a/17435156/956278
        if (ua.match(/Firefox/i)) {
            return false;
        }

        var supportedValues = [
            '-webkit-flex',
            '-moz-flex',
            '-o-flex',
            '-ms-flex',
            'flex'
        ];

        var testSpan = document.createElement('span');

        supportedValues.forEach(function (value) {
            testSpan.style.display = value;
        });

        return supportedValues.indexOf(testSpan.style.display) > -1;
    };

    /**
     * @method flagModernFlexboxSupport
     * @memberof sofa.DeviceService
     *
     * @description
     * Flags the document with an SDK specific class for modern flexbox support.
     */
    self.flagModernFlexboxSupport = function () {
        var htmlTag = self.getHtmlTag();
        if (self.hasModernFlexboxSupport()) {
            htmlTag.className += ' ' + MODERN_FLEXBOX_SUPPORT;
        } else {
            htmlTag.className += ' ' + NO_MODERN_FLEXBOX_SUPPORT;
        }
    };

    /**
     * @method flagIpadOnIos7
     * @memberof cc.DeviceService
     *
     * @description
     * Flags the document with an SDK specific class to help getting around a bug in iOS7 on iPad landscape mode.
     * see http://stackoverflow.com/questions/18855642/ios-7-css-html-height-100-692px
     */
    self.flagIpadOnIos7 = function () {
        if (isIpadOnIos7) {
            var htmlTag = self.getHtmlTag();
            htmlTag.className += ' ' + IPAD_ON_IOS_7;
        }
    };

    /**
     * @method setViewportHeightToDeviceHeight
     * @memberof cc.DeviceService
     *
     * @description
     * Sets the height of the html element to the actual height of the device.
     */
    self.setViewportHeightToDeviceHeight = function () {
        self.getHtmlTag().style.height = self.getViewportDimensions().height + 'px';
    };

    return self;
});

}(sofa, document));

/**
 * sofa-http-service - v0.3.0 - 2014-03-27
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, window, undefined) {

'use strict';
/* global sofa */
/* global XMLHttpRequest */

sofa.define('sofa.HttpService', function ($q) {

    var JSON_START = /^\s*(\[|\{[^\{])/,
        JSON_END = /[\}\]]\s*$/,
        PROTECTION_PREFIX = /^\)\]\}',?\n/,
        CONTENT_TYPE_APPLICATION_JSON = {
            'Content-Type': 'application/json;charset=utf-8'
        },
        ABORTED = -1;

    var rawDocument = window.document;

    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val)
                    .replace(/%40/gi, '@')
                    .replace(/%3A/gi, ':')
                    .replace(/%24/g, '$')
                    .replace(/%2C/gi, ',')
                    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    function indexOf(array, obj) {
        if (array.indexOf) {
            return array.indexOf(obj);
        }

        for (var i = 0; i < array.length; i++) {
            if (obj === array[i]) {
                return i;
            }
        }
        return -1;
    }

    var isString = sofa.Util.isString,
        toJson = sofa.Util.toJson,
        isObject = sofa.Util.isObject,
        isFunction = sofa.Util.isFunction,
        isUndefined = sofa.Util.isUndefined,
        isDefined = function (value) {
            return !isUndefined(value);
        },
        isArray = sofa.Util.isArray,
        forEach = sofa.Util.forEach,
        extend = sofa.Util.extend;


    var fromJson = function (json) {
        return sofa.Util.isString(json) ? JSON.parse(json) : json;
    };

    var lowercase = function (string) {
        return isString(string) ? string.toLowerCase() : string;
    };

    var uppercase = function (string) {
        return isString(string) ? string.toUpperCase() : string;
    };

    var trim = function (value) {
        return isString(value) ? value.trim() : value;
    };

    function transformData(data, headers, fns) {
        if (isFunction(fns)) {
            return fns(data, headers);
        }

        forEach(fns, function (fn) {
            data = fn(data, headers);
        });

        return data;
    }

    function isSuccess(status) {
        return 200 <= status && status < 300;
    }

    function createXhr() {
        return new XMLHttpRequest();
    }

    function headersGetter(headers) {
        var headersObj = isObject(headers) ? headers : undefined;

        return function (name) {
            if (!headersObj) {
                headersObj =  parseHeaders(headers);
            }

            if (name) {
                return headersObj[lowercase(name)] || null;
            }

            return headersObj;
        };
    }

    function parseHeaders(headers) {
        var parsed = {}, key, val, i;

        if (!headers) {
            return parsed;
        }

        forEach(headers.split('\n'), function (line) {
            i = line.indexOf(':');
            key = lowercase(trim(line.substr(0, i)));
            val = trim(line.substr(i + 1));

            if (key) {
                if (parsed[key]) {
                    parsed[key] += ', ' + val;
                } else {
                    parsed[key] = val;
                }
            }
        });

        return parsed;
    }

    var defaults = this.defaults = {
        // transform incoming response data
        transformResponse: [function (data) {
            if (isString(data)) {
                // strip json vulnerability protection prefix
                data = data.replace(PROTECTION_PREFIX, '');
                if (JSON_START.test(data) && JSON_END.test(data)) {
                    data = fromJson(data);
                }
            }
            return data;
        }],

        // transform outgoing request data
        transformRequest: [function (d) {
            return isObject(d) ? toJson(d) : d;
        }],

        // default headers
        headers: {
            common: {
                'Accept': 'application/json, text/plain, */*'
            },
            post:   sofa.Util.clone(CONTENT_TYPE_APPLICATION_JSON),
            put:    sofa.Util.clone(CONTENT_TYPE_APPLICATION_JSON),
            patch:  sofa.Util.clone(CONTENT_TYPE_APPLICATION_JSON)
        },

        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN'
    };

    var httpService = function (requestConfig) {

        var config = {
            method: 'get',
            transformRequest: defaults.transformRequest,
            transformResponse: defaults.transformResponse
        };

        var headers = mergeHeaders(requestConfig);

        extend(config, requestConfig);
        config.headers = headers;
        config.method = uppercase(config.method);

        var serverRequest = function (config) {
            headers = config.headers;
            var reqData = transformData(config.data, headersGetter(headers), config.transformRequest);

            // strip content-type if data is undefined
            if (isUndefined(config.data)) {
                forEach(headers, function (value, header) {
                    if (lowercase(header) === 'content-type') {
                        delete headers[header];
                    }
                });
            }

            if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
                config.withCredentials = defaults.withCredentials;
            }

            // send request
            return sendReq(config, reqData, headers).then(transformResponse, transformResponse);
        };

        var chain = [serverRequest, undefined];
        var promise = $q.when(config);

        while (chain.length) {
            var thenFn = chain.shift();
            var rejectFn = chain.shift();

            promise = promise.then(thenFn, rejectFn);
        }

        return promise;

        function transformResponse(response) {
            // make a copy since the response must be cacheable
            var resp = extend({}, response, {
                data: transformData(response.data, response.headers, config.transformResponse)
            });
            return (isSuccess(response.status)) ? resp : $q.reject(resp);
        }

        function mergeHeaders(config) {
            var defHeaders = defaults.headers,
                reqHeaders = extend({}, config.headers),
                defHeaderName, lowercaseDefHeaderName, reqHeaderName;

            defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);

            // execute if header value is function
            execHeaders(defHeaders);
            execHeaders(reqHeaders);

            // using for-in instead of forEach to avoid unecessary iteration after header has been found
            defaultHeadersIteration:
            for (defHeaderName in defHeaders) {
                lowercaseDefHeaderName = lowercase(defHeaderName);

                for (reqHeaderName in reqHeaders) {
                    if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
                        continue defaultHeadersIteration;
                    }
                }
                reqHeaders[defHeaderName] = defHeaders[defHeaderName];
            }

            return reqHeaders;

            function execHeaders(headers) {
                var headerContent;

                forEach(headers, function (headerFn, header) {
                    if (isFunction(headerFn)) {
                        headerContent = headerFn();
                        if (headerContent !== null) {
                            headers[header] = headerContent;
                        } else {
                            delete headers[header];
                        }
                    }
                });
            }
        }
    };

    httpService.pendingRequests = [];
    httpService.callbacks = {
        counter: 0
    };
    httpService.defaults = defaults;

    function sortedKeys(obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys.sort();
    }

    function forEachSorted(obj, iterator, context) {
        var keys = sortedKeys(obj);
        for (var i = 0; i < keys.length; i++) {
            iterator.call(context, obj[keys[i]], keys[i]);
        }
        return keys;
    }

    function buildUrl(url, params) {
        if (!params) {
            return url;
        }
        var parts = [];
        forEachSorted(params, function (value, key) {
            if (value === null || isUndefined(value)) {
                return;
            }

            if (!isArray(value)) {
                value = [value];
            }

            forEach(value, function (v) {
                if (isObject(v)) {
                    v = toJson(v);
                }
                parts.push(encodeUriQuery(key) + '=' +
                            encodeUriQuery(v));
            });
        });

        if (parts.length > 0) {
            url += ((url.indexOf('?') === -1) ? '?' : '&') + parts.join('&');
        }
        return url;
    }

    function sendReq(config, reqData, reqHeaders) {
        var deferred = $q.defer(),
            promise = deferred.promise,
            cache,
            cachedResp,
            url = buildUrl(config.url, config.params);

        httpService.pendingRequests.push(config);
        promise.then(removePendingReq, removePendingReq);


        // if we won't have the response in cache, send the request to the backend
        if (isUndefined(cachedResp)) {
            doActualRequest(config.method, url, reqData, done, reqHeaders, config.timeout,
                config.withCredentials, config.responseType);
        }

        return promise;


        /**
        * Callback registered to $httpBackend():
        *  - caches the response if desired
        *  - resolves the raw $http promise
        *  - calls $apply
        */
        function done(status, response, headersString) {
            if (cache) {
                if (isSuccess(status)) {
                    cache.put(url, [status, response, parseHeaders(headersString)]);
                } else {
                    // remove promise from the cache
                    cache.remove(url);
                }
            }

            resolvePromise(response, status, headersString);
        }


        /**
        * Resolves the raw $http promise.
        */
        function resolvePromise(response, status, headers) {
            // normalize internal statuses to 0
            status = Math.max(status, 0);

            (isSuccess(status) ? deferred.resolve : deferred.reject)({
                data: response,
                status: status,
                headers: headersGetter(headers),
                config: config
            });
        }


        function removePendingReq() {
            var idx = indexOf(httpService.pendingRequests, config);
            if (idx !== -1) {
                httpService.pendingRequests.splice(idx, 1);
            }
        }
    }

    function doActualRequest(method, url, post, callback, headers, timeout, withCredentials, responseType) {

        var status;
        url = url;
        var callbacks = httpService.callbacks;

        if (lowercase(method) === 'jsonp') {
            var callbackId = '_' + (callbacks.counter++).toString(36);
            callbacks[callbackId] = function (data) {
                callbacks[callbackId].data = data;
            };

            var jsonpDone = jsonpReq(url.replace('JSON_CALLBACK', 'sofa.callbacks.' + callbackId),  function () {
                if (callbacks[callbackId].data) {
                    completeRequest(callback, 200, callbacks[callbackId].data);
                } else {
                    completeRequest(callback, status || -2);
                }
                callbacks[callbackId] = function () {};
            });
        } else {
            var xhr = createXhr(method);

            xhr.open(method, url, true);
            forEach(headers, function (value, key) {
                if (isDefined(value)) {
                    xhr.setRequestHeader(key, value);
                }
            });

            // In IE6 and 7, this might be called synchronously when xhr.send below is called and the
            // response is in the cache. the promise api will ensure that to the app code the api is
            // always async
            xhr.onreadystatechange = function () {
                // onreadystatechange might get called multiple times with readyState === 4 on mobile webkit caused by
                // xhrs that are resolved while the app is in the background (see #5426).
                // since calling completeRequest sets the `xhr` variable to null, we just check if it's not null before
                // continuing
                //
                // we can't set xhr.onreadystatechange to undefined or delete it because that breaks IE8 (method=PATCH) and
                // Safari respectively.
                if (xhr && xhr.readyState === 4) {
                    var responseHeaders = null,
                        response = null;

                    if (status !== ABORTED) {
                        responseHeaders = xhr.getAllResponseHeaders();

                        // responseText is the old-school way of retrieving response (supported by IE8 & 9)
                        // response/responseType properties were introduced in XHR Level2 spec (supported by IE10)
                        response = ('response' in xhr) ? xhr.response : xhr.responseText;
                    }

                    completeRequest(callback,
                        status || xhr.status,
                        response,
                        responseHeaders);
                }
            };

            if (responseType) {
                try {
                    xhr.responseType = responseType;
                } catch (e) {
                    // WebKit added support for the json responseType value on 09/03/2013
                    // https://bugs.webkit.org/show_bug.cgi?id=73648. Versions of Safari prior to 7 are
                    // known to throw when setting the value "json" as the response type. Other older
                    // browsers implementing the responseType
                    //
                    // The json response type can be ignored if not supported, because JSON payloads are
                    // parsed on the client-side regardless.
                    if (responseType !== 'json') {
                        throw e;
                    }
                }
            }

            xhr.send(post || null);
        }

        function completeRequest(callback, status, response, headersString) {

            jsonpDone = xhr = null;
            // fix status code when it is 0 (0 status is undocumented).
            // Occurs when accessing file resources.
            // On Android 4.1 stock browser it occurs while retrieving files from application cache.
            status = (status === 0) ? (response ? 200 : 404) : status;
            callback(status, response, headersString);
        }

        function jsonpReq(url, done) {
            // we can't use jQuery/jqLite here because jQuery does crazy shit with script elements, e.g.:
            // - fetches local scripts via XHR and evals them
            // - adds and immediately removes script elements from the document
            var script = rawDocument.createElement('script'),
                doneWrapper = function () {
                    script.onreadystatechange = script.onload = script.onerror = null;
                    rawDocument.body.removeChild(script);
                    if (done) {
                        done();
                    }
                };

            script.type = 'text/javascript';
            script.src = url;

            script.onload = script.onerror = function () {
                doneWrapper();
            };

            rawDocument.body.appendChild(script);
            return doneWrapper;
        }
    }

    var createShortMethods = function () {
        forEach(arguments, function (name) {
            httpService[name] = function (url, config) {
                return httpService(extend(config || {}, {
                    method: name,
                    url: url
                }));
            };
        });
    };

    var createShortMethodsWithData = function () {
        forEach(arguments, function (name) {
            httpService[name] = function (url, data, config) {
                return httpService(extend(config || {}, {
                    method: name,
                    url: url,
                    data: data
                }));
            };
        });
    };

    createShortMethods('get', 'jsonp');
    createShortMethodsWithData('post');

    return httpService;
});

} (sofa, window));

;(function (sofa, console, undefined) {

'use strict';
/* global sofa */
/* global console */
/**
 * @name LoggingService
 * @namespace sofa.LoggingService
 *
 * @description
 * This service abstracts the concrete console interface away. It provides the same
 * methods for logging like `.log()`, `.info()` etc..
 *
 * Use this service to log within your application.
 */
sofa.define('sofa.LoggingService', function (configService) {
    var self = {};

    var enabled = configService.get('loggingEnabled', false);

    var doIfEnabled = function (fn) {
        if (!enabled) {
            return;
        }
        fn();
    };

    var dump = function (data) {
        var output = '\n'; //allways start with a new line for better alignment

        data.forEach(function (line) {
            //for a cleaner output we convert objects to beautified JSON
            output += sofa.Util.isString(line) ? line : JSON.stringify(line, null, 4);
            output += '\n';
        });

        return output;
    };

    /**
     * @method info
     * @memberof sofa.LogingService
     * @public
     *
     * @description
     * A `console.info()` wrapper to log some info in the console.
     *
     * @param {(array|string)} str String or array to log.
     */
    self.info = function (str) {
        doIfEnabled(function () {
            if (sofa.Util.isArray(str)) {
                console.info(dump(str));
            } else {
                console.info(str);
            }
        });
    };

    /**
     * @method log
     * @memberof sofa.LoggingService
     * @public
     *
     * @description
     * A `console.log()` wrapper to log to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.log = function (str) {
        doIfEnabled(function () {
            if (sofa.Util.isArray(str)) {
                console.log(dump(str));
            } else {
                console.log(str);
            }
        });
    };

    /**
     * @method warn
     * @memberof sofa.LoggingService
     * @public
     *
     * @description
     * A `console.warn()` wrapper to log warnings to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.warn = function (str) {
        doIfEnabled(function () {
            if (sofa.Util.isArray(str)) {
                console.warn(dump(str));
            } else {
                console.warn(str);
            }
        });
    };

    /**
     * @method error
     * @memberof sofa.LoggingService
     * @public
     *
     * @description
     * A `console.error()` wrapper to log errors to console.
     *
     * @param {(string|array)} str String or array to log.
     */
    self.error = function (str) {
        doIfEnabled(function () {
            if (sofa.Util.isArray(str)) {
                console.error(dump(str));
            } else {
                console.error(str);
            }
        });
    };

    return self;
});

} (sofa, console));

/**
 * sofa-pages-service - v0.1.0 - 2014-03-24
 * 
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, undefined) {

'use strict';
/* global sofa */
/**
 * @name PagesService
 * @namespace sofa.PagesService
 *
 * @description
 * This service takes care of accessing static page data.
 */
sofa.define('sofa.PagesService', function ($http, $q, configService) {

    var self = {};

    var RESOURCE_URL = configService.get('resourceUrl') + 'html/',
        ABOUT_PAGES  = configService.get('aboutPages');

    /**
     * @method getPage
     * @memberof sofa.PagesService
     *
     * @description
     * Returns a page object by a given id.
     *
     * @param {int} id Page id.
     * @return {object} Page object.
     */
    self.getPage = function (id) {
        return $http({
            method: 'get',
            url: RESOURCE_URL + id + '.html'
        }).then(function (result) {
            if (result.data) {

                //we don't want to directly alter the page config, so we create a copy
                var pageConfig = sofa.Util.clone(self.getPageConfig(id));

                pageConfig.content = result.data;

                return pageConfig;
            }
        });
    };

    /**
     * @method getPageConfig
     * @memberof sofa.PagesService
     *
     * @description
     * Returns a page configuration object by a given page id.
     *
     * @param {int} id Page id.
     * @return {object} Page configuration
     */
    self.getPageConfig = function (id) {
        var page = ABOUT_PAGES.filter(function (page) {
            return page.id === id;
        });

        return page.length > 0 && page[0];
    };

    return self;
});

} (sofa));

;(function (sofa, undefined) {

'use strict';

sofa.define('sofa.QService', function () {
    /**
     * Constructs a promise manager.
     *
     * @param {function(function)} nextTick Function for executing functions in the next turn.
     * @param {function(...*)} exceptionHandler Function into which unexpected exceptions are passed for
     *     debugging purposes.
     * @returns {object} Promise manager.
     */
    function qFactory(nextTick, exceptionHandler) {

        /**
        * @ngdoc
        * @name ng.$q#defer
        * @methodOf ng.$q
        * @description
        * Creates a `Deferred` object which represents a task which will finish in the future.
        *
        * @returns {Deferred} Returns a new instance of deferred.
        */
        var defer = function () {
            var pending = [],
                value, deferred;

            deferred = {

                resolve: function (val) {
                    if (pending) {
                        var callbacks = pending;
                        pending = undefined;
                        value = ref(val);

                        if (callbacks.length) {
                            nextTick(function () {
                                var callback;
                                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                                    callback = callbacks[i];
                                    value.then(callback[0], callback[1], callback[2]);
                                }
                            });
                        }
                    }
                },


                reject: function (reason) {
                    deferred.resolve(reject(reason));
                },


                notify: function (progress) {
                    if (pending) {
                        var callbacks = pending;

                        if (pending.length) {
                            nextTick(function () {
                                var callback;
                                for (var i = 0, ii = callbacks.length; i < ii; i++) {
                                    callback = callbacks[i];
                                    callback[2](progress);
                                }
                            });
                        }
                    }
                },


                promise: {
                    then: function (callback, errback, progressback) {
                        var result = defer();

                        var wrappedCallback = function (value) {
                            try {
                                result.resolve((callback || defaultCallback)(value));
                            } catch (e) {
                                exceptionHandler(e);
                                result.reject(e);
                            }
                        };

                        var wrappedErrback = function (reason) {
                            try {
                                result.resolve((errback || defaultErrback)(reason));
                            } catch (e) {
                                exceptionHandler(e);
                                result.reject(e);
                            }
                        };

                        var wrappedProgressback = function (progress) {
                            try {
                                result.notify((progressback || defaultCallback)(progress));
                            } catch (e) {
                                exceptionHandler(e);
                            }
                        };

                        if (pending) {
                            pending.push([wrappedCallback, wrappedErrback, wrappedProgressback]);
                        } else {
                            value.then(wrappedCallback, wrappedErrback, wrappedProgressback);
                        }

                        return result.promise;
                    },
                    always: function (callback) {

                        function makePromise(value, resolved) {
                            var result = defer();
                            if (resolved) {
                                result.resolve(value);
                            } else {
                                result.reject(value);
                            }
                            return result.promise;
                        }

                        function handleCallback(value, isResolved) {
                            var callbackOutput = null;
                            try {
                                callbackOutput = (callback || defaultCallback)();
                            } catch (e) {
                                return makePromise(e, false);
                            }
                            if (callbackOutput && callbackOutput.then) {
                                return callbackOutput.then(function () {
                                    return makePromise(value, isResolved);
                                }, function (error) {
                                    return makePromise(error, false);
                                });
                            } else {
                                return makePromise(value, isResolved);
                            }
                        }

                        return this.then(function (value) {
                            return handleCallback(value, true);
                        }, function (error) {
                            return handleCallback(error, false);
                        });
                    }
                }
            };

            return deferred;
        };


        var ref = function (value) {
            if (value && value.then) {
                return value;
            }
            return {
                then: function (callback) {
                    var result = defer();
                    nextTick(function () {
                        result.resolve(callback(value));
                    });
                    return result.promise;
                }
            };
        };


        /**
        * @ngdoc
        * @name ng.$q#reject
        * @methodOf ng.$q
        * @description
        * Creates a promise that is resolved as rejected with the specified `reason`. This api should be
        * used to forward rejection in a chain of promises. If you are dealing with the last promise in
        * a promise chain, you don't need to worry about it.
        *
        * When comparing deferreds/promises to the familiar behavior of try/catch/throw, think of
        * `reject` as the `throw` keyword in JavaScript. This also means that if you "catch" an error via
        * a promise error callback and you want to forward the error to the promise derived from the
        * current promise, you have to "rethrow" the error by returning a rejection constructed via
        * `reject`.
        *
        * <pre>
        *   promiseB = promiseA.then(function(result) {
        *     // success: do something and resolve promiseB
        *     //          with the old or a new result
        *     return result;
        *   }, function(reason) {
        *     // error: handle the error if possible and
        *     //        resolve promiseB with newPromiseOrValue,
        *     //        otherwise forward the rejection to promiseB
        *     if (canHandle(reason)) {
        *      // handle the error and recover
        *      return newPromiseOrValue;
        *     }
        *     return $q.reject(reason);
        *   });
        * </pre>
        *
        * @param {*} reason Constant, message, exception or an object representing the rejection reason.
        * @returns {Promise} Returns a promise that was already resolved as rejected with the `reason`.
        */
        var reject = function (reason) {
            return {
                then: function (callback, errback) {
                    var result = defer();
                    nextTick(function () {
                        result.resolve((errback || defaultErrback)(reason));
                    });
                    return result.promise;
                }
            };
        };


        /**
        * @ngdoc
        * @name ng.$q#when
        * @methodOf ng.$q
        * @description
        * Wraps an object that might be a value or a (3rd party) then-able promise into a $q promise.
        * This is useful when you are dealing with an object that might or might not be a promise, or if
        * the promise comes from a source that can't be trusted.
        *
        * @param {*} value Value or a promise
        * @returns {Promise} Returns a promise of the passed value or promise
        */
        var when = function (value, callback, errback, progressback) {
            var result = defer(),
                done;

            var wrappedCallback = function (value) {
                try {
                    return (callback || defaultCallback)(value);
                } catch (e) {
                    exceptionHandler(e);
                    return reject(e);
                }
            };

            var wrappedErrback = function (reason) {
                try {
                    return (errback || defaultErrback)(reason);
                } catch (e) {
                    exceptionHandler(e);
                    return reject(e);
                }
            };

            var wrappedProgressback = function (progress) {
                try {
                    return (progressback || defaultCallback)(progress);
                } catch (e) {
                    exceptionHandler(e);
                }
            };

            nextTick(function () {
                ref(value).then(function (value) {
                    if (done) {
                        return;
                    }
                    done = true;
                    result.resolve(ref(value).then(wrappedCallback, wrappedErrback, wrappedProgressback));
                }, function (reason) {
                    if (done) {
                        return;
                    }
                    done = true;
                    result.resolve(wrappedErrback(reason));
                }, function (progress) {
                    if (done) {
                        return;
                    }
                    result.notify(wrappedProgressback(progress));
                });
            });

            return result.promise;
        };


        function defaultCallback(value) {
            return value;
        }


        function defaultErrback(reason) {
            return reject(reason);
        }


        /**
        * @ngdoc
        * @name ng.$q#all
        * @methodOf ng.$q
        * @description
        * Combines multiple promises into a single promise that is resolved when all of the input
        * promises are resolved.
        *
        * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
        * @returns {Promise} Returns a single promise that will be resolved with an array/hash of values,
        *   each value corresponding to the promise at the same index/key in the `promises` array/hash. If any of
        *   the promises is resolved with a rejection, this resulting promise will be resolved with the
        *   same rejection.
        */
        function all(promises) {
            var deferred = defer(),
                counter = 0,
                /* global isArray: true */
                results = isArray(promises) ? [] : {};

            /* global forEach: true */
            forEach(promises, function (promise, key) {
                counter++;
                ref(promise).then(function (value) {
                    if (results.hasOwnProperty(key)) {
                        return;
                    }
                    results[key] = value;
                    if (!(--counter)) {
                        deferred.resolve(results);
                    }
                }, function (reason) {
                    if (results.hasOwnProperty(key)) {
                        return;
                    }
                    deferred.reject(reason);
                });
            });

            if (counter === 0) {
                deferred.resolve(results);
            }

            return deferred.promise;
        }

        return {
            defer: defer,
            reject: reject,
            when: when,
            all: all
        };
    }


    return qFactory(function (fn) {
        //This is because this service is an Angular rip off. In Angular they
        //use this hook to trigger the dirty checking. For us it's a noop.
        //We just don't want to change the code too much so that we can maintain
        //compatibility to the Angular $q service easily.
        fn();
    }, function (err) {
        //That's the exceptionHandler. For now, just dump all exceptions on the console
        console.log(err);
    });
});

}(sofa));

/**
 * sofa-search-service - v0.1.2 - 2014-03-21
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, undefined) {

'use strict';
/**
 * @name SearchService
 * @namespace sofa.SearchService
 *
 * @description
 * Search service which let's you query against the CouchCommerce API to search
 * for products.
 */
sofa.define('sofa.SearchService', function (configService, $http, $q, applier) {

    var self = {},
        lastRequestToken = null,
        storeCode = configService.get('storeCode'),
        debounceMs = configService.get('searchDebounceMs', 300),
        endpoint = configService.get('searchUrl') + '?callback=JSON_CALLBACK&len=100';

    /**
     * @method search
     * @memberof sofa.SearchService
     *
     * @description
     * Searches for `searchStr` and groups the results if `grouping` is truthy.
     * This search is promise based to let you have flow control. Therefore it
     * returns a promise that gets resolved with the search results.
     *
     * @param {string} searchStr A search string.
     * @param {boolean} grouping Whether to group the results or not.
     *
     * @return {Promise} A promise with the search results.
     */
    self.search = function (searchStr, grouping) {

        var deferredResponse = $q.defer();

        debouncedInnerSearch(deferredResponse, searchStr, grouping);

        return deferredResponse.promise;
    };

    var innerSearch = function (deferredResponse, searchStr, grouping) {

        lastRequestToken = sofa.Util.createGuid();

        var requestToken = lastRequestToken;

        if (!searchStr) {
            deferredResponse.resolve({
                data: {
                    results: [],
                    groupedResults: []
                }
            });
        } else {
            $http({
                method: 'JSONP',
                url: endpoint,
                params: {
                    q: createSearchCommand(normalizeUmlauts(searchStr)),
                    fetch: 'text, categoryUrlKey, categoryName, productUrlKey, productImageUrl'
                }
            }).then(function (response) {
                if (requestToken === lastRequestToken) {
                    if (grouping) {
                        groupResult(response, grouping);
                    }
                    deferredResponse.resolve(response);
                }
            });
        }

        //in an angular context, we need to call the applier to
        //make $http run. For non angular builds, no applier is needed.
        if (applier) {
            applier();
        }
        return deferredResponse.promise;
    };

    var groupResult = function (response) {
        var results = response.data.results;
        var grouped = results.reduce(function (prev, curr) {
            if (!prev[curr.categoryUrlKey]) {
                var group = prev[curr.categoryUrlKey] = {
                    groupKey: curr.categoryUrlKey,
                    groupText: curr.categoryName,
                    items: []
                };
                prev.items.push(group);
            }

            prev[curr.categoryUrlKey].items.push(curr);

            return prev;
        }, { items: [] });
        //we only care about the array. The object was just for fast lookups!
        response.data.groupedResults = grouped.items;
    };

    var debouncedInnerSearch = sofa.Util.debounce(innerSearch, debounceMs);

    var createSearchCommand = function (searchStr) {
        var reverseString = searchStr.split('').reverse().join('');
        return '(text:' + searchStr + '* OR reverse_text:' + reverseString + '*) AND storeCode:' + storeCode;
    };

    var normalizeUmlauts = function (searchStr) {
        return searchStr
                    .replace(/[áàâä]/g, 'a')
                    .replace(/[úùûü]/g, 'u')
                    .replace(/[óòôö]/g, 'o')
                    .replace(/[éèêë]/g, 'e')
                    .replace(/[ß]/g, 'ss');
    };

    return self;
});

}(sofa));

;(function(){
    var store = {},
        win = window,
        doc = win.document,
        localStorageName = 'localStorage',
        namespace = '__storejs__',
        storage

    store.disabled = false
    store.set = function(key, value) {}
    store.get = function(key) {}
    store.remove = function(key) {}
    store.clear = function() {}
    store.transact = function(key, defaultVal, transactionFn) {
        var val = store.get(key)
        if (transactionFn == null) {
            transactionFn = defaultVal
            defaultVal = null
        }
        if (typeof val == 'undefined') { val = defaultVal || {} }
        transactionFn(val)
        store.set(key, val)
    }
    store.getAll = function() {}

    store.serialize = function(value) {
        return JSON.stringify(value)
    }
    store.deserialize = function(value) {
        if (typeof value != 'string') { return undefined }
        try { return JSON.parse(value) }
        catch(e) { return value || undefined }
    }

    // Functions to encapsulate questionable FireFox 3.6.13 behavior
    // when about.config::dom.storage.enabled === false
    // See https://github.com/marcuswestin/store.js/issues#issue/13
    function isLocalStorageNameSupported() {
        try { return (localStorageName in win && win[localStorageName]) }
        catch(err) { return false }
    }

    if (isLocalStorageNameSupported()) {
        storage = win[localStorageName]
        store.set = function(key, val) {
            if (val === undefined) { return store.remove(key) }
            storage.setItem(key, store.serialize(val))
            return val
        }
        store.get = function(key) { return store.deserialize(storage.getItem(key)) }
        store.remove = function(key) { storage.removeItem(key) }
        store.clear = function() { storage.clear() }
        store.getAll = function() {
            var ret = {}
            for (var i=0; i<storage.length; ++i) {
                var key = storage.key(i)
                ret[key] = store.get(key)
            }
            return ret
        }
    } else if (doc.documentElement.addBehavior) {
        var storageOwner,
            storageContainer
        // Since #userData storage applies only to specific paths, we need to
        // somehow link our data to a specific path.  We choose /favicon.ico
        // as a pretty safe option, since all browsers already make a request to
        // this URL anyway and being a 404 will not hurt us here.  We wrap an
        // iframe pointing to the favicon in an ActiveXObject(htmlfile) object
        // (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
        // since the iframe access rules appear to allow direct access and
        // manipulation of the document element, even for a 404 page.  This
        // document can be used instead of the current document (which would
        // have been limited to the current path) to perform #userData storage.
        try {
            storageContainer = new ActiveXObject('htmlfile')
            storageContainer.open()
            storageContainer.write('<s' + 'cript>document.w=window</s' + 'cript><iframe src="/favicon.ico"></frame>')
            storageContainer.close()
            storageOwner = storageContainer.w.frames[0].document
            storage = storageOwner.createElement('div')
        } catch(e) {
            // somehow ActiveXObject instantiation failed (perhaps some special
            // security settings or otherwse), fall back to per-path storage
            storage = doc.createElement('div')
            storageOwner = doc.body
        }
        function withIEStorage(storeFunction) {
            return function() {
                var args = Array.prototype.slice.call(arguments, 0)
                args.unshift(storage)
                // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
                // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
                storageOwner.appendChild(storage)
                storage.addBehavior('#default#userData')
                storage.load(localStorageName)
                var result = storeFunction.apply(store, args)
                storageOwner.removeChild(storage)
                return result
            }
        }

        // In IE7, keys may not contain special chars. See all of https://github.com/marcuswestin/store.js/issues/40
        var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g")
        function ieKeyFix(key) {
            return key.replace(forbiddenCharsRegex, '___')
        }
        store.set = withIEStorage(function(storage, key, val) {
            key = ieKeyFix(key)
            if (val === undefined) { return store.remove(key) }
            storage.setAttribute(key, store.serialize(val))
            storage.save(localStorageName)
            return val
        })
        store.get = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            return store.deserialize(storage.getAttribute(key))
        })
        store.remove = withIEStorage(function(storage, key) {
            key = ieKeyFix(key)
            storage.removeAttribute(key)
            storage.save(localStorageName)
        })
        store.clear = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            storage.load(localStorageName)
            for (var i=0, attr; attr=attributes[i]; i++) {
                storage.removeAttribute(attr.name)
            }
            storage.save(localStorageName)
        })
        store.getAll = withIEStorage(function(storage) {
            var attributes = storage.XMLDocument.documentElement.attributes
            var ret = {}
            for (var i=0, attr; attr=attributes[i]; ++i) {
                var key = ieKeyFix(attr.name)
                ret[attr.name] = store.deserialize(storage.getAttribute(key))
            }
            return ret
        })
    }

    try {
        store.set(namespace, namespace)
        if (store.get(namespace) != namespace) { store.disabled = true }
        store.remove(namespace)
    } catch(e) {
        store.disabled = true
    }
    store.enabled = !store.disabled
    if (typeof module != 'undefined' && module.exports) { module.exports = store }
    else if (typeof define === 'function' && define.amd) { define(store) }
    else { this.store = store }
})();
;(function (sofa, undefined) {

'use strict';
/* global sofa */
/* global store */
/**
 * @name LocalStorageService
 * @namespace sofa.LocalStorageService
 *
 * @description
 * We just wrap store.js in a service here.
 */
sofa.define('sofa.LocalStorageService', function () {
    return store;
});

'use strict';
/* global sofa */
/**
 * @name MemoryStorageService
 * @namespace sofa.MemoryStorageService
 *
 * @description
 * Simple memory storage service. Provides methods to get and set values in form
 * of simple key - value pairs.
 */
sofa.define('sofa.MemoryStorageService', function () {

    var _storage = {};

    /**
     * @method set
     * @memberof sofa.MemoryStorageService
     *
     * @description
     * Sets a value by a given id.
     *
     * @param {string} id Identifier
     * @param {object} data Any kind of data to store under given id.
     */
    var set = function (id, data) {
        _storage[id] = data;
    };

    /**
     * @method get
     * @memberof sofa.MemoryStorageService
     *
     * @description
     * Gets a value by a given id.
     *
     * @param {string} id Identifier
     *
     * @return {object} Stored data.
     */
    var get = function (id) {
        return _storage[id];
    };

    /**
     * @method remove
     * @memberof sofa.MemoryStorageService
     *
     * @description
     * Removes a value by a given id.
     *
     * @param {string} id Identifier
     */
    var remove = function (id) {
        delete _storage[id];
    };

    /**
     * @method clear
     * @memberof sofa.MemoryStorageService
     *
     * @description
     * Clear memory storage.
     */
    var clear = function () {
        _storage = {};
    };

    return {
        set: set,
        get: get,
        remove: remove,
        clear: clear
    };
});

}(sofa));

;(function (sofa, undefined) {

'use strict';
/* global sofa */
/* global Image */
/**
 * @name BingTracker
 * @namespace sofa.tracking.BingTracker
 *
 * @description
 * A Bing Tracker abstraction layer to connect to the SDK's
 * tracker interface.
 */
sofa.define('sofa.tracking.BingTracker', function (options) {

    var self = {};

    /**
     * @method setup
     * @memberof sofa.tracking.BingTracker
     *
     * @description
     * Sets up Bing tracking code snippet with provided client
     * information like account number and domain name.
     */
    self.setup = function () {

    };

    /**
     * @method trackEvent
     * @memberof sofa.tracking.BingTracker
     *
     * @description
     * Dummy tracking method for Bing, only transactions can be tracked.
     */
    self.trackEvent = function () {

    };

    /**
     * @method trackTransaction
     * @memberof sofa.tracking.BingTracker
     *
     * @description
     * Pushes transaction data using the Bing Ecommerce Tracking API
     *
     * @param {object} transactionData Transaction data object.
     */
    self.trackTransaction = function (transactionData) {
        var url = '//flex.msn.com/mstag/tag/' + options.siteId +
        '/analytics.html?dedup=' + (options.dedup || '1') +
        '&domainId=' + (options.domainId) +
        '&type=' + (options.type || '1') +
        '&revenue=' + transactionData.totals.subtotal +
        '&actionid=' + options.actionId;
        var image = new Image(1, 1);
        image.src = url;
    };

    return self;
});

'use strict';
/* global sofa */
/* global document */
/* global window */
/* global Image */
/* global _gaq */
/* global location */
/**
 * @name GoogleAnalyticsTracker
 * @namespace sofa.tracking.GoogleAnalyticsTracker
 *
 * @description
 * A Google Analytics Tracker abstraction layer to connect to the SDK's
 * tracker interface.
 */
sofa.define('sofa.tracking.GoogleAnalyticsTracker', function (options) {

    var self = {};

    /**
     * @method setup
     * @memberof sofa.tracking.GoogleAnalyticsTracker
     *
     * @description
     * Sets up Google Analytics tracking code snippet with provided client
     * information like account number and domain name.
     */
    self.setup = function () {
        var _gaq = self._gaq = window._gaq = window._gaq || [];

        _gaq.push(['_setAccount', options.accountNumber]);
        _gaq.push(['_setDomainName', options.domainName]);
        _gaq.push(['_setAllowLinker', true]);

        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    };

    /**
     * @method trackEvent
     * @memberof sofa.tracking.GoogleAnalyticsTracker
     *
     * @description
     * Explicit event tracking. This method pushes tracking data
     * to Google Analytics.
     *
     * @param {object} eventData Event data object.
     */
    self.trackEvent = function (eventData) {

        eventData.category = eventData.category || '';
        eventData.action = eventData.action || '';
        eventData.label = eventData.label || '';
        eventData.value = eventData.value || '';

        var dataToBePushed = [];

        if (eventData.category === 'pageView') {
            dataToBePushed.push('_trackPageview');
            dataToBePushed.push(eventData.label);
        } else {
            // https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
            dataToBePushed.push('_trackEvent');
            dataToBePushed.push(eventData.category);
            dataToBePushed.push(eventData.action);
            dataToBePushed.push(eventData.label);

            // value is optional
            if (eventData.value) {
                dataToBePushed.push(eventData.value);
            }
        }

        _gaq.push(dataToBePushed);
    };

    /**
     * @method trackTransaction
     * @memberof sofa.tracking.GoogleAnalyticsTracker
     *
     * @description
     * Pushes transaction data using the Google Analytics Ecommerce Tracking API
     *
     * @param {object} transactionData Transaction data object.
     */
    self.trackTransaction = function (transactionData) {

        if (options.conversionId) {
            var url = 'http://www.googleadservices.com/pagead/conversion/' +
                options.conversionId + '/?value=' + transactionData.totals.subtotal + '&label=' +
                options.conversionLabel + '&guid=ON&script=0';
            var image = new Image(1, 1);
            image.src = url;
        }

        _gaq.push(['_gat._anonymizeIp']);
        _gaq.push(['_addTrans',
            transactionData.token,               // transaction ID - required
            location.host,                       // affiliation or store name
            transactionData.totals.subtotal,     // total - required; Shown as "Revenue" in the
                                                 // Transactions report. Does not include Tax and Shipping.
            transactionData.totals.vat,          // tax
            transactionData.totals.shipping,     // shipping
            '',                                  // city
            '',                                  // state or province
            transactionData.billing.countryname, // country
        ]);

        transactionData.items.forEach(function (item) {
            _gaq.push(['_addItem',
                transactionData.token,           // transaction ID - necessary to associate item with transaction
                item.productId,                  // SKU/code - required
                item.name,                       // product name - necessary to associate revenue with product
                '',                              // category or variation
                item.price,                      // unit price - required
                item.qty                         // quantity - required
            ]);
        });

        _gaq.push(['_trackTrans']);

    };

    return self;
});

'use strict';
/* global sofa */
/**
 * @name TrackingService
 * @namespace sofa.TrackingService
 *
 * @description
 * Abstraction layer to communicate with concrete tracker services
 * like Google Analytics.
 */
sofa.define('sofa.tracking.TrackingService', function ($window, $http, configService) {

    var self = {};
    var trackers = self.__trackers = [];

    //allow this service to raise events
    sofa.observable.mixin(self);

    /**
     * @method addTracker
     * @memberof sofa.TrackingService
     *
     * @description
     * Adds a concrete tracker service implementation and also takes care
     * of the setup. It'll throw exceptions if the tracker service
     * doesn't implement the needed API.
     *
     * @param {object} tracker Concrete tracker implementation.
     */
    self.addTracker = function (tracker) {

        if (!tracker.setup) {
            throw new Error('tracker must implement a setup method');
        }

        if (!tracker.trackEvent) {
            throw new Error('tracker must implement a trackEvent method');
        }

        if (!tracker.trackTransaction) {
            throw new Error('tracker must implement a trackTransaction method');
        }

        tracker.setup();
        trackers.push(tracker);
    };

    /**
     * @method trackEvent
     * @memberof sofa.TrackingService
     *
     * @description
     * Forces all registered trackers to track an event.
     *
     * @param {object} eventData Event data object.
     */
    self.trackEvent = function (eventData) {

        self.emit('trackEvent', self, eventData);

        trackers.forEach(function (tracker) {
            tracker.trackEvent(eventData);
        });
    };

    /**
     * @method trackTransaction
     * @memberof sofa.TrackingService
     *
     * @description
     * First requests information about a token from the backend, then
     * forces all registered trackers to track the associated transaction.
     *
     * @param {string} token.
     */
    self.trackTransaction = function (token) {

        var requestTransactionDataUrl = configService.get('checkoutUrl') + 'summaryfin.php';

        $http.get(requestTransactionDataUrl + '?token=' + token + '&details=get')
            .then(function (response) {
                var transactionData = sofa.Util.toJson(response.data);

                transactionData.token = token;

                self.emit('trackTransaction', self, transactionData);

                trackers.forEach(function (tracker) {
                    tracker.trackTransaction(transactionData);
                });
            });

    };

    return self;
});

}(sofa));

/**
 * sofa-url-construction-service - v0.1.2 - 2014-03-20
 * http://www.sofa.io
 *
 * Copyright (c) 2013 CouchCommerce GmbH (http://www.couchcommerce.org) and other contributors
 * THIS SOFTWARE CONTAINS COMPONENTS OF THE SOFA SDK (SOFA.IO).
 * IT IS PROVIDED UNDER THE LICENSE TERMS OF THE ATTACHED LICENSE.TXT.
 */
;(function (sofa, undefined) {

'use strict';
/* global sofa */
/**
 * @name UrlConstructionService
 * @namespace sofa.UrlConstructionService
 *
 * @description
 * As the name says. This service provides methods to construct URLs for
 * different use cases.
 */
sofa.define('sofa.UrlConstructionService', function (configService) {
    var self = {};

    /**
     * @method createUrlForContentPage
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for content page.
     *
     * @param {string} pageId
     * @return {string} Url
     */
    self.createUrlForContentPage = function (pageId) {
        return '/pages/' + pageId;
    };


    /**
     * @method createUrlForProducts
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for products.
     *
     * @param {int} categoryUrlId Category url id.
     * @return {string} Url
     */
    self.createUrlForProducts = function (categoryUrlId) {
        return '/cat/' + categoryUrlId + '/products';
    };

    /**
     * @method createUrlForProduct
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for a product.
     *
     * @param {product} product Product object.
     * @return {string} Url
     */
    self.createUrlForProduct = function (product) {
        return '/cat/' + product.categoryUrlId + '/product/' + product.urlKey;
    };

    /**
     * @method createUrlForCategory
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for a category.
     *
     * @param {int} categoryUrlId Category url id.
     * @return {string} Url
     */
    self.createUrlForCategory = function (categoryUrlId) {
        return '/cat/' + categoryUrlId;
    };

    /**
     * @method createUrlForRootCategory
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for root category.
     *
     * @return {string} Url
     */
    self.createUrlForRootCategory = function () {
        return '';
    };

    /**
     * @method createUrlForCart
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for cart.
     *
     * @return {string} Url
     */
    self.createUrlForCart = function () {
        return '/cart';
    };

    /**
     * @method createUrlForCheckout
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for checkout.
     *
     * @return {string} Url
     */
    self.createUrlForCheckout = function () {
        return '/checkout';
    };

    /**
     * @method createUrlForSummary
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for summary.
     *
     * @param {string} token Summary token.
     * @return {string} Url
     */
    self.createUrlForSummary = function (token) {
        return '/summary/' + token;
    };

    /**
     * @method createUrlForShippingCostsPage
     * @memberof sofa.UrlConstructionService
     *
     * @description
     * Creates url for shipping costs page.
     *
     * @return {string} Url
     */
    self.createUrlForShippingCostsPage = function () {
        return '/pages/' + configService.get('linkShippingCosts', '');
    };

    return self;
});

} (sofa));

;(function (sofa, undefined) {

'use strict';
/* global sofa */
/**
 * @name UrlParserService
 * @namespace sofa.UrlParserService
 *
 * @description
 * This service provides a clean interface when it comes to accessing url ids
 * for categories and products.
 */
sofa.define('sofa.UrlParserService', function ($location) {
    var self = {};

    var views = {
        product: /\/cat\/.*\/product\//i,
        products: /\/cat\/.*\/products/i,
        categories: /\/cat\/[^/]+$/i
    };

    var utilityRegex = {
        urlBeforeCategory: /.*cat\//,
        urlBeforeProduct: /.*\/product\//,
        urlRightFromSlash: /\/.*/
    };

    /**
     * @method isView
     * @memberof sofa.UrlParserService
     *
     * @description
     * Returns true if given `viewName` is a view.
     *
     * @param {string} viewName View name.
     * @return {boolean}
     */
    self.isView = function (viewName) {
        var regex = views[viewName];

        if (!regex) {
            throw new Error(viewName + 'unknown');
        }

        return regex.test($location.path());
    };

    /**
     * @method isRootCategory
     * @memberof sofa.UrlParserService
     *
     * @description
     * Returns true if current location path is a root category.
     *
     * @return {boolean}
     */
    self.isRootCategory = function () {
        var path = $location.path();
        return path === '/' || path === '/cat/';
    };

    /**
     * @method getCategoryUrlId
     * @memberof sofa.UrlParserService
     * 
     * @description
     * Extracts a category url id from a URL for you and returns it.
     *
     * @return {string} Category url id.
     */
    self.getCategoryUrlId = function () {
        return $location.path()
                        .replace(utilityRegex.urlBeforeCategory, '')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    /**
     * @method getProductUrlId
     * @memberof sofa.UrlParserService
     *
     * @description
     * Extracts a Product url id from a URL for you and returns it.
     *
     * @return {string} Product url id.
     */
    self.getProductUrlId = function () {
        return $location.path()
                        .replace(utilityRegex.urlBeforeProduct, '')
                        .replace(utilityRegex.urlRightFromSlash, '');
    };

    return self;
});

} (sofa));
