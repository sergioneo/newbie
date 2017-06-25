chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    jQmessage = $(message);
    var news_element = jQmessage.find("#overview").first();
    var unavailable_element = jQmessage.find("#not-available").first();
    if (request.source['type'] == 'article') {
      page_info = request.source;
      //news_element.html("here "+JSON.stringify(request.source, null, 2));
      news_element.find("#article-title").first().html(page_info["title"]);
      news_element.find(".form-title").val(page_info["title"]);
      news_element.find("#article-img").first().css({"background-image" : "url('"+page_info["image"]+"')"});
      news_element.find(".form-image").val(page_info["image"]);
      news_element.find("#article-description").first().html(page_info["description"]);
      news_element.find(".form-description").val(page_info["description"]);
      news_element.find(".form-url").val(page_info["url"]);
      const items = ["unreliable", "caution", "trustable"];
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
      
      news_element.show();
      unavailable_element.hide();
      $.ajax({
        method: "GET",
        url: "https://newbie-c0810.firebaseio.com/articles.json?orderBy=%22url%22&startAt=%22"+page_info["url"]+"%22&endAt=%22"+page_info["url"]+"%22"
      })
        .done(function( msg ) {
          if (Object.keys(msg).length == 0 || !msg[Object.keys(msg)[0]].ratings){
            $("#unknown-form").show();
            $("#load").html("There's no information for this article yet.");
          } else {
            var name = Object.keys(msg)[0];
            var newstar = '<i class="fa fa-star" aria-hidden="true"></i>';
            var newstarvoid = '<i class="fa fa-star-o" aria-hidden="true"></i>';
            var ratings = msg[name].ratings;
            var total = 0.0;
            for (var i = 0; i < Object.keys(ratings).length; i++){
              var iname = Object.keys(ratings)[i];
              var rate = parseInt(ratings[iname].rating);
              total += rate;
            }
            var score = total / Object.keys(ratings).length;
            console.log(msg[name]);
            var newbie_score = parseFloat(msg[name].newbie_rating)
            var readersStarsHTML = "";
            for (var i = 1; i <= score; i++){
              readersStarsHTML += newstar;
            }
            for (var i = Math.ceil(score); i < 5; i++){
              readersStarsHTML += newstarvoid;
            }
            console.log(readersStarsHTML);
            if (msg[name].source_num_ratings != 0){
              var source_score = parseFloat(msg[name].source_rep_total) / parseFloat(msg[name].source_num_ratings)
            } else {
              var source_score = score;
            }
            var sourceStarsHTML = "";
            for (var i = 1; i <= source_score; i++){
              sourceStarsHTML += newstar;
            }
            for (var i = Math.ceil(source_score); i < 5; i++){
              sourceStarsHTML += newstarvoid;
            }
            var newbieStarsHTML = "";
            for (var i = 1; i <= newbie_score; i++){
              newbieStarsHTML += newstar;
            }
            for (var i = Math.ceil(newbie_score); i < 5; i++){
              newbieStarsHTML += newstarvoid;
            }
            console.log("NB");
            console.log(newbie_score);
            $("#eval-stars").html(readersStarsHTML);
            $("#source-stars").html(sourceStarsHTML);
            $("#newbie-stars").html(newbieStarsHTML);
            $("#eval-text").html(Math.floor(score*100)/100.0);
            $("#source-text").html(Math.floor(source_score*100)/100.0);
            $("#newbie-text").html(Math.floor(newbie_score*100)/100.0);
            var overall_score = (score + newbie_score + source_score) / 3.0;
            if (overall_score < 2) var item = items[0];
            else if (overall_score < 4.5) var item = items[1];
            else item = items[2];
            news_element.find('#explanation-text').first().html(descriptions[item]);
            news_element.find("#article-verdict").first().addClass(item);
            news_element.find("#verdict-icon").first().addClass(icons[item]);
            news_element.find("#verdict-title").first().html(item.toUpperCase());
            $("#article-loading").hide();
            $("#article-summary").show();
          }
        });
      page_info = null;
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