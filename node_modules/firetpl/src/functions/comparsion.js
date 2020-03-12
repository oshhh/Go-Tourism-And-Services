/**
 * Comparison functions
 * @module Inline Functions (Comparison)
 */
(function(FireTPL) {
    'use strict';
    
        /**
     * Greater than comparison
     *
     * The property becomes true if property is greater than value.
     *
     * @group InlineFunctions
     * @method gt
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is greater then value
     */
    FireTPL.registerFunction('gt', function(str, cmp) {
        return Number(str) > Number(cmp);
    });

    /**
     * Greater than comparison or equal
     *
     * The property becomes true if property is greater or equal than value.
     *
     * @group InlineFunctions
     * @method gte
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is greater or equal then value
     */
    FireTPL.registerFunction('gte', function(str, cmp) {
        return Number(str) >= Number(cmp);
    });

    /**
     * Lesser than comparison
     *
     * The property becomes true if property is lesser than value.
     *
     * @group InlineFunctions
     * @method lt
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is lesser then value
     */
    FireTPL.registerFunction('lt', function(str, cmp) {
        return Number(str) < Number(cmp);
    });

    /**
     * Lesser than comparison or equal
     *
     * The property becomes true if property is lesser or equal than value.
     *
     * @group InlineFunctions
     * @method gte
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input is lesser or equal then value
     */
    FireTPL.registerFunction('lte', function(str, cmp) {
        return Number(str) <= Number(cmp);
    });

    /**
     * Equal comparison
     *
     * The property becomes true if input and value are both identical
     *
     * @group InlineFunctions
     * @method eq
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value are identical
     */
    FireTPL.registerFunction('eq', function(str, cmp) {
        if (isNaN(str)) {
            return str === cmp;
        }
        else {
            return Number(str) === Number(cmp);
        }
    });

    /**
     * Not equal comparison
     *
     * The property becomes true if input and value aren't identical
     *
     * @group InlineFunctions
     * @method not
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     */
    FireTPL.registerFunction('not', function(str, cmp) {
        if (isNaN(str)) {
            return str !== cmp;
        }
        else {
            return Number(str) !== Number(cmp);
        }
    });

    /**
     * Expression matching
     *
     * Returns value if expression is matching, otherwise altValue will be returned
     *
     * @group InlineFunctions
     * @method if
     * @param {string} expression Expression
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     */
    FireTPL.registerFunction('if', function(str, expression, value, altValue) {
        if (String(str) === String(expression)) {
            return value;
        }

        return altValue;
    });

    /**
     * Returns str if it is truthy, otherwise altValue is returning
     *
     * @group InlineFunctions
     * @method or
     * @param  {String} altValue 
     * @return {String}    Returns instr or altValue
     * 
     * @example {fire}
     * $str.or('String is empty')
     */
    FireTPL.registerFunction('or', function(str, value, altValue) {
        if (str) {
            return str;
        }

        return altValue;
    });

    /**
     * Checks whether str is truthy or not
     *
     * Returns value if str is truthy, otherwise altValue will be returned.
     * If only one arg is passed and str becomes truthy the instr will be returned instead.
     *
     * @group InlineFunctions
     * @method ifTrue
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     * @example {fire}
     * $str.ifTrue('Yes', 'No')
     *
     * @example {fire}
     * //$str == 'Yes'
     * $str.ifTrue('No')
     * //returns 'Yes'
     */
    FireTPL.registerFunction('ifTrue', function(str, value, altValue) {
        if (str) {
            return arguments.length === 2 ? str : value;
        }

        return arguments.length === 2 ? value : altValue;
    });

    /**
     * Checks whether str is falsy or not
     *
     * Returns value if str is falsy, otherwise altValue will be returned,
     * if altValue is not given, instr will be returned.
     *
     * @group InlineFunctions
     * @method ifFalse
     * @param  {number} value Comparison value
     * @return {boolean}    Returns true if input and value aren't identical
     * @example {fire}
     * $str.ifFalse('Yes', 'No')
     * 
     * @example {fire}
     * //$str = 'No'
     * $str.ifFalse('Yes')
     * //returns 'No'
     */
    FireTPL.registerFunction('ifFalse', function(str, value, altValue) {
        if (!str) {
            return value;
        }

        return arguments.length === 2 ? str : altValue;
    });

    /**
     * Checks whether str has a value other than undefined or null
     *
     * Returns true if str is not undefined or null
     *
     * @group InlineFunctions
     * @method exists
     * @return {boolean}    Returns true if input is not undefined or null
     * @example {fire}
     * :if $str.exists()
     *     "Str exists!"
     */
    FireTPL.registerFunction('exists', function(str) {
        return str !== undefined && str !== null;
    });

    /**
     * Checks whether str matches agains a regular expression
     *
     * Returns true if str matches
     *
     * @group InlineFunctions
     * @method match
     * @return {boolean}    Returns true if input matches
     * @example {fire}
     * :if $str.match('foo|bar')
     *     "Str matches!"
     */
    FireTPL.registerFunction('match', function(str, pattern, modifier) {
        var reg = new RegExp(pattern, modifier);
        return reg.test(str);
    });
})(FireTPL);