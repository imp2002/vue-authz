"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
var casbin_js_1 = require("casbin.js");
var useAuthorizer_1 = require("./useAuthorizer");
var vue_demi_1 = require("vue-demi");
var install = function (app, authorizer, options) {
    var availableProperties = [
        'getPermission',
        'setPermission',
        'initEnforcer',
        'getEnforcerDataFromSvr',
        'setUser',
        'can',
        'cannot',
        'canAll',
        'canAny',
    ];
    app.provide(useAuthorizer_1.AUTHORIZER_KEY, authorizer);
    if (!authorizer || !(authorizer instanceof casbin_js_1.Authorizer)) {
        throw new Error('Please provide an authorizer instance to plugin.');
    }
    if (options) {
        // I cannot implement this because of the limitation of Vue.
        // If you have any idea, plz tell me.
        //
        // TODO: add autoload option when Authorizer in 'auto' mode is given.
        //
        // if (options.autoload) {
        //   if (authorizer.mode!=='auto'){
        //     throw new Error('autoload will only work on auto mode Authorizer. You don\'t need this.')
        //   }
        //
        //   if (!(options.autoload instanceof String)) {
        //     throw new Error('autoload option should have argument username:string')
        //   }
        //
        //   authorizer.setUser(options.autoload)
        // }
        if (options.useGlobalProperties) {
            var vueProperty_1 = vue_demi_1.isVue2 ? app.prototype : app.config.globalProperties;
            vueProperty_1.$authorizer = authorizer;
            if (options.customProperties) {
                var targetProperties = availableProperties.filter(function (property) {
                    return options.customProperties.indexOf(property) !== -1;
                });
                targetProperties.forEach(function (propertyStr) {
                    var property = Object.getPrototypeOf(authorizer)[propertyStr];
                    if (property) {
                        var propertyKey = "$".concat(propertyStr);
                        // app.config.globalProperties[propertyKey] = property;
                        Object.defineProperty(vueProperty_1, propertyKey, {
                            enumerable: true,
                            configurable: true,
                            writable: true,
                            value: property
                        });
                    }
                    else {
                        throw new Error('Unexpected Error.');
                    }
                });
            }
            else {
                vueProperty_1.$can = authorizer.can;
            }
        }
    }
};
exports.install = install;
