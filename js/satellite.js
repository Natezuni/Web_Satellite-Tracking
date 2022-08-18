function run() {
	document.getElementById('bgimg').style.filter = 'brightness(100%)';
	var name = getSatelliteName();
	var validated = validation(name);

	if (validated) {
		fetch(`https://tle.ivanstanojevic.me/api/tle/?search=${name}`).then((res) => res.json()).then((json) => {
			const tleString = json.member[0].line1 + '\n' + json.member[0].line2;

			const satrec = satellite.twoline2satrec(tleString.split('\n')[0].trim(), tleString.split('\n')[1].trim());
			// Get the position of the satellite at the given date
			const date = new Date();
			const positionAndVelocity = satellite.propagate(satrec, date);
			const gmst = satellite.gstime(date);
			const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);

			console.log(position.longitude); // in radians
			console.log(position.latitude); // in radians
			console.log(position.height); // in km

			var LatDegree = convertRadiansToDegrees(position.latitude);
			var LongDegree = convertRadiansToDegrees(position.longitude);
			var tmp = LatDegree + ' ' + LongDegree;

			generateMap(LatDegree, LongDegree, name, position.height);
			
			console.log(tmp);
			informationBox(name, LatDegree, LongDegree, position.height);
		});
	} else {
		console.log('break');
	}

	

}

function convertRadiansToDegrees(radians) {
	var pi = Math.PI;
	return radians * (180 / pi);
}

function getSatelliteName() {
	return document.getElementById('satelliteName').value;
}

function validation(satName) {
	if (satName.length <= 2) {
		//Change this from alert to actual website popup
		console.log('Satellite name input invalid, send alert and break');
		alert('The name you entered is too short. Please enter a minimum of 2 letters');
		document.getElementById('satelliteName').value = '';
		return false;
	} else if (satName.length > 20) {
		console.log('Satellite name input invalid, send alert and break');
		alert('The name you entered is too long. Please enter a maximum of 20 letters');
		document.getElementById('satelliteName').value = '';
		return false;
	} else {
		document.getElementById('satelliteName').value = '';
		console.log('Satellite name input successful, returning name: ' + satName);
		return true;
	}
}

function generateMap(latitude, longitude, name, elevation) {
	console.log(latitude, longitude, name);
	// Create root and chart
	var root = am5.Root.new('chartdiv');
	var chart = root.container.children.push(
		am5map.MapChart.new(root, {
			panX: 'rotateX',
			panY: 'rotateY',
			wheelX: 'zoomX',
			maxZoomLevel: 1,
			projection: am5map.geoOrthographic()
		})
	);

	// Set themes
	root.setThemes([ am5themes_Animated.new(root) ]);

	// Create polygon series
	var polygonSeries = chart.series.push(
		am5map.MapPolygonSeries.new(root, {
			geoJSON: am5geodata_worldLow
		})
	);

	var graticuleSeries = chart.series.insertIndex(0, am5map.GraticuleSeries.new(root, {}));

	graticuleSeries.mapLines.template.setAll({
		stroke: am5.color(0x000000),
		strokeOpacity: 0.1
	});

	var backgroundSeries = chart.series.unshift(am5map.MapPolygonSeries.new(root, {}));

	backgroundSeries.mapPolygons.template.setAll({
		fill: am5.color('#000000'),
		stroke: am5.color('#000000')
	});

	backgroundSeries.data.push({
		geometry: am5map.getGeoRectangle(90, 180, -90, -180)
	});

	var location = {
		type: 'FeatureCollection',
		features: [
			{
				type: 'Feature',
				properties: {
					name: `Name: ${name}\nLatitude: ${latitude}\nLongitude: ${longitude}\nElevation: ${elevation}`
				},
				geometry: {
					type: 'Point',
					coordinates: [ longitude, latitude ]
				}
			}
		]
	};

	var pointSeries = chart.series.push(
		am5map.MapPointSeries.new(root, {
			geoJSON: location
		})
	);

	pointSeries.bullets.push(function() {
		return am5.Bullet.new(root, {
			sprite: am5.Circle.new(root, {
				radius: 5,
				fill: am5.color(0xb30000),
				tooltipText: "{name}"
			})
		});
	});
	chart.appear(1000, 100);
} // end am5.ready()

//REDO
function informationBox(name, lat, long, elevation) {
	var newElement = document.createElement('h4');
	newElement.innerHTML = `<u>Name:<br><br></u> ${name} `;
	var newElement2 = document.createElement('h4');
	newElement2.innerHTML = `<u>Latitude:<br><br></u> ${lat.toFixed(2)}&#176;`;
	var newElement3 = document.createElement('h4');
	newElement3.innerHTML = `<u>Longitude:<br><br></u> ${long.toFixed(2)}&#176;`;
	var newElement4 = document.createElement('h4');
	newElement4.innerHTML = `<u>Elevation:<br><br></u> ${elevation.toFixed(2)} km`;

	document.getElementById('leftInfoBox').appendChild(newElement)
	document.getElementById('leftInfoBox').appendChild(newElement2)
	document.getElementById('leftInfoBox').appendChild(newElement3)
	document.getElementById('leftInfoBox').appendChild(newElement4)
	document.getElementById('leftInfoBox').style = 'display: inline;';
}
