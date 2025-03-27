#nanogenmo

nanogenmo issue: https://github.com/dariusk/NaNoGenMo-2014/issues/104

## Inspiration

I got to know about NaNoGenMo 2014 via Twitter. I first reworked an old script but then I got fed up with it (partly because it was written in PHP) and wanted to create something new (using JavaScript). I like generators which use existing text to create something new.

So I created a generator that is loosely inspired by the markov chain code from Hay Kranen from 2008. My generator reads an exisiting file, splits it on space, removes empty strings and numbers and creates a table containing all words with a list of all possible subsuquent words. After finishing this table, a for loop runs through this table, randomly choosing which word will be the next. After finishing, the output is shown.

## Usage

The project includes the following input text files:

* `assets/pg10.txt` - the Bible
* `assets/pg1041.txt` - all sonnets by Shakespeare

### Basic Usage

```bash
# Generate text using npm script
npm run generate -- assets/pg1041.txt output/my-text.txt

# Run directly with Node
node src/generator.mjs assets/pg1041.txt output/my-text.txt
```

### Advanced Usage

```bash
# Basic usage with all parameters
node src/generator.mjs [input_file] [output_file] [seed_word] [word_count] [table_file]

# Generate text with a specific seed word and word count
node src/generator.mjs assets/pg1041.txt output/shakespeare.txt "love" 1000

# Generate using Shakespeare sonnets with 500 words
npm run run-pg1041

# Save the Markov chain table to a JSON file for later use
npm run save-table

# Load a previously saved table and generate new text without reprocessing
npm run load-table
```

### Command-line Arguments

1. `input_file`: Source text file to build the Markov chain (required unless loading a table)
2. `output_file`: Destination file for generated text (default: timestamped file)
3. `seed_word`: Starting word for generation (default: random word from text)
4. `word_count`: Number of words to generate (default: 100)
5. `table_file`: Path to store/load the Markov chain table as JSON (optional)

The `table_file` argument serves dual purposes:
- If the file doesn't exist, the program will save the Markov chain table to this file
- If the file exists, the program will load the Markov chain from this file instead of processing the input file

## Implementation Details

### Architecture

The generator uses Node.js streams to process the input text file and create a Markov chain model:

1. **Text Preprocessing**: The input file is read as a stream, cleaned up (removing empty strings, Roman numerals, etc.), converting all words to lowercase, and processed into a table.
2. **Markov Chain**: A table is constructed mapping each lowercase word to an array of possible following words.
3. **Text Generation**: Starting from a seed word, the generator randomly selects subsequent words based on the Markov chain model.
4. **Output**: The generated text is wordwrapped and saved to the specified output file.

### Features

- **Stream Processing**: Efficiently processes large input files using Node.js streams
- **Word Wrapping**: Custom algorithm that handles long words, preserves text semantics, and supports different wrapping widths
- **Table Storage**: Option to save and load Markov chain tables to/from JSON files for reuse
- **Seed Word**: Ability to start text generation from a specific word
- **Configurable Length**: Control the number of words generated

### Technical Notes

- Uses modern JavaScript (ES Modules, async/await, etc.)
- Written with test-driven development (Jest tests for core functionality)
- Originally created in 2014, modernized in 2025

I have stripped all Gutenberg meta data from the text files so no traces of these will show up in the resulting text.

## License
MIT

## Contributors
* @_y_a_v_a_ - Vincent Bruijn