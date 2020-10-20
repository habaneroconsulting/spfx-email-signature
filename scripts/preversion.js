//@ts-check
const fs = require('fs');

const solutionConfigPath = './config/package-solution.json';

// Check if the version number gets passed in the third option
if (process.argv.length < 4) {
  console.log('ERROR: No version have been passed in.');
  process.exit(1);
}

// Get the version passed in as argument
const nextVersion = isNaN(parseFloat(process.argv[2])) ? process.argv[3] : process.argv[2].split('-')[0];

// Require filesystem instance

// Read package-solution file
const solutionFileContent = fs.readFileSync(solutionConfigPath, 'UTF-8');

// Parse file as json
const solutionContents = JSON.parse(solutionFileContent);

// Set property of version to next version
solutionContents.solution.version = nextVersion + '.0';

fs.writeFileSync(
  solutionConfigPath,
  // Convert file back to proper json
  JSON.stringify(solutionContents, null, 2),
  'UTF-8'
);
