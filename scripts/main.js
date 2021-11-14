


/**
 * Create HTML document and elements and fetches resources when window is loaded.
 *
 */
// Page meta data


// Add the title to the page
document.onload = function () {
	let meta = {
		siteName: "Roche Kollie",
		pageTitle: `${meta.siteName | page.title}`,
		pageDesc: page.desc,
		pageKeywords: page.keywords
	};

	document.title = meta.pageTitle;
};

// Add current year to the copyright year
document.onload = function () {
	let element = document.getElementById("currentYear");
	if (element !== null)
	{
		element.innerHTML = new Date().getFullYear();
	}
};

//Get current date and time
let d = new Date();
let day = d.getDay();
let month = d.getMonth();
let date = d.getDate();
let dayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

var dateTime = dayName[day] + ", " + monthName[month] + " " + date;

// Add current year to the copyright year
document.onload = function () {
	let element = document.getElementById("date");
	if (element !== null)
	{
		element.innerHTML = `- ${dateTime}`;
	}
};

window.readyState = function() {
	// Display the nav bar ul on icon click
	document.getElementById("nav-bar-close").display = "none";
	document.getElementById("nav-items").display = "none";
	document.getElementById("nav-bar-open").addEventListener("click", function () {
	document.getElementById("nav-items").display = "block";
	});
}

if (document.readyState === "complete") {
	// Display the nav bar ul on icon click
	document.getElementById("nav-bar-close").display = "none";
	document.getElementById("nav-items").display = "none";
	document.getElementById("nav-bar-open").addEventListener("click", function () {
	document.getElementById("nav-items").display = "block";
	});
}
