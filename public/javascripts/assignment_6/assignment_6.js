

var basic_choropleth = new Datamap({
  element: document.getElementById("map"),
  projection: 'mercator',
  fills: {
    defaultFill: "#ABDDA4",
    customFill: "#b000b5"
  },
  data: {
    ISL: { fillKey: "customFill" }
  }
});
    

