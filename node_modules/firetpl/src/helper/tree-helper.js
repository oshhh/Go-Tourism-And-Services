/**
 * Tree helper
 *
 * @module  Tree helper
 * @submodule  Helper
 */

(function() {
    'use strict';

    var helper = function(ctx, fn) {
        // console.log('Call helper', ctx, fn);
        var s = '';

        var ctxFuncs = {
            next: function(item, tag, attrs, itemFn) {
                var s = '';

                // console.log('Call next', item, itemFn);

                if (Array.isArray(item) && item.length) {
                    s = '';

                    if (tag) {
                        s += '<' + tag + (attrs ? ' ' + attrs : '') + '>';
                    }

                    s += helper({
                        data: item,
                        parent: ctx.parent,
                        root: ctx.root,
                        ctx: ctx.ctx,
                        tag: ctx.tag,
                        attrs: ctx.attrs
                    }, fn);

                    if (tag) {
                        s += '</' + tag + '>';
                    }
                }

                return s;
            }
        };

        ctx.ctx.next = ctxFuncs.next;
        if (ctx.data) {
            if (Array.isArray(ctx.data)) {
                ctx.data.forEach(function(d) {
                    s += fn(d,ctx.parent, ctx.root, ctx.ctx);
                });
            }
            else {
                s += fn(ctx.data,ctx.parent, ctx.root, ctx.ctx);
            }
        }

        return s;
    };

    FireTPL.registerHelper('tree', helper);
})();