const processPages = require('./convert.js');

const readline = require('readline');

const values = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser() {
  rl.question('Enter a value (or press Enter to finish): ', function(value) {
    if (value.trim() === '') {
      rl.close();
      processValues(values);
      for (let i = 0; i < values.length; i++) {
        const page = values[i];
        processPages(page)
      }
    } else {
      values.push(value);
      promptUser();
    }
  });
}

function processValues(values) {
  console.log('Values entered:', values);
  // Perform any further operations with the values
}

promptUser();



