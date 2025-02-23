document.getElementById("pipeline-filter").addEventListener("change", () => {
  fetch("/subseaPipelines.json")
    .then((response) => response.json())
    .then((data) => {
      const healthFilter = document.getElementById("pipeline-filter").value;
      const filteredData = filterPipelines(data, healthFilter);
      plotPipelinesOnGlobe(filteredData);
    })
    .catch((error) => console.error("Error loading pipelines.json:", error));
});

function filterPipelines(pipelines, healthStatus = "All") {
  if (healthStatus === "All") return pipelines;
  return pipelines.filter((pipeline) => pipeline.health === healthStatus);
}

function plotPipelinesOnGlobe(data) {
  const viewer = window.viewer; //new Cesium.Viewer("cesiumContainer");
  const ellipsoid = viewer.scene.globe.ellipsoid;

  data.forEach((pipeline) => {
    // Create a new entity for each start point and end point
    const startCarto = Cesium.Cartographic.fromDegrees(
      pipeline.start_coordinates.coordinates.longitude,
      pipeline.start_coordinates.coordinates.latitude
    );
    const endCarto = Cesium.Cartographic.fromDegrees(
      pipeline.end_coordinates.coordinates.longitude,
      pipeline.end_coordinates.coordinates.latitude
    );

    // calculate geodesic
    const geodesic = new Cesium.EllipsoidGeodesic(
      startCarto,
      endCarto,
      ellipsoid
    );
    const numSamples = 100000; // sample points, the more, the smoother

    let positions = [];
    for (let i = 0; i <= numSamples; i++) {
      let fraction = i / numSamples;
      let interpolatedCarto = geodesic.interpolateUsingFraction(fraction);

      // raise height to make it look smoother
      let altitude = 5000 + 5000 * Math.sin(Math.PI * fraction); // lift the middle
      let interpolatedCartesian = ellipsoid.cartographicToCartesian(
        new Cesium.Cartographic(
          interpolatedCarto.longitude,
          interpolatedCarto.latitude,
          altitude
        )
      );

      positions.push(interpolatedCartesian);
    }

    // plot the curve
    viewer.entities.add({
      name: pipeline.name,
      polyline: {
        positions: positions,
        width: 3,
        material:
          pipeline.health === "Degraded"
            ? Cesium.Color.YELLOW
            : Cesium.Color.GREEN,
        arcType: Cesium.ArcType.GEODESIC,
        clampToGround: false,
      },
    });

    // mark the start point and end point
    viewer.entities.add({
      position: ellipsoid.cartographicToCartesian(startCarto),
      point: { pixelSize: 8, color: Cesium.Color.RED },
      label: {
        text: "Start: " + pipeline.name,
        font: "14px sans-serif",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    });

    viewer.entities.add({
      position: ellipsoid.cartographicToCartesian(endCarto),
      point: { pixelSize: 8, color: Cesium.Color.BLUE },
      label: {
        text: "End: " + pipeline.name,
        font: "14px sans-serif",
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
    });
  });

  viewer.zoomTo(viewer.entities);
}
