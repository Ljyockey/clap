let textarea, emojiSpan, characterCount;

const emojiString = `<span role="img" aria-label="clap">&#128079;</span>`;

function onFormSubmit (e) {
    e.preventDefault();
}

function refreshCharacterCount () {
    const len = textarea.value.trim().length;
    characterCount.innerHTML = len + '/200';
}

function refreshOtherExamples () {
    const v = textarea.value.trim();
    const emoji = emojiSpan.innerHTML;
    const emojiRegex = new RegExp(emoji, 'g');
    const replaceEmojis = r => v.replace(emojiRegex, r);

    document.getElementById('rendered-text').innerHTML = replaceEmojis(emojiString);
    document.getElementById('raw-text').innerHTML = replaceEmojis('');
}

function onTextareaChange ({key}) {
    const len = textarea.value.length;
    if (key === ' ' && len < 200) {
        textarea.value = textarea.value += emojiSpan.innerHTML + ' ';
    }

    refreshCharacterCount();
    refreshOtherExamples();
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
