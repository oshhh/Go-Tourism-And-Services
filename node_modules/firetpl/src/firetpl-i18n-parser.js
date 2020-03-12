/**
 * FireTPL i18n parser
 *
 * @module  FireTPL.I18nParser
 */
(function(FireTPL) {
    'use strict';

    /**
     * I18nParser constructor
     *
     * @constructor
     *
     * @example {js}
     * var parser = new FireTPL.Parser();
     * parser.parse('input string');
     * var parsedStr = parser.flush();
     *
     * Options:
     *
     * @arg eventTags {boolean}
     * Strip html event tags and add all into an `on` tag. The tag contains all event tags as a list seperated by a semicolon.
     * For example: `on="click:click-handler;mousedown:mouse-handler"`
     * 
     */
    var I18nParser = function(options) {
        options = options || {};
        
        this.lang = {};
        this.varName = options.varName || 'FireTPL.locale';
    };

    /**
     * Add i18n data
     * @method add
     * @param  {String} lang Language code
     * @param  {Object} data Language data
     */
    I18nParser.prototype.add = function(lang, data) {
        this.flattn(data).forEach(function(item) {
            if (!this.lang[item[0]]) {
                this.lang[item[0]] = {};
            }

            this.lang[item[0]][lang] = item[1];
        }, this);
    };

    /**
     * Add one i18n item
     * @method addItem
     * @param  {String} lang  Language code
     * @param  {String} value Data key
     * @param  {String|Object} value Data value
     */
    I18nParser.prototype.addItem = function(lang, key, value) {
        if (!this.lang[key]) {
            this.lang[key] = {};
        }
        
        this.lang[key][lang] = value;
    };

    /**
     * Parse i18n data
     * @method parse
     * @return {String} Returns parser result
     */
    I18nParser.prototype.parse = function() {
        if (typeof this.lang !== 'object') {
            throw new FireTPL.ParseError('No i18n data found!');
        }

        var replaceVars = function(str) {
            return str.replace(/\$([a-zA-Z][a-zA-Z0-9_.-]*)/g, '\'+data.$1+\'');
        };

        var parseItem = function(val) {
            if (typeof val === 'string') {
                return '\'' + replaceVars(val) + '\'';
            }
            else if (!val) {
                throw new FireTPL.ParseError('Unsupported i18n item! (' + String(val) + ')');
            }
            else if (!val.key) {
                return '\'' + replaceVars(val.plur) || replaceVars(val.sing) + '\'';
            }

            return 'data.' + val.key.replace(/^\$/, '') + '===1?\'' + val.sing + '\':\'' + val.plur + '\'';
        };

        var fn = this.varName + '=function(key,data,lang){var curLang=lang||FireTPL.i18nCurrent;switch(key){';

        for (var el in this.lang) {
            if (this.lang.hasOwnProperty(el)) {
                var item = this.lang[el];

                fn += 'case\'' + el + '\':switch(curLang){';
                
                for (var l in item) {
                    if (l === FireTPL.i18nDefault) {
                        continue;
                    }
                    if (item.hasOwnProperty(l)) {
                        var langItem = item[l];
                        
                        fn += 'case\'' + l + '\':return ' + parseItem(langItem) + ';';
                    }
                }                
                
                if ((FireTPL.i18nDefault in item)) {
                    fn += 'default:return ' + parseItem(item[FireTPL.i18nDefault]) + ';';
                }

                fn += '}';
            }
        }

        fn += 'default:return FireTPL.i18nFallbackText;}};';
        return fn;
    };

    /**
     * Flattn a an i18n data object
     * 
     * @method flattn
     * @private
     * @param  {String} key  Key prefix
     * @param  {Object} data Data object
     * @return {Object}      Returns a flatted data object
     */
    I18nParser.prototype.flattn = function(key, data) {
        if (arguments.length === 1) {
            data = key;
            key = '';
        }

        var values = [];
        for (var el in data) {
            if (data.hasOwnProperty(el)) {
                var item = data[el];
                
                if (typeof item === 'object') {
                    if (typeof item.sing === 'string' || typeof item.plur === 'string') {
                        values.push([key + el, item.key ? item : (item.plur || item.sing)]);
                    }
                    else {
                        values = values.concat(this.flattn(key + el + '.', item));
                    }
                }
                else {
                    values.push([key + el, item]);
                }
            }
        }


        return values;
    };

    //--

    FireTPL.I18nParser = I18nParser;
})(FireTPL);