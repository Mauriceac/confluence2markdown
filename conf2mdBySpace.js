const processPages = require('./convert.js');
const { clear } = require('console')

const readline = require('readline');

const toml = require('toml');
const base64 = require('base-64');
const axios = require('axios');
const fs = require('fs');


// Load the config file
const config = toml.parse(fs.readFileSync('config.toml', 'utf-8'));
const { username, password: api_token, base_url } = config;

// Convert the auth string to base64
const auth_string = `${username}:${api_token}`;
const base64_auth = base64.encode(auth_string);

const headers = {
    'Authorization': `Basic ${base64_auth}`,
    'Accept': 'application/json'
  };

  const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let spaceId
const ids = [];

// Function to prompt user for space key and get the corresponding page IDs
function promptUser() {
  rl.question('Enter the key of a Confluence space and press ENTER: ', function(key) {

    // First request to get the space ID using the space key
    axios.get(`${base_url}/api/v2/spaces?keys=${key}`, { headers, timeout: 10000 })
      .then(response => {
        spaceId = response.data.results[0].id;  // Extract the space ID from the response
        return spaceId;
      })
      .then(spaceId => {

        // Second request to get pages based on the space ID
        return axios.get(`${base_url}/api/v2/spaces/${spaceId}/pages?limit=250&depth=all&status=current`, {
          headers,
          timeout: 10000
        });
      })
      .then(response => {
        console.log(`Response: ${response.status} ${response.statusText}`);
        response.data.results.forEach(page => {
          ids.push(page.id);  // Store page IDs
        });
        rl.close();  // Close readline interface
        processValues(ids);  // Process the page IDs
      })
      .catch(err => {
        console.error('Error:', err);
        rl.close();  // Ensure readline closes on error
      });
  });
}

function processValues(ids) {
  console.log('Converting the following pages:', ids);
  for (let i = 0; i < ids.length; i++) {
    const page = ids[i];
    processPages(page)
  }
}

clear()
promptUser();



