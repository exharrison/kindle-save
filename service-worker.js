importScripts('kindle-save.js', 'page.service.js');

chrome.commands.onCommand.addListener(async (command) => {
    switch (command) {
        case 'announce':
            await sendTitle();
            break;
        default:
            console.log(`Command ${command} not found`);
    }
});

/**
 * Gets the current active tab URL and opens a new tab with the same URL.
 */
const duplicateTab = async () => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs) => {
        chrome.tabs.create({ url: tabs[0].url, active: false });
    });
}

/**
 * Sends message to the content script with the currently active tab title.
 */
const sendTitle = async () => {
    const kindleSave = new KindleSave();
    const tab = await kindleSave.getActiveTab();
    var url, asin;
    var asin_template = ".*/dp/<asin>/.*"

    chrome.tabs.sendMessage(tab.id, {
        tabTitle: tab.title
    });

    url = tab.url;
    asin = url.substring(
        url.indexOf("/dp/") + 1, 
        url.lastIndexOf("/")
    );

    await PageService.savePage(tab.title, asin);

    kindleSave.quiet();
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    new KindleSave().remind();
});

chrome.tabs.onCreated.addListener(tab => {
    new KindleSave().remind();
});