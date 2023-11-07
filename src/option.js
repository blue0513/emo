const EMO_EMOTION_KEY = "emoEmotionKey";

async function saveOptions() {
  const emotions = document.getElementById("emotions").value;
  await chrome.storage.local.set({
    [EMO_EMOTION_KEY]: emotions,
  });

  const status = document.getElementById("status");
  status.textContent = "Option saved.";
  setTimeout(() => {
    status.textContent = "";
  }, 750);
}

async function restoreOptions() {
  const emotions = await chrome.storage.local.get(EMO_EMOTION_KEY);
  document.getElementById("emotions").value = emotions?.emoEmotionKey || "";
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
