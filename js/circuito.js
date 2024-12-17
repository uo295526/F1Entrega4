class Circuito{
    
    constructor(){
        var pAviso = document.createElement("p")
        //comprobamos si lo soporta
        if (window.File && window.FileReader && window.FileList && window.Blob) {  
            //El navegador soporta el API File
            pAviso.textContent = "Este navegador soporta el API File";
        }else {
            pAviso.textContent = "¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!";
        } 
        document.querySelector("body").appendChild(pAviso);

    }

    

    //Nota: Mirar lo de SimpleXMLElement
    readInputFileXML(files){
        //Obtenemos el archivo a leer, los cuales vienen en arrays
        var actualFile = files[0];
        //establecemos el tipo que nos interesa
        var tipoTexto = /xml.*/;

        var seccionXML = $("section:first-of-type");  //para que solo lo escriba en su section correspondiente
        //var errorArchivo = $("body > section:first-of-type > p:last-of-type"); 
        var errorArchivo = $("main > section:first-of-type > p:last-of-type"); 

        //comprobamos si es valido
        if(actualFile.type.match(tipoTexto)){
            //Ya sabiendo que es un archivo correcto, leemos
            var lector = new FileReader();
            lector.onload = function (evento){

            //limpiamos el section para no repetir archivos
            //seccionXML.innerHTML = '';
            
            var textoXML = lector.result;
            var arrayLineasXML = textoXML.split("\n"); //Pues cada notcia es una linea del documento

            //var article = document.createElement("article");
            var article = $("<article></article>");

            var hArticle = $("<h4></h4>");
            hArticle.text("Resultado obtenido: ");
            article.append(hArticle);

            //recorremos cada noticia para anadirla por separado
            arrayLineasXML.forEach(XMLlinea => {

                //ADAPTAR EL TEXTO A HTML, NO ESCRIBIRLO TAL CUAL
                
                //var article = document.createElement("article");
                var linea = $("<p></p>");
                linea.text(XMLlinea);

                article.append(linea);

                
            });
            //seccionXML.empty(); //vacio la section
            seccionXML.find("article").remove(); //solo vacio lo leido del xml 

            var headerXML = $("<h3></h3>");
            headerXML.text("Datos del circuito");
            //seccionXML.append(headerXML);

            seccionXML.append(article);
            errorArchivo.text("Inserte el archivo en formato XML");
          }

          lector.readAsText(actualFile);
        }else{
            //document.write("<p>¡¡¡ Ni se ha podido leer el archivo correctamente !!!</p>");
            errorArchivo.text("Error : ¡¡¡ Archivo no válido !!!");
        }
    }


    mapFromInputFileKML(files) {
        var actualFile = files[0];
    
        var isKML = actualFile.name.toLowerCase().endsWith(".kml");
    
        //var errorArchivo = $("body > section:nth-of-type(3)> p:first-of-type"); //first por si en el div de mapa hay ps
        var errorArchivo = $("main > section:nth-of-type(3)> p:first-of-type"); //first por si en el div de mapa hay ps

        if (isKML) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var archivoKml = lector.result; //esto es el kml en texto, cogido por el lector

                const kml = $.parseXML(archivoKml); //lo parseamos a un kml para manipular sus datos

                //proba
                //var sectionMapa = $("section:nth-of-type(2)");
                //var divMapa = $("<div></div>");
                //sectionMapa.append(divMapa);

                var coordenadasArray = [];
                $(kml).find('coordinates').each(function (){
                    var coordenadasTexto = $(this).text().trim(); //asi se coje el texto de cada coordinates
                    coordenadasArray.push(coordenadasTexto);
                });
                //var coordenadasArray = coordenadasGeneral.split('\n');

                //var coordenadasArray = $("coordinates", archivoKml);   //obtener las coordenadas del .kml

                //this.escribirInfoKml(lector.result);
                
                var mapa = new Mapa();
                mapa.initMap(coordenadasArray[0].split(',')[0], 
                coordenadasArray[0].split(',')[1]);
                /*
                var primeraCoordenada = coordenadasArray[0].split(',');
                var mapa = new Mapa();
                mapa.initMap(primeraCoordenada[1], primeraCoordenada[0]);
                */
                for(var i = 0; i < coordenadasArray.length; i++){
                    var coordenadas = coordenadasArray[i].split(','); //separamos la lat long y alt de la actual
                    var longitud = coordenadas[0];
                    var latitud = coordenadas[1];
                    //var altitud = coordenadas[2];

                    mapa.marcarTramo(longitud, latitud);
                }

                
                errorArchivo.text("Inserte el archivo en formato KML");
            };
            lector.readAsText(actualFile);
        } else {
            errorArchivo.text("Error: ¡El archivo debe ser un KML válido!");
        }
    }


    readInputSVG(files) {
        var actualFile = files[0];
    
        var isSVG = actualFile.name.toLowerCase().endsWith(".svg");
    
        var seccionSVG = $("section:nth-of-type(2)");  //para que solo lo escriba en su section correspondiente
        //var errorArchivo = $("body > section:nth-of-type(2)> p:last-of-type"); 
        var errorArchivo = $("main > section:nth-of-type(2)> p:last-of-type"); 
    
        if (isSVG) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var textoSVG = lector.result;
    
                /**** */
                const SVG = $.parseXML(textoSVG);
                const svgElement = $(SVG).find("svg");
                /**** */

                seccionSVG.find("article").remove(); //limpio la seccion previo a anadir

                var headerSVG = $("<h3></h3>");
                headerSVG.text("Altimetria del circuito");
                //seccionSVG.append(headerSVG);

                var articleImagenSVG = $("<article></article>");

                var hArticle = $("<h4></h4>");
                hArticle.text("Resultado obtenido: ");
                articleImagenSVG.append(hArticle);

                
                //articleImagenSVG.append(textoSVG);
                articleImagenSVG.append(svgElement);

                seccionSVG.append(articleImagenSVG);

                //seccionSVG.append(svgContent);
                //seccionSVG.append(textoSVG);
    
                errorArchivo.text("Inserte el archivo en formato svg");
            };

            lector.readAsText(actualFile);
        } else {
            // Si el archivo no es un SVG, mostrar mensaje de error
            errorArchivo.text("Error: ¡El archivo debe ser un SVG válido!");
        }
    }

}

class Mapa{
    constructor(){
        //this.initMap();
    }

    initMap(longitud, latitud){
        //token mio
        mapboxgl.accessToken = 'pk.eyJ1IjoidW8yOTU1MjYiLCJhIjoiY20zdnFucmJjMHF6cTJqcGNxaDF6M25kMSJ9.YuYth_GgIKyI-rtcdvauSQ';
        //$("input").after("<article id=\"mapa\"></main>");

        //borro todo lo que pueda haber en el contenedor del mapa por si acaso
        //var mapaContainer = document.getElementById("mapaKML");
        var mapaContainer = document.querySelector('main > section:nth-of-type(3) > div');
        //var mapaContainer = $("body > section:nth-of-type(2) > div").first()[0];
        mapaContainer.innerHTML = '';
        

        this.map = new mapboxgl.Map({
            //container: "mapaKML",
            container: mapaContainer,
            style: "mapbox://styles/mapbox/streets-v9",
            //center: [-5.8502461, 43.3672702], 
            center: [longitud, latitud], 
            zoom: 14
        });        
        this.map.addControl(new mapboxgl.NavigationControl());
        this.map.addControl(new mapboxgl.FullscreenControl());        
        this.map.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },                
                trackUserLocation: true,                
                showUserHeading: true
            })
        );
    }

    marcarTramo(longitud, latitud) {
        new mapboxgl.Marker({color: "red"}).setLngLat([longitud, latitud])
        .addTo(this.map);
    }
}