// Notification body.
const notification = document.createElement("div");
notification.className = 'kindle-save-notification';

// Notification icon.
const icon = document.createElement('img');
icon.src = chrome.runtime.getURL("images/icon32.png");
notification.appendChild(icon);

// Notification text.
const notificationText = document.createElement('p');
notification.appendChild(notificationText);

// Add to current page.
document.body.appendChild(notification);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    const notification = document.getElementsByClassName('kindle-save-notification')[0];
    const notificationText = notification.getElementsByTagName('p')[0];

    const kindleSave = new KindleSave();
    notificationText.innerHTML = kindleSave.getSavedTitle(request.tabTitle);

    notification.style.display = 'flex';

    setTimeout(function () {
        notification.style.display = 'none';
    }, 5000);
    
    return true;
});