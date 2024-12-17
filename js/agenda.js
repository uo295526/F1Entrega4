class Agenda{
    APIUrl;

    //boton = document.querySelector("button");
    boton = $("button");

    constructor(){
        this.APIUrl = "https://api.jolpi.ca/ergast/f1/2024/races.json";
        //this.APIUrl = "https://ergast.com/api/f1/current.json";

        this.prepararBotones();
    }

    
    prepararBotones(){
        //this.boton.addEventListener("click", this.getCarreras.bind(this));
        this.boton.on("click", this.getCarreras.bind(this));
    }

    getCarreras() {
        // Realiza una llamada AJAX para obtener el calendario de la temporada actual
        $.ajax({
            dataType: "json",
            url: this.APIUrl,
            method: "GET",
            success: function(data){
                // Accede a la lista de carreras dentro de la respuesta de la API
                const carreras = data.MRData.RaceTable.Races;

                const section = $("<section></section>");

                const headerCarreras = $("<h3></h3>");
                headerCarreras.text("Carreras de la temporada"); 
                //$("body").append(headerCarreras);
                section.append(headerCarreras);


                // Recorre cada carrera y construye el contenido HTML
                carreras.forEach((carrera) => {
                    const nombreCarrera = carrera.raceName;
                    const nombreCircuito = carrera.Circuit.circuitName;
                    const coordenadas = `Lat: ${carrera.Circuit.Location.lat}, Long: ${carrera.Circuit.Location.long}`;
                    const fechaCarrera = `${carrera.date}`;
                    const horaCarrera = `${carrera.time}`;

                    // Crea un nuevo elemento HTML para cada carrera y agrega la información
                    var article = $("<article></article>");
                    var headerArticle = $("<h4></h4>");
                    var listaElementos = $("<ul></ul>");

                    /*
                    var pCircuito = document.createElement("p");
                    var pCoordenadas = document.createElement("p");
                    var pFecha = document.createElement("p");
                    var pHora = document.createElement("p");
                    */
                    var pCircuito = $("<p></p>");
                    var pCoordenadas = $("<p></p>");
                    var pFecha = $("<p></p>");
                    //var pHora = document.createElement("li");
                    var pHora = $("<p></p>");

                    headerArticle.text(nombreCarrera);
                    headerArticle.attr("lang", "en");
                    article.append(headerArticle);

                    pCircuito.text("Circuito: " + nombreCircuito);
                    pCircuito.attr("lang", "en");
                    article.append(pCircuito);

                    pCoordenadas.text("Coordenadas: " + coordenadas);
                    article.append(pCoordenadas);

                    pFecha.text("Fecha: " + fechaCarrera);
                    article.append(pFecha);

                    pHora.text("Hora: " + horaCarrera);
                    article.append(pHora);


                    section.append(article);
                });
                //document.querySelector("body").appendChild(section);
                $("main").append(section);
            },
            error:function(){
                $("h3").html("¡Tenemos problemas! No puedo obtener XML de <a href='http://openweathermap.org'>OpenWeatherMap</a>"); 
            }
        });
    }
}