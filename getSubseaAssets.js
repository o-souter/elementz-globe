function filterAssets(assets, healthStatus) {
  if (healthStatus == "All") return assets;
  return assets.filter((asset) => asset.health === healthStatus);
}

document.getElementById("asset-filter").addEventListener("change", () => {
  fetch("/subseaAssets.json")
    .then((response) => response.json())
    .then((data) => {
      const healthFilter = document.getElementById("asset-filter").value;
      const filteredData = filterAssets(data, healthFilter);
      plotAssetsOnGlobe(filteredData);
    })
    .catch((error) => console.error("Error loading assets.json:", error));
});

function plotAssetsOnGlobe(data) {
  const viewer = window.viewer; //new Cesium.Viewer("cesiumContainer");
  const ellipsoid = viewer.scene.globe.ellipsoid;

  let assetPositions = {};

  data.forEach((asset) => {
    const position = Cesium.Cartesian3.fromDegrees(
      asset.coordinates.coordinates.longitude,
      asset.coordinates.coordinates.latitude,
      -asset.coordinates.depth
    );

    assetPositions[asset.name] = position;

    // asset color change along with health status (need refine)
    let assetColor = Cesium.Color.GREEN;
    if (asset.health === "Degraded") {
      assetColor = Cesium.Color.YELLOW;
    } else if (asset.health === "Critical") {
      assetColor = Cesium.Color.RED;
    }

    // add assets to scenary
    viewer.entities.add({
      name: asset.name,
      position: position,
      ellipsoid: {
        radii: new Cesium.Cartesian3(500, 500, 500),
        material: assetColor,
      },
      label: {
        text: asset.name,
        font: "14px sans-serif",
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      },
      description: `Health: ${asset.health}<br>
                   Pressure: ${asset.pressure} bar<br>
                   Temperature: ${asset.temperature} °C<br>
                   Flow Rate: ${asset.flow_rate} m³/h<br>
                   Last Inspection: ${asset.last_inspection}<br>
                   Next Maintenance: ${asset.next_maintenance}`,
    });
  });

  // connect the assets using straght lines
  data.forEach((asset) => {
    if (asset.connected_assets) {
      asset.connected_assets.forEach((connectedAsset) => {
        if (assetPositions[connectedAsset]) {
          viewer.entities.add({
            polyline: {
              positions: [
                assetPositions[asset.name],
                assetPositions[connectedAsset],
              ],
              width: 2,
              material: Cesium.Color.CYAN.withAlpha(0.7),
              arcType: Cesium.ArcType.GEODESIC,
              clampToGround: false,
            },
          });
        }
      });
    }
  });

  viewer.zoomTo(viewer.entities);
}
