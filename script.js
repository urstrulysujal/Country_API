const countriesContainer = document.querySelector(".countries-container"); 
const filterByRegion = document.querySelector(".filter-by-region");
const searchInput = document.querySelector('input[type="text"][placeholder="Search for a country..."]');
const themeChanger = document.querySelector(".theme-changer");
let allCountriesData = [];

function createCountryCard(country) {
  const countryCard = document.createElement("a");
  countryCard.classList.add("country-card");
  countryCard.href = `/country.html?name=${country.name.common}`;
  countryCard.innerHTML =  `
    <img src="${country.flags.svg}" alt="${country.name.common}">
    <div class="card-text">
      <h3 class="card-title">${country.name.common}</h3>
      <p><b>Population: </b>${country.population.toLocaleString('en-IN')}</p>
      <p><b>Region: </b>${country.region}</p>
      <p><b>Capital: </b>${country.capital?.[0] || 'N/A'}</p>
    </div>
  `;
  return countryCard;
}

function displayCountries(data) {
  countriesContainer.innerHTML = "";
  data.forEach((country) => {
    const countryCard = createCountryCard(country);
    countriesContainer.append(countryCard);
  });
}

function filterCountriesByName(name) {
  const filtered = allCountriesData.filter(country =>
    country.name.common.toLowerCase().includes(name.toLowerCase())
  );
  if (filtered.length === 0) {
    countriesContainer.innerHTML = "<p class='no-results'>No results found</p>";
  } else {
    displayCountries(filtered);
  }
}

fetch("https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region")
  .then((res) => res.json())
  .then((data) => {
    allCountriesData = data;
    displayCountries(data);
  })
  .catch((error) => {
    console.error("Error fetching countries data:", error);
  });

filterByRegion.addEventListener('change', (e) => {
  const region = filterByRegion.value;
  if (!region) {
    displayCountries(allCountriesData);
  } else {
    fetch(`https://restcountries.com/v3.1/region/${region}`)
      .then((res) => res.json())
      .then((data) => {
        allCountriesData = data;
        displayCountries(data);
      })
      .catch((error) => {
        console.error("Error fetching countries data:", error);
      });
  }
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    filterCountriesByName(searchTerm);
  });
}

function updateThemeChanger() {
  if (document.body.classList.contains("dark")) {
    themeChanger.innerHTML = '<i class="fa-regular fa-sun"></i>&nbsp;&nbsp;Light Mode';
  } else {
    themeChanger.innerHTML = '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
  }
}

themeChanger.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
  updateThemeChanger();
});

// Listen for localStorage changes to sync theme across tabs
window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    if (event.newValue === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    updateThemeChanger();
  }
});

// Initialize themeChanger on page load

function applySavedTheme() {
  let savedTheme = localStorage.getItem("theme");
  if (!savedTheme) {
    // Default to dark mode if no preference saved
    savedTheme = "dark";
    localStorage.setItem("theme", savedTheme);
  }
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  updateThemeChanger();
}

applySavedTheme();
