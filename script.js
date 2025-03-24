const getFactBtn = document.querySelector("#getFactBtn");
const favoriteBtn = document.querySelector("#favoriteBtn");
const factElement = document.querySelector("#fact");
const sourceElement = document.querySelector("#source");
const favoritesList = document.querySelector("#favoritesList");

let currentFact = null;

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favoritesList.innerHTML = "";
    favorites.forEach(favorite => {
        const li = document.createElement("li");
        li.textContent = `${favorite.fact} (Источник: ${favorite.source || "Неизвестен"})`;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.onclick = () => removeFavorite(favorite);
        
        li.appendChild(deleteBtn);
        favoritesList.appendChild(li);
    });
}

function addToFavorites() {
    if (!currentFact) return;
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Проверяем, есть ли уже такой факт в избранном
    if (!favorites.some(item => item.fact === currentFact.fact && item.source === currentFact.source)) {
        favorites.push(currentFact);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    }
}

function removeFavorite(favorite) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const updatedFavorites = favorites.filter(item => item.fact !== favorite.fact || item.source !== favorite.source);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    loadFavorites();
}

function getRandomFact() {
    const url = "https://api.spacefacts.dev/random";
    fetch(url)
        .then(response => response.json())
        .then(data => {
            currentFact = { fact: data.fact, source: data.source || "Источник неизвестен" };
            factElement.textContent = data.fact;
            sourceElement.textContent = `Источник: ${data.source || "Неизвестен"}`;
        })
        .catch(() => {
            currentFact = null; // Сброс текущего факта
            factElement.textContent = "Не удалось загрузить факт";
            sourceElement.textContent = "";
        });
}

getFactBtn.addEventListener("click", getRandomFact);
favoriteBtn.addEventListener("click", addToFavorites);

loadFavorites();
