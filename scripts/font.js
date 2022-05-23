/* jshint esversion: 6 */
const getFontSize = () => {
	let size = parseInt((window.innerWidth / 100) / 16);
	return (size < 1) ? 1 : size;
};

const setBodyFontSize = () => {
	document.querySelector('body').style.fontSize = `${ getFontSize() }rem`;

	console.log(`Body font size: ${ getFontSize() }rem`);
};

const setHeadingOneFontSize = () => {
	const h1 = document.querySelectorAll('h1');
	h1.forEach(heading => {
		heading.style.fontSize = `${ getFontSize() * 2.5 }rem`;
	});

	console.log(`H1 font size: ${ getFontSize() * 2.5 }rem`);
};

const setHeadingTwoFontSize = () => {
	const h2 = document.querySelectorAll('h2');
	h2.forEach(heading => {
		heading.style.fontSize = `${ getFontSize() * 2 }rem`;
	});

	console.log(`H2 font size: ${ getFontSize() * 2 }rem`);
};

const setHeadingThreeFontSize = () => {
	const h3 = document.querySelectorAll('h3');
	h3.forEach(heading => {
		heading.style.fontSize = `${ getFontSize() * 1.7 }rem`;
	});

	console.log(`H3 font size: ${ getFontSize() * 1.7 }rem`);
};

const setHeadingFourFontSize = () => {
	const h4 = document.querySelectorAll('h4');
	h4.forEach(heading => {
		heading.style.fontSize = `${ getFontSize() * 1.5 }rem`;
	});

	console.log(`H4 font size: ${ getFontSize() * 1.5 }rem`);
};

const setHeadingFiveFontSize = () => {
	const h5 = document.querySelectorAll('h5');
	h5.forEach(heading => {
		heading.style.fontSize = `${ getFontSize() * 1.3 }rem`;
	});

	console.log(`H5 font size: ${ getFontSize() * 1.3 }rem`);
};

const setHeadingSixFontSize = () => {
	const h6 = document.querySelectorAll('h6');
	h6.forEach(heading => {
		heading.style.fontSize = `${ getFontSize() * 1.2 }rem`;
	});

	console.log(`H6 font size: ${ getFontSize() * 1.2 }rem`);
};

// run the following functions on page load and when the window is resized
//body
window.addEventListener('load', setBodyFontSize);
window.addEventListener('resize', setBodyFontSize);

//h1
window.addEventListener('load', setHeadingOneFontSize);
window.addEventListener('resize', setHeadingOneFontSize);

//h2
window.addEventListener('load', setHeadingTwoFontSize);
window.addEventListener('resize', setHeadingTwoFontSize);

//h3
window.addEventListener('load', setHeadingThreeFontSize);
window.addEventListener('resize', setHeadingThreeFontSize);

//h4
window.addEventListener('load', setHeadingFourFontSize);
window.addEventListener('resize', setHeadingFourFontSize);

//h5
window.addEventListener('load', setHeadingFiveFontSize);
window.addEventListener('resize', setHeadingFiveFontSize);

//h5
window.addEventListener('load', setHeadingSixFontSize);
window.addEventListener('resize', setHeadingSixFontSize);
