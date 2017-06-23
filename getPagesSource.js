function extract_information(document_root) {
    var page_info = {};
    const node = document_root.firstChild;
    const head = document_root.getElementsByTagName('head')[0];
    if (head.querySelectorAll("meta[property='og:type']").length > 0)
        page_info["type"] = head.querySelectorAll("meta[property='og:type']")[0].content;
    else
        page_info["type"] = "other";
    if (head.querySelectorAll("meta[property='og:url']").length > 0)
        page_info["url"] = head.querySelectorAll("meta[property='og:url']")[0].content;
    if (head.querySelectorAll("meta[property='og:title']").length > 0)
        page_info["title"] = head.querySelectorAll("meta[property='og:title']")[0].content;
    if (head.querySelectorAll("meta[property='og:image']").length > 0)
        page_info["image"] = head.querySelectorAll("meta[property='og:image']")[0].content;
    if (head.querySelectorAll("meta[property='og:description']").length > 0)
        page_info["description"] = head.querySelectorAll("meta[property='og:description']")[0].content;
    else
        page_info["description"] = "There's no available description for this article."
    
    return page_info;
}

chrome.runtime.sendMessage({
    action: "getSource",
    source: extract_information(document)
});