const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const singleMealEl = document.getElementById('single-meal');

// Search for meal and fetch from meal API
const searchMeal = (e) => {
    e.preventDefault();

    // Clear single meal
    singleMealEl.innerHTML = '';

    const term = search.value;

    if (term.trim()) {
        search.placeholder = 'Search for meals...';
        search.style.border = 'none';

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);

                if (data.meals === null) {
                    resultHeading.innerHTML = `<h2>There are no search results for '${term}':</h2>`;
                } else {
                    resultHeading.innerHTML = `<h2>Found ${data.meals.length} results for '${term}':</h2>`;

                    mealsEl.innerHTML = data.meals
                        .map(
                            (meal) => `
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>`
                        )
                        .join('');
                }
            });
        //Clear search text
        search.value = '';
    } else {
        search.placeholder = 'Please Enter a Search Term!';
        search.style.border = '2px solid red';
    }
};

// Fetch a meal from the API given an ID
const getMealByID = (mealID) => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
};

// Fetch one random meal from API
const getRandomMeal = () => {
    // Clear dom elements
    mealsEl.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
        .then((res) => res.json())
        .then((data) => {
            const meal = data.meals[0];

            addMealToDOM(meal);
        });
};

// Add meal info to DOM for user to see
const addMealToDOM = (meal) => {
    const ingredients = [];

    for (let i = 1; i <= 20; ++i) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(
                `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
            );
        } else {
            break;
        }
    }

    singleMealEl.innerHTML = `
    <div class="single-meal">
        <h1>${meal.strMeal}</h1>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <div class="single-meal-info">
            ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
            ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
        </div>
        <div class="main" >
            <p>${meal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
    </div>
    `;
};

// Event Listeners
submit.addEventListener('submit', searchMeal);

mealsEl.addEventListener('click', (e) => {
    const mealInfo = e.composedPath().find((item) => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });

    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealByID(mealID);
    }
});

random.addEventListener('click', getRandomMeal);
