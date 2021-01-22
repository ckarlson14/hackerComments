var baseURL = "https://news.ycombinator.com"

window.onload=function() {
    document.getElementById("newsButton").addEventListener("click", newsClick);
    document.getElementById("hideButtons").addEventListener("click", hideButton);
    document.getElementById("showButtons").addEventListener("click", showButton);
}

function newsClick() {
    var url = baseURL + "/news"
    console.log(url)
    window.open(url)
    window.close();
}

function hideButton() {
    console.log("hide button")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
     var activeTab = tabs[0];
     chrome.tabs.sendMessage(activeTab.id, {"message": "hide_button"});
     });
        window.close();
}

function showButton() {
    console.log("show button")
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
     var activeTab = tabs[0];
     chrome.tabs.sendMessage(activeTab.id, {"message": "show_button"});
     });
        window.close();
}