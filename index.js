
const SPREADSHEET_ID = '1v9qxDmXpAZehEUQoOeEy8pBmZUSHJJxZ5mb4f87O750';

// Function to fetch data from a Google Sheet and extract JSON data
async function fetchSheetData(sheetId) {
  try {
    const response = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`);
    const textResponse = await response.text();

    // Use regex to extract JSON data from the response text
    const jsonMatch = textResponse.match(/{.*}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON data found in the response');
    }

    const jsonData = jsonMatch[0];

    // Parse the JSON data safely using JSON.parse()
    const data = JSON.parse(jsonData);

    return data;
  } catch (error) {
    throw new Error('Error fetching and parsing data: ' + error.message);
  }
}

// Function to filter rows with null lat or lon and map to desired format
function filterAndMapRows(data) {
  try {
    // Extract the rows from the parsed JSON data (data.table.rows)
    if (!data || !data.table || !data.table.rows) {
      throw new Error('Invalid data format from Google Sheets API');
    }

    const rows = data.table.rows;

    // Filter out rows with null lat or lon
    const filteredRows = rows.filter((row) => row.c[0] && row.c[1]);

    // Map filtered rows to objects with properties lat, lon, title, linkTitle, url, and description
    const mappedData = filteredRows.map((row) => {
      const cells = row.c.map((cell) => cell?.v ?? '');
      const [lat, lon, title, linkTitle, url, description] = cells;
      return {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
        title: title,
        linkTitle: linkTitle,
        url: url,
        description: description,
      };
    });

    return mappedData;
  } catch (error) {
    throw new Error('Error filtering and mapping data: ' + error.message);
  }
}

// The initMap function to initialize the Leaflet map
function initMap(data, middleLocation) {
  // Create a map instance
  const map = L.map('map').setView([middleLocation.lat, middleLocation.lon], 4);

  // Add OpenStreetMap tile layer to the map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  // Iterate through the data to create markers and add them to the map
  data.forEach((location) => {
    const marker = L.marker([location.lat, location.lon]).addTo(map);

    // Create the content for the popup
    const popupContent = `
      <h3>${location.title}</h3>
      <p>${location.description}</p>
      <a href="${location.url}" target="_blank">${location.linkTitle}</a>
    `;

    // Bind the popup to the marker
    marker.bindPopup(popupContent);
  });
}


async function fetchDataAndInitMap(sheetId) {
  try {
    // Fetch data and extract JSON
    const data = await fetchSheetData(sheetId);

    // Filter rows and map to desired format
    const mappedData = filterAndMapRows(data);

    // Calculate the middle location from the mapped data
    const middleLocation = calculateMiddleLocation(mappedData);

    // Now, you can call initMap function with the filtered and mapped data and the middle location
    initMap(mappedData, middleLocation);
  } catch (error) {
    console.error(error);
  }
}

function calculateMiddleLocation(locations) {
  if (!locations || locations.length === 0) {
    return null;
  }

  // Calculate the sum of latitudes and longitudes
  let sumLat = 0;
  let sumLon = 0;

  for (const location of locations) {
    sumLat += location.lat;
    sumLon += location.lon;
  }

  // Calculate the average latitudes and longitudes
  const avgLat = sumLat / locations.length;
  const avgLon = sumLon / locations.length;

  // Return the middle location
  return { lat: avgLat, lon: avgLon };
}

fetchDataAndInitMap(SPREADSHEET_ID);