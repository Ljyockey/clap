function trackClick (e) {
    const fieldsObject = {
        eventAction: 'click',
        eventCategory: e.target.type,
        eventLabel: e.target.id || e.target.href,
        hitType: 'event'
    }
    ga('send', fieldsObject);
}

function init () {
    const clickableElements = document.querySelectorAll('button, a, input[type=submit]');
    for (let i = 0; i < clickableElements.length; i++) {
        clickableElements[i].addEventListener('click', trackClick);
    }
}

document.addEventListener('DOMContentLoaded', init);
