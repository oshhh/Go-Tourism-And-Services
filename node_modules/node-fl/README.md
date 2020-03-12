node-fl
=======

node-fl is a collection of usefull file methods. 


### mkdir(dir, [callback])
Creates a folder and all parent folders if it doesn't exist.
This method is similar to `mkdir -p`. Folders will be created with `755` file permissions.

Example:
```js
    //Creates a folder syncronous
    fl.mkdir('path/to/folder');

    //Creates a folder asyncron
    fl.mkdir('path/to/folder', function(err) {

    });
```
