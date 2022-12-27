/** Shared logic */
class KindleSave {

    /**
     * Gets the active Tab
     * @returns {Promise<*>} Active tab
     */
    getActiveTab = async () => {
        const query = { active: true, currentWindow: true };
        const getTabTitlePromise = new Promise((resolve, reject) => {
            chrome.tabs.query(query, (tabs) => {
                resolve(tabs[0]);
            });
        });
        return getTabTitlePromise;
    }

    /**
     * Concatenates the tab title with Acho's barks.
     * @param {String} tabTitle Current tab title
     * @returns {String} 
     */
    getSavedTitle = (tabTitle) => {
        const savedTitle = `Saving page for later: <br><b>${tabTitle}</b>`
        return savedTitle;
    }

}