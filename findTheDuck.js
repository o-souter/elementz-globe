function placeTheDuck() {
    const viewer = window.viewer;

    // Remove existing duck if already placed
    const existingDuck = viewer.entities.getById("duck-marker");
    if (existingDuck) {
        viewer.entities.remove(existingDuck);
    }

    // Generate a random latitude (-90 to 90) and longitude (-180 to 180)
    const randomLatitude = (Math.random() * 180) - 90;
    const randomLongitude = (Math.random() * 360) - 180;

    // Add duck marker
    viewer.entities.add({
        id: "duck-marker", // Unique ID to ensure only one duck exists
        name: "Mysterious Duck",
        position: Cesium.Cartesian3.fromDegrees(randomLongitude, randomLatitude),
        billboard: {
            image: "icons/duck.png", // Path to duck image
            width: 50,
            height: 50,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
        },
        label: {
            text: "Quack!",
            font: "16px sans-serif",
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(0, 10)
        },
        description: `Congratulations! You found the duck at ${randomLatitude}, ${randomLongitude} <br>
        Your prize: 1 Can of monster!!`
    });

    console.log(`Duck placed at: ${randomLatitude}, ${randomLongitude}`);
}
