class Noticias{


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

        //para el boton de crear noticia
        const primerBoton = document.querySelector("button");
        primerBoton.addEventListener("click", this.crearNoticia.bind(this));
    }

    readInputFile(files){
        //Obtenemos el archivo a leer, los cuales vienen en arrays
        var actualFile = files[0];
        //establecemos el tipo que nos interesa
        var tipoTexto = /text.*/;

        var seccionNoticias = document.querySelector("section");
        //var errorArchivo = document.querySelector("input + p");
        var errorArchivo = document.querySelector("label + p");

        //comprobamos si es valido
        if(actualFile.type.match(tipoTexto)){
            //Ya sabiendo que es un archivo correcto, leemos
            var lector = new FileReader();
            lector.onload = function (evento){
            //var seccionNoticias = document.querySelector("section");
            
            var textoNoticias = lector.result;
            var arrayNoticias = textoNoticias.split("\n"); //Pues cada notcia es una linea del documento

            //recorremos cada noticia para anadirla por separado
            arrayNoticias.forEach(noticia => {
                var noticiaEstructurada = noticia.split("_");

                var tituloNoticia = noticiaEstructurada[0];
                var coreNoticia = noticiaEstructurada[1];
                var autorNoticia = noticiaEstructurada[2];

                var article = document.createElement("article");
                var header = document.createElement("h4");
                header.textContent = tituloNoticia;

                var parrafo1 = document.createElement("p");
                parrafo1.textContent = coreNoticia;

                var parrafo2 = document.createElement("p");
                parrafo2.textContent = autorNoticia;

                article.appendChild(header);
                article.appendChild(parrafo1);
                article.appendChild(parrafo2);

                seccionNoticias.appendChild(article);

                //
                errorArchivo.innerText = "Inserte el archivo en formato txt";
            });
          }

          lector.readAsText(actualFile);
        }else{
            //document.write("<p>¡¡¡ No se ha podido leer el archivo correctamente !!!</p>");
            errorArchivo.innerText = "Error : ¡¡¡ Archivo no válido !!!";
        }
    }


    crearNoticia(){
        var seccionNoticias = document.querySelector("section");

        var tituloNoticia = document.querySelector("ul li:first-of-type input").value;
        var coreNoticia = document.querySelector("ul li:nth-of-type(2) input").value;
        var autorNoticia = document.querySelector("ul li:nth-of-type(3) input").value;

        if(tituloNoticia != "" && coreNoticia != "" && autorNoticia != ""){
            var article = document.createElement("article");
            var header = document.createElement("h4");
            header.textContent = tituloNoticia;

            var parrafo1 = document.createElement("p");
            parrafo1.textContent = coreNoticia;

            var parrafo2 = document.createElement("p");
            parrafo2.textContent = autorNoticia;

            article.appendChild(header);
            article.appendChild(parrafo1);
            article.appendChild(parrafo2);

            seccionNoticias.appendChild(article);

            //reseteamos los inputs
            document.querySelector("ul li:first-of-type input").value = "";
            document.querySelector("ul li:nth-of-type(2) input").value = "";
            document.querySelector("ul li:nth-of-type(3) input").value = "";
        }
    }

}