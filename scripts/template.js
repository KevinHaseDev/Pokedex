function pokemonTemplateGerman(pokemon, germanName, germanTypes) {
    return `
        <div class="pokemon">
          <img src="${pokemon.sprites.front_default}" alt="${germanName}">
          <h3>${germanName}</h3>
          <p>Typ: ${germanTypes}</p>
        </div>
      `;
}