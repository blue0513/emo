const EMO_EMOTION_KEY = "emoEmotionKey";
const NORMAL_EMOTION = [".", "。"];
const GOOD_EMOTION = ["😀", "👌", "🤝", "👍"];

// message from content script
chrome.runtime.onMessage.addListener(async (message) => {
  const { text } = message;
  const goodEmotions = await restoreGoodEmotions();
  const emoText = emotionalize(text, goodEmotions);
  sendCopyCommand(emoText);
});

// message from user action
chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "emotion": {
      sendSelectCommand();
      break;
    }
  }
});

function emotionalize(text, goodEmotions) {
  const emoText = text
    .split("")
    .map((c) => {
      if (NORMAL_EMOTION.includes(c)) {
        return randomElement(goodEmotions);
      }
      return c;
    })
    .join("");

  return emoText;
}

async function sendCopyCommand(text) {
  const tab = await activeTab();
  if (tab) {
    await chrome.tabs.sendMessage(tab.id, { command: "copy", text: text });
  }
}

async function sendSelectCommand() {
  const tab = await activeTab();
  if (tab) {
    await chrome.tabs.sendMessage(tab.id, { command: "select" });
  }
}

function randomElement(arry) {
  return arry[Math.floor(Math.random() * arry.length)];
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!!tabs && !!tabs[0]) {
    return tabs[0];
  }
}

async function restoreGoodEmotions() {
  const maybeGoodEmotions = await chrome.storage.local.get(EMO_EMOTION_KEY);
  if (!!maybeGoodEmotions && !!maybeGoodEmotions[EMO_EMOTION_KEY]) {
    return maybeGoodEmotions[EMO_EMOTION_KEY].split(",");
  }
  return GOOD_EMOTION;
}
