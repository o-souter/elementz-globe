export async function fetchGeographicPoints() {
    try {
        const response = await fetch('https://elementz.rguhack.uk/pointsOfInterest', {
            method: 'GET',
            mode: 'no-cors', // This will make it a "opaque" response
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const points = await response.json(); // Expecting an array of objects like [{ lat, lon, name, description }]
        
        console.log(`Fetched ${points.length} geographic points of interest:`);
        points.forEach((point, index) => {
            console.log(`Point ${index + 1}:`, point);
        });

        return points;
    } catch (error) {
        console.error('Error fetching geographic points:', error);
        return [];
    }
}

export async function addMarkersFromAPI(viewer) {
    const points = await fetchGeographicPoints();

    // Create a ScreenSpaceEventHandler to handle hover events
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((movement) => {
        const pickedObject = viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pickedObject)) {
            // Show the info on hover
            const { name, description } = pickedObject.id;
            console.log(`Hovered over: ${name} - ${description}`);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    points.forEach(point => {
        const position = Cesium.Cartesian3.fromDegrees(point.coordinates.longitude, point.coordinates.latitude);

        const entity = viewer.entities.add({
            position: position,
            billboard: {
                image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Red_dot.svg/120px-Red_dot.svg.png', // Marker image
                width: 16,
                height: 16
            },
            id: point, // Storing the entire point as the entity's id
            name: point.name,
            description: point.description // Adding description
        });
    });

    console.log('Markers added:', points);
}


// Function to fetch and process data from a given JSON file
function fetchData(file) {
    fetch(file)
      .then(response => response.json())
      .then(data => {
        console.log(`Fetched data from ${file}:`, data);
  
        // Example: Processing data based on the file name
        if (file === 'pointsOfInterest.json') {
          data.forEach(point => {
            console.log(`Name: ${point.name}, Latitude: ${point.coordinates.latitude}, Longitude: ${point.coordinates.longitude}`);
          });
        } else if (file === 'surfVessels.json') {
          data.forEach(vessel => {
            console.log(`Vessel ID: ${vessel.id}, Latitude: ${vessel.latitude}, Longitude: ${vessel.longitude}`);
          });
        } else if (file === 'subseaAssets.json') {
          data.forEach(asset => {
            console.log(`Asset ID: ${asset.id}, Latitude: ${asset.latitude}, Longitude: ${asset.longitude}`);
          });
        } else if (file === 'subseaPipelines.json') {
          data.forEach(pipeline => {
            console.log(`Pipeline ID: ${pipeline.id}, Start Latitude: ${pipeline.startLatitude}, End Latitude: ${pipeline.endLatitude}`);
          });
        }
  
        // You can use this data to add markers or visualizations in your Cesium app
      })
      .catch(error => {
        console.error(`Error fetching ${file}:`, error);
      });
  }
  
  // Fetch all the required JSON files
  fetchData('points_of_interest.json');
  fetchData('surfVessels.json');
  fetchData('subseaAssets.json');
  fetchData('subseaPipelines.json');
  