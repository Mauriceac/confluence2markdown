const TurndownService = require('turndown');

const turndown = async (newHtml) => {
try {
// Convert HTML to Markdown using Turndown
      //DEFINE CHARACTERS TO ESCAPE
      // Define the new escape function for Turndown
      var escapes = [
        // [/\\/g, '\\\\'],
        [/\*/g, '\\*'],
        [/^-/g, '\\-'],
        [/^\+ /g, '\\+ '],
        [/^(=+)/g, '\\$1'],
        [/^(#{1,6}) /g, '\\$1 '],
        [/`/g, '\\`'],
        [/^~~~/g, '\\~~~'],
        // [/\[/g, '\\['],
        // [/\]/g, '\\]'],
        // [/_/g, '\\_'],
        [/^>/g, '\\>'],
        [/^(\d+)\. /g, '$1\\. ']
      ];
      function myEscape(string) {
        return escapes.reduce(function (accumulator, escape) {
          return accumulator.replace(escape[0], escape[1])
        }, string)
      }
      // Set the new function as the prototype method for escape
      TurndownService.prototype.escape = myEscape;

    const turndownService = new TurndownService({ headingStyle: 'atx' });
    // Add rules and configure turndownService as needed
    turndownService.remove(['ac:parameter', 'ac:adf-content', 'ac:adf-attribute']);
      turndownService.keep(['table'])
      turndownService.addRule('image', {
        filter: 'temp',
        replacement: function (content) {
          return 'NEWLINE' + content + 'NEWLINENEWLINE'
        }
      })
      turndownService.addRule('code', {
        filter: 'pre',
        replacement: function (content) {
          return 'NEWLINE' + '```' + content.replace(/```/g, '\\```') + 'NEWLINE' + '```' + 'NEWLINENEWLINE'
        }
      });
      turndownService.addRule('expand', {
        filter: function (node, options) {
          return (
            node.nodeName === 'ac:structured-macro',
            node.getAttribute('ac:name') === 'expand'
          )
        },
        replacement: function(content) {
            return 'NEWLINENEWLINE' + `<details><summary>Click to expand.</summary>` + content.replace(/\*   /g, 'NEWLINE> *   ').replace(/\n/g, '') + '</details>' + 'NEWLINENEWLINE';
          }
        });
        turndownService.addRule('notes', {
          filter: function (node, options) {
            return (
              node.nodeName === 'ac:structured-macro',
              node.getAttribute('ac:name') === 'note'
            )
          },
          replacement: function(content) {
            if (content.startsWith('Note:')) {
              return 'NEWLINENEWLINE' + `> **Note**` + content.substring(4).replace(/\n/g, '') + 'NEWLINENEWLINE';
            } else {
              return 'NEWLINENEWLINE' + `> **Note**: ` + content.replace(/\*   /g, 'NEWLINE> *   ').replace(/\n/g, '') + 'NEWLINENEWLINE';
            }
          }        
          });
          turndownService.addRule('notes2', {
            filter: 'ac:adf-fallback',
            replacement: function(content) {
              if (content.startsWith('Note:')) {
                return 'NEWLINENEWLINE' + `> **Note**` + content.substring(4).replace(/\n/g, '') + 'NEWLINENEWLINE';
              } else {
                return 'NEWLINENEWLINE' + `> **Note**: ` + content.replace(/\*   /g, 'NEWLINE> *   ').replace(/\n/g, '') + 'NEWLINENEWLINE';
              }
            }        
            });
        turndownService.addRule('methods', {
            filter: function (node, options) {
              return (
                node.previousElementSibling === 'ac:structured-macro',
                node.getAttribute('ac:name') === 'panel'
              )
            },
            replacement: function(content) {
              if (content.startsWith('Note:')) {
                return 'NEWLINENEWLINE' + `> **Note**` + content.substring(4).replace(/\n/g, '') + 'NEWLINENEWLINE';
              } else if (content.startsWith('**POST')) {
                return 'NEWLINENEWLINE' + `<div style="border: 0px; color: black; background-color: #E3FCEF; padding: 10px; border-radius: 5px"><strong>` + content.replace(/\*\*/g, '').replace(/\n/g, '') + `</strong></div><br/>` + 'NEWLINENEWLINE';
              } else if (content.startsWith('**GET')) {
                return 'NEWLINENEWLINE' + `<div style="border: 0px; color: black; background-color: #DEEBFF; padding: 10px; border-radius: 5px"><strong>` + content.replace(/\*\*/g, '').replace(/\n/g, '') + `</strong></div><br/>` + 'NEWLINENEWLINE';
              } else if (content.startsWith('**PUT')) {
                return 'NEWLINENEWLINE' + `<div style="border: 0px; color: black; background-color: #FFFAE6; padding: 10px; border-radius: 5px"><strong>` + content.replace(/\*\*/g, '').replace(/\n/g, '') + `</strong></div><br/>` + 'NEWLINENEWLINE';
              } else if (content.startsWith('**PATCH')) {
                return 'NEWLINENEWLINE' + `<div style="border: 0px; color: black; background-color: #FFFAE6; padding: 10px; border-radius: 5px"><strong>` + content.replace(/\*\*/g, '').replace(/\n/g, '') + `</strong></div><br/>` + 'NEWLINENEWLINE';
              } else if (content.startsWith('**DELETE')) {
                return 'NEWLINENEWLINE' + `<div style="border: 0px; color: black; background-color: #FFEBE6; padding: 10px; border-radius: 5px"><strong>` + content.replace(/\*\*/g, '').replace(/\n/g, '') + `</strong></div><br/>` + 'NEWLINENEWLINE';
              } else {
                return 'NEWLINENEWLINE' + `> **Note**: ` + content.replace(/\*   /g, 'NEWLINE> *   ').replace(/\n/g, '') + 'NEWLINENEWLINE';
              }
            }        
            });    
      turndownService.addRule('caption', {
        filter: 'ac:caption',
        replacement: function(content) {
          return '_' + content + '_' + 'NEWLINENEWLINE'
          }
        });

    const markdown_content = turndownService.turndown(newHtml);

    return markdown_content

} catch (error) {
    return error
}
};

module.exports = turndown;