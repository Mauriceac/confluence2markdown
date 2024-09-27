const axios = require('axios');
const fs = require('fs');
const toml = require('toml');
const base64 = require('base-64');
const processHtml = require('./processHtml.js')
const getAttachments = require('./get_attachments.js');
const turndown = require('./turndown.js');
const retry = require('async-retry');

const importFolder = './imports/';
const mediaFolder = './imports/media/';

// Create importFolder and mediaFolder if they don't exist
fs.mkdirSync(importFolder, { recursive: true });
fs.mkdirSync(mediaFolder, { recursive: true });

// Load the config file
const config = toml.parse(fs.readFileSync('config.toml', 'utf-8'));
const { username, password: api_token, base_url } = config;

// Convert the auth string to base64
const auth_string = `${username}:${api_token}`;
const base64_auth = base64.encode(auth_string);


const processPages = async (page_id) => {
  try {
    await retry(async () => {
    // API request to get Confluence page content
    const url = `${base_url}/api/v2/pages/${page_id}?body-format=storage`;
    const headers = {
      'Accept': 'application/json',
      'Authorization': `Basic ${base64_auth}`
    };
    const response = await axios.get(url, { headers, timeout: 10000 });
    
    if (response.status === 200) {
      console.log('\x1b[30m%s\x1b[0m', 'Writing markdown file.\n Please wait...')
    } else {
      console.log('\x1b[31m%s\x1b[0m', 'Network Error.')
    }

    const confluence_content = response.data.body.storage.value;
    const page_title = response.data.title;
    const newHtml = await processHtml(confluence_content);
    const markdown_content = await turndown(newHtml);
    
    // Prepare the markdown file name and content
    const markdown_filename = `${importFolder}${page_title.replace(/:/g, '').replace(/ /g, '_').toLowerCase()}.md`;
    const markdown_file_content = `# ${page_title}\n${markdown_content}\n`;
    
    // Write the markdown file and get rid of workarounds.
    fs.writeFileSync(markdown_filename, markdown_file_content.replace(/NEWLINE/g, '\n').replace(/Ç/g, ' '));
    console.log('\x1b[32m%s\x1b[0m', `Markdown file exported successfully:\n ${markdown_filename}`);
    }, {
      retries: 3,
      minTimeout: 1000,
      factor: 2
    });   
    // Download attachments to mediaFolder
    await getAttachments(page_id, mediaFolder);
  } catch (error) {
    if (error.response) {
      console.error('\x1b[31m%s\x1b[0m', `Request failed with status code ${error.response.status}`);
      console.error(error.response.data);
    } else if (error.code === 'ETIMEDOUT') {
      console.error('\x1b[31m%s\x1b[0m', 'Request timed out. Please try again.')
    } else {
      console.error('\x1b[31m%s\x1b[0m', 'UNEXPECTED ERROR', error);
    }
  }
};

module.exports = processPages;