// your_script.js

// Function to initialize the map
function initMap() {
    // Set the initial coordinates and zoom level of the map
    var map = L.map('map').setView([51.505, -0.09], 13);

    // Add the OpenStreetMap tile layer to the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to fetch data from the Google Sheet (Mock implementation)
    function fetchDataFromGoogleSheet() {
        // In a real-world scenario, you would use the Google Sheets API to fetch data
        // For simplicity, we're using a mock dataset here
        return [
            { lat: 51.5, lng: -0.09, popup: "Location 1" },
            { lat: 51.51, lng: -0.1, popup: "Location 2" },
            { lat: 51.52, lng: -0.11, popup: "Location 3" },
            // Add more locations as needed
        ];
    }

    // Fetch data from the Google Sheet (Mock implementation)
    var locations = fetchDataFromGoogleSheet();

    // Loop through the locations array and add markers to the map
    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        var marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup("<b>" + location.popup + "</b>").openPopup();
    }
}

// Call the initMap function when the page loads
window.onload = initMap;
