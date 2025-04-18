#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Known Solana system program IDs to detect incorrect address values
const KNOWN_SYSTEM_PROGRAMS = {
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
  '11111111111111111111111111111111': 'System Program',
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token Program',
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': 'Metaplex Token Metadata Program'
};

const PROGRAM_ID = process.env.SOLARA_PROGRAM_ID;

if (!PROGRAM_ID) {
  console.error('SOLARA_PROGRAM_ID environment variable is not set');
  process.exit(1);
}

// Get the IDL from the target directory (adjusted for scripts folder)
const idlPath = path.join(__dirname, '..', 'program', 'presale-source.idl.json');

// Create an IDL template if the file doesn't exist
let idl;
if (!fs.existsSync(idlPath)) {
  console.log(`IDL file not found at ${idlPath}. Creating a minimal template.`);
  
  // Make sure the directory exists
  const idlDir = path.dirname(idlPath);
  if (!fs.existsSync(idlDir)) {
    fs.mkdirSync(idlDir, { recursive: true });
  }
  
  // Create a basic template
  idl = {
    address: PROGRAM_ID,
    metadata: {
      name: "solara",
      version: "0.1.0",
      spec: "0.1.0",
      description: "Permissioned token system for RWA on Solana",
      address: PROGRAM_ID
    },
    instructions: [],
    accounts: [],
    events: [],
    errors: [],
    types: []
  };
  
  // Write the template file
  fs.writeFileSync(idlPath, JSON.stringify(idl, null, 2));
  console.log(`Created template IDL file at ${idlPath}`);
} else {
  console.log(`Reading IDL from ${idlPath}`);
  idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));
}

// Check for incorrect system program IDs in address fields
const rootAddress = idl.address;
const metaAddress = idl.metadata?.address;

if (KNOWN_SYSTEM_PROGRAMS[rootAddress]) {
  console.log(`⚠️ WARNING: IDL root address is currently set to the ${KNOWN_SYSTEM_PROGRAMS[rootAddress]} (${rootAddress})`);
}

if (KNOWN_SYSTEM_PROGRAMS[metaAddress]) {
  console.log(`⚠️ WARNING: IDL metadata address is currently set to the ${KNOWN_SYSTEM_PROGRAMS[metaAddress]} (${metaAddress})`);
}

// Update the IDL with the current program ID (both root address and metadata.address)
console.log(`Updating IDL with program ID: ${PROGRAM_ID}`);
idl.address = PROGRAM_ID; // Update root level address
idl.metadata = idl.metadata || {};
//idl.metadata.address = PROGRAM_ID; // Update metadata address

// Ensure the name and other metadata fields are preserved
if (!idl.metadata.name) idl.metadata.name = "solara";
if (!idl.metadata.version) idl.metadata.version = "0.1.0";
if (!idl.metadata.spec) idl.metadata.spec = "0.1.0";
if (!idl.metadata.description) {
  idl.metadata.description = "Permissioned token system for RWA on Solana";
}

// Update the IDL file
fs.writeFileSync(idlPath, JSON.stringify(idl, null, 2));
console.log(`Updated IDL at ${idlPath}`);

// Write the IDL to the web UI directory (adjusted for scripts folder)
const webUIIdlPath = path.join(__dirname, '..', 'web-ui', 'src', 'utils', 'idl.json');
const yieldDistributionServiceIdlPath = path.join(__dirname, '..', 'yield-distributor-service', 'src', 'utils', 'idl.json');
const paths = [webUIIdlPath, yieldDistributionServiceIdlPath];

// Create directory if it doesn't exist
for (const _path of paths) {
  
  const dir = path.dirname(_path);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  console.log(`Writing updated IDL to ${_path}`);
  fs.writeFileSync(_path, JSON.stringify(idl, null, 2));
}

console.log('IDL generation completed successfully!'); 