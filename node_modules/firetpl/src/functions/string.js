(function(FireTPL) {
    'use strict';

    /**
     * Concatenate String
     *
     * @group InlineFunctions
     * @method if
     * @param {String} separator Concatenates strings by using a separator
     * @return {String}    Returns a concatenated string
     *
     * @example
     * $str = 'foo'
     * $foo = 'bar'
     * 
     * $str.concat(' ', $foo, 'link')
     *
     * returns "foo bar link"
     */
    FireTPL.registerFunction('concat', function(str, sep) {
        var args = Array.prototype.slice.call(arguments, 2);
        args.unshift(str);
        return args.join(sep);
    });

})(FireTPL);