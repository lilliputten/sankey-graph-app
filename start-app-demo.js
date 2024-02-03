/* eslint-disable no-console */
/**
 * @changed 2024.02.03, 21:15
 */

let defaultServerUrl = 'http://localhost:8080';

const postRequestUrl = '/cgi-bin/accept-post-data?redirect=false';

let receivedUrl;

function onLoad() {
  console.log('[start-app-demo-watch:onLoad]');
  const serverUrlNode = document.getElementById('serverUrl');
  if (serverUrlNode) {
    serverUrlNode.value = defaultServerUrl;
  }
}

function getServerUrl() {
  const useServerUrlNode = document.getElementById('useServerUrl');
  if (useServerUrlNode && !useServerUrlNode.checked) {
    return '';
  }
  const serverUrlNode = document.getElementById('serverUrl');
  return serverUrlNode?.value || '';
}

function sendPostDataRequest() {
  const edges = document.getElementById('edges')?.value;
  const flows = document.getElementById('flows')?.value;
  const graphs = document.getElementById('graphs')?.value;
  const nodes = document.getElementById('nodes')?.value;
  const requestData = {
    edges,
    flows,
    graphs,
    nodes,
  };
  const fetchParams = {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Server header
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(requestData), // body data type must match "Content-Type" header
  };
  const resultNode = document.getElementById('result');
  const resultWrapperNode = document.getElementById('resultWrapper');
  const serverUrl = getServerUrl();
  const url = serverUrl + postRequestUrl;
  console.log('[start-app-demo-watch:sendPostDataRequest] start', {
    url,
    serverUrl,
    postRequestUrl,
    fetchParams,
  });
  fetch(url, fetchParams)
    .then((res) => {
      const { ok, body, status, statusText } = res;
      if (!ok) {
        return res.text().then((text) => {
          const errText = [
            'Error:',
            statusText || (status && String(status)),
            '(see details in log)',
            // text?.message || String(text),
          ]
            .filter(Boolean)
            .join(' ');
          const error = new Error(errText);
          console.error('[start-app-demo-watch:sendPostDataRequest] response with error', errText, {
            error,
            text,
            ok,
            body,
            status,
            statusText,
          });
          // eslint-disable-next-line no-debugger
          debugger;
          throw error;
        });
      }
      console.log('[start-app-demo-watch:sendPostDataRequest] response', {
        ok,
        body,
        res,
      });
      return res.text();
    })
    .then((text) => {
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn('Cannot parse json text', { text });
      }
      let result = text;
      receivedUrl = undefined;
      if (data) {
        receivedUrl = data.url;
        // prettier-ignore
        result = '\n'
          + '<h4>Data:</h4>\n'
          + '<pre>' + JSON.stringify(data, null, 2) + '</pre>\n'
          + '<h4>Text:</h4>\n'
          + '<div>' + text + '</div>\n'
        ;
        if (receivedUrl) {
          // prettier-ignore
          result = '\n'
            + '<h4>Received url:</h4>\n'
            + '<div>' + receivedUrl + '</div>\n'
        }
      }
      console.log('[start-app-demo-watch:sendPostDataRequest] result', {
        receivedUrl,
        result,
        text,
        data,
      });
      resultNode.innerHTML = result;
      resultWrapperNode.classList.toggle('error', false);
      document.getElementById('goToReceivedUrl')?.classList.toggle('hidden', !receivedUrl);
    })
    .catch((err) => {
      let errText = err.message || String(err);
      const isHtml = /<html/i.test(errText);
      if (isHtml) {
        errText = errText
          .replace(/<head>[\s\S]*<\/head>/i, '')
          .replace(/<[^<>]*>/g, '')
          // .replace(/[ \t]+/g, ' ')
          // .replace(/\n\s+/g, '\n')
          .replace(/\s+\n/g, '\n')
          .trim();
      }
      console.error('[start-app-demo-watch:sendPostDataRequest] error', {
        errText,
        isHtml,
        err,
      });
      // eslint-disable-next-line no-debugger
      debugger;
      resultNode.innerText = errText;
      resultWrapperNode.classList.toggle('error', true);
    })
    .finally(() => {
      resultWrapperNode.classList.toggle('hidden', false);
    });
}

function goToReceivedUrl() {
  const serverUrl = getServerUrl();
  const url = serverUrl + receivedUrl;
  console.log('[start-app-demo-watch:goToReceivedUrl]', {
    url,
    serverUrl,
    receivedUrl,
  });
  window.location.href = url;
}

function updateFormAction() {
  const formNode = document.getElementById('form');
  const dataAction = formNode.getAttribute('data-action');
  const serverUrl = getServerUrl();
  const actionUrl = serverUrl + dataAction;
  formNode.setAttribute('action', actionUrl);
  console.log('[start-app-demo-watch:goToReceivedUrl]', {
    actionUrl,
    dataAction,
    formNode,
    serverUrl,
    receivedUrl,
  });
  debugger;
  return false;
}

window.sendPostDataRequest = sendPostDataRequest;
window.goToReceivedUrl = goToReceivedUrl;
window.updateFormAction = updateFormAction;

window.addEventListener('load', onLoad);
