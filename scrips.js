// Assuming you're working in a CesiumJS environment
const viewer = new Cesium.Viewer('cesiumContainer');  // Initialize Cesium Viewer

// Function to load JSON data
export async function loadJSON(filePath) {
  const response = await fetch(filePath);
  const data = await response.json();
  return data;
}

// Load all files
Promise.all([
  loadJSON('/pointsOfInterest.json'),
  loadJSON('/subseaAssets.json'),
  loadJSON('/subseaPipelines.json'),
  loadJSON('/surfVessels.json')
]).then(([pointsOfInterest, subseaAssets, subseaPipelines, surfVessels]) => {
  // Process and plot each data set

  // Points of Interest
  pointsOfInterest.forEach(point => {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
      point: {
        pixelSize: 10,
        color: Cesium.Color.RED
      },
      description: point.name // or any other property you want to display
    });
  });

  // Subsea Assets
  subseaAssets.forEach(asset => {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(asset.longitude, asset.latitude),
      point: {
        pixelSize: 10,
        color: Cesium.Color.GREEN
      },
      description: asset.name
    });
  });

  // Subsea Pipelines
  subseaPipelines.forEach(pipeline => {
    viewer.entities.add({
      polyline: {
        positions: Cesium.Cartesian3.fromDegreesArray(pipeline.coordinates),
        width: 5,
        material: Cesium.Color.BLUE
      },
      description: pipeline.name
    });
  });

  // Surf Vessels
  surfVessels.forEach(vessel => {
    viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(vessel.longitude, vessel.latitude),
      point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW
      },
      description: vessel.name
    });
  });
}).catch(error => {
  console.error("Error loading JSON files: ", error);
});


// export async function loadJSON(filepath) {
//     const response = await fetch(filePath);
//     const data = await response.json();
//     return data;
// }