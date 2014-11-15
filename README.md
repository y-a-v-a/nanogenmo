#nanogenmo

## Inspiration

I got to know about NaNoGenMo 2014 via Twitter. I first reworked an old script but then I got fed up with it (partly because it was written in PHP) and wanted to create something new (using JavaScript). I like generators which use existing text to create something new.

So I created a generator that is loosely inspired by the markov chain code from Hay Kranen from 2008. My generator reads an exisiting file, splits it on space, removes empty strings and numbers and creates a table containing all words with a list of all possible subsuquent words. After finishing this table, a for loop runs through this table, randomly choosing which word will be the next. After finishing, the output is shown.

## Usage
The two added text files are

* pg10.txt - the bible
* pg1041.txt - all sonnets by Shakespeare

```bash
$ node ./generator.js pg10.txt
```

## For the curious

First I had made a non-stream based version, and just for the matter of learning some extra stuff, I transformed the beginning of the script into using streams. Inspiration taken from:

* http://howtonode.org/coding-challenges-with-streams
* http://nodejs.org/api/stream.html#stream_object_mode

I have stripped all Gutenberg meta data from the text files so no traces of these will show up in the resulting text.

## License
MIT

## Contributors
* @_y_a_v_a_ - Vincent Bruijn