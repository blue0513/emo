const NORMAL_EMOTION = [".", "。"];
const QUESTION_EMOTION = ["?", "？"];
const GOOD_EMOTION = [
  ...Array(5).fill("。"),
  ...Array(2).fill("！"),
  ...Array(2).fill("〜"),
  "😀",
  "👌",
  "🤝",
  "👍",
];
const GOOD_QUESTION_EMOTION = [...Array(5).fill("？"), "？👀", "？🤔"];

function randomElement(arry) {
  return arry[Math.floor(Math.random() * arry.length)];
}

async function activeTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!!tabs && !!tabs[0]) {
    return tabs[0];
  }
}

function emotionalize(text) {
  const emoText = text
    .split("")
    .map((c) => {
      if (NORMAL_EMOTION.includes(c)) {
        return randomElement(GOOD_EMOTION);
      }
      if (QUESTION_EMOTION.includes(c)) {
        return randomElement(GOOD_QUESTION_EMOTION);
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

chrome.runtime.onMessage.addListener((message) => {
  const { text } = message;
  const emoText = emotionalize(text);
  sendCopyCommand(emoText);
});

chrome.commands.onCommand.addListener(async (command) => {
  switch (command) {
    case "emotion": {
      sendSelectCommand();
      break;
    }
  }
});
