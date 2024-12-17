class Fondo{
    pais;
    capital;
    circuito;

    constructor(nombrePais, nombreCapital, nombreCircuito){
        this.pais = nombrePais;
        this.capital = nombreCapital;
        this.circuito = nombreCircuito;
    }

    establecerImagenFondo(){
        //NOTA AL VALIDAR CON LIGHTHOSE. SI NO SE EJECUTA EN MODO INCOGNITO, LAS COOKIES DE TERCEROS DEL PROPIO FLICKR AFECTA Al APARTADO DE BUENAS PRACTICAS
        //DE EJECUTARSE EN MODO INCOGNITO, ESTE PROBLEMA DESAPARECE. Comento esto para hacer saber que esto esta comprobado

        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickrAPI, 
                    {
                        method: "flickr.photos.search",
                        api_key: "c7c08b347cd13d541076d0c2b944d2ff", //mi key
                        tags: this.circuito,  //zandvoort F1
                        tagmode: "any",
                        format: "json"
                    })
                .done(function(data) {
                    //fotos de la pagina guardades en:  data.items
                    
                    //cojo foto aleatoria de la lista de fotos encontradas en la pagina
                    let posFoto = Math.floor(Math.random() * (data.items.length)); //-1
                    
                    if(posFoto < 0){
                        posFoto = 0;
                    }

                    let fotoEscogida = data.items[posFoto]; 
                    //sacamos el url de la foto, PUES ES EL URL EL QUE SE METE EN EL HTML
                    let fotoEscogidaURL = fotoEscogida.media.m;  //.m es acceder al url de la imagen
                    //anado la foto al fondo del body
                            //.css(propertyName, value)         //este replace('_m', '_b') ESCALA LA FOTO
                    //$('body').css('background-image', 'url(' + fotoEscogidaURL.replace('_m', '_b') + ')').css('background-size', 'cover');
                    $('body').css({
                        'background-image': 'url(' + fotoEscogidaURL.replace('_m', '_b') + ')',
                        'background-size': 'cover',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center center'
                    });

                });


        
    }
}