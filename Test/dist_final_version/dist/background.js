/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
let isRunning = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_AUTOMATION') {
        isRunning = true;
        // Notify content script to start automation
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'START_AUTOMATION' });
            }
        });
        sendResponse({ isRunning: true, success: true });
    }
    else if (message.type === 'STOP_AUTOMATION') {
        isRunning = false;
        // Notify content script to stop automation
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'STOP_AUTOMATION' });
            }
        });
        sendResponse({ isRunning: false, success: true });
    }
    else if (message.type === 'GET_STATE') {
        sendResponse({ isRunning });
    }
    return true; // Required for async response
});

})();

/******/ })()
;
//# sourceMappingURL=background.js.map