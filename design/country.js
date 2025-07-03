// Existing code unchanged above

const countryName = new URLSearchParams(location.search).get("name");
const flagImage = document.querySelector(".country-details img");
const countryNameH2 = document.querySelector(".country-details h2");
const nativeNameSpan = document.querySelector(".native-name");
const populationSpan = document.querySelector(".population");
const regionSpan = document.querySelector(".region");
const subRegionSpan = document.querySelector(".sub-region");
const topLevelDomainSpan = document.querySelector(".top-level-domain");
const currenciesSpan = document.querySelector(".currencies");
const languagesSpan = document.querySelector(".languages");
const bordersContainer = document.querySelector(".borders-container");

fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
  .then((res) => res.json())
  .then((data) => {
    if (Array.isArray(data) && data.length > 0) {
      const country = data[0];
      console.log(country);
      flagImage.src = country.flags.svg;
      countryNameH2.textContent = country.name.common;

      if (country.name.nativeName) {
        nativeNameSpan.textContent = Object.values(country.name.nativeName)[0].common || "";
      } else {
        nativeNameSpan.textContent = country.name.common || "";
      }
      populationSpan.textContent = country.population ? country.population.toLocaleString() : "";
      regionSpan.textContent = country.region || "";
      subRegionSpan.textContent = country.subregion || "";
      topLevelDomainSpan.textContent = country.tld ? country.tld[0] : "";
      currenciesSpan.textContent = country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "";
      languagesSpan.textContent = country.languages ? Object.values(country.languages).join(", ") : "";

      if (country.borders) {
        bordersContainer.innerHTML = ""; // Clear existing content
        country.borders.forEach((border) => {
          fetch(`https://restcountries.com/v3.1/alpha/${border}`)
            .then((res) => res.json())
            .then((borderData) => {
              const borderCountryTag = document.createElement("a");
              borderCountryTag.innerText = borderData[0].name.common;
              borderCountryTag.href = `country.html?name=${borderData[0].name.common}`;
              borderCountryTag.style.marginRight = "10px";
              bordersContainer.append(borderCountryTag);
            })
            .catch((error) => {
              console.error("Error fetching border country data:", error);
            });
        });
      }
    } else {
      console.error("Country data not found or invalid response", data);
    }
  })
  .catch((error) => {
    console.error("Error fetching country data:", error);
  });

// Theme toggling with persistence for country.html

const themeChanger = document.querySelector(".theme-changer");

console.log("themeChanger element:", themeChanger);

function updateThemeChanger() {
  if (document.body.classList.contains("dark")) {
    themeChanger.innerHTML = '<i class="fa-regular fa-sun"></i>&nbsp;&nbsp;Light Mode';
  } else {
    themeChanger.innerHTML = '<i class="fa-regular fa-moon"></i>&nbsp;&nbsp;Dark Mode';
  }
  console.log("updateThemeChanger called. Current mode:", document.body.classList.contains("dark") ? "dark" : "light");
}

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

if (themeChanger) {
  themeChanger.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
    updateThemeChanger();
  });
}

// Apply saved theme on page load
applySavedTheme();
