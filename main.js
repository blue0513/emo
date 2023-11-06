document.addEventListener("selectionchange", () => {
    const selectionText = window.getSelection().toString();
    if (selectionText) chrome.runtime.sendMessage({ text: selectionText });
});

chrome.runtime.onMessage.addListener(async (message) => {
    if (message.command == "copy") {
        navigator.clipboard.writeText()
    }
});
