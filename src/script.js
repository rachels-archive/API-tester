import axios from "axios";

const form = document.querySelector("[data-form]");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  axios({
    url: document.querySelector("[data-url]").value,
    method: document.querySelector("[data-method]").value,
    params: keyValuePairsToObjects(queryParamsContainer),
    headers: keyValuePairsToObjects(requestHeadersContainer),
  }).then((json) => {
    console.log(json);
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
