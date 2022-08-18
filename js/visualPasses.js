
function run() {
	var tmp = (document.getElementById('grid').innerHTML = '');
	var tmp = (document.getElementById('button').innerHTML = '');
	let locationInformation = getInputs();
	var validated = validation(
		locationInformation.lat,
		locationInformation.long,
		locationInformation.seaAlt,
		locationInformation.searchRadius,
		locationInformation.category
	);
	//testing: addGrid(3);
	let request = new XMLHttpRequest();
	if (validated) {
		let url = `https://api.n2yo.com/rest/v1/satellite/above/${locationInformation.lat}/${locationInformation.long}/${locationInformation.seaAlt}/${locationInformation.searchRadius}/${locationInformation.category}/&apiKey=2EVG56-JENTTE-SKZMB5-4VM4`;
		console.log(url);
		request.open('GET', url);
		request.send();
		request.onload = () => {
			console.log(request);
			if (request.status === 200) {
				var tmp = JSON.parse(request.response);

				length = Object.keys(tmp.above).length;

				var satellites = tmp.above;

				addGrid(satellites, length);

				//testing: console.log(array)
			} else {
				console.log(`error ${request.status} ${request.statusText}`);
			}
		};
	} else {
		console.log('Did not pass validation');
		document.getElementById('inputLatitude').value = '';
		document.getElementById('inputLongitude').value = '';
		document.getElementById('inputSeaAlt').value = '';
		document.getElementById('inputRadius').value = '';
	}
}

function getInputs() {
	let lat = document.getElementById('inputLatitude').value,
		long = document.getElementById('inputLongitude').value,
		seaAlt = document.getElementById('inputSeaAlt').value,
		searchRadius = document.getElementById('inputRadius').value,
		category = document.getElementById('satellites').value;
	return { lat, long, seaAlt, searchRadius, category };
}

function validation(latitude, longitude, Altitude, searchRadius, category) {
	if (latitude.length == 0 || longitude.length == 0 || Altitude.length == 0 || searchRadius.length == 0) {
		alert('Please enter valid values');
		return false;
		//InnerHTML response...
	} else if (searchRadius > 60) {
		alert('Please enter a Radius between 0 and 70');
		return false;
	} else if (category == 55) {
		alert('Please select a category!');
		return false;
	} else {
		return true;
	}
}

function addGrid(satellites, length) {
	var btn = document.getElementById('button');
	btn.innerHTML += `<button id="addedBtn" type="button" class="btn btn-outline-light" onclick="openAll()">View Interactive Map of All Satellites</button>`;
	for (var i = 0; i < length; i++) {
		const grid = document.getElementById('grid');
		grid.innerHTML += `<div class="col col-lg-4 no-gutters">
              <div class="rightside no-gutters">
                <h5 class="satName"><u>Satellite Name: ${satellites[i].satname}</u></h5>
                <h5 class="satID${i}">Satellite ID: ${satellites[i].satid}</h5>
                <h5 class="satDate">Satellite Launch Date: ${satellites[i].launchDate}</h5>
                <h5 class="satLat${i}">Satellite Latitude: ${satellites[i].satlat}</h5>
                <h5 class="satLng${i}">Satellite Longitude: ${satellites[i].satlng}</h5>
				<button type="button" id="${i}" class="btn btn-outline-light" onclick="trackSatellite(${satellites[i].satid})">Track</button>
				<button type="button" id="${i}" class="btn btn-outline-light" onclick="openSelected(${satellites[i]
					.satlat}, ${satellites[i].satlng})">View Interactive Map</button>
            </div>
          </div>`;
	}
	localStorage.setItem('allSatellites', JSON.stringify(satellites));
	console.log(satellites);
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(autoFill);
	} else {
		x.innerHTML = 'Geolocation is not supported by this browser.';
	}
}

function autoFill(position) {
	console.log(position);

	var latitude = document.getElementById('inputLatitude');
	latitude.value = position.coords.latitude;
	var longitude = document.getElementById('inputLongitude');
	longitude.value = position.coords.longitude;

	var altitude = document.getElementById('inputSeaAlt');
	if (position.altitude == null) {
		altitude.value = 'N/A';
	}
}

function openSelected(lat, long) {
	var currentLatitude = document.getElementById('inputLatitude').value;
	var currentLongitude = document.getElementById('inputLongitude').value;
	localStorage.setItem('satLatitude', lat);
	localStorage.setItem('satLongitude', long);
	localStorage.setItem('currentLatitude', currentLatitude);
	localStorage.setItem('currentLongitude', currentLongitude);
	window.open('/views/selectedSatelliteVisualizer.html');
}

function openAll() {
	window.open('/views/viewAllSatellites.html');
}



function trackSatellite(id) {

	if (localStorage.getItem("satelliteTrackingList") === null) {
		var trackingList = [1]
		trackingList.push(id)
		console.log(trackingList)
		localStorage.satelliteTrackingList = JSON.stringify(trackingList);
	} else {
		var trackingList = JSON.parse(localStorage.satelliteTrackingList);
		trackingList.push(id)
		console.log(trackingList)
		localStorage.satelliteTrackingList = JSON.stringify(trackingList);
	}
		
	
}

