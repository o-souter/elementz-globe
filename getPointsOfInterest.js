fetch('/pointsOfInterest.json')
    .then(response => response.json())
    .then(data => {
        plotPointsOnGlobe(data);
    })
    .catch(error => console.error('Error loading pointsOfInterest.json:', error));


    function plotPointsOnGlobe(data) {
        const viewer = window.viewer//new Cesium.Viewer('cesiumContainer');  // Assuming you have a container with id 'cesiumContainer'
    
        data.forEach(point => {
            // Create a new entity for each point of interest
            const entity = viewer.entities.add({
                name: point.name,
                position: Cesium.Cartesian3.fromDegrees(
                    point.coordinates.longitude,
                    point.coordinates.latitude
                ),
                point: {
                    pixelSize: 10,
                    color: Cesium.Color.RED
                },
                label: {
                    text: point.name,
                    font: '16px sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                description: `
                Name: ${point.name}<br>
                ID: ${point.id}<br>
                Description: ${point.description}<br>
                Coordinates: \nLat: ${point.coordinates.latitude}\n Long: ${point.coordinates.longitude}<br>
                `  // Add description for the point of interest
            });
        });
    
        // Zoom to the area of the points
        viewer.zoomTo(viewer.entities);
    }
    