const processPages = require('./convert.js');
const { clear } = require('console')

const readline = require('readline');

const values = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser() {
  rl.question('Enter the number of a Confluence page and press ENTER (or press ENTER with no value to finish): ', function(value) {
    if (value.trim() === '') {
      rl.close();
      processValues(values);
    } else {
      values.push(value);
      promptUser();
    }
  });
}

function processValues(values) {
  console.log('Converting the following pages:', values);
  for (let i = 0; i < values.length; i++) {
    const page = values[i];
    processPages(page)
  }
}

clear()
promptUser();



