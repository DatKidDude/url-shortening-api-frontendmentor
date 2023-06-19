const menuToggle = document.getElementById("menu-toggle");
const navBar = document.getElementById("navbar");
const modal = document.getElementById("modal");
const primaryHeader = document.getElementById("primary-header");
const scrollWatcher = document.createElement("div");

scrollWatcher.setAttribute("data-scroll-watcher", "");
primaryHeader.before(scrollWatcher);

const navObserver = new IntersectionObserver(
  (entries) => {
    primaryHeader.classList.toggle("sticking", !entries[0].isIntersecting);
  },
  { rootMargin: "50px 0px 0px 0px" }
);

navObserver.observe(scrollWatcher);

menuToggle.addEventListener("click", toggleMenu);

modal.addEventListener("click", toggleMenu);

// Close modal with Escape key if modal is open
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.getAttribute("aria-expanded") === "true") {
    toggleMenu();
  }
});

/* Toggle the navigation and modal and set their aria-expanded attributes accordingly */
function toggleMenu(e) {
  let isExpanded = menuToggle.getAttribute("aria-expanded");

  if (isExpanded === "true") {
    isExpanded = "false";
    navBar.classList.remove("active");
    primaryHeader.style.position = "sticky";

    toggleModal();
  } else {
    isExpanded = "true";
    navBar.classList.add("active");
    primaryHeader.style.position = "relative"; // Added so user can scroll if screen cuts off navbar
    toggleModal();
  }

  menuToggle.setAttribute("aria-expanded", isExpanded);
}

function toggleModal() {
  let isModalExpanded = modal.getAttribute("aria-expanded");

  if (isModalExpanded === "true") {
    isModalExpanded = "false";
    modal.style.display = "none";
  } else {
    isModalExpanded = "true";
    modal.style.display = "block";
  }

  modal.setAttribute("aria-expanded", isModalExpanded);
}
