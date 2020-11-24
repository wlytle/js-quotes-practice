(function () {
  // Submitting the form creates a new quote and adds it to the list of quotes without having to refresh the page. Pessimistic rendering is reccommended.
  const quoteList = document.getElementById("quote-list");
  const quoteForm = document.getElementById("new-quote-form");
  const sortBtn = document.getElementById("btn-sort");

  quoteForm.addEventListener("submit", submitNewQuote);
  sortBtn.addEventListener("click", sortQuotes);

  function getQuotes(url = "http://localhost:3000/quotes?_embed=likes") {
    quoteList.innerHTML = "";
    fetch(url)
      .then((res) => res.json())
      .then((data) => buildAllQuotes(data));
  }

  function buildAllQuotes(data) {
    for (quote of data) {
      buildSingleQuote(quote);
    }
  }

  function buildSingleQuote(data) {
    // build all elements with createElement
    // OR build it like Lantz with a big string

    const li = document.createElement("li");
    li.className = "quote-card";
    li.id = data.id;

    li.innerHTML = `<blockquote class="blockquote">
                <p class="mb-0" contentEditable="true">${data.quote}</p>
                <footer class="blockquote-footer">${data.author}</footer>
                <br>
                <button class='btn-update' hidden="true">Update</button>
                <button class='btn-success'>Likes: <span>${data.likes.length}</span></button>
                <button class='btn-danger'>Delete</button>
            </blockquote>
            `;
    quoteList.prepend(li);

    const deleteButton = li.querySelector(".btn-danger");
    deleteButton.addEventListener("click", () => deleteQuote(data.id));

    const likeButton = li.querySelector(".btn-success");
    likeButton.addEventListener("click", () => likeQuote(data.id));

    const quote = li.querySelector(".mb-0");
    const updateButton = li.querySelector(".btn-update");

    updateButton.addEventListener("click", () => editQuote(quote, data));

    quote.addEventListener("input", () => (updateButton.hidden = false));
  }

  function submitNewQuote(ev) {
    ev.preventDefault();
    // need to make a POST
    const quote = document.getElementById("new-quote").value;
    const author = document.getElementById("new-author").value;

    const body = { author, quote };

    // const quote = ev.target.quote.value
    // const author = ev.target.aardvark.value

    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => buildSingleQuote(data));
  }

  function deleteQuote(quoteId) {
    console.log(quoteId);
    fetch("http://localhost:3000/quotes" + "/" + quoteId, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .catch((errors) => alert("error"))
      .then(() => {
        document.getElementById(quoteId).remove();
      });
  }

  function likeQuote(quoteId) {
    console.log("like");
    +quoteId;
    fetch("http://localhost:3000/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ quoteId, createdAt: Date.now() }),
    })
      .then((res) => res.json())
      .then(() => updateLikes(quoteId))
      .catch((errors) => alert("error"));
  }

  function updateLikes(id) {
    li = document.getElementById(id);
    const likes = li.querySelector(".btn-success span");
    likes.textContent = +likes.textContent + 1;
  }

  function editQuote(quote, data) {
    const updateButton = document
      .getElementById(data.id)
      .querySelector(".btn-update");

    if (quote.textContent === data.quote) {
      updateButton.hidden = true;
    } else {
      fetch("http://localhost:3000/quotes" + "/" + data.id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          quote: quote.textContent,
        }),
      })
        .then((updateButton.hidden = true))
        .catch((errors) => alert("error"));
    }
  }

  function sortQuotes({ target }) {
    let url;
    switch (target.textContent) {
      case "Sort By Author":
        url =
          "http://localhost:3000/quotes?_embed=likes&_order=desc&_sort=author";
        target.textContent = "Sort By ID";
        break;
      case "Sort By ID":
        url = "http://localhost:3000/quotes?_embed=likes";
        target.textContent = "Sort By Author";
        break;
      default:
        return;
    }
    getQuotes(url);
  }

  getQuotes();
})();
