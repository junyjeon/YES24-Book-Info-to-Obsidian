chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      files: ["content.js"],
    },
    () => {
      // content.js 실행 후 옵시디언 플러그인으로 메시지 보내기
      chrome.tabs.sendMessage(tab.id, { action: "createMarkdownFile" });
    }
  );
});
