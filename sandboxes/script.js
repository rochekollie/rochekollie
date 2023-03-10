import {Element} from '../modules/Element.js';

const heading = new Element(document.querySelector('h1'));
const paragraph = new Element(document.querySelector('p'));
const anchor = new Element(document.querySelector('a'));
const list = new Element(document.querySelector('li'));
const div = new Element(document.querySelector('div'));
const span = new Element(document.querySelector('span'));
const input = new Element(document.querySelector('input'));
const text = new Element(document.querySelector('textarea'));
const image = new Element(document.querySelector('img'));

heading.render('It works on the heading!');
paragraph.render('It works on the paragraph!');
anchor.render('It works on the anchor!');
list.render('It works on the li!');
div.render('It works on the div!');
span.render('It works on the span!');
input.render('It works on the input!');
text.render('It works on the textarea!');
paragraph.render('assets/images/mars.jpeg');

console.log(image.getSrc());

image.addEvents('click', () => {
  console.log('Image clicked!');
});

const header = new Element(document.querySelector('h1'));

header.color('red');
header.backgroundColor('blue');

header.margin('10px', '20px', '30px', '40px');

console.log(typeof p);