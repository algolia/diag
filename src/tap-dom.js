// This module is able to create an html representation
// of the console tap output
// Used to get a visual representation of test pass/fail/..
module.exports = tapDom;

function tapDom(HTMLElement) {
  HTMLElement.classList.add('tap-dom');

  var tapParser = require('tap-parser');

  var parser = tapParser();

  var originalLog = console.log;
  console.log = function() {
    var firstArg = arguments[0];
    parser.write(firstArg + '\n', 'utf8');

    // still forward everything to console
    originalLog.apply(console, arguments);
  };

  parser.on('comment', onTest);

  parser.on('assert', onAssert);

  parser.on('complete', onComplete);

  var currentTest;
  var failed;

  function onTest(name) {
    endCurrentTest();

    currentTest = {};
    currentTest.container = document.createElement('div');
    currentTest.container.classList.add('test');
    currentTest.container.classList.add('pending');

    currentTest.title = document.createElement('header');
    currentTest.status = document.createElement('span');
    currentTest.status.textContent = '⏳';

    currentTest.status.classList.add('status');

    currentTest.title.textContent = ' ' + name.slice(1).trim();
    currentTest.title.insertBefore(currentTest.status, currentTest.title.firstChild);
    currentTest.container.appendChild(currentTest.title);

    HTMLElement.appendChild(currentTest.container);
  }

  function onAssert(assert) {
    if (!assert.ok) {
      failed = true;
    }

    var status;

    if (assert.skip) {
      status = '😐';
    } else if (assert.ok) {
      status = '😊';
    } else {
      status = '😱';
    }

    var assertElement = document.createElement('div');
    assertElement.classList.add('assert');
    assertElement.textContent = status + ' ' + assert.name;
    currentTest.container.appendChild(assertElement);
  }

  function onComplete(results) {
    endCurrentTest();

    parser.removeListener('comment', onTest);
    parser.removeListener('assert', onAssert);
    console.log('complete', results);
  }

  function endCurrentTest() {
    if (!currentTest) {
      return;
    }

    currentTest.container.classList.remove('pending');

    if (failed) {
      currentTest.container.classList.add('failed');
      currentTest.status.textContent = '✖';
    } else {
      currentTest.status.textContent = '✔';
      currentTest.container.classList.add('success');
    }

    failed = false;
  }

  return parser;
}
