chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({ color: '#3aa757' }, function() {});
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { hostEquals: 'bitbucket.*.com' }, // <- ADD HERE THE CORRECT URL
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});