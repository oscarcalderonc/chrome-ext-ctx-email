
/* 
Based on the inner text of the node that was right clicked,
and the exact character that was right clicked, goes back
and forth to get the full "word" and identify if it is an
email. This logic probably can be improved
/*
const identifySearchTerm = (text, offset) => {
    let startIndex = 0;
    let endIndex = text.length;

    // Goes forward to find end of word
    for (let i = offset; i >= 0; i--) {
        if (text[i] === ' ') {
            startIndex = i;
            break;
        }
    }

    // Goes backward to find beginning of word
    for (let i = offset; i < text.length; i++) {
        if (text[i] === ' ') {
            endIndex = i;
            break;
        }
    }

    const emailRegex = /([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})/ig;
    const wordClicked = text.substring(startIndex, endIndex).trim(' ');
    
    // Check if the obtained "word" is an email
    console.log(`Is ${wordClicked} an email? ${emailRegex.test(wordClicked)}`);
}

// Event listener for contextual menu option
const onSelectionRightClick = async (info, tab) => {

    // Checks that our new menu option is selected
    if (info.menuItemId !== 'checkIfSelectionIsEmail') {
        return;
    }

    // Function to retrieved the right click node info on webpage
    const getSelectionData = () => ({
        text: window.getSelection().focusNode.data,
        offset: window.getSelection().focusOffset
    });

    // Tries to inject and run the function above in the webpage 
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

    //Adds new contextual menu to click after right clicking on a text
    chrome.contextMenus.create({
        title: 'Check if selection is an email',
        contexts: ['all'],
        id: 'checkIfSelectionIsEmail'
    });

    Add listener to try to read the right-clicked email
    chrome.contextMenus.onClicked.addListener(onSelectionRightClick);
});

