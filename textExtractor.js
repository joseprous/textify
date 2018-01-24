const NODE_TYPE_TEXT = 3;

function extractText(inNode,outNode){
    var children = inNode.childNodes;
    var array = Array.from(children);
    array.forEach(function(item){
        if(item.nodeType == NODE_TYPE_TEXT){
            outNode.appendChild(item);
        }else{
            extractText(item,outNode);
        }
    });
}


var oldBody = document.body.innerHTML;

var oldTitle = document.getElementsByTagName("h1")[0];

var title = document.createElement('h1');
title.textContent = oldTitle.textContent;

var oldArticleBody = document.getElementsByClassName("row article-body")[0];
var articleBody = document.createElement("div");

extractText(oldArticleBody,articleBody);

document.body.innerHTML = "";

document.body.appendChild(title);
document.body.appendChild(articleBody);

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "reset") {
        document.body.innerHTML = oldBody;
    }
});
