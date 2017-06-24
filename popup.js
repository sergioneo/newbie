chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    jQmessage = $(message);
    var news_element = jQmessage.find("#overview").first();
    var unavailable_element = jQmessage.find("#not-available").first();
    if (request.source['type'] == 'article') {
      page_info = request.source;
      //news_element.html("here "+JSON.stringify(request.source, null, 2));
      news_element.find("#article-title").first().html(page_info["title"]);
      news_element.find("#article-img").first().css({"background-image" : "url('"+page_info["image"]+"')"});
      news_element.find("#article-description").first().html(page_info["description"]);
      const items = ["caution", "unreliable", "trustable"];
      const descriptions = {
        "caution": "we advise you to read carefully and not to trust blindly this article.",
        "unreliable": "we advise against reading and sharing this article, it's been published in an unreliable source.",
        "trustable": "we have enough reasons to believe this article is reliable."
      }
      const icons = {
        "caution": "fa-exclamation-triangle",
        "unreliable": "fa-hand-paper-o",
        "trustable": "fa-shield"
      }
      var item = items[Math.floor(Math.random()*items.length)];
      news_element.find('#explanation-text').first().html(descriptions[item]);
      news_element.find("#article-verdict").first().addClass(item);
      news_element.find("#verdict-icon").first().addClass(icons[item]);
      news_element.find("#verdict-title").first().html(item.toUpperCase());
      news_element.show();
      unavailable_element.hide();
    } else {  
      news_element.hide();
      unavailable_element.show();
      unavailable_element.html("This webpage doesn't seem to be a news piece.<br><a href = 'http://google.cl'>Is it? Please tell us.</a>");
    }
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;