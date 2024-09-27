const TurndownService = require('turndown');
var turndownPluginGfm = require('turndown-plugin-gfm')
const gfm = turndownPluginGfm.gfm;

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
    turndownService.use(gfm);
    
    // Add rules and configure turndownService as needed
    turndownService.remove(['ac:parameter', 'ac:adf-content', 'ac:adf-attribute']);
      //turndownService.keep(['table'])
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
       turndownService.addRule('info', {
         filter: function (node, options) {
           return (
             node.nodeName === 'ac:structured-macro',
             node.getAttribute('ac:name') === 'info'
           )
         },
         replacement: function(content) {
          return 'NEWLINE' + `:::info` + 'NEWLINENEWLINE' + content + 'NEWLINENEWLINE' + `:::` + 'NEWLINENEWLINE';
         }        
         });
         turndownService.addRule('note', {
          filter: 'ac:adf-fallback',
          replacement: function(content) {
            return 'NEWLINE' + `:::note` + 'NEWLINENEWLINE' + content + 'NEWLINENEWLINE' + `:::` + 'NEWLINENEWLINE';
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