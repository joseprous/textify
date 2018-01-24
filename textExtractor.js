
function extractText(inNode,outNode){
    var out = outNode;
    if(inNode.tagName == "H1")
        return;
    
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

var oldArticleTitle;
var h = document.getElementsByClassName("entry-title");
if(h.length > 0){
    oldArticleTitle = h[0];
}else{
    var allH1 = document.getElementsByTagName("h1");
    oldArticleTitle = allH1[allH1.length-1];
}

var articleTitle = document.createElement('h1');
articleTitle.textContent = oldArticleTitle.textContent;

var oldArticleBody;

var classBigThink = "row article-body";
var b = document.getElementsByClassName(classBigThink);
if(b.length > 0){
    oldArticleBody = b[0];
}

var classSciencemag/*and nature*/ = "article__body";
var b = document.getElementsByClassName(classSciencemag);
if(b.length > 0){
    oldArticleBody = b[0];
}

var classBrainpickings = "posts";
var b = document.getElementById(classBrainpickings);
if(b != null){
    oldArticleBody = b;
}


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
