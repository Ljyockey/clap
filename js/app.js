let textarea, emojiSpan, characterCount;

const emojiString = `<span role="img" aria-label="clap">&#128079;</span>`;
const tweetEnd = '\n\nAdd emojis to the end of each word at https://clap.money, by @Ljyockey.'

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

function refreshCharacterCount (id) {
    const len = document.getElementById(id).value.trim().length;
    characterCount.innerHTML = len + '/205';
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

function refreshTwitterData (id) {
    const urlSeparator = '&text='

    const v = document.getElementById(id).value.trim();
    const link = document.getElementById(`tweet-link${id.split('-')[2] ? '-universal' : ''}`);

    const baseHref = link.href.split(urlSeparator)[0];
    const tweet = fullyEncodeURI(v + tweetEnd);
    link.setAttribute('href', baseHref + urlSeparator + tweet);
}

function refreshViews (targetId) {
    refreshCharacterCount(targetId);
    refreshOtherExamples();
    refreshTwitterData(targetId);
}

function onTextareaChange ({key, target}) {
    const len = target.value.length;
    if (key === ' ' && len < 205) {
        target.value = target.value += emojiSpan.innerHTML + ' ';
    }

    refreshViews(target.id);
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
    document.getElementById('emoji-text-universal').addEventListener('keyup', onTextareaChange);
    document.getElementById('speech-form').addEventListener('submit', onFormSubmit);
    document.getElementById('raw-text-button').addEventListener('click', onExampleButtonClick);
    document.getElementById('rendered-text-button').addEventListener('click', onExampleButtonClick);

    refreshTwitterData('emoji-text');
    refreshTwitterData('emoji-text-universal');
}

document.addEventListener('DOMContentLoaded', init);
