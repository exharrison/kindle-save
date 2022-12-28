/** @private */
const PAGES_KEY = 'pages';

/** Shared logic */
class PageService {

    /**
     * 
     * @returns {Promise<Array>}
     */
    static getPages = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.get([PAGES_KEY], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                const researches = result.pages ?? [];
                console.log("kindle-save[getPages]: " + researches);
                resolve(researches);
            });
        });

        return promise;
    }

    static savePage = async (title, asin) => {
        const pages = await this.getPages();
        
        console.log("kindle-save[savePage]: title " + title + " and asin " + asin);

        var newItem = {title, asin};
        pages.forEach(page => {
            if(page != null && page.asin != null && page.asin == asin) {
                newItem = null;
                console.log("kindle-save[savePage]: found " + asin);
                return;
            }
        });
        if( newItem == null )
            return;
        console.log("kindle-save[savePage]: Adding " + asin);
        const updatedPages = [...pages, newItem];

        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.set({ [PAGES_KEY]: updatedPages }, () => {          
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(updatedPages);
            });
        });

        return promise;
    }

    static clearPages = () => {
        const promise = toPromise((resolve, reject) => {
            chrome.storage.local.remove([PAGES_KEY], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                resolve();
            });
        });

        return promise;
    }
}

/**
 * Promisify a callback.
 * @param {Function} callback 
 * @returns {Promise}
 */
const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}