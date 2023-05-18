const { DOMParser, XMLSerializer } = require('xmldom');

const processHtml = async (confluence_content) => {
try {
    // Parse the HTML code as a DOM tree
const parser = new DOMParser();
const doc = parser.parseFromString(confluence_content, 'text/html');

// Process the HTML content...
// Get code languages used in code blocks.
const parameters = doc.getElementsByTagName('ac:parameter');
let language = null;
const languages = [];
for (let i = 0; i < parameters.length; i++) {
  const parameter = parameters[i];
  if (parameter.getAttribute('ac:name') === 'language') {
    language = parameter.textContent;
    languages.push(language);
  }
};

// Get all HTML elements that match the ac:plain-text-body tag
var plainTextBodies = doc.getElementsByTagNameNS('*', 'plain-text-body');
  
// Iterate over all matching elements and apply the procedure to each one
for (var i = 0; i < plainTextBodies.length; i++) {
  var plainTextBody = plainTextBodies[i];
  
  // Get the entire content of the ac:plain-text-body element
  var content = plainTextBody.textContent.trim();
  
  // Add the consecutive item to the beginning of the content
  content = languages[i] + '\n' + content;

  // Replace new line characters with a unique string
  content = content.replace(/\n/g, 'NEWLINE');
  
  // Extract the text content within the CDATA section
  var cdataMatch = content.match(/<!\[CDATA\[(.*?)\]\]>/);
  if (cdataMatch) {
    var cdata = cdataMatch[1];

    // Remove the CDATA section from the content
    content = content.replace(cdataMatch[0], cdata);
  }

  // Create a new text node with the modified content
  var newTextNode = doc.createTextNode(content);
  
  // Replace the existing text node with the new one
  plainTextBody.replaceChild(newTextNode, plainTextBody.firstChild);
}

// Serialize the modified DOM tree back into HTML code
const serializer = new XMLSerializer();
const modifiedHtml = serializer.serializeToString(doc);

let newHtml = modifiedHtml
  .replace(/<table\b[^>]*>/gi, '<table>')
  .replace(/<ac:plain-text-body\b[^>]*>/gi, '<pre><code>')
  .replace(/<\/ac:plain-text-body\b[^>]*>/g, '</code></pre>')
  .replace(/<colgroup([\s\S]*?)<\/colgroup>/gi, '')
  .replace(/ri:filename="(.*?)"[^>]*"/g, '<temp>![$1](./media/$1)</temp')
  .replace(/<\/p>/g, '<br/>')
  .replace(/<\p>/g, '')
  .replace(/ <\/strong>/g, '</strong> ')
  .replace(/!\[(.*?)\)/g, (_, content) => '<temp>![' + content.replace(/ /g, '_') + ')</temp>')
  .replace(/<ac:caption>(.*?)<\/ac:caption>/g, (_, content) => '<ac:caption>' + content.replace(/<br\/>/g, '') + '</ac:caption>');

  return newHtml
  
} catch (error) {
    return error
}
};

module.exports = processHtml;
