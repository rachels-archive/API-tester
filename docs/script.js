import axios from "axios";
import prettyBytes from "pretty-bytes";
import setupEditors from "./setupEditor";

const form = document.querySelector("[data-form]");
const responseHeadersContainer = document.querySelector("[data-response-headers]");

// Axios request interceptor to store the start time of the request
axios.interceptors.request.use((request) => {
  request.customData = request.customData || {};
  request.customData.startTime = new Date().getTime();
  return request;
});

// Function to update the response with the time taken for the request
function updateEndTime(response) {
  response.customData = response.customData || {};
  response.customData.time = new Date().getTime() - response.config.customData.startTime;
  return response;
}

// Axios response interceptor to update the response with the time taken
axios.interceptors.response.use(updateEndTime, (e) => {
  return Promise.reject(updateEndTime(e.response));
});

const { requestEditor, updateResponseEditor } = setupEditors();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let data;
  try {
    data = JSON.parse(requestEditor.state.doc.toString() || null);
  } catch (e) {
    alert("JSON data is malformed");
    return;
  }
  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairsToObjects(queryParamsContainer),
    headers: keyValuePairsToObjects(requestHeadersContainer),
    data,
  })
    .catch((e) => e)
    .then((response) => {
      // unhide response after request is made
      document.querySelector("[data-response-section]").classList.remove("hidden");
      updateResponseDetails(response);
      updateResponseEditor(response.data);
      updateRepsonseHeaders(response.headers);
    });
});

function keyValuePairsToObjects(container) {
  const pairs = container.querySelectorAll("[data-key-value-pair]");
  // destructure key value pairs and map into objects
  return [...pairs].reduce((data, pair) => {
    const key = pair.querySelector("[data-key]").value;
    const value = pair.querySelector("[data-value]").value;

    if (key === "") return data;
    return { ...data, [key]: value };
  }, {});
}

function updateResponseDetails(response) {
  document.querySelector("[data-status").textContent = response.status;
  document.querySelector("[data-time").textContent = response.customData.time;
  document.querySelector("[data-size]").textContent = prettyBytes(
    JSON.stringify(response.data).length + JSON.stringify(response.headers).length
  );
}

function updateRepsonseHeaders(headers) {
  responseHeadersContainer.innerHTML = "";

  // iterate response headers and display them in headers tab
  Object.entries(headers).forEach(([key, value]) => {
    const pair = document.createElement("div");
    pair.classList.add("header-pair");

    const keyElem = document.createElement("span");
    keyElem.textContent = key + ": ";
    // keyElem.classList.add("header-key");
    pair.appendChild(keyElem);
    // responseHeadersContainer.append(keyElem);

    const valElem = document.createElement("span");
    valElem.textContent = value + ": ";
    // valElem.classList.add("header-value");

    //pair.appendChild(keyElem)
    pair.appendChild(valElem);

    responseHeadersContainer.appendChild(pair);
  });
}

let requestTabsContainer = document.querySelector("[data-form]");
let requestTabTogglers = requestTabsContainer.querySelectorAll("#tabs a");

let responseTabsContainer = document.querySelector("[data-response-section]");
let responseTabTogglers = responseTabsContainer.querySelectorAll("#tabs a");

requestTabTogglers.forEach(function (toggler) {
  toggler.addEventListener("click", function (e) {
    e.preventDefault();

    let tabName = this.getAttribute("href");

    let tabContents = document.querySelector("#tab-contents-request");

    for (let i = 0; i < tabContents.children.length; i++) {
      requestTabTogglers[i].parentElement.classList.remove("border-t", "border-r", "border-l", "-mb-px", "bg-white");
      tabContents.children[i].classList.remove("hidden");
      if ("#" + tabContents.children[i].id === tabName) {
        continue;
      }
      tabContents.children[i].classList.add("hidden");
    }
    e.target.parentElement.classList.add("border-t", "border-r", "border-l", "-mb-px", "bg-white");
  });
});

responseTabTogglers.forEach(function (toggler) {
  toggler.addEventListener("click", function (e) {
    e.preventDefault();

    let tabName = this.getAttribute("href");

    let tabContents = document.querySelector("#tab-contents-response");

    for (let i = 0; i < tabContents.children.length; i++) {
      responseTabTogglers[i].parentElement.classList.remove("border-t", "border-r", "border-l", "-mb-px", "bg-white");
      tabContents.children[i].classList.remove("hidden");
      if ("#" + tabContents.children[i].id === tabName) {
        continue;
      }
      tabContents.children[i].classList.add("hidden");
    }
    e.target.parentElement.classList.add("border-t", "border-r", "border-l", "-mb-px", "bg-white");
  });
});

const queryParamsContainer = document.querySelector("[data-query-params]");
const requestHeadersContainer = document.querySelector("[data-request-headers]");
const keyValueTemplate = document.querySelector("[data-key-value-template]");
const addQueryParamsBtn = document.querySelector("[data-add-query-param-btn]");
const addRequestHeadersBtn = document.querySelector("[data-add-request-headers-btn]");

// initialise first key-value pair field
queryParamsContainer.append(createKeyValuePair());
requestHeadersContainer.append(createKeyValuePair());

addQueryParamsBtn.addEventListener("click", () => {
  queryParamsContainer.append(createKeyValuePair());
});

addRequestHeadersBtn.addEventListener("click", () => {
  requestHeadersContainer.append(createKeyValuePair());
});

function createKeyValuePair() {
  const elem = keyValueTemplate.content.cloneNode(true);

  elem.querySelector("[data-remove-btn").addEventListener("click", (event) => {
    event.target.closest("[data-key-value-pair]").remove();
  });

  return elem;
}
