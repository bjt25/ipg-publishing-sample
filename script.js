const menuButton = document.querySelector(".menu-button");
const primaryLinks = document.querySelector(".primary-links");
const filterButtons = document.querySelectorAll("[data-filter]");
const bookCards = document.querySelectorAll(".book-card");
const bookDialog = document.querySelector("#book-dialog");
const dialogClose = document.querySelector(".dialog-close");
const dialogTitle = document.querySelector("#dialog-title");
const dialogCoverTitle = document.querySelector("#dialog-cover-title");
const dialogCategory = document.querySelector("#dialog-category");
const dialogCopy = document.querySelector("#dialog-copy");
const dialogCover = document.querySelector("#dialog-cover");

const books = {
  "Job Seeker Jammy": {
    category: "Business and career",
    coverClass: "coral",
    copy:
      "A practical career title for readers looking for confidence, clarity, and momentum in the job-search journey. Use this landing page for excerpts, launch notes, reviews, and sales links.",
  },
  "Lisa of Florence": {
    category: "Fiction",
    coverClass: "teal",
    copy:
      "A fiction title ready for excerpt-led discovery. This page can collect likes, host preview copy, and send interested readers to the best buying destination.",
  },
  Launch: {
    category: "Business and career",
    coverClass: "navy",
    copy:
      "A soon-to-be-published title focused on momentum and new beginnings. This landing page is built for prelaunch reader interest and sales-link routing.",
  },
};

const likeKey = "hipg-book-likes";
const storedLikes = JSON.parse(localStorage.getItem(likeKey) || "{}");

function saveLikes() {
  localStorage.setItem(likeKey, JSON.stringify(storedLikes));
}

function renderLikes() {
  document.querySelectorAll("[data-like-count]").forEach((node) => {
    const title = node.getAttribute("data-like-count");
    node.textContent = storedLikes[title] || 0;
  });
}

function openMenu(isOpen) {
  primaryLinks?.classList.toggle("is-open", isOpen);
  menuButton?.setAttribute("aria-expanded", String(isOpen));
  menuButton?.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

function openBook(title) {
  const book = books[title];

  if (!book || !bookDialog) {
    return;
  }

  dialogTitle.textContent = title;
  dialogCoverTitle.textContent = title;
  dialogCategory.textContent = book.category;
  dialogCopy.textContent = book.copy;
  dialogCover.className = `mini-cover dialog-cover ${book.coverClass}`;

  if (typeof bookDialog.showModal === "function") {
    bookDialog.showModal();
    document.body.classList.add("is-locked");
  }
}

function closeBook() {
  bookDialog?.close();
  document.body.classList.remove("is-locked");
}

menuButton?.addEventListener("click", () => {
  openMenu(!primaryLinks?.classList.contains("is-open"));
});

primaryLinks?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    openMenu(false);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.getAttribute("data-filter");

    filterButtons.forEach((item) => item.classList.remove("is-selected"));
    button.classList.add("is-selected");

    bookCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      card.classList.toggle("is-hidden", filter !== "all" && category !== filter);
    });
  });
});

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const actionButton = target.closest("[data-action]");

  if (!(actionButton instanceof HTMLElement)) {
    return;
  }

  const title = actionButton.getAttribute("data-book");
  const action = actionButton.getAttribute("data-action");

  if (!title || !action) {
    return;
  }

  if (action === "like") {
    storedLikes[title] = (storedLikes[title] || 0) + 1;
    saveLikes();
    renderLikes();
    return;
  }

  openBook(title);
});

dialogClose?.addEventListener("click", closeBook);

bookDialog?.addEventListener("click", (event) => {
  if (event.target === bookDialog) {
    closeBook();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.body.classList.remove("is-locked");
  }
});

renderLikes();
