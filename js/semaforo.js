class Semaforo{
    difficulty;
    levels = [0.2, 0.5, 0.8];
    lights = 4;
    unload_moment = null;
    clic_moment = null;

    //almaceno el tiempo obtenido
    result_Time = null;

    constructor(){
        //Inicializamos la dificultad de forma aleatoria en funcion de levels
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.createStructure();
    }

    createStructure(){
        var main = document.querySelector("main");
        
        /*
        var encabezadoTitulo = document.createElement("h2"); //creamos el h2 para el Titulo del juego
        encabezadoTitulo.textContent = "Juego de Semaforo";
        main.appendChild(encabezadoTitulo);
        */
        
        for(let i = 0; i < this.lights; i++){
            var div = document.createElement("div");
            main.appendChild(div);
        }
        

        var botonArrancar = document.createElement("button");
        botonArrancar.textContent = "Arranque"; //Arranque
        botonArrancar.onclick = () => this.initSequence();
        //botonArrancar.addEventListener("click", this.initSequence());

        var botonTiempo = document.createElement("button");
        botonTiempo.textContent = "Reacción"; //Reacción
        botonTiempo.onclick = () => this.stopReaction();
        //deberia empezar deshabilitado
        botonTiempo.disabled = true;
        
        main.appendChild(botonArrancar);
        main.appendChild(botonTiempo);
    }

    initSequence(){
        //primero desactivamos el boton.        Asi selecciono el primer boton del main, en este caso el de arrancar
        var botonArrancar = document.querySelector("main button");
        botonArrancar.disabled = true; //lo desactivamos

        //Anadimos class (SOLO EN ESTE EJERCICIO)
        document.querySelector("main").classList.add('load'); //anadimos la clase load al main
                                //clase load -> encendido de las luces
        
        //apagado
        setTimeout(()=>{
            this.unload_moment = new Date(); //asi creo que almaceno fecha y hora a la vez
            this.endSequence();
        }, (2000 + this.difficulty*100));
    }

    endSequence(){
        //conseguimos todos los botones del main (en un array) y de ahi sacamos el de tiempos, que es el segundo
        var botonTiempo = document.querySelectorAll("main button")[1];
        botonTiempo.disabled = false;

        //Anadimos class (SOLO EN ESTE EJERCICIO)

                    //COMPROBAR ESTE AQUI -> NO DEBERIA
        //document.querySelector("main").classList.remove('load'); //importante quitarlo para luego apagar
            //el declarar los delays de las unload no se mezclan con las anteriores y se soluciona el problema

        document.querySelector("main").classList.add('unload');
    }

    stopReaction(){
        var clic_Moment = new Date();

        this.clic_moment = clic_Moment; //lo guardo para tenerlo almacenado para usar en otros metodos

        var difTiempos = clic_Moment - this.unload_moment;

        //para varias pruebas.- Asi no voy creando parrafos infinitos
        const parrafoConClase = document.querySelector("main p"); 
        if (parrafoConClase) {
            parrafoConClase.remove();
        }

        var parrafoTiempos = document.createElement("p");
        parrafoTiempos.textContent = "Tiempo de reacción: " + (difTiempos/1000).toFixed(3) + " segundos";

        //almaceno el tiempo obtenido
        this.result_Time = (difTiempos/1000).toFixed(3);

        var main = document.querySelector("main");
        //main.appendChild(parrafoTiempos);
        main.insertBefore(parrafoTiempos, main.querySelector('section')); //que lo meta an

        //deshabilitar boton tiempo, borrar parrafo y habilitar boton arranque
        document.querySelector("main").classList.remove('load');
        document.querySelector("main").classList.remove('unload');

        document.querySelectorAll("main button")[1].disabled=true;
        document.querySelector("main button").disabled=false;

        this.createRecordForm();
    }


    createRecordForm(){
        //var sectionCuestionario = $("<section></section>");

        //"Labels" que acompanaran a los inputs
        var pNombre = $("<p></p>");
        pNombre.text("Nombre: ");
        var pApellidos = $("<p></p>");
        pApellidos.text("Apellidos: ");
        var pNivelDificultad = $("<p></p>");
        pNivelDificultad.text("Dificultad: ");
        var pTiempo = $("<p></p>");
        pTiempo.text("Tiempo obtenido: ");

        var inputNombre = $("<input>");
        inputNombre.attr("name", "nombre"); //ATRIBUTO NAME: identifica el campo al hacer Solicitudes al servidor
        inputNombre.attr("required", true);

        var inputApellido = $("<input>");
        inputApellido.attr("name", "apellidos");
        inputApellido.attr("required", true);

        var inputNivelDificultad = $("<input>");
        inputNivelDificultad.attr("name", "nivel");
        //inputNivelDificultad.value(this.difficulty);
        inputNivelDificultad.val(this.difficulty);
        //inputNivelDificultad.prop("disabled", true); //CON DISABLE NO SE ENVIAN LOS DATOS DEL CUESTIONARIO
        inputNivelDificultad.prop("readonly", true); //mejor asi


        //var difTiempos = this.clic_Moment - this.unload_moment;
        //var segReaccion = (difTiempos/1000).toFixed(3); //obtengo la reaccion sacada por el usuario

        var inputTiempo = $("<input>");
        inputTiempo.attr("name", "tiempo");
        //inputTiempo.value(segReaccion);
        inputTiempo.val(this.result_Time);
        //inputTiempo.disabled(true);
        //inputTiempo.prop("disabled", true); //CON DISABLE NO SE ENVIAN LOS DATOS DEL CUESTIONARIO
        inputTiempo.prop("readonly", true); //mejor asi

        var inputFinalizar = $("<input>");
        inputFinalizar.val("Guardar"); //el texto del boton de submit
        //inputFinalizar.type("submit"); //para que una vez clickado envie el formulario
        inputFinalizar.attr("type", "submit");

        //Con todo preparado, hago el cuestionario. Dentro de este se almacenaran todos sus componentes
        var form = $("<form></form>");
        form.attr("action", "#"); //action especifica la URL a enviar al formulario. Con # hacemos que sea la misma pagina (se recarga)
        form.attr("method", "post");//method es el http al que enviar los datos, dos alternativas clave, Post y Get
        form.attr("name", "formResult"); //el name

        form.append(pNombre); //acordarse, append = jQuery, appendChild de normal
        form.append(inputNombre);
        form.append(pApellidos);
        form.append(inputApellido);
        form.append(pNivelDificultad);
        form.append(inputNivelDificultad);
        form.append(pTiempo);
        form.append(inputTiempo);
        form.append(inputFinalizar);

        //sectionCuestionario.append(form);

        //$("body").append(sectionCuestionario);
        $("main > section").append(form);
    }
}