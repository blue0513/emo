let searchCandidateText = "";

const NORMAL_EMOTION = [".", "。"]
const QUESTION_EMOTION = ["?", "？"]

const GOOD_EMOTION = [
    ...Array(5).fill("。"),
    ...Array(2).fill("！"),
    ...Array(2).fill("〜"),
    "😀",
    "👌",
    "🤝",
    "👍"
];
const GOOD_QUESTION_EMOTION = [
    ...Array(5).fill("？"),
    "？👀",
    "？🤔",
];

function setText(text) {
    searchCandidateText = text.trim();
}
function getText() {
    return searchCandidateText.trim();
}
function clearText() {
    setText("");
}
async function emotionalize(text) {
  const replaced = text.split("").map((c) => {
    if (NORMAL_EMOTION.includes(c)) {
      return GOOD_EMOTION[Math.floor(Math.random() * GOOD_EMOTION.length)]
    }
    if (QUESTION_EMOTION.includes(c)) {
      return GOOD_QUESTION_EMOTION[Math.floor(Math.random() * GOOD_QUESTION_EMOTION.length)]
    }
    return c
  }).join("");

  await sentCopyCommand(replaced);
}

async function sentCopyCommand(text) {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!!tabs && !!tabs[0]) {
        await chrome.tabs.sendMessage(tabs[0].id, { command: "copy", text: text })
    }
}

chrome.runtime.onMessage.addListener((message) => {
    const { text } = message;
    setText(text);
});

chrome.commands.onCommand.addListener(async (command) => {
    switch (command) {
        case "emotion": {
            const text = getText();
            if (text) {
                await emotionalize(text);
                clearText();
                break;
            }
        }
    }
});
