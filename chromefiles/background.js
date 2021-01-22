// background.js


chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.type === 'updateValue') {
        response('success');
    }
});



