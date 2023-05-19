const axios = require('axios');
const fs = require('fs');
const https = require('https');
const url = require('url');
const toml = require('toml');
const base64 = require('base-64');
const retry = require('async-retry')

// API token
const config = toml.parse(fs.readFileSync('config.toml'));

// Define API config
const username = config.username;
const api_token = config.password;
const base_url = config.base_url

// Combine the username and API token with a colon separator
const auth_string = `${username}:${api_token}`;

// Encode the auth string in Base64 format
const base64_auth = base64.encode(auth_string);

// https auth config
const options = {
  auth: `${username}:${api_token}`,
  headers: {
    Authorization: `Basic ${base64_auth}`,
  },
  timeout: 30000
};

// Get attachment URLs
const getAttachments = async (pageId, mediaFolder) => {
  try {
    await retry(async () => {
      const response = await axios.get(`${base_url}/api/v2/pages/${pageId}/attachments`, {
        headers: { 
          'Accept': 'application/json', 
          'Authorization': `Basic ${base64_auth}`
        },
        timeout: 30000
      });
      const { results: attachments } = response.data;
      const attachmentUrls = attachments.map(obj => base_url + obj.downloadLink);

      // Console attachment status message.
      if (response.status === 200 && attachments.length !== 0) {
        console.log('\x1b[30m%s\x1b[0m', `Retrieving ${attachments.length} attachments. Please wait...`)
      } else if (response.status === 200 && attachments.length === 0) {
        console.log('\x1b[30m%s\x1b[0m', 'No attachments found.')
      } else {
        console.log('\x1b[30m%s\x1b[0m', 'Network Error.')
      }
      
      // Save attachment to hard disk
      for (const attachmentUrl of attachmentUrls) {
        const fileName = url.parse(attachmentUrl).pathname.split('/').pop();
        const fullPath = `${mediaFolder}${fileName.replace(/%20/g, '_')}`;
        const file = fs.createWriteStream(fullPath);
        
        await retry(async () => {
          await new Promise((resolve, reject) => {
            https.get(attachmentUrl, options, (res) => {

              if (res.statusCode === 200) {
                console.log('\x1b[30m%s\x1b[0m', `Waiting for ${fileName}...`)
              } else if (res.statusCode === 302) {
                const newUrl = res.headers.location;
                console.log('\x1b[30m%s\x1b[0m', `Downloading:\n ${fileName}`)
                https.get(newUrl, options, (res) => {
                  res.pipe(file);
                  file.on('finish', () => {
                    file.close();
                    resolve();
                  });
                });
              } else {
                reject(new Error(`Failed to download ${attachmentUrl} with status code ${res.statusCode}`));
              }
            }).on('error', (error) => {
              reject(error);
            });;
          });
          console.log('\x1b[36m', `Downloaded:\n ${attachmentUrl}\n to:\n ${fullPath}`);
        }, {
          retries: 5,
          minTimeout: 2000,
          factor: 2
        }); 
      }
    }, {
      retries: 3,
      minTimeout: 2000,
      factor: 2
    });  
  } catch (error) {
    console.error('\x1b[31m', 'Error downloading attachments.', error);
  }
};

module.exports = getAttachments;

