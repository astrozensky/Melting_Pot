function toggleNav() {
  const mobileNav = document.querySelector(".mobile-nav");
  mobileNav.classList.toggle("hidden");
}

function toggleLike() {
  const heart = document.querySelector(".recipe__heart-icon");
  heart.classList.toggle("like");
}

let recipes;
const searchBtn = document.querySelector(".search__btn");

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
  const paginationDiv = document.querySelector(".pagination");
  debugger;
  paginationDiv.classList.remove("hidden");
};

const populateSearchResults = function (searchResults) {
  let featured = document.querySelector(".featured");
  featured.innerHTML = "";
  let h2 = document.createElement("h2");
  h2.classList.add("featured__heading", "heading-2");
  h2.textContent = "Results";
  featured.appendChild(h2);
  featured.scrollIntoView();

  for (let i = 0; i < searchResults.results.length; i++) {
    // let recipeData;

    // fetch(
    //   `https://api.spoonacular.com/recipes/${searchResults.results[i].id}/information?apiKey=69eba1cad9c44ee4ac0e44e3ea0a25ef&includeNutrition=false`
    // )
    //   .then((response) => response.json())
    //   .then((data) => {
    //     recipeData = data;
    //     createRecipeCard();
    //   });

    createRecipeCard();

    function createRecipeCard() {
      let divRecipeCard = document.createElement("div");
      divRecipeCard.classList.add("recipe__card");

      let imgContainer = document.createElement("figure");
      imgContainer.classList.add("recipe__img-container");

      let img = document.createElement("img");
      img.src = searchResults.results[i].image;
      img.alt = `${searchResults.results[i].title} image`;
      img.classList.add("recipe__img");
      imgContainer.appendChild(img);

      divRecipeCard.appendChild(imgContainer);

      let recipeDetails = document.createElement("div");
      recipeDetails.classList.add("recipe__details");

      let recipeName = document.createElement("a");
      recipeName.href = `recipe/${searchResults.results[i].id}`;
      recipeName.classList.add("heading-4", "recipe__name");
      recipeName.textContent = searchResults.results[i].title;
      recipeDetails.appendChild(recipeName);

      // let recipeSource = document.createElement("a");
      // recipeSource.href = recipeData.sourceUrl;
      // recipeSource.classList.add("recipe__source");
      // recipeSource.textContent = recipeData.sourceName;
      // recipeDetails.appendChild(recipeSource);

      divRecipeCard.appendChild(recipeDetails);

      let featured = document.querySelector(".featured");
      featured.appendChild(divRecipeCard);
    }
  }
};
