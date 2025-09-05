
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
        let germanTypes = pokemon.types.map(typeIndex => typeTranslations[typeIndex.type.name] || typeIndex.type.name).join(", ");
        Pokedex.push({ pokemon, germanName, germanTypes });
        document.getElementById("content").innerHTML += pokemonTemplateGerman(pokemon, germanName, germanTypes, i);
        pokemonBgTypeColor(i, germanTypes);
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

function pokemonBgTypeColor(i, germanTypes) {
    let typesArray = germanTypes.split(","); // Zerlege den String mit den Typen an jedem Komma
    for (let pkm_i = 0; pkm_i < typesArray.length; pkm_i++) {
        typesArray[pkm_i] = typesArray[pkm_i].trim().toLowerCase();// Entferne Leerzeichen und wandle in Kleinbuchstaben um
    }
    let color1; // Bestimme die erste Farbe
    if (typeColors[typesArray[0]]) {
        color1 = typeColors[typesArray[0]];
    } else {
        color1 = "#fafafaff"; // Standardfarbe
    }
    let color2;// Bestimme die zweite Farbe
    if (typesArray.length > 1) {
        if (typeColors[typesArray[1]]) {
            color2 = typeColors[typesArray[1]];
        } else {
            color2 = color1;
        }
    } else {
        color2 = color1;

    }
    let gradient = "linear-gradient(180deg, " + color1 + ", " + color2 + ")";

    document.getElementById(`pkm_bg${i}`).style.background = gradient;
}