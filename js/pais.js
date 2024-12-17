class Pais {
    nombre; 
    capital;
    circuito;
    numPoblacion;
    tipoGobierno;
    coordenadasMetaCircuito;
    religion;

    constructor (nombre, capital, numPoblacion){
        this.nombre = nombre;
        this.capital = capital;
        this.numPoblacion = numPoblacion;
    }

    rellenarAtributos(circuito, tipoGobierno, coordenadasMetaCircuito, religion){
        this.circuito = circuito;
        this.tipoGobierno = tipoGobierno;
        this.coordenadasMetaCircuito = coordenadasMetaCircuito;
        this.religion = religion;
    }

    getNombreTexto(){  //devuelven los atributos tal cual (HABRA QUE ENVOLVERLOS CON HTML EN METEOROLOGIA)
        return this.nombre;
    }

    getCapitalTexto(){
        return this.capital;
    }

    getInfoSecundaria(){ //devuelven los atributos ya en formato html, por lo tanto en mateorologia bastara con llamarlo tal cual
        return "<ul><li>" + this.circuito + "</li><li>" +this.numPoblacion + "</li><li>" +this.tipoGobierno + "</li><li>" + this.religion+ "</li></ul>";
        //al ya ser una lista de html, se le puede hacer un document.write directamente, no como los anteriores
    }

    escribirCoordenadasMeta(){  //ESCRIBE DIRECTAMENTE EN EL DOCUMENTO DESDE AQUI
        document.write("<p>Coordenadas circuito: " + this.coordenadasMetaCircuito + "</p>");   //window.document
    }



    getPrevisionTiempo(){
        const  apiKey = "6e84b48af466b12982c36834e5fedd66";
        const  coordenadasArray = this.coordenadasMetaCircuito.split("/");
        const  lon = coordenadasArray[0];
        const  lat = coordenadasArray[1];

        const  units = "metric";
        const  lang = "es";
        const mode = "xml";

        const horaAMedir = "12:00:00";
        //const meteoAPIURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&mode=" + mode + "&units=" + units + "&lang=" + lang + "&appid=" + apiKey;
            //MEJOR forecast que weather, PUES NECESITAMOS EL PRONOSTICO DE CINCO DIAS
        const meteoAPIURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&units=" + units + "&mode=" + mode + "&lang=" + lang + "&appid=" + apiKey;         

        $.ajax({
            dataType: "xml",
            url: meteoAPIURL,
            method: 'GET',
            success: function(datos){
                
                    //const section = document.createElement("section"); //section en el que incluir los article(los pronosticos)
                    const section = $("<section></section>");

                    //const headerPronostico = document.createElement("h3");
                    //headerPronostico.textContent = "Pronósticos";
                    const headerPronostico = $("<h3></h3>").text("Pronósticos");
                    
                    //document.querySelector("body").appendChild(headerPronostico);
                    //$("body").append(headerPronostico);
                    //$("main").append(headerPronostico);
                    section.append(headerPronostico);

                    //IMP
                    //Sacamos todos los pronosticos obtenidos segun los dias
                    var listaPronosticos = $(datos).find("time"); 

                    //recorremos todos los pronosticos obtenidos
                    for(let i = 0; i < listaPronosticos.length; i++){
                    //for(let i = 0; i < listaPronosticos.length; i+=8){  //METODO ALTERNATIVO: incremento cada ocho, asi solo coge cada 24 horas
                        if($(listaPronosticos[i]).attr("from").split("T")[1] === horaAMedir){  //filtramos para solo coger tomas a horas concretas de distintos dias
                            
                            var diaActual = listaPronosticos[i].getAttribute("from").split("T")[0];  //PUES SEPARADO POR T ESTAN: fechaThora
                            var horaActual = listaPronosticos[i].getAttribute("from").split("T")[1];

                            var minutosZonaHoraria    = new Date().getTimezoneOffset();
                            var temperatura           = $('temperature',listaPronosticos[i]).attr("value");
                            var temperaturaMin        = $('temperature',listaPronosticos[i]).attr("min");
                            var temperaturaMax        = $('temperature',listaPronosticos[i]).attr("max");
                            var temperaturaUnit       = $('temperature',listaPronosticos[i]).attr("unit");
                            var humedad               = $('humidity',listaPronosticos[i]).attr("value");
                            var humedadUnit           = $('humidity',listaPronosticos[i]).attr("unit");
                            var precipitacionValue    = $('precipitation',listaPronosticos[i]).attr("value");
                            var horaMedida            = $('lastupdate',listaPronosticos[i]).attr("value");
                            var horaMedidaMiliSeg1970 = Date.parse(horaMedida);
                                horaMedidaMiliSeg1970 -= minutosZonaHoraria * 60 * 1000;


                            var article = $("<article></article>");
                            var headerArticle = $("<h4></h4>");
                            var imgIcono = $("<img>");
                            var pTemperatura = $("<p></p>");
                            var pTemperaturaMin = $("<p></p>");
                            var pTemperaturaMax = $("<p></p>");
                            var pHumedad = $("<p></p>");
                            var pPrecipitacion = $("<p></p>");

                            //damos los valores a los elementos y los appendeamos al article
                            //headerArticle.textContent = diaActual;
                            //article.appendChild(headerArticle);
                            headerArticle.text(diaActual);
                            article.append(headerArticle);

                            //img           OBTENEMOS LA IMAGEN CORRESPONDIENTE EN LA PAGINA, usando el atributo "var" y buscando en este el symbol
                                                                                                                    //este @2x es el modificador de tamano, puedo cambiarlo si tal (4x)
                            //imgIcono.src = ("https://openweathermap.org/img/wn/" + $("symbol",listaPronosticos[i]).attr("var") + "@2x.png");
                            //imgIcono.alt = "Icono tiempo";
                            //article.appendChild(imgIcono);
                            imgIcono.attr({src:"https://openweathermap.org/img/wn/" + $("symbol",listaPronosticos[i]).attr("var") + "@2x.png", 
                                alt:"Icono tiempo"
                            });
                            article.append(imgIcono);

                            //pTemperatura.textContent = "Temperatura: " + temperatura + " grados " + temperaturaUnit;
                            //article.appendChild(pTemperatura);
                            pTemperatura.text("Temperatura: " + temperatura + " grados " + temperaturaUnit);
                            article.append(pTemperatura);

                            //pTemperaturaMin.textContent = "Temperatura mínima: " + temperaturaMin + " grados " + temperaturaUnit;
                            //article.appendChild(pTemperaturaMin);
                            pTemperaturaMin.text("Temperatura mínima: " + temperaturaMin + " grados " + temperaturaUnit);
                            article.append(pTemperaturaMin);

                            //pTemperaturaMax.textContent = "Temperatura máxima: " + temperaturaMax + " grados " + temperaturaUnit;
                            //article.appendChild(pTemperaturaMax);
                            pTemperaturaMax.text("Temperatura máxima: " + temperaturaMax + " grados " + temperaturaUnit);
                            article.append(pTemperaturaMax);

                            //pHumedad.textContent = "Humedad: " + humedad + " " + humedadUnit;
                            //article.appendChild(pHumedad);
                            pHumedad.text("Humedad: " + humedad + " " + humedadUnit);
                            article.append(pHumedad);

                            /*
                            pPrecipitacion.textContent = "Valor Precipitación: " + precipitacionValue;
                            //compruebo por si sale undefined
                            if(pPrecipitacion.textContent === "Valor Precipitación: undefined"){
                                pPrecipitacion.textContent = "Valor Precipitación: No disponible";
                            } */
                            pPrecipitacion.text("Valor Precipitación: " + precipitacionValue);
                            //compruebo por si sale undefined
                            if(pPrecipitacion.text() === "Valor Precipitación: undefined"){
                                pPrecipitacion.text("Valor Precipitación: No disponible");
                            }

                            //article.appendChild(pPrecipitacion);
                            article.append(pPrecipitacion);

                            //section.appendChild(article);  
                            section.append(article);
                        }
                    }
                    //finalmmente, teniendo el section con todos los pronosticos articles en este, lo anadimos al main
                    //document.querySelector("body").appendChild(section);
                    //$("body").append(section);
                    $("main").append(section);
                },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
}
