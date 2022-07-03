"use strict";

let menuButton = document.querySelector(".page-header__nav-toggle");
let menu = document.querySelector(".page-header__wrapper");

function toogleMenu() {
  menu.classList.toggle("page-header__wrapper--open");
  menuButton.classList.toggle("page-header__nav-toggle--close");
  menuButton.textContent = menuButton.textContent === "Menu" ? "Close" : "Menu";
}

function closeMenu() {
  menu.classList.remove("page-header__wrapper--open");
  menuButton.classList.remove("page-header__nav-toggle--close");
  menuButton.textContent = "Menu";
}

menuButton.addEventListener("click", function () {

  toogleMenu();
});

function clickOutside(el) {
  document.addEventListener("click", function (event) {
    event.stopPropagation();
    if (event.target === el || event.target === menuButton) return;

    closeMenu()
  });
}

clickOutside(menu);

const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
  animationTime = 300,
  framesCount = 20;

anchors.forEach(function (item) {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    let coordY =
      document.querySelector(item.getAttribute("href")).getBoundingClientRect()
        .top +
      window.pageYOffset -
      50;

    let scroller = setInterval(function () {
      let scrollBy = coordY / framesCount;

      if (
        scrollBy > window.pageYOffset - coordY &&
        window.innerHeight + window.pageYOffset < document.body.offsetHeight
      ) {
        window.scrollBy(0, scrollBy);
      } else {
        window.scrollTo(0, coordY);
        clearInterval(scroller);
      }
    }, animationTime / framesCount);
  });
});
