// const { Billboard } = require("cesium");

fetch('/surfVessels.json')
    .then(response => response.json())
    .then(data => {
        plotVesselsOnGlobe(data);
    })
    .catch(error => console.error('Error loading surfVessels.json:', error));

    function plotVesselsOnGlobe(data) {
        const viewer = window.viewer // Assuming you have a container with id 'cesiumContainer'
    
        data.forEach(vessel => {
            // Create a new entity for each subsea vessel of interest
            const entity = viewer.entities.add({
                name: vessel.name,
                position: Cesium.Cartesian3.fromDegrees(
                    vessel.coordinates.longitude,
                    vessel.coordinates.latitude
                ),
                billboard: {
                    image: '/icons/boat.png', 
                    width: 32,  
                    height: 32,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                label: {
                    text: vessel.name,
                    font: '16px sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                },
                // description: vessel.description  // Add description for the point of interest
                description: `Name: ${vessel.name}<br>
                            ID: ${vessel.id}<br>
                            Vessel Type: ${vessel.vessel_type}<br>
                            Coordinates: \nLat:${vessel.coordinates.latitude} Lon: ${vessel.coordinates.longitude}<br>    
                            Heading: ${vessel.heading}<br>  
                            Speed: ${vessel.speed}<br>  
                            ETA: ${vessel.eta}<br> 
                            Status: ${vessel.status}<br>   
                            Last Inspection: ${vessel.last_inspection}<br>
                            Crew Count: ${vessel.crew_count}<br>
                            Fuel Level: ${vessel.fuel_level}<br>`,
            });
        });
    
        // Zoom to the area of the points
        viewer.zoomTo(viewer.entities);
    }
    