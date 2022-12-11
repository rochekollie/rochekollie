/* jshint esversion: 8 */
(function () {
	"use strict";
	
	const today = {
		date() {
			return new Date();
		},
		months: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
		weekdays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
		year() {
			return this.date().getFullYear();
		},
		month() {
			return this.months[ this.date().getMonth() ];
		},
		day() {
			return this.weekdays[ this.date().getDay() ];
		},
		dateNumber() {
			return this.date().getDate();
		},
		time() {
			let meridian = "";
			let hours = this.date().getHours();
			let minutes = this.date().getMinutes();

			if (hours > 12)
			{
				meridian = "PM";
			} else if (hours < 10)
			{
				meridian = "AM";
				hours = "0" + hours;
			} else if (hours === 12)
			{
				meridian = "PM";
			} else
			{
				meridian = "AM";
			}

			if (minutes < 10)
			{
				minutes = "0" + minutes;
			}
			return hours + ":" + minutes + " " + meridian;
		}
	};

	/**
	 * Runs a given function at the interval of a given time in milliseconds.
	 * @param interval the interval in milliseconds to run the given callback function.
	 * @param func the callback function to run at every interval.
	 * */
	const setTimeInterval = (interval, func) => {
		setInterval(() => {
			func();
		}, interval);
	};

	/**
	 * Display an HTML text content within a specified HTML parent container element.
	 * @param htmlElement the HTML parent container
	 * @param content the text content to display
	 * */
	const displayContent = (htmlElement, content) => {
		try
		{
			htmlElement.innerHTML = content;
		} catch (error)
		{
			console.log(error);
		}
	};

	/**
	 * Changes the background image of a specified HTML block element.
	 * @param element the HTML element whose background is being changed.
	 * @param bgImage the image file to set the element background.
	 * */
	const changeBackgroundImage = (element, bgImage) => {
		try
		{
			element.style.backgroundImage = `url('${ bgImage }')`;
		} catch (error)
		{
			console.log(error);
		}
	};

	const randomNumber = Math.floor(Math.random() * 100);
	const image = `assets/images/backgrounds/${ randomNumber }.jpeg`;
	const body = document.querySelector("body");

	//save the image and date to local storage
	if (!(localStorage.getItem("backgroundImage") && (localStorage.getItem("dateNumber"))))
	{
		localStorage.setItem("backgroundImage", image);
		localStorage.setItem("dateNumber", today.dateNumber().toString());
		changeBackgroundImage(body, image);
	}

	const backgroundImage = localStorage.getItem("backgroundImage");
	let dateNumber = localStorage.getItem("dateNumber");

	//update the background image when the date changes
	const updateBackgroundAndSaveImage = () => {
		if (dateNumber !== today.dateNumber().toString())
		{
			changeBackgroundImage(body, image);
			localStorage.setItem("backgroundImage", image);
			localStorage.setItem("dateNumber", today.dateNumber().toString());
		} else
		{
			changeBackgroundImage(body, backgroundImage);
		}
	};

	updateBackgroundAndSaveImage();

	//call setTimeInterval to update the background image every minute
	setTimeInterval(60000, updateBackgroundAndSaveImage);

	// location elements
	const dateElement = document.getElementById('date');
	const timeElement = document.getElementById('time');

	// set location date and time data
	setTimeInterval(1000, () => {
		displayContent(dateElement, `${ today.day() } ${ today.month() } ${ today.dateNumber() }`);
		displayContent(timeElement, today.time());
	});

}());
