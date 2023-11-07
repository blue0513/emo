chrome.runtime.onMessage.addListener(async (message) => {
  if (message.command == "select") {
    const selectedText = window.getSelection().toString();
    if (!selectedText) return;
    await chrome.runtime.sendMessage({ text: selectedText });
  }

  if (message.command == "copy") {
    const emoText = message.text;
    if (!emoText) return;
    navigator.clipboard.writeText(emoText);
  }
});
