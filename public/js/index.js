"use strict";

function toggleNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  mobileNav.classList.toggle("hidden");
}

function toggleStep() {
  const icon = event.srcElement;
  icon.classList.toggle("icon-orange");
}

function openShare() {
  const shareDiv = document.querySelector(".social-share");
  shareDiv.classList.toggle("hidden");
}

function socialLike() {
  const likeBtn = document.getElementById("like-btn");
  const icon = likeBtn.children[0];
  icon.classList.toggle("fill-orange");
  likeBtn.classList.toggle("color-orange");
}

function clearSession() {
  sessionStorage.clear();
}

function init() {
  const featuredCuisine = [
    "African",
    "Cajun",
    "Chinese",
    "European",
    "Indian",
    "Japanese",
    "Korean",
    "Mediterranean",
    "Middle Eastern",
    "Southern",
    "Spanish",
    "Thai",
  ];
  const randomNum = Math.trunc(Math.random() * 12) + 1;
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=69eba1cad9c44ee4ac0e44e3ea0a25ef&offset=0&number=6&cuisine=${featuredCuisine[randomNum]}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      featuredRecipes = data;
      populateSearchResults(data, "Featured");
    });
}

function saveRecipe(el) {
  const data = { id: el.dataset.id };
  console.log(data);

  fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      window.location.replace("/login");
      alert("You need to be logged in to do that");
    });
}

let recipes;
let featuredRecipes;
let offset = 0;
let resultsPerPage = 12;
let counter = 0;
const searchBtn = document.querySelector(".search__btn");
const paginationDiv = document.querySelector(".pagination");
let cuisineCategory = "";
let searchString = "";

document.addEventListener("DOMContentLoaded", function () {
  if (sessionStorage.getItem("resultsJSON") === true) {
    recipes = JSON.parse(sessionStorage.getItem("resultsJSON"));
    displayPaginationControls();
    populateSearchResults(recipes, "Results");
    if (counter === 0) {
      addPaginationListeners();
      counter++;
    }
  } else {
    init();
  }

  // Search button listener
  searchBtn.addEventListener("click", function () {
    cuisineCategory = document.querySelector(".search__category").value;
    searchString = document.querySelector(".search__main").value;

    callRecipeApi(0, resultsPerPage, searchString, cuisineCategory);
  });

  // Like button listeners
  const heartBtns = document.querySelectorAll(".recipe__like-btn");

  for (let i = 0; i < heartBtns.length; i++) {
    heartBtns[i].addEventListener("click", function () {
      this.querySelector("svg").classList.toggle("like");
    });
  }
});

const callRecipeApi = function (
  offset,
  resultsPerPage,
  query,
  cuisineCategory
) {
  let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=69eba1cad9c44ee4ac0e44e3ea0a25ef&query=${query}&offset=${offset}&number=${resultsPerPage}&cuisine=${cuisineCategory}`;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      recipes = data;
      populateSearchResults(data, "Results");
      if (counter === 0) {
        displayPaginationControls();
        addPaginationListeners();
        counter++;
      }
    });
};

const displayPaginationControls = function () {
  paginationDiv.classList.remove("hidden");
};

const addPaginationListeners = function () {
  // Pagination Buttons
  const startBtn = document.getElementById("btn-start");
  const prevBtn = document.getElementById("btn-prev");
  const nextBtn = document.getElementById("btn-next");
  const endBtn = document.getElementById("btn-end");
  // Pagination buttons

  startBtn.addEventListener("click", function () {
    offset = 0;
    callRecipeApi(offset, resultsPerPage, searchString, cuisineCategory);
  });

  prevBtn.addEventListener("click", function () {
    if (offset !== 0) {
      offset -= resultsPerPage;
      callRecipeApi(offset, resultsPerPage, searchString, cuisineCategory);
    }
  });

  nextBtn.addEventListener("click", function () {
    if (offset + resultsPerPage <= recipes.totalResults) {
      offset += resultsPerPage;
      callRecipeApi(offset, resultsPerPage, searchString, cuisineCategory);
    }
  });

  endBtn.addEventListener("click", function () {
    offset = recipes.totalResults - resultsPerPage;
    callRecipeApi(offset, resultsPerPage, searchString, cuisineCategory);
  });
};

const populateSearchResults = function (searchResults, heading) {
  const recipesJSON = JSON.stringify(recipes);
  sessionStorage.setItem("resultsJSON", recipesJSON);

  const featured = document.querySelector(".featured");
  const featuredHeading = document.querySelector(".featured__heading");
  const recipeCards = document.querySelectorAll(".recipe__card");
  const accentLine = document.createElement("span");
  accentLine.classList.add("accent-line");

  featuredHeading.textContent = heading;
  featuredHeading.appendChild(accentLine);

  for (let i = 0; i < recipeCards.length; i++) {
    featured.removeChild(recipeCards[i]);
  }

  featured.scrollIntoView();

  for (let i = 0; i < searchResults.results.length; i++) {
    createRecipeCard();

    function createRecipeCard() {
      const divRecipeCard = document.createElement("div");
      divRecipeCard.classList.add("recipe__card");

      const imgContainer = document.createElement("figure");
      imgContainer.classList.add("recipe__img-container");

      const img = document.createElement("img");
      img.src = searchResults.results[i].image;
      img.alt = `${searchResults.results[i].title} image`;
      img.classList.add("recipe__img");
      imgContainer.appendChild(img);

      divRecipeCard.appendChild(imgContainer);

      const recipeDetails = document.createElement("div");
      recipeDetails.classList.add("recipe__details");

      const recipeName = document.createElement("a");
      recipeName.href = `recipe/${searchResults.results[i].id}`;
      recipeName.classList.add("heading-4", "recipe__name");
      recipeName.textContent = searchResults.results[i].title;
      recipeDetails.appendChild(recipeName);

      const recipeLike = document.createElement("div");
      recipeLike.classList.add("recipe__like");

      const likeBtn = document.createElement("button");
      likeBtn.classList.add("recipe__like-btn");
      likeBtn.dataset.id = searchResults.results[i].id;
      likeBtn.setAttribute("onclick", "saveRecipe(this)");

      const heartIcon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      heartIcon.classList.add("recipe__heart-icon");

      const iconLink = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "use"
      );
      iconLink.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "xlink:href",
        "img/sprite.svg#icon-heart"
      );

      heartIcon.appendChild(iconLink);
      likeBtn.appendChild(heartIcon);
      likeBtn.addEventListener("click", function () {
        this.querySelector("svg").classList.toggle("like");
      });
      recipeLike.appendChild(likeBtn);
      divRecipeCard.appendChild(recipeLike);

      divRecipeCard.appendChild(recipeDetails);

      featured.insertBefore(divRecipeCard, paginationDiv);
    }
  }
};
