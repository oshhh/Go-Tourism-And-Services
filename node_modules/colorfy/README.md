Colorfy
=======

Colorfy your console output with pretty ANSI colors.

Installation
------------

```shell
npm i colorfy --save
```

Usage
-----

```js
let cf = require('colorfy');
console.log(cf().red('Hello').green('colorful').blue('World!').colorfy());
```

Methods
-------

The `cf()` method returns a colorfy instance. All colorize methods are chainable.
Pass `colorfy()` as last method to a chain to get a pretty colorful string  

`red(text, [styles])` Draws red text  
`yellow(text, [styles])` Draws yellow text  
`green(text, [styles])` Draws green text  
`blue(text, [styles])` Draws blue text  
`fire(text, [styles])` Draws fire red text  
`orange(text, [styles])` Draws orange text  
`azure(text, [styles])` Draws azure blue text  
`lime(text, [styles])` Draws lime text  
`pink(text, [styles])` Draws pink text  
`plum(text, [styles])` Draws plum text  
`turq(text, [styles])` Draws turquoise text  
`ored(text, [styles])` Draws orangered text  
`grey(text, [styles])` Draws grey text  
`dgrey(text, [styles])` Draws dark grey text  
`ddgrey(text, [styles])` Draws dark dark grey text  
`lgrey(text, [styles])` Draws light grey text  
`llgrey(text, [styles])` Draws light light grey text  
`lbrown(text, [styles])` Draws light brown text  
`txt(text, [styles])` Draws text in default color. Without any styling  
`ansi(color, text, [styles])` Draws text in any ansi color. Must be a number between 0 and 255
`auto(text, [styles])` Calculates a cross number between 0 and 99 of the input text uses a `color based of this cross number. This feature could be usefull for logging of hash values.  

Run `node examples/colorfy.js` to see colorfy in action. It gives you a list of all ansi color codes.  

The `styles` argument is optional and defines the text style.

`bold` draws bold text  
`italic` draws italic text  
`underline` draws underlined text  
`blink` draws a flashing text  
`trim` Trims your text on both sides (See **trim** section below)  
`rtrim` Trims your text on its right side (See **trim** section below)  
`ltrim` Trims your text on its left (See **trim** section below)  

Seperate multiple stylings by a space `cf().red('foo', 'bold underline')`

### Trim

All texts are joined by a space character. The trim parameter can be used to avoid joining by spaces.

```
cf().grey('(').green('20ms').grey(')').colorfy();
```
returns `( 20ms )`


```
cf().grey('(').green('20ms', 'trim').grey(')').colorfy();
```
returns `(20ms)` (No space around the number)

### Output

The `colorfy()` method returns a colorfied string of the colorfy chain. Colorization can be skiped by passing `false` as first argument to `colorfy()`

```
cf().red('All colors are beautiful').colorfy();      //Returns a colofied string
cf().red('All colors are beautiful').colorfy(false); //Returns a plain string
```

The `cf()` method can be used as a shortcut of `cf().txt()`

```
cf('Plain text') === cf().txt('Plain text')
```

#### Author

(c) 2016 by Andifeind  
Licensed under MIT license.
