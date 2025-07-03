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
