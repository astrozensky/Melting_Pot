function toggleNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  if (mobileNav.classList.contains("hidden")) {
    mobileNav.classList.remove("hidden");
    mobileNav.classList.add("visible");
  } else {
    mobileNav.classList.remove("visible");
    mobileNav.classList.add("hidden");
  }
}
