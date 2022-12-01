const identifySearchTerm = (text, offset) => {
    let startIndex = 0;
    let endIndex = text.length;

    for (let i = offset; i >= 0; i--) {
    if (text[i] === ' ') {
        startIndex = i;
        break;
    }
    }

    for (let i = offset; i < text.length; i++) {
        if (text[i] === ' ') {
        endIndex = i;
        break;
        }
    }

    const emailRegex = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/ig;
    const wordClicked = text.substring(startIndex, endIndex).trim(' ');

    console.log(`Is ${wordClicked} an email? ${emailRegex.test(wordClicked)}`);
}

const onSelectionRightClick = async (info, tab) => {

    if (info.menuItemId !== 'checkIfSelectionIsEmail') {
        return;
    }

    const getSelectionData = () => ({
        text: window.getSelection().focusNode.data,
        offset: window.getSelection().focusOffset
    });

    try {
        const selectionData = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getSelectionData
        });
        
        const { text, offset } = selectionData[0]?.result;
        identifySearchTerm(text, offset);
    } catch(ex) {
        console.log('Unable to check if text is an email')
        console.log(ex);
    }
};

const extensionFailed = () => console.log('Failure trying to load extension');

chrome.runtime.onInstalled.addListener(async () => {

    chrome.contextMenus.create({
        title: 'Check if selection is an email',
        contexts: ['all'],
        id: 'checkIfSelectionIsEmail'
    });

    chrome.contextMenus.onClicked.addListener(onSelectionRightClick);
});

