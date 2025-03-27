/**
 * Word wraps a string to a specified width
 * @param {string} string - The string to word wrap
 * @param {number} width - The maximum width of each line
 * @param {string} lineBreak - The character to use for line breaks
 * @param {boolean} cut - Whether to cut words that are longer than the width
 * @returns {string} The word wrapped string
 */
export function wordwrap(string, width = 75, lineBreak = '\n', cut = false) {
    const words = string.split(' ').reverse();
    let result = '';
    let line = '';
    
    while (words.length) {
        const word = words.pop();
        if ((line + word).length >= width) {
            if (word.length > width && cut) {
                words.push(word.substring(width));
                word = word.substring(0, width);
            }
            result += line.trim() + lineBreak;
            line = '';
        }
        line += word + ' ';
        if (!words.length) {
            result += line.trim();
        }
    }
    return result;
}

export default wordwrap;