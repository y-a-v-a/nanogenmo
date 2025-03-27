import { wordwrap } from './wordwrap.mjs';

describe('wordwrap function', () => {
  test('wraps text at the specified width', () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam non felis euismod, eleifend purus vitae, dignissim velit.';
    const wrapped = wordwrap(text, 30);
    const lines = wrapped.split('\n');
    
    // Every line (except possibly the last) should be <= 30 chars
    for (let i = 0; i < lines.length - 1; i++) {
      expect(lines[i].length).toBeLessThanOrEqual(30);
    }
  });

  test('does not split a word that fits on a line', () => {
    const text = 'cat dog fish elephant tiger';
    const wrapped = wordwrap(text, 10);
    
    expect(wrapped).toBe('cat dog\nfish\nelephant\ntiger');
  });

  test('handles very long words without cutting by default', () => {
    const text = 'This is a verylongwordthatexceedsthewidthlimit testing wrap';
    const wrapped = wordwrap(text, 10);
    
    expect(wrapped).toContain('verylongwordthatexceedsthewidthlimit');
  });

  test('cuts long words when cut=true', () => {
    const text = 'This is a verylongwordthatexceedsthewidthlimit testing wrap';
    const wrapped = wordwrap(text, 10, '\n', true);
    
    expect(wrapped).not.toContain('verylongwordthatexceedsthewidthlimit');
  });

  test('uses custom line break character', () => {
    const text = 'This is a test of custom line breaks';
    const wrapped = wordwrap(text, 10, '<br>');
    
    expect(wrapped).toBe('This is a<br>test of<br>custom<br>line<br>breaks');
  });

  test('handles empty string', () => {
    expect(wordwrap('', 10)).toBe('');
  });

  test('handles single-word input', () => {
    expect(wordwrap('word', 10)).toBe('word');
  });

  test('trims extra spaces', () => {
    const text = 'This   has   extra   spaces';
    const wrapped = wordwrap(text, 20);
    
    // Results should not contain double spaces
    expect(wrapped).not.toMatch(/\s{2,}/);
  });

  test('handles a real paragraph', () => {
    const paragraph = `The quick brown fox jumps over the lazy dog. This sentence is used because it contains all the letters in the English alphabet. The five boxing wizards jump quickly.`;
    const wrapped = wordwrap(paragraph, 40);
    const lines = wrapped.split('\n');
    
    // Check each line length
    for (let line of lines) {
      expect(line.length).toBeLessThanOrEqual(40);
    }
    
    // Check content is preserved
    expect(wrapped.replace(/\n/g, ' ')).toBe(paragraph);
  });
});