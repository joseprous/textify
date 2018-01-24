
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

var oldArticleBody = null;

var bodyClasses = [
    "row article-body", /*bigthink*/
    "article__body" /*sciencemag and nature*/
];

for (var c in bodyClasses) {
    var e = document.getElementsByClassName(bodyClasses[c]);
    if(e.length > 0){
        oldArticleBody = e[0];
        break;
    }
}

if(oldArticleBody == null){
    var ids = [
        "posts" //brainpickings
    ];

    for (var c in ids) {
        var e = document.getElementById(ids[c]);
        if(e != null){
            oldArticleBody = e;
            break;
        }
    }
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
