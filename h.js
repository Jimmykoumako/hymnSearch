//To be run with node js
const fs = require('fs');


// Function to parse the text file and convert it to JSON
function parseTextFile(filename) {
    const data = fs.readFileSync(filename, 'utf8');
    const lines = data.split('\n');

    const records = [];

    lines.forEach(line => {
        const fields = line.split('\t');
        if (fields.length > 1) {
            const record = {
                number: fields[0],
                title: fields[1],
                melody: fields[2],
            };
            records.push(record);
        }
    });

    return records;
}

// Path to your input text file
const inputFilename = 'v.txt';

// Parse the text file and convert to JSON
const jsonData = parseTextFile(inputFilename);

// Write the JSON data to a new file
const outputFilename = 'output.json';
fs.writeFileSync(outputFilename, JSON.stringify(jsonData, null, 4));

console.log(`Conversion successful! JSON data written to ${outputFilename}`);
