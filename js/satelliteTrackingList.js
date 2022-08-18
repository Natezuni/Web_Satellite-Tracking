function run() {
	var trackingList = JSON.parse(localStorage.satelliteTrackingList);
	addTable(trackingList);
}

function convertRadiansToDegrees(radians) {
	var pi = Math.PI;
	return radians * (180 / pi);
}

function remove(id) {
	var trackingList = JSON.parse(localStorage.satelliteTrackingList);

	const index = trackingList.indexOf(id);
	if (index > -1) {
		trackingList.splice(index, 1); 
	}
    localStorage.satelliteTrackingList = JSON.stringify(trackingList);
	console.log(trackingList);
    location.reload();
}

function openMap(long, lat) {
	localStorage.setItem('currentLatitude', lat);
	localStorage.setItem('currentLongitude', long);
	localStorage.setItem('satLatitude', lat);
	localStorage.setItem('satLongitude', long);
	window.open('/views/selectedSatelliteVisualizer.html');
}

function addTable(trackingList) {
	var length = Object.keys(trackingList).length;

	const grid = document.getElementById('grid');
	grid.innerHTML += `<div class="container table-responsive py-5"> 
    <table class="table table-bordered table-hover">
      <thead id="content" class="thead-dark">
        <tr>
          <th class="centerTable" scope="col">Id #</th>
		  <th class="centerTable" scope="col">Name</th>
          <th class="centerTable" scope="col">Longitude</th>
          <th class="centerTable" scope="col">Latitude</th>
          <th class="centerTable" scope="col">Options</th>
        </tr>
      </thead>`;

	for (var i = 1; i < length; i++) {
		let request = new XMLHttpRequest();
		request.open(
			'GET',
			`https://api.n2yo.com/rest/v1/satellite/tle/${trackingList[i]}&apiKey=2EVG56-JENTTE-SKZMB5-4VM4`
		);
		request.send();
		request.onload = () => {
			if (request.status === 200) {
				var tmp = JSON.parse(request.response);
				console.log(tmp)
				var tle = tmp.tle;
				const satrec = satellite.twoline2satrec(tle.split('\n')[0].trim(), tle.split('\n')[1].trim());
				const date = new Date();
				const positionAndVelocity = satellite.propagate(satrec, date);
				const gmst = satellite.gstime(date);
				const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
				var lat = convertRadiansToDegrees(position.latitude);
				var long = convertRadiansToDegrees(position.longitude);
				const grid = document.getElementById('content');
				grid.innerHTML += `
                <tbody>
                    <tr>
                    <th class="centerTable" scope="row">${tmp.info.satid}</th>
					<td class="centerTable">${tmp.info.satname}</td>
                    <td class="centerTable">${long}</td>
                    <td class="centerTable">${lat}</td>
                    <td class="centerTable">
                    <button id="mapButton" type="button" class="btn btn-outline-light" onclick="openMap(${long}, ${lat})">Map</button>
                    <button id="mapButton" type="button" class="btn btn-outline-light" onclick="remove(${tmp.info
						.satid})">Remove From List</button>
                    </td>
                    </tr>
                </tbody>
                </table>
                </div>
                `;
			} else {
				console.log(`error ${request.status} ${request.statusText}`);
			}
		};
	}
}
