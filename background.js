const TITLE_APPLY = "Enable text only";
const TITLE_REMOVE = "Disable text only";

const ICON_ON = "icons/text_on32.png";
const ICON_OFF = "icons/text_off32.png";

function textOnly(){
    browser.tabs.executeScript({
        file: "textExtractor.js"
    });    
}

function resetPage(tab){
    browser.tabs.sendMessage(tab.id, {
        command: "reset",
    });
}


function toggleTextOnly(tab) {

    function gotTitle(title) {
        if (title === TITLE_APPLY) {
            browser.pageAction.setIcon({tabId: tab.id, path: ICON_ON});
            browser.pageAction.setTitle({tabId: tab.id, title: TITLE_REMOVE});
            textOnly();
        } else {
            browser.pageAction.setIcon({tabId: tab.id, path: ICON_OFF});
            browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
            resetPage(tab);
        }
    }

    var gettingTitle = browser.pageAction.getTitle({tabId: tab.id});
    gettingTitle.then(gotTitle);
}



function initializePageAction(tab) {
    browser.pageAction.setIcon({tabId: tab.id, path: ICON_OFF});
    browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
    browser.pageAction.show(tab.id);
}

var gettingAllTabs = browser.tabs.query({});
gettingAllTabs.then((tabs) => {
    for (let tab of tabs) {
        initializePageAction(tab);
    }
});

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
    initializePageAction(tab);
});

browser.pageAction.onClicked.addListener(toggleTextOnly);
