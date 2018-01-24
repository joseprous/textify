const TITLE_APPLY = "Enable text only";
const TITLE_REMOVE = "Disable text only";

const ICON_ON = "icons/text_on32.png";
const ICON_OFF = "icons/text_off32.png";

const APPLICABLE_DOMAINS = ["bigthink.com", "nature.com","brainpickings.org","sciencemag.org"];


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
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

function extractRootDomain(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    //if there is a subdomain 
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
        //check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
        if (splitArr[arrLen - 1].length == 2 && splitArr[arrLen - 1].length == 2) {
            //this is using a ccTLD
            domain = splitArr[arrLen - 3] + '.' + domain;
        }
    }
    return domain;
}

function domainIsApplicable(url) {
    var domain = extractRootDomain(url);
    return APPLICABLE_DOMAINS.includes(domain);
}


function initializePageAction(tab) {
    if(domainIsApplicable(tab.url)){
        browser.pageAction.setIcon({tabId: tab.id, path: ICON_OFF});
        browser.pageAction.setTitle({tabId: tab.id, title: TITLE_APPLY});
        browser.pageAction.show(tab.id);
    }
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
