let Pokedex = [];
let currentGen = 1;
let statsChart = null;

let generations = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 898 },
    9: { start: 899, end: 1010 }
};

const typeColors = {
    feuer: '#e63b19',
    wasser: '#278acc',
    pflanze: '#58a851',
    elektro: '#e6c700',
    eis: '#68baac',
    kampf: '#a84b3d',
    gift: '#8649b8',
    boden: '#946632',
    flug: '#87b5e6',
    psycho: '#e65a73',
    käfer: '#82ad24',
    gestein: '#a8995b',
    geist: '#633c63',
    drache: '#4d64ab',
    unlicht: '#453d3d',
    stahl: '#9999a8',
    fee: '#d47fce',
    normal: '#a8a899'
};

let typeTranslations = {
    normal: "Normal",
    fire: "Feuer",
    water: "Wasser",
    grass: "Pflanze",
    electric: "Elektro",
    ice: "Eis",
    fighting: "Kampf",
    poison: "Gift",
    ground: "Boden",
    flying: "Flug",
    psychic: "Psycho",
    bug: "Käfer",
    rock: "Gestein",
    ghost: "Geist",
    dragon: "Drache",
    dark: "Unlicht",
    steel: "Stahl",
    fairy: "Fee"
};

function init() {
  fetchPokemonApi(currentGen);
  searchPokemon()
}

async function fetchPokemonGeneration(gen) {
    let { start, end } = generations[gen];
    let promises = [];

    for (let i = start; i <= end; i++) {
        promises.push(fetchSinglePokemon(i));
    }

    return Promise.all(promises);
}

function showLoading() {
    document.getElementById("loadingOverlay").style.display = "flex";
    document.getElementById("loadMoreBtn").disabled = true;
}

function hideLoading() {
    document.getElementById("loadingOverlay").style.display = "none";
    document.getElementById("loadMoreBtn").disabled = false;
}

async function fetchPokemonApi(gen) {
    showLoading();
    let results = await fetchPokemonGeneration(gen);

    for (let index = 0; index < results.length; index++) {
        let pokemonData = results[index];
        let pokeId = addPokemonToPokedex(pokemonData);
        renderPokemon(pokemonData.pokemon, pokemonData.germanName, pokemonData.germanTypes, pokemonData.i, pokeId);
        applyPokemonBgColor(pokemonData.i, pokemonData.germanTypes);
    }
    hideLoading()
}

function addPokemonToPokedex(pokemonData) {
    let { pokemon, germanName, germanTypes } = pokemonData;
    Pokedex.push({ pokemon, germanName, germanTypes });
    return Pokedex.length - 1;
}

function renderPokemon(pokemon, germanName, germanTypes, i, pokeId) {
    document.getElementById("content").innerHTML +=
        pokemonTemplateGerman(pokemon, germanName, germanTypes, i, pokeId);
}

function applyPokemonBgColor(i, germanTypes) {
    pokemonBgTypeColor(i, germanTypes);
}

function searchPokemon() {
    let input = document.getElementById("searchInput");
    input.addEventListener("keyup", () => handleSearch(input.value));
}

function handleSearch(query) {
    let filtered = filterPokemon(query);
    renderSearchResults(filtered);
}

function filterPokemon(query) {
    return Pokedex.filter(p => p.germanName.toLowerCase().includes(query.toLowerCase()));
}

function renderSearchResults(results) {
    let myDiv = document.getElementById("content");
    myDiv.innerHTML = results.map((p, id) => pokemonTemplateGerman(p.pokemon, p.germanName, p.germanTypes, id, id)).join("");
    for (let i = 0; i < results.length; i++) {
        pokemonBgTypeColor(i, results[i].germanTypes);
    }
}

async function fetchSinglePokemon(i) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    let pokemon = await response.json();
    let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
    let species = await speciesResponse.json();
    let germanNameObj = species.names.find(nameIndex => nameIndex.language.name === "de");
    let germanName = germanNameObj ? germanNameObj.name : pokemon.name;
    let germanTypes = pokemon.types
        .map(typeIndex => typeTranslations[typeIndex.type.name] || typeIndex.type.name)
        .join(", ");
    return { pokemon, germanName, germanTypes, i };
}

function pokemonBgTypeColor(i, germanTypes) {
    let typesArray = parseTypes(germanTypes);
    let [color1, color2] = getGradientColors(typesArray);
    setPokemonBackground(i, color1, color2);
}

function parseTypes(germanTypes) {
    return germanTypes
        .split(",")
        .map(type => type.trim().toLowerCase());
}

function getTypeColor(type) {
    return typeColors[type] || "#fafafaff";
}

function getGradientColors(typesArray) {
    let color1 = getTypeColor(typesArray[0]);
    let color2 = typesArray.length > 1 ? getTypeColor(typesArray[1]) : color1;
    return [color1, color2];
}

function setPokemonBackground(i, color1, color2) {
    document.getElementById(`pkm_bg${i}`).style.background =
        `linear-gradient(180deg, ${color1}, ${color2})`;
}


function loadNextGen() {
    currentGen++;
    if (generations[currentGen]) {
        fetchPokemonApi(currentGen);
        renderPokemonList();
    } else {
        alert("Keine weiteren Generationen verfügbar!");
    }
}

function setPokemonDetails(pkm) {
    document.getElementById("pokemonName").textContent = pkm.germanName;
    document.getElementById("pokemonSprite").src = pkm.pokemon.sprites.front_default;
}

function getPokemonStatsData(pkm) {
    return {
        labels: pkm.pokemon.stats.map(s => s.stat.name.toUpperCase()),
        data: pkm.pokemon.stats.map(s => s.base_stat)
    };
}

function renderPokemonStatsChart(labels, data) {
    const canvas = document.getElementById("pokemonStats");
    const ctx = canvas.getContext("2d");

    if (statsChart) statsChart.destroy();

    statsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Basis-Stats",
                data: data,
                backgroundColor: "rgba(54,162,235,0.5)",
                borderColor: "rgba(54,162,235,1)",
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { beginAtZero: true },
                y: { ticks: { autoSkip: false } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

function renderPokemonList() {
    let listContainer = document.getElementById("pokemonList");
    listContainer.innerHTML = Pokedex
        .map((p, id) => `<div class="pokeListName" onclick="openDialog(${id})">${p.germanName}</div>`)
        .join("");
}
function openDialog(pokemonIndex) {
    let pkm = Pokedex[pokemonIndex];
    if (!pkm) return;

    setPokemonDetails(pkm);

    let { labels, data } = getPokemonStatsData(pkm);
    renderPokemonStatsChart(labels, data);
    renderPokemonList();
    showPokemonDialog();
}
window.openDialog = openDialog;

function showPokemonDialog() {
    let dlg = document.getElementById("pokemonDialog");
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute("open", "");
}

function closeDialog() {
    document.getElementById("pokemonDialog").close();
}