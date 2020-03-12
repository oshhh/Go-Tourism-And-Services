'use strict';

class Colorfy {
  constructor() {
    this.text = [];
  }

  /**
   * Draws red text
   *
   * @method red
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  red(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('160', styles), text);
    }
    return this;
  }

  /**
   * Draws yellow text
   *
   * @method yellow
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  yellow(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('226', styles), text);
    }

    return this;
  }

  /**
   * Draws green text
   *
   * @method green
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  green(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('34', styles), text);
    }

    return this;
  }

  /**
   * Draws blue text
   *
   * @method blue
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  blue(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('21', styles), text);
    }

    return this;
  }

  /**
   * Draws fire text
   *
   * @method fire
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  fire(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('196', styles), text);
    }

    return this;
  }

  /**
   * Draws orange text
   *
   * @method orange
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  orange(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('208', styles), text);
    }

    return this;
  }

  /**
   * Draws azure text
   *
   * @method azure
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  azure(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('33', styles), text);
    }

    return this;
  }

  /**
   * Draws lime text
   *
   * @method lime
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  lime(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('148', styles), text);
    }

    return this;
  }

  /**
   * Draws pink text
   *
   * @method pink
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  pink(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('199', styles), text);
    }

    return this;
  }

  /**
   * Draws plum text
   *
   * @method plum
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  plum(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('93', styles), text);
    }

    return this;
  }

  /**
   * Draws turq text
   *
   * @method turq
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  turq(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('39', styles), text);
    }

    return this;
  }

  /**
   * Draws ored text
   *
   * @method ored
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  ored(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('202', styles), text);
    }

    return this;
  }

  /**
   * Draws grey text
   *
   * @method grey
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  grey(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('247', styles), text);
    }

    return this;
  }

  /**
   * Draws dgrey text
   *
   * @method dgrey
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  dgrey(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('244', styles), text);
    }

    return this;
  }

  /**
   * Draws ddgrey text
   *
   * @method ddgrey
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  ddgrey(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('241', styles), text);
    }

    return this;
  }

  /**
   * Draws lgrey text
   *
   * @method lgrey
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  lgrey(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('250', styles), text);
    }

    return this;
  }

  /**
   * Draws llgrey text
   *
   * @method llgrey
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  llgrey(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('254', styles), text);
    }

    return this;
  }

  /**
   * Draws lbrown text
   *
   * @method lbrown
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @chainable
   * @return {object}        Returns this value
   */
  lbrown(text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode('315', styles), text);
    }

    return this;
  }

  /**
   * Draws text in an 256 ansi color
   *
   * @method ansi
   * @chainable
   * @param  {Number} color   Ansi color code. Must be a range between 0 and 256
   * @param  {String} text   Text to be colorfied
   * @param  {String} styles Text styles (bold underlined)
   * @return {Object}        Returns this value
   */
  ansi(color, text, styles) {
    if (text) {
      this.addTextItem(this.getColorCode(color, styles), text);
    }

    return this;
  }

  /**
   * Colorfies a text depending on a checksum
   *
   * @chainable
   * @param  {String} text   Test to be colorfied
   * @param  {String} styles Test styles (bold, underlined)
   * @return {object}        Returns this value
   */
  auto(text, styles) {
    if (text) {
      let startCode = 30;
      let sum = 0;
      for (let i = 0; i < text.length; i++) {
        sum += text.charCodeAt(i);
      }

      let colorCode = startCode + parseInt(String(sum).substr(-2)) * 2;
      let color = this.getColorCode(colorCode, styles);
      this.addTextItem(color, text);
    }

    return this;
  }

  txt(text, styles) {
    if (text) {
      let style = styles ? this.getColorCode('', styles) : '';
      this.addTextItem(style, text);
    }

    return this;
  }

  /**
   * Returns a coloried String
   *
   * @return {String} Returns a colorfied string
   */
  colorfy(printColors) {
    if (printColors === false) {
      return this.text.map(txt => txt[1]).join('');
    }

    let colorfied = this.text.map(txt => {
      return txt[0] + txt[1] + '\u001b[m';
    }).join('');

    this.text = [];
    return colorfied;
  }

  getColorCode(color, styles) {
    let style = '';

    if (styles) {
      styles.split(' ').forEach(curStyle => {
        switch (curStyle) {
          case 'reset': style += ';0'; break;
          case 'bold': style += ';1'; break;
          case 'italic': style += ';3'; break;
          case 'underline': style += ';4'; break;
          case 'blink': style += ';5'; break;
          case 'invert': style += ';7'; break;
          case 'ltrim': this.trimLeft = true; break;
          case 'rtrim': this.trimRight = true; break;
          case 'trim':
            this.trimLeft = true;
            this.trimRight = true;
            break;
          default: style += ';' + curStyle; break;
        }
      });
    }

    if (color) {
      color = '38;5;' + color
    }

    return '\u001b[' + color + style + 'm';
  }

  addTextItem(styles, text) {
    if (!this.trimLeft) {
      text = ' ' + text;
    }

    this.text.push([styles, text]);
    this.trimLeft = this.trimRight;
    this.trimRight = false;
  }

  toString() {
    return this.text.map(txt => txt[1]).join(' ').substr(1);
  }
}

// Object.defineProperty(module, 'exports', {
//   get: function() {
//     return new Colorfy();
//   }
// });

module.exports = function(text, styles) {
  let colorfy = new Colorfy();
  if (text) {
    colorfy.txt(text, styles);
  }

  return colorfy;
};

module.exports.Colorfy = Colorfy;
