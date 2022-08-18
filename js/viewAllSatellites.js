am5.ready(function() {
	var satellites = JSON.parse(localStorage.getItem('allSatellites') || '[]');
	console.log(satellites);

	// Create root and chart
	var root = am5.Root.new('chartdiv');
	var chart = root.container.children.push(
		am5map.MapChart.new(root, {
			panX: 'rotateX',
			panY: 'none',
			wheelX: 'zoomX',
			maxZoomLevel: 1,
			projection: am5map.geoNaturalEarth1()
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

	var backgroundSeries = chart.series.unshift(am5map.MapPolygonSeries.new(root, {}));

	backgroundSeries.mapPolygons.template.setAll({
		fill: am5.color(0x000000),
		stroke: am5.color(0x000000)
	});

	backgroundSeries.data.push({
		geometry: am5map.getGeoRectangle(900, 180, -90, -180)
	});

	var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

	var sats = [];

	for (const element of satellites) {
		sats.push(pointSeries.pushDataItem({ latitude: element.satlat, longitude: element.satlng }));
	}

	console.log(sats);

	pointSeries.bullets.push(function() {
		return am5.Bullet.new(root, {
			sprite: am5.Circle.new(root, {
				radius: 2,
				fill: am5.color('#fc0328')
			})
		});
	});

	// Create point series

	// Add projection buttons
	var buttons = chart.children.push(
		am5.Container.new(root, {
			x: am5.p50,
			centerX: am5.p50,
			y: am5.p100,
			dy: 0,
			centerY: am5.p100,
			layout: root.horizontalLayout,
			paddingTop: 5,
			paddingRight: 8,
			paddingBottom: 5,
			paddingLeft: 8,
			background: am5.RoundedRectangle.new(root, {
				fill: am5.color('#363434'),
				fillOpacity: 1
			})
		})
	);

	function createButton(text, projection) {
		var button = buttons.children.push(
			am5.Button.new(root, {
				paddingTop: 0,
				paddingRight: 0,
				paddingBottom: 0,
				paddingLeft: 0,
				marginLeft: 5,
				marginRight: 5,
				label: am5.Label.new(root, {
					text: text
				})
			})
		);

		button.events.on('click', function() {
			chart.set('projection', projection);
		});
	}

	createButton('geoEqualEarth', am5map.geoEqualEarth());
	createButton('geoEquirectangular', am5map.geoEquirectangular());
	createButton('geoNaturalEarth1', am5map.geoNaturalEarth1());
	createButton('geoOrthographic', am5map.geoOrthographic());

	

}); // end am5.ready()
