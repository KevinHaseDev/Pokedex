function pokemonTemplateGerman(pokemon, germanName, germanTypes, i) {
    return `
        <div id="pkm_bg${[i]}" class="pokemon" onclick="">
          <img src="${pokemon.sprites.front_default}" alt="${germanName}">
          <h3>${germanName}</h3>
          <p>Typ: ${germanTypes}</p>
        </div>
      `;
}