
let Pokedex = [];
let currentGen = 1;

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

async function fetchPokemonApi(gen) {
    let { start, end } = generations[gen];

    for (let i = start; i <= end; i++) {
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);// Basisdaten (Sprite, Typen etc.)
        let pokemon = await response.json();
        let speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${i}`);// Species-Daten (für deutsche Namen)
        let species = await speciesResponse.json();
        let germanNameObj = species.names.find(nameIndex => nameIndex.language.name === "de"); // Deutschen Namen heraussuchen
        let germanName;
        if (germanNameObj) {
            germanName = germanNameObj.name;
        } else {
            germanName = pokemon.name;
        }
        let germanTypes = pokemon.types.map(typeIndex => typeTranslations[typeIndex.type.name] || typeIndex.type.name).join(",");
        Pokedex.push({pokemon, germanName, germanTypes});
        document.getElementById("content").innerHTML += pokemonTemplateGerman(pokemon, germanName, germanTypes);
    }
}

function loadNextGen() {
    currentGen++;
    if (generations[currentGen]) {
        fetchPokemonApi(currentGen);
    } else {
        alert("Keine weiteren Generationen verfügbar!");
    }
}

// Start mit Gen 1
fetchPokemonApi(currentGen);

