let textarea, emojiSpan, characterCount;

const emojiString = `<span role="img" aria-label="clap">&#128079;</span>`;
const tweetEnd = '\n\nhear how this sounds with a screenreader at https://clap.money, by @Ljyockey. #a11y'

// encodes all characters encoded with encodeURIComponent, plus: ! ~ * ' ( )
function fullyEncodeURI (value) {
return encodeURIComponent(value)
  .replace(/!/g, '%21')
  .replace(/'/g, '%27')
  .replace(/\(/g, '%28')
  .replace(/\)/g, '%29')
  .replace(/\*/g, '%2a')
  .replace(/~/g, '%7e');
}

function onFormSubmit (e) {
    e.preventDefault();
}

function refreshCharacterCount () {
    const len = textarea.value.trim().length;
    characterCount.innerHTML = len + '/194';
}

function refreshOtherExamples () {
    const v = textarea.value.trim();
    const emoji = emojiSpan.innerHTML;
    const emojiRegex = new RegExp(emoji, 'g');
    const replaceEmojis = r => v.replace(emojiRegex, r);

    document.getElementById('rendered-text').innerHTML = replaceEmojis(emojiString);
    document.getElementById('raw-text').innerHTML = replaceEmojis('');
}

function refreshTwitterData () {
    const urlSeparator = '&text='

    const v = textarea.value.trim();
    const link = document.getElementById('tweet-link');

    const baseHref = link.href.split(urlSeparator)[0];
    const tweet = fullyEncodeURI(v + tweetEnd);
    link.setAttribute('href', baseHref + urlSeparator + tweet);
}

function onTextareaChange ({key}) {
    const len = textarea.value.length;
    if (key === ' ' && len < 194) {
        textarea.value = textarea.value += emojiSpan.innerHTML + ' ';
    }

    refreshCharacterCount();
    refreshOtherExamples();
    refreshTwitterData();
}

function createEmoji () {
    emoji = document.createElement('span');
    emoji.setAttribute('role', 'img');
    emoji.setAttribute('aria-label', 'clap');
    emoji.innerHTML = '&#128079;';
    return emoji;
}

function init () {
    characterCount = document.getElementById('character-count');
    textarea = document.getElementById('emoji-text');
    emojiSpan = createEmoji();

    textarea.addEventListener('keyup', onTextareaChange);
    document.getElementById('form').addEventListener('submit', onFormSubmit);
}

document.addEventListener('DOMContentLoaded', init);
