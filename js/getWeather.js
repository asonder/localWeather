$(document).ready(function loadWeather() {

	var getLoc = 'https://cors-everywhere.herokuapp.com/http://ipinfo.io';
	var getWeather = 'https://cors-everywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?units=imperial&';

	//Get location coords via IP address
	$.getJSON(getLoc).done(function(location) {
		var latlong = location.loc;
		var comma = latlong.indexOf(',');
		lat = latlong.substring(0, comma);
		lon = latlong.substring(comma + 1);
		$('h2#current_loc').text(location.city + ',' + location.region);

		//Nested AJAX call to get weather info
		$.getJSON(getWeather, {
			lat: lat,
			lon: lon,
			appid: "d61378352f6dc1dd73cfbe61fdc3db0f"

		}).done(function(weather) {

			var condition = weather.weather[0].id;
			var farenheight = Math.round(weather.main.temp);
			var celcius = Math.round((farenheight - 32) * 5 / 9);
			var sunrise = weather.sys.sunrise;
			var sunset = weather.sys.sunset;


			//Load farenheight initially
			$('p#current_temp').html(farenheight + '&deg;');

			$('input#units').change(function() {
				var current = $(this).data('next');

				if (current == 'c') {
					$('p#current_temp').html(celcius + '&deg;');
					$(this).data('next', 'f');
					return;
				}
				$('p#current_temp').html(farenheight + '&deg;');
				$(this).data('next', 'c');

			});

			//Get today's date and current time, and use that to determine which icon to use.
			function timeFormat() {
				var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
					"December"
				];
				var d = new Date();
				var date = d.getDate();
				var month = d.getMonth();
				var year = d.getFullYear();

				$('h1#today_date').text(months[month] + " " + date + "," + " " + year);

				var hh = d.getHours();
				var m = d.getMinutes();
				var t = d.getTime();
				var dd = "am";
				var h = hh;
				if (h >= 12) {
					h = hh - 12;
					dd = "pm";
				}
				if (h === 0) {
					h = 12;
				}
				m = m < 10 ? "0" + m : m;
				var time = h + ':' + m + dd;
				$('i#climacon').addClass(t > sunset ? 'wi wi-owm-night-' + condition : 'wi wi-owm-day-' + condition);
				$('h2#time').text(time);
			}

			timeFormat();

		}).fail(function() {
			var msg = '<span style="font-size:.25em;">' + 'Sorry. Current temperature could not be found.' + '</span>';
			$('p#current_temp').html(msg);

		});

	}).fail(function() {
		var msg = '<span style="font- size:.25em;">' + 'Sorry. Location could not be found.' + '</span>';
		$('p#current_temp').html(msg);

	});
});
