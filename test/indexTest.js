const chai = require('chai');
global.expect = chai.expect;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

// Load HTML content
const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf-8');

// Transform JavaScript using Babel
const { code: transformedScript } = babel.transformFileSync(
  path.resolve(__dirname, '..', 'index.js'),
  { presets: ['@babel/preset-env'] }
);

// Initialize JSDOM
const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

// --- CRITICAL FIX: MANUALLY MOCK FETCH IN JSDOM ---
dom.window.fetch = () =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          title: 'sunt aut facere repellat',
          body: 'quia et suscipit\nsuscipit'
        },
      ]),
  });

// Expose JSDOM globals to the testing environment (Node global)
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.HTMLElement = dom.window.HTMLElement;
global.Node = dom.window.Node;

// Inject and run the script
const scriptElement = dom.window.document.createElement("script");
scriptElement.textContent = transformedScript;
dom.window.document.body.appendChild(scriptElement);

describe('Asynchronous Fetching ', () => {
  // Give the async fetch time to complete before running assertions
  const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 100));

  it('should fetch to external api and add information to page', async () => {
    await waitForAsync();
    let postDisplay = document.querySelector("#post-list");
    expect(postDisplay.innerHTML).to.include('sunt aut');
  });

  it('should create an h1 and p element to add', async () => {
    await waitForAsync();
    let h1 = document.querySelector("h1");
    let p = document.querySelector("p");
    
    expect(h1).to.not.be.null;
    expect(p).to.not.be.null;
    expect(h1.textContent).to.include("sunt aut facere repellat");
    expect(p.textContent).to.include("quia et suscipit\nsuscipit");
  });
});