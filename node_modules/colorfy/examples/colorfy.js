'use strict';

let cf = require('../lib/colorfy');

console.log(cf().txt('This text should be coloryfied in').red('fantastic red').colorfy());
console.log(cf().txt('This text should be coloryfied in').yellow('fantastic yellow').colorfy());
console.log(cf().txt('This text should be coloryfied in').green('fantastic green').colorfy());
console.log(cf().txt('This text should be coloryfied in').blue('fantastic blue').colorfy());
console.log(cf().txt('This text should be coloryfied in').fire('fantastic fire').colorfy());
console.log(cf().txt('This text should be coloryfied in').orange('fantastic orange').colorfy());
console.log(cf().txt('This text should be coloryfied in').azure('fantastic azure').colorfy());
console.log(cf().txt('This text should be coloryfied in').lime('fantastic lime').colorfy());
console.log(cf().txt('This text should be coloryfied in').pink('fantastic pink').colorfy());
console.log(cf().txt('This text should be coloryfied in').plum('fantastic plum').colorfy());
console.log(cf().txt('This text should be coloryfied in').turq('fantastic turq').colorfy());
console.log(cf().txt('This text should be coloryfied in').ored('fantastic ored').colorfy());
console.log(cf().txt('This text should be coloryfied in').grey('fantastic grey').colorfy());
console.log(cf().txt('This text should be coloryfied in').dgrey('fantastic dgrey').colorfy());
console.log(cf().txt('This text should be coloryfied in').ddgrey('fantastic ddgrey').colorfy());
console.log(cf().txt('This text should be coloryfied in').lgrey('fantastic lgrey').colorfy());
console.log(cf().txt('This text should be coloryfied in').llgrey('fantastic llgrey').colorfy());

for (var i = 0; i < 256; i++) {
  console.log(cf().txt('Ansi color code ' + i).ansi(i, 'pretty color code').colorfy());
}

console.log(cf('Auto mode', 'underline').colorfy());

for (var i = 0; i < 100; i++) {
  console.log(cf().auto('Auto color code ' + String.fromCharCode(i + 41)).colorfy());
}

console.log(cf('Font style reset', 'reset').txt('plain').colorfy());
console.log(cf('Font style bold', 'bold').txt('bold').colorfy());
console.log(cf('Font style italic', 'italic').txt('italic').colorfy());
console.log(cf('Font style underline', 'underline').txt('underline').colorfy());
console.log(cf('Font style blink', 'blink').txt('blink').colorfy());
console.log(cf('Font style invert', 'invert').txt('invert').colorfy());
