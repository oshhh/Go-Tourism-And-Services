/**
 * FireTPL browser extension
 *
 * @module FireTPL Browser extensions
 */
(function(FireTPL) {
    'use strict';

    FireTPL.readFile = function(src) {
        var content = '';

        if (typeof XMLHttpRequest === 'undefined') {
            console.warn('Don\'t use FireTPL.loadFile() on node.js');
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', src, false);
        xhr.send();

        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                content = xhr.responseText;
            }
            else if (xhr.status === 404) {
                console.error('Loading a FireTPL template failed! Template wasn\'t found!');
            }
            else {
                console.error('Loading a FireTPL template failed! Server response was: ' + xhr.status + ' ' + xhr.statusText);
            }
        }

        return content;
    };

    /**
     * Synchronous read file function to read a file from file system.
     * @param  {string} file File path
     * @return {String}      Returns file content
     */
    FireTPL.loadFile = function(file) {
        console.warn('FireTPL.loadFile is deprecated! Please use FireTPL.readFile instead!');
        return FireTPL.readFile(file);
    };
})(FireTPL);