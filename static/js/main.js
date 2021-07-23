import { boardsManager } from "/static/js/boardsManager.js";

function init() {
  boardsManager.loadBoards()
}

async function registerSW() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./static/js/sw.js');
    } catch (e) {
      console.log('SW registration failed');
    }
  }
}

init();
registerSW();