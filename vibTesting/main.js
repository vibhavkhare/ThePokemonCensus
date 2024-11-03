// Load the CSV data from the data folder
d3.csv("data/pokemon.csv").then(data => {
    // Sort the data by pokedex_number
    data.sort((a, b) => +a.pokedex_number - +b.pokedex_number);

    // Print each Pokémon name in order of pokedex_number
    data.forEach(pokemon => {
        console.log(pokemon.name);
    });
}).catch(error => {
    console.error("Error loading the CSV file:", error);
});