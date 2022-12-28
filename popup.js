document.addEventListener('DOMContentLoaded', async () => {
    
    const dialogBox = document.getElementById('dialog-box');
    
    const kindleSave = new KindleSave();
    const tab = await kindleSave.getActiveTab();
    const saved = kindleSave.getSavedTitle(tab.title);

    dialogBox.innerHTML = saved;
    
    // Store page.
    var asin, url, first, end;
    url = tab.url;

    first = url.indexOf("/dp/") + 4;
    end = first + 10;
    asin = url.substring(first, end);
    await PageService.savePage(tab.title, asin, tab.url);

    // Display history.
    await displayPages();

    // Clear history
    const clearHistoryBtn = document.getElementById('clear-history');
    clearHistoryBtn.onclick = async () => {
        await PageService.clearPages();
        await displayPages();
    };

    kindleSave.quiet();
});

const displayPages = async () => {
    const visitedPages = await PageService.getPages();
    const pageList = document.getElementById('page-list');
    var pageTemplate = "https://www.amazon.com/dp/"
    var eriqTemplate = "https://www.ereaderiq.com/dp/"

    pageList.innerHTML = '';
    
    visitedPages.forEach(page => {
        const pageItem = document.createElement('li');
        pageList.appendChild(pageItem);
        
        /* Amazon Link */
        const pageLink = document.createElement('a');
        pageLink.title = page.title;
        pageLink.innerHTML = page.title;
        var url = pageTemplate + "" + page.asin;        
        pageLink.href = url;
        pageLink.onclick = (ev) => {
            ev.preventDefault();
            chrome.tabs.create({ url: ev.srcElement.href, active: false });
        };
        pageItem.appendChild(pageLink);
        /* Insert a space for tidiness */
        pageItem.appendChild(document.createTextNode( '\u00A0' ));
        /* eReaderIQ Link */
        const eriqLink = document.createElement('a');
        eriqLink.title = page.title;
        eriqLink.innerHTML = "[eReaderIQ]";
        var eriqUrl = eriqTemplate + "" + page.asin;        
        eriqLink.href = eriqUrl;
        eriqLink.onclick = (ev) => {
            ev.preventDefault();
            chrome.tabs.create({ url: ev.srcElement.href, active: false });
        };
        pageItem.appendChild(eriqLink);
    });
}
