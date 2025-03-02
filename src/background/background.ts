import { MessageType, ResponseType } from '../types';

let isRunning = false;

chrome.runtime.onMessage.addListener((
  message: MessageType,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: ResponseType) => void
) => {
  if (message.type === 'START_AUTOMATION') {
    isRunning = true;
    // Notify content script to start automation
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'START_AUTOMATION' });
      }
    });
    sendResponse({ success: true });
  } else if (message.type === 'STOP_AUTOMATION') {
    isRunning = false;
    // Notify content script to stop automation
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_AUTOMATION' });
      }
    });
    sendResponse({ success: true });
  } else if (message.type === 'GET_STATE') {
    sendResponse({ isRunning });
  }
  return true; // Required for async response
}); 