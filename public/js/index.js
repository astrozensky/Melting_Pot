function toggleNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  mobileNav.classList.toggle("hidden");
}

function toggleLike() {
  heart.classList.toggle("like");
}

let recipes;
const searchBtn = document.querySelector(".search__btn");
const paginationDiv = document.querySelector(".pagination");

document.addEventListener("DOMContentLoaded", function () {
  searchBtn.addEventListener("click", function () {
    let offset = 0;
    let resultsPerPage = 12;
    let cuisineCategory = document.querySelector(".search__category").value;
    let searchString = document.querySelector(".search__main").value;

    let url = `https://api.spoonacular.com/recipes/complexSearch?apiKey=69eba1cad9c44ee4ac0e44e3ea0a25ef&query=${searchString}&offset=${offset}&number=${resultsPerPage}&cuisine=${cuisineCategory}`;
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        populateSearchResults(data);
        displayPaginationControls();
      });
  });

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
  let json;
  fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data;
    });
};

const displayPaginationControls = function () {
  paginationDiv.classList.remove("hidden");
};

const populateSearchResults = function (searchResults) {
  const featured = document.querySelector(".featured");
  const featuredHeading = document.querySelector(".featured__heading");
  const recipeCards = document.querySelectorAll(".recipe__card");
  const accentLine = document.createElement("span");
  accentLine.classList.add("accent-line");

  featuredHeading.textContent = "Results";
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

      // let recipeSource = document.createElement("a");
      // recipeSource.href = recipeData.sourceUrl;
      // recipeSource.classList.add("recipe__source");
      // recipeSource.textContent = recipeData.sourceName;
      // recipeDetails.appendChild(recipeSource);

      const recipeLike = document.createElement("div");
      recipeLike.classList.add("recipe__like");

      const likeBtn = document.createElement("button");
      likeBtn.classList.add("recipe__like-btn");

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
