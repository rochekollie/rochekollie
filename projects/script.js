// Set random background color on each section element
window.onload = function () {
	var sections = document.querySelectorAll('section');

	//set the background color and text color for each section
	sections.forEach(function (section) {
		var color = getRandomColor();
		section.style.backgroundColor = color;
		section.style.color = getContrastYIQ(color);
	});
}

/**
 * Generate a random hex color
 * @returns {string} - hex color
 */
const getRandomColor = () => {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++)
	{

		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

/**
 * Generate a random hex color
 * @param {*} hexColor  - hex color
 * @returns  - text color
 */
const getContrastYIQ = (hexColor) => {
	var r = parseInt(hexColor.substr(1, 2), 16);
	var g = parseInt(hexColor.substr(3, 2), 16);
	var b = parseInt(hexColor.substr(5, 2), 16);
	var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
	return (yiq >= 128) ? 'black' : 'white';
}
