let textarea, emojiSpan, characterCount;

const emojiString = `<span role="img" aria-label="clap">&#128079;</span>`;
const tweetEnd = '\n\nHear how this sounds with a screenreader at https://clap.money, by @Ljyockey. #a11y'

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
    textToSpeech(textarea.value);
}

function refreshCharacterCount () {
    const len = textarea.value.trim().length;
    characterCount.innerHTML = len + '/194';
}

function replaceEmojis(replacer) {
    const v = textarea.value.trim();
    const emoji = emojiSpan.innerHTML;
    const emojiRegex = new RegExp(emoji, 'g');
    return v.replace(emojiRegex, replacer);
}

function refreshOtherExamples () {
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

function refreshViews () {
    refreshCharacterCount();
    refreshOtherExamples();
    refreshTwitterData();
}

function onTextareaChange ({key}) {
    const len = textarea.value.length;
    if (key === ' ' && len < 194) {
        textarea.value = textarea.value += emojiSpan.innerHTML + ' ';
    }

    refreshViews();
}

function createEmoji () {
    emoji = document.createElement('span');
    emoji.setAttribute('role', 'img');
    emoji.setAttribute('aria-label', 'clap');
    emoji.innerHTML = '&#128079;';
    return emoji;
}

function onExampleButtonClick(e) {
    const textId = e.target.id.split('-button')[0];
    const shouldRenderEmojis = textId.split('-')[0] === 'rendered';
    const emojiReplacer = shouldRenderEmojis ? 'clap image' : '';
    const text = replaceEmojis(emojiReplacer);
    textToSpeech(text);
}

function textToSpeech(text) {
	const availableVoices = window.speechSynthesis.getVoices();
    const voice = availableVoices.find(v => v.lang === 'en-US') || availableVoices[0];

	const ssu = new SpeechSynthesisUtterance();
	ssu.rate = 1;
	ssu.text = text
	ssu.voice = voice;

	window.speechSynthesis.speak(ssu);
}

function init () {
    characterCount = document.getElementById('character-count');
    textarea = document.getElementById('emoji-text');
    emojiSpan = createEmoji();
    
    textarea.addEventListener('keyup', onTextareaChange);
    document.getElementById('form').addEventListener('submit', onFormSubmit);
    document.getElementById('raw-text-button').addEventListener('click', onExampleButtonClick);
    document.getElementById('rendered-text-button').addEventListener('click', onExampleButtonClick);

    refreshViews();
}

document.addEventListener('DOMContentLoaded', init);
