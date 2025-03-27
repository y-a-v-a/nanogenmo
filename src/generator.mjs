/**
 * Random text generator
 * Based on using an input text.
 * Checks for all words what the next words are.
 * When generating a new text, it chooses randomly
 * which word to add next from all possible next words
 * @license MIT
 * 2014 y-a-v-a • Vincent Bruijn <vebruijn@gmail.com>
 * 2025 Modernized version
 */
import fs from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { Transform } from 'node:stream';
import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { wordwrap } from './wordwrap.mjs';

// Get command-line arguments
const inputFile = process.argv[2];
const outputFile = process.argv[3] || `text-${Date.now()}.txt`;
const seedWord = process.argv[4]; // Optional seed word to start the generation
const wordCount = parseInt(process.argv[5], 10) || 100; // Optional word count with default of 100
const tableFilePath = process.argv[6]; // Optional path to store/load the Markov chain table as JSON

// Flag to indicate if we're loading an existing table or creating a new one
const loadExistingTable = tableFilePath && existsSync(tableFilePath);

// Check input file only if we're not loading an existing table
if (!loadExistingTable && (!inputFile || !existsSync(inputFile))) {
    console.error('Input file does not exist or not specified.');
    process.exit(1);
}

class CleanUp extends Transform {
    constructor(options = {}) {
        super({ ...options, decodeStrings: false, objectMode: true });
    }

    _transform(data, encoding, done) {
        const array = data.split(/\r\n|\n|\r| /)
            .filter(el => el.length > 0)
            .filter(el => el.replace(/[LMCXIV]/g, '').length > 0) // remove Roman numbers
            .filter(el => el.replace(/[0-9:]/g, '').length > 0);  // remove all latin numbers

        array.reverse().forEach(word => this.push(word));
        done();
    }
}

class ProcessToTable extends Transform {
    constructor(options = {}) {
        super({ ...options, objectMode: true });
        this._former = undefined;
        this._table = {};
    }

    _transform(key, encoding, done) {
        if (typeof this._former === 'undefined') {
            this._former = key;
        }
        
        const value = this._former;
        if (typeof this._table[key] === 'undefined') {
            this._table[key] = [value];
        } else if (this._table[key].indexOf(value) === -1) {
            this._table[key].push(value);
        }

        this._former = key;
        done();
    }

    _flush(done) {
        this._table[Object.keys(this._table)[0]] = [this._former];
        done();
    }
}

// Imported from wordwrap.js

/**
 * Stores a Markov chain table as JSON to the specified path
 * @param {Object} table - The Markov chain table
 * @param {string} path - The file path to save the JSON
 * @returns {Promise<void>}
 */
async function storeTableToJson(table, path) {
    if (!path) return;
    
    try {
        await fs.writeFile(path, JSON.stringify(table, null, 2));
        console.log(`Markov chain table saved to: ${path}`);
    } catch (err) {
        console.error('Error writing table file:', err);
    }
}

/**
 * Loads a Markov chain table from a JSON file
 * @param {string} path - The path to the JSON file
 * @returns {Object} The loaded table
 */
function loadTableFromJson(path) {
    try {
        const data = readFileSync(path, 'utf8');
        const table = JSON.parse(data);
        console.log(`Loaded Markov chain table from: ${path}`);
        return table;
    } catch (err) {
        console.error('Error loading table file:', err);
        process.exit(1);
    }
}

/**
 * Creates text using a Markov chain model
 * @param {Object} table - The Markov chain table
 * @returns {Promise<void>}
 */
async function createText(table) {
    // If tableFilePath is provided, save the table as JSON (but only if we didn't load from it)
    if (tableFilePath && !loadExistingTable) {
        await storeTableToJson(table, tableFilePath);
    }
    
    let start = 0;
    const words = [];
    
    // Use seed word if provided and it exists in the table, otherwise use the first key
    let current = seedWord && table[seedWord] ? seedWord : Object.keys(table)[0];
    
    words.push(current);
    
    for (start; start < wordCount; start++) {
        if (table[current]) {
            current = table[current][Math.floor(Math.random() * table[current].length)];
            if (start === wordCount - 1) {
                current += '.';
            }
            words.push(current);
        } else {
            current = Object.keys(table)[0];
        }
    }
    
    // Capitalize first letter of sentences
    const text = words.join(' ').replace(/^([a-z]{1})|([\.\?\!]{1} [a-z]{1})/g, match => 
        match.toUpperCase()
    );

    try {
        await fs.writeFile(outputFile, wordwrap(text, 120));
        console.log(`Generated text saved to: ${outputFile}`);
    } catch (err) {
        console.error('Error writing file:', err);
        process.exit(1);
    }
}

/**
 * Main function that processes the input file and generates text
 */
async function main() {
    let table;
    
    // Either load existing table or create a new one
    if (loadExistingTable) {
        // Load table from JSON file
        table = loadTableFromJson(tableFilePath);
    } else {
        // Create new table from input file
        const cleanUp = new CleanUp();
        const processToTable = new ProcessToTable();
        
        const readable = createReadStream(inputFile, { encoding: 'utf8' });
        
        try {
            await pipeline(
                readable,
                cleanUp,
                processToTable
            );
            
            table = processToTable._table;
        } catch (err) {
            console.error('Pipeline failed:', err);
            process.exit(1);
        }
    }
    
    // Generate text using the table
    await createText(table);
}

// Run the program
main().catch(console.error);