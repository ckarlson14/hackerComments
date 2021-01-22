var baseURL = "https://news.ycombinator.com"
var buttonID = "none"
var existing = false

chrome.storage.sync.get('ids', function (data) {
    if (data.ids.length > 0 && location.host != "news.ycombinator.com") {
        buttonID = data.ids[0]
        existing = true
        var index = data.ids.indexOf(buttonID)
        if (index > -1) {
            data.ids.splice(index, 1);
            chrome.storage.sync.set({ids: data.ids}, function () {
                console.log('Comment URL removed on page load');
            });
        } else {
            console.log("id not found")
        }
    } else if (data.ids.length > 0 && location.host === "news.ycombinator.com") {
            chrome.storage.sync.set({ids: []}, function () {
                console.log('Comment URL removed : ' + data.ids);
                console.log("on HN already")
                buttonID = "none"
                existing = false
            });
    }else if (location.host === "news.ycombinator.com") {
        console.log("on HN already")
        buttonID = "none"
        existing = false
    }else {
        console.log("not on HN")
        buttonID = "none"
        existing = false
    }
});

$.get(chrome.runtime.getURL('/examplePage.html'), function (data) {
    //$('body').prepend(data);
    $(data).appendTo('body');
    var image = document.getElementById("image")
    image.src = chrome.runtime.getURL("/hn.png");
    console.log("loaded comments button")
    const button = document.getElementById("commentButton")
    button.addEventListener("click", openComments);
    button.param = buttonID
    check()
});

function check() {
    if (existing === true) {
            console.log("existing id", buttonID)
            var x = document.getElementById("bwrap")
            x.style.display = "flex"
    } else {
            console.log("no id found, hide button")
        if (location.host === "news.ycombinator.com"){
            var x = document.getElementById("bwrap")
            x.style.display = "none"
            var all = document.querySelectorAll(".storylink");
            for (var i = 0; i < all.length; i++) {
                const someInput = all[i]
                someInput.param = someInput.closest('tr').getAttribute('id')
                someInput.addEventListener("mousedown", story, false);
            }
        }else{
            console.log("not HN, don't run")
        }
    }
}

function story(evt) {
    console.log("which mouse clicked", evt.which)
    var id = evt.currentTarget.param
    console.log("story clicked", id)
    var url1 = baseURL + "/item?id="
    var url2 = url1.concat(id)

    chrome.storage.sync.get('ids', function (data) {
        if (data.ids.length > 0) {
            var arr = data.ids
            arr.push(url2)
            chrome.storage.sync.set({ids: arr}, function() {
            console.log('Comment URL added to end: ' + url2);
            });
        } else {
            chrome.storage.sync.set({ids: [url2]}, function() {
            console.log('Comment URL set: ' + url2);
            });
        }
    });
}

function openComments(evt) {
    console.log("openComments clicked");
    var id = evt.currentTarget.param
    var arr = []
    console.log(id)
    if (id === "none") {
        console.log("no existing id found, opening HN")
        var url = "https://news.ycombinator.com/news"
        window.open(url)
    }else{
        console.log("id from page load found", id)
        chrome.storage.sync.get('ids', function (data) {
            if (data.ids.length > 0) {
                var index = data.ids.indexOf(id)
                if (index > -1) {
                    var newarr = data.ids.splice(index, 1);
                    chrome.storage.sync.set({ids: newarr}, function () {
                        console.log('Comment URL removed, opening: ' + id);
                        window.open(id)
                    });
                } else {
                    window.open(id)
                    console.log("ids empty")
                }
            }else{
                window.open(id)
                console.log("ids empty")
            }
        });
    }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_news"){
      console.log("go to news")
      var url = baseURL + "/news"
      console.log(url)
      window.open(url)
    }
    else if (request.message === "hide_button") {
        var x = document.getElementById("bwrap")
        x.style.display = "none"
        console.log("button hidden")
    }
    else if (request.message === "show_button") {
        var x = document.getElementById("bwrap")
        x.style.display = "flex"
        console.log("button shown")
    }
  });

chrome.runtime.sendMessage({type: 'updateValue'}, (response) => {
    if(response == 'success') {
      console.log("loaded background.js")
  }
});


