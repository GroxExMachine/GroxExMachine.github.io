
const SPREADSHEET_ID = '1v9qxDmXpAZehEUQoOeEy8pBmZUSHJJxZ5mb4f87O750';

// Function to get rows from a Google Sheet
async function getRowsFromGoogleSheet(sheetId) {
  try {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`);
    const text = await response.text();
    const jsonString = /({.*})/.exec(text)[1];
    const data = JSON.parse(jsonString);

    // Extract the rows from the response (data.table.rows)
    if (data && data.table && data.table.rows) {
      const rows = data.table.rows;

      const mappedData = rows.map((row) => {
        const [lat, lng, title, linkTitle, url, description] = row.c.map((cell) => cell.v);
        return { 
            lat: parseFloat(lat), 
            lng: parseFloat(lng), 
            title: title.trim(),
            linkTitle: linkTitle.trim(),
            url: url.trim(),
            description: description.trim()
        };
      });
      console.log(mappedData);
      
      return mappedData;
    } else {
      console.error('Error: Invalid response from Google Sheets API');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error.message);
    return null;
  }
}

// Call the function with the sample spreadsheet ID
const spreadsheetId = SPREADSHEET_ID; // Replace this with your actual spreadsheet ID
getRowsFromGoogleSheet(spreadsheetId)
  .then((rows) => {
    if (rows) {
      initMap(rows)
      console.log(rows);
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

// Function to initialize the map
function initMap(locations) {
    // Set the initial coordinates and zoom level of the map
    var map = L.map('map').setView([40.177628, 44.512546], 10);

    // Add the OpenStreetMap tile layer to the map
    L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Fetch data from the Google Sheet (Mock implementation)
    // const locations = getRowsFromGoogleSheet(SPREADSHEET_ID);
    console.log(locations)
    locations.forEach((location) => {
        var marker = L.marker([location.lat, location.lng]).addTo(map);
        marker.bindPopup(
            `<b>${location.title}</b><br>` +
            `<a href="${location.url}">${location.linkTitle}</a><br>` +
            location.description 
          ).openPopup();
      });
}

// Call the initMap function when the page loads
// window.onload = initMap;
