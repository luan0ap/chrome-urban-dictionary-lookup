/* Copyright 2017 Abner Soares Alves Junior

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License. */

const newChromeTab = (...conf) => chrome.tabs.create.apply(this, conf)

const lookup = (selectionText) => 
  newChromeTab({
    'url': 'http://www.urbandictionary.com/define.php?term=' + encodeURI(selectionText)
  })

const lookupInjected = ()  => {
    chrome.tabs.executeScript(null, {
        code: `const text = getSelection ? getSelection().toString() 
                              : (selection && selection.type !== 'Control') ? selection.createRange().text : ''`
    }, lookup)
}

chrome.commands.onCommand.addListener(command => command === 'urban-lookup'? lookupInjected(): false )

chrome.contextMenus.onClicked.addListener(lookup);
chrome.browserAction.onClicked.addListener(lookupInjected);

chrome.runtime.onInstalled.addListener(function () {
    chrome.contextMenus.create({
        'id': 'urbanDictionaryContext',
        'title': 'Lookup the selected text on Urban Directory',
        'contexts': ['selection']
    }, function () {
        if (chrome.extension.lastError) {
            console.error('Got expected error: ' + chrome.extension.lastError.message);
        }
    });
});