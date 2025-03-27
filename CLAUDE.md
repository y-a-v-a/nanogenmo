# CLAUDE.md - Guidelines for this repository

## Purpose
This repository contains a text generator using Markov chains for NaNoGenMo (National Novel Generation Month).

## Running the Generator
```bash
# Run with npm script
npm run generate -- [input_file] [output_file] [seed_word] [word_count]

# Run with predefined input file
npm run run-pg1041

# Or directly with node
node src/generator.mjs [input_file] [output_file] [seed_word] [word_count]
```

Arguments:
- `input_file`: Source text file to build the Markov chain (required unless loading a table)
- `output_file`: Destination file for generated text (default: timestamped file)
- `seed_word`: Starting word for generation (default: random word from text)
- `word_count`: Number of words to generate (default: 100)
- `table_file`: Path to store/load the Markov chain table as JSON (optional)

The `table_file` argument serves dual purposes:
1. If the file doesn't exist, the program will save the generated Markov chain table to this file
2. If the file exists, the program will load the Markov chain from this file instead of processing the input file

## Project Structure
- `/src` - Source code files
- `/test` - Test files
- `/assets` - Input text files
- `/output` - Generated text output and saved tables

## Module System
- Uses ES Modules (ESM) with `type: "module"` in package.json
- Uses .mjs file extensions for clarity
- Requires Node.js version 16.0.0 or higher
- Use named imports with 'node:' prefix for core modules

## Testing
```bash
# Install dependencies
npm install

# Run tests
npm test
```

- Uses Jest for testing with ESM support
- Test files should follow the pattern `*.test.mjs`
- Keep functions in separate modules for better testability

## Code Style Guidelines
- Modern JavaScript with async/await and ES6+ features
- Use Node.js streams with the pipeline API
- Use camelCase for variables and functions
- Write JSDoc style comments for file headers and functions
- Follow 4-space indentation
- Use single quotes for strings
- Use template literals for string interpolation
- Write descriptive function and variable names
- Favor functional programming patterns where appropriate
- Document complex logic clearly in comments
- Organize functions in order of execution flow
- Use meaningful variable names that describe their purpose
- Handle file system operations with proper async/await and try/catch blocks