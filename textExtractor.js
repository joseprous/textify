
function extractText(inNode,outNode){
    var out = outNode;
    if(inNode.tagName == "P"){
        var p = document.createElement("P");
        out = p;
    }
    var children = inNode.childNodes;
    var array = Array.from(children);
    array.forEach(function(item){
        if(item.nodeType == 3/*text node*/){
            out.appendChild(item);
        }else{
            extractText(item,out);
        }
    });
    if(inNode.tagName == "P"){
        outNode.appendChild(out);
    }
}


var oldHead = document.head.innerHTML;
var oldTitle = document.title;
var oldBody = document.body.innerHTML;


var oldArticleTitle = document.getElementsByTagName("h1")[0];

var articleTitle = document.createElement('h1');
articleTitle.textContent = oldArticleTitle.textContent;

var oldArticleBody = document.getElementsByClassName("row article-body")[0];
var articleBody = document.createElement("div");

extractText(oldArticleBody,articleBody);

document.head.innerHTML = "";
document.body.innerHTML = "";
document.title = oldTitle;
document.body.appendChild(articleTitle);
document.body.appendChild(articleBody);

browser.runtime.onMessage.addListener((message) => {
    if (message.command === "reset") {
        document.head.innerHTML = oldHead;
        document.body.innerHTML = oldBody;
    }
});
