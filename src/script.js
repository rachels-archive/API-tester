let tabsContainer = document.querySelector("#tabs");

let tabTogglers = tabsContainer.querySelectorAll("#tabs a");

console.log(tabTogglers);

tabTogglers.forEach(function (toggler) {
  toggler.addEventListener("click", function (e) {
    e.preventDefault();

    let tabName = this.getAttribute("href");

    let tabContents = document.querySelector("#tab-contents");

    for (let i = 0; i < tabContents.children.length; i++) {
      tabTogglers[i].parentElement.classList.remove("border-t", "border-r", "border-l", "-mb-px", "bg-white");
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
