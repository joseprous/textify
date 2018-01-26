function listenForClicks() {
    document.addEventListener("click", (e) => {

        function textonly(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "textonly"
            });
        }

        function textimg(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "textimg"
            });
        }

        function reset(tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                command: "reset",
            });
        }

        function reportError(error) {
            console.error(`Could not textify: ${error}`);
        }

        if (e.target.classList.contains("textonly")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(textonly)
                .catch(reportError);
        }
        else if (e.target.classList.contains("textimg")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(textimg)
                .catch(reportError);
        }
        else if (e.target.classList.contains("reset")) {
            browser.tabs.query({active: true, currentWindow: true})
                .then(reset)
                .catch(reportError);
        }
  });
}


function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute textify content script: ${error.message}`);
}

browser.tabs.executeScript({file: "/content_scripts/textify.js"})
.then(listenForClicks)
.catch(reportExecuteScriptError);


