const form = document.getElementById("form");
const urlInput = document.getElementById("url");

window.addEventListener("load", () => {
  // have the links persist on page reload
  const urlData = JSON.parse(localStorage.getItem("urlData"));

  if (!urlData) {
    return;
  } else {
    for (const { originalUrl, shortUrl } of urlData) {
      addUrlToPage(originalUrl, shortUrl);
    }
  }
});

form.addEventListener("submit", (e) => {
  // prevent the form from being submitted
  e.preventDefault();

  // if valid returns true send the url to shrtcode api
  let { valid, url } = checkUrl();
  if (valid) {
    shortlyApiCall(url);
  }
});

const isRequired = (value) => {
  return value === "" ? false : true;
};

const isUrlValid = (url) => {
  const urlRegex =
    /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;
  const re = new RegExp(urlRegex);
  return re.test(url);
};

const showError = (input, message) => {
  // get the form-field element
  let formField = input.parentElement;
  console.log(formField.querySelector("span"));

  // add the error class
  formField.classList.add("error");

  // show error message
  const error = formField.querySelector("span");
  error.textContent = message;
};

// remove the form container error styles
const removeError = (e) => {
  let formField = e.target.parentElement;
  let error = formField.querySelector("span");
  if (formField.classList.contains("error")) {
    formField.classList.remove("error");
    error.textContent = "";
  }
};

// Remove the error styles on urlInput focus
urlInput.addEventListener("focus", removeError);

const checkUrl = () => {
  let valid = false;
  let url = document.getElementById("url");

  if (!isRequired(url.value)) {
    showError(url, "Input box cannot be empty");
    return valid;
  } else if (!isUrlValid(url.value)) {
    showError(url, "Please provide a valid url");
    return valid;
  } else {
    valid = true;
  }

  return {
    valid,
    url: url.value,
  };
};

async function shortlyApiCall(url) {
  const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);

  const data = await response.json();

  const {
    result: { full_short_link2: shortUrl },
  } = data;

  console.log(data);

  addUrlToLocalStorage(url, shortUrl);
  addUrlToPage(url, shortUrl);
}

const addUrlToLocalStorage = (originalUrl, shortUrl) => {
  // if urlData is null create a new array
  const urlData = JSON.parse(localStorage.getItem("urlData")) || [];

  // create the url object
  const newUrl = {
    originalUrl: originalUrl,
    shortUrl: shortUrl,
  };

  // add the new url object to the urlData array
  urlData.push(newUrl);

  // convert the array to a string and store it in local storage
  localStorage.setItem("urlData", JSON.stringify(urlData));
};

const deleteUrlInLocalStorage = (parentElement) => {
  const urlData = JSON.parse(localStorage.getItem("urlData"));
  const shortUrl = parentElement.querySelector("#short-url").innerText;

  // remove the array index that contains the matching short url and update the array
  urlData.filter((url, idx, arr) => {
    if (url["shortUrl"] === shortUrl) {
      arr.splice(idx, 1);
    }
  });

  /* if the urlData array is empty clear the user's local storage else
     add the updated urlData array to local storage    
     Probably wouldn't want to clear all of a user's local storage data in a production environment 
  */
  return urlData.length > 0
    ? localStorage.setItem("urlData", JSON.stringify(urlData))
    : localStorage.clear();
};

const addUrlToPage = (url, shortUrl) => {
  const advancedStatisticsWrapper = document.querySelector(
    ".advanced-statistics .wrapper"
  );
  const shortenendLinkContainer = document.createElement("div");
  shortenendLinkContainer.classList.add("shortened-link-container");

  shortenendLinkContainer.innerHTML = `
  <div class="original-url-container">
    <a class="original-url" href="${url}" target="_blank">${url}</a>
  </div>
  <div class="short-url-container">
    <a id="short-url" class="short-url" href="${shortUrl}"  target="_blank"
      >${shortUrl}</a
    >
    <button id="btn-copy" class="btn btn-submit btn-copy">
      Copy
    </button>
    <button id="btn-delete" class="btn btn-delete">Delete</button>
</div>
  `;

  // Add the container after the advancedStatisticsWrapper element
  advancedStatisticsWrapper.insertAdjacentElement(
    "afterbegin",
    shortenendLinkContainer
  );

  // After the container is in the DOM get a reference to the copy and delete buttons
  const btnCopy = document.getElementById("btn-copy");
  const btnDelete = document.getElementById("btn-delete");
  btnCopy.addEventListener("click", copyUrlToClipboard);
  btnDelete.addEventListener("click", deleteUrl);
};

const deleteUrl = (e) => {
  // shortened-link-container
  const parent = e.target.parentElement.parentElement;

  // delete url from local storage
  deleteUrlInLocalStorage(parent);

  // remove the current parent div *shortenedLinkContainer*
  parent.remove();
};

const copyUrlToClipboard = (e) => {
  // short-url div
  const parent = e.target.parentElement;

  // get the text field
  const copyUrl = parent.querySelector("#short-url").innerText;

  // copy the text
  navigator.clipboard.writeText(copyUrl);

  // change copy button style
  e.target.textContent = "Copied!";
  e.target.style.backgroundColor = "#3b3054";
};
