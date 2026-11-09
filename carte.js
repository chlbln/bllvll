// zoom de départ
const zoom = 15.5;
// coordonnées de départ
const lat = 48.8718168;
const lng = 2.3854118;

const GeoportailFrance_orthos = L.tileLayer('https://data.geopf.fr/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
  attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
  bounds: [[-75, -180], [81, 180]],
  minZoom: 2,
  maxZoom: 19,
  format: 'image/jpeg',
  style: 'normal'
});

const WatercolorMap = L.tileLayer('https://watercolormaps.collection.cooperhewitt.org/tile/watercolor/{z}/{x}/{y}.jpg', {
  maxZoom: 18.9,
  attribution: 'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA'
})

let config = {
  layers: [WatercolorMap],
  zoomSnap: 0.1,
  minZoom: 12,
  zoomControl: false
}

// appel de la map >>
const map = L.map('map', config).setView([lat, lng], zoom);

// afficher l'échelle
L.control.scale({position: "bottomleft", imperial: false}).addTo(map);

// appel des boutons zoom pour le positionner ailleurs
L.control.zoom({position: "bottomleft"}).addTo(map);

// appel des données points en geojson

var icone_dessins = L.icon({
      iconUrl: 'data/marker_Dessins.png',
      iconSize: [56/1.8, 70/1.8],
      iconAnchor: [56/1.8/2, 56/1.8],
      popupAnchor: [0, -(56/1.8/2)],
      
      tooltipAnchor: [5, -(56/1.8/2)]
    });

const dessins = L.geoJSON(dessins_points, {
  pointToLayer: function (feature, latlng) {
    let popupContent = "Dessin de " + feature.properties.prenom + "<figure><img id='zoom-default' src='" + feature.properties.img_link + "' alt='Dessin'></figure>";
    let popup = L.popup().setContent(popupContent);
    let circleMarker = L.marker(latlng, {icon: icone_dessins});
    // let circleMarker = L.circleMarker(latlng, {color: '#79b2e0ff', fillColor: '#058ad8ff', radius: 5, weight: 16, opacity: 0.5, fillOpacity: 0.6});
    
    return circleMarker.bindPopup(popup,
      {
          minWidth: 300,
          className: "popup-dessins",
        }
    )
    .bindTooltip(feature.properties.prenom);
  }
});

dessins.addTo(map);


var pane = map.createPane("fixed", document.getElementById("map")).style.zIndex = 9999; // ça marche à peu près ?

var icone_paysages = L.icon({
      iconUrl: 'data/marker_Paysages.png',
      iconSize: [56/1.8, 70/1.8],
      iconAnchor: [56/1.8/2, 56/1.8],
      tooltipAnchor: [5, -(56/1.8/2)]
    }); 

const paysages = L.geoJSON(paysages_points, {
  pointToLayer: function (feature, latlng) {
    var marker = L.marker(latlng, { icon: icone_paysages });
    marker.bindTooltip(feature.properties.OBJECTID + "<b> Chez " + feature.properties.prenom + "</b>",
      {
        // permanent: true
      });
    marker.bindPopup(feature.properties.popup_contenu,
      {
        maxWidth: "auto",
        // maxHeight: 500,
        className: "popup-fixed",
        pane: "fixed",
        autoPan: false
      }
    );
    marker.on('mouseout', function() {
      if(marker.isPopupOpen()) {
        this.openTooltip();
      }
    });
    marker.on('popupclose', function () {
      this.closeTooltip();
    });
    return marker;
  }
}).addTo(map);

// L.geoJSON(paysages_points, {
//   pointToLayer: function(feature, latlng) {
//     return L.circleMarker(latlng, {
//       color: '#e64303ff', fillColor: '#ffffffff', radius: 5.5, weight: 7, opacity: 0.5, fillOpacity: 1})
//     }
//   }).addTo(map);


// initialisation de Medium Zoom à l'ouverture d'une popup
const zooooom = function() {
    const zoomImage = mediumZoom('#zoom-default', {
    margin: 80,
    background: '#6f6f6f80',
  });
};

dessins.on('popupopen', zooooom);
paysages.on('popupopen', zooooom);

var icone_audios1 = L.icon({
  iconUrl: 'data/marker_Audios1.png',
  iconSize: [29 / 1.6, 52 / 1.6],
  iconAnchor: [29 / 1.6 / 2, 52 / 1.6],
  tooltipAnchor: [5, -(52 / 1.6 / 1.5)],
  popupAnchor: [1, -(52 / 1.6 / 1.5)]
});

var icone_audios2 = L.icon({
  iconUrl: 'data/marker_Audios2.png',
  iconSize: [29 / 1.6, 52 / 1.6],
  iconAnchor: [29 / 1.6 / 2, 52 / 1.6],
  tooltipAnchor: [5, -(52 / 1.6 / 1.5)],
  popupAnchor: [1, -(52 / 1.6 / 1.5)]
});


const audios_1 = L.geoJSON(audios_1_points, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: icone_audios1})
    // return L.circleMarker(latlng, { fillColor: '#aee9b1ff', color: '#686868ff', radius: 6, weight: 1, opacity: 1, fillOpacity: 0.9})
      .bindTooltip(feature.properties.OBJECTID + ", audio " + feature.properties.audio)
      .bindPopup("<b>" + feature.properties.OBJECTID + " : </b>" + feature.properties.description + "<p><audio controls src='" + feature.properties.audio_link + "'</audio>",
        {
        }
      );
  }
}).addTo(map);


const audios_2 = L.geoJSON(audios_2_points, {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: icone_audios2})
    // return L.circleMarker(latlng, { fillColor: '#97f0e4ff', color: '#686868ff', radius: 6, weight: 1, opacity: 1, fillOpacity: 0.9 })
      .bindTooltip(feature.properties.OBJECTID + ", audio " + feature.properties.audio)
      .bindPopup("<b>" + feature.properties.OBJECTID + " : </b>" + feature.properties.description + "<p><audio controls src='" + feature.properties.audio_link + "'</audio>",
        {
        }
      );
  }
}).addTo(map);

let balades_sonores = L.layerGroup([audios_1, audios_2]).addTo(map)



// 1 create an operational layer that is empty for now
let mylayer = L.layerGroup().addTo(map)

// // 2 fill that layer with data from a geojson file
//   jQuery.getJSON("https://france-geojson.gregoiredavid.fr/repo/departements/75-paris/communes-75-paris.geojson", function(json){
//     L.geoJSON(json, {
//       onEachFeature: addMyData,
//     })
//   })

//   // 3 This function is run for every feature found in the geojson file. It adds the feature to the empty layer we created above
//   function addMyData(feature, layer){
//     mylayer.addLayer(layer),
//     layer.bindPopup("hello");
//   }

/* !!!! ça marche tout à fait mais c'est dans le passage !!!! */
/* rajouter un geojson extérieur, avec fetch */
/*   function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.code);
  }
    // adding geojson by fetch 
    // of course you can use jquery, axios etc.
    fetch("https://france-geojson.gregoiredavid.fr/repo/departements/75-paris/communes-75-paris.geojson")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        // use geoJSON 
       L.geoJSON(data, {
          onEachFeature: onEachFeature,
        }).addTo(map);
      }); */

// ajouter une couche (de fond de plan) avec les labels seulement
map.createPane('labels');
map.getPane('labels').style.zIndex = 340 /*540*/; // position z : au-dessus des Tiles du fond 
map.getPane('labels').style.pointerEvents = 'none';
// var coucheLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
//         attribution: '©OpenStreetMap, ©CartoDB',
//         pane: 'labels'
// }).addTo(map);


// .control de description
const presentation = L.control({position: "topleft", maxHeight: 20});

presentation.onAdd = function () {
  let div = L.DomUtil.create("div", "titre");
  L.DomEvent.disableClickPropagation(div);
  const txt_titre =
    "<h1 class=>Belleville par ses habitantes : une cartographie sensible et sonore</h1>";
  const txt_descr =  
    "À Belleville, un quartier populaire du 20e arrondissement de Paris qui s’embourgeoise depuis plusieurs décennies, des femmes se rassemblent tous les lundis après-midi dans un centre social. Récemment arrivées de l’étranger ou installées depuis les années 1980, jeunes mamans ou retraitées, vivant dans des situations de précarité ou dans une plus grande stabilité, elles participent chaque semaine à des ateliers organisés par trois co-facilitatrices qui travaillent au centre social ou sont bénévoles d’une ONG de solidarité internationale. Ces dernières ont à cœur de créer un espace de solidarité entre femmes, dans lequel elles trouvent des ressources pour leur vie. Elles participent ainsi à des ateliers de création de documentaire sonore, de sensibilisation sur des questions de santé, à des manifestations féministes ou encore à des sorties culturelles. <p>De 2018 à 2021, trois géographes (Amandine Chapuis, Anne Clerval et Mari Oiry-Varacca) ont pris part à cette dynamique collective et ont contribué à animer des ateliers autour de l’orientation dans l’espace, à partir de cartes utilisées au centre social, ou de balades dans et en dehors du quartier. En 2020, trois ateliers ont donné lieu à des productions de nature diverses (dessins, photographies, enregistrements sonores...), présentées sur cette carte.<p>Cette carte est le fruit de ce travail commun. Elle donne à voir le regard que posent les femmes sur l’espace qu’elles pratiquent au quotidien et donne à entendre ce qu’elles ont à dire sur leur vie dans ce quartier. Ces regards souvent invisibilisés par les médias, ces voix féminines passées sous silence sont pourtant si précieuses pour comprendre les évolutions des quartiers populaires. Avec cette carte, elles prennent la parole.<br>Leurs productions matérialisent les positions qu’elles occupent dans la ville, liées à la place qu’elles peuvent tenir dans la société en tant que femme et aux multiples variations de leurs trajectoires et de leurs divers positionnements sociaux."
  div.insertAdjacentHTML("beforeend", txt_titre);
  return div;
};

presentation.addTo(map);

// .control de la "légende" -> infos & description
const legende = L.control({
  position: "topright"
});

legende.onAdd = function () {
  let div = L.DomUtil.create("div", "infobox");
  L.DomEvent.disableClickPropagation(div);
  const text =
    "<i><b>Dessiner les lieux du quotidien</b></i> <br> Ces dessins ont été réalisés dans le cadre d’un atelier qui a eu lieu en février 2020. La consigne de départ était que les femmes dessinent les lieux importants pour elles dans le quartier, ceux qu’elles fréquentent beaucoup et/ou qui comptent pour elles. Au-delà de leur satisfaction ou de leur sentiment d’avoir terminé leur dessin ou pas, elles ont travaillé sur leur confiance en leur capacité à produire une expression symbolique par elles-mêmes. Les présentations qu’elles ont faites au groupe de leur dessin a été l’occasion de riches discussions sur les lieux qu’elles apprécient ou non dans leur quartier et les raisons à cela.";
  const iiii = "<div id='info-click' class='point-info'><span class='gg-info'></span><strong>Présentation du projet</strong></div>"
    div.insertAdjacentHTML("beforeend", iiii);
  return div;
};

legende.addTo(map);

// contrôler l'affichage des couches (fonds & données)
let fond_plan = L.layerGroup([WatercolorMap/* , coucheLabels */]).addTo(map);

var baseLayers = {
  "Fond de plan aquarelle": fond_plan,
  "Fond de plan photos aériennes": GeoportailFrance_orthos,
};

var overlayMaps = {
  "<i class='activer'> activer/désactiver la couche :</i><details name='legende'><summary><img src='data/marker_Dessins.png' height='50px' style='margin:-5px 1px'/>Dessiner les lieux du quotidien</summary><p>Ces dessins ont été réalisés dans le cadre d’un atelier qui a eu lieu en février 2020. La consigne de départ était que les femmes dessinent les lieux importants pour elles dans le quartier, ceux qu’elles fréquentent beaucoup et/ou qui comptent pour elles. Au-delà de leur satisfaction ou de leur sentiment d’avoir terminé leur dessin ou pas, elles ont travaillé sur leur confiance en leur capacité à produire une expression symbolique par elles-mêmes. Les présentations qu’elles ont faites au groupe de leur dessin a été l’occasion de riches discussions sur les lieux qu’elles apprécient ou non dans leur quartier et les raisons à cela.</p><img src='data/desc2.jpg' alt='Photo de l'atelier dessin' width='90%' style='display:block;margin: 0 auto;' /></details>" : dessins,
  "<i class='activer'> activer/désactiver la couche :</i><details name='legende'><summary><img src='data/marker_Paysages.png' height='50px' style='margin:-5px 1px'/>Paysages de femmes solidaires confinées</summary><p>Ces productions sont issues d’un atelier réalisé sur WhatsApp pendant le confinement, au printemps 2020. Il s’agissait de prendre une photographie de ce que les femmes voyaient par la fenêtre de leur logement et de commenter la photographie qu’elles avaient prises. Elles postaient photographie(s) et commentaires sous forme de message écrit ou audio. Ce fut l’occasion d’échanges sur les évolutions du quartier lié à la situation sanitaire, sur ce qui manquait aux femmes dans ce contexte et sur leurs histoires personnelles en lien avec les logements qu’elles ont successivement occupés dans le quartier.</p></details>" : paysages,
  "<i class='activer'> activer/désactiver la couche :</i><details name='legende'><summary><img src='data/marker_Audios1.png' height='40px' style='margin:-5px 1px'/><img src='data/marker_Audios2.png' height='40px' style='margin:-5px 2px'/>Deux balades sonores</summary><p>Le 20 janvier et le 6 juillet 2020, nous avons effectué deux promenades dans le quartier. La première a eu lieu dans le haut du quartier, dans les rues situées à proximité du centre social et jusqu’au boulevard de Belleville, en passant par le parc. La seconde s’est déroulée rue de Belleville, du haut vers le bas. Dans le contexte post-confinement, nous étions toutes masquées. Les femmes notaient sur des plans représentant la rue là où nous nous arrêtions, pour poursuivre le travail commun autour de l’orientation. Lors des deux balades, nous avions à la main des enregistreurs sonores qui passaient de main en main. Les femmes choisissaient où elles souhaitaient s’arrêter (devant un lieu de culte, un commerce, une école, etc) et commentaient. Elles racontent leurs usages des lieux, les évolutions du quartier, elles confient au passage des morceaux de leur existence, ce qui les met en colère, ce qu’elles entreprennent pour lutter contre de petites et grandes injustices, et ce qui leur donne de l’espoir.</p><img src='data/desc3.jpg' alt='Photo d'une balade' width='90%' style='display:block;margin: 0 auto;' /></details>": balades_sonores
}

L.control.layers(baseLayers, null, {position: "bottomright", collapsed: false}).addTo(map);
// le control layers de la légende effectif... -> les choix de couches
L.control.layers(null, overlayMaps, {position: "topleft", collapsed: false}).addTo(map);

// afficher le niveau de zoom dans la console !
map.on("zoomend", function(ev) {
console.log(map.getZoom());
});
