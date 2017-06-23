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