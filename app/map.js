const Data = {
    geojson: async() => d3.json("https://raw.githubusercontent.com/yurukov/Bulgaria-geocoding/master/municipalities.geojson"),
    municip: async() => d3.csv("https://raw.githubusercontent.com/yurukov/Bulgaria-geocoding/master/municipalities.csv")
};