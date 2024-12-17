class Trivia{

    //Array que almacenara los distintos pilotos, junto a una imagen asociada. Al empezar el juego, se establecera uno
    //al azar, teniendo el jugador elegir de cada article/section de campos (equipo, nacionalidad, etc) el correspondiente al piloto
    elements = [{
        piloto: "Fernando Alonso",
        source: "multimedia/imagenes/imagenesApi/fotoFernandoAlonso.jpg",
        nacionalidad: "Española",
        equipo: "Aston Martin Racing"
    },{
        piloto: "Max Verstappen",
        source: "multimedia/imagenes/imagenesApi/fotoMaxVerstappen.jpg",
        nacionalidad: "Neerlandesa",
        equipo: "Red Bull Racing"
    },{
        piloto: "Charles Leclerc",
        source: "multimedia/imagenes/imagenesApi/fotoCharlesLeclerc.jpg",
        nacionalidad: "Monegasca",
        equipo: "Ferrari"
    },{
        piloto: "Lewis Hamilton",
        source: "multimedia/imagenes/imagenesApi/fotoHamilton.jpg",
        nacionalidad: "Británica",
        equipo: "Mercedes"
    }];

    primerCampoSeleccionado; //campo nombre
    segundoCampoSeleccionado; //campo nacionalidad
    tercerCampoSeleccionado; //campo equipo
    pilotoActual;

    audioContext;

    currentAudioElement;
    
    //gestionar api drag movil
    dragableActual;
    registroMovimientoTouchX;
    registroMovimientoTouchY;


    constructor(){
        this.primerCampoSeleccionado = null;
        this.segundoCampoSeleccionado = null;
        this.tercerCampoSeleccionado = null;
        this.pilotoActual = null;

        //$("button").on("click", this.confirmarRespuestas());

        this.shuffleElements(); 
        this.createElements();
        //this.addEventListeners();

        //Web Audio API
        //this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        //Para evitar warnings, que se cree tras que el usuario le de a un botom
        document.querySelector("button:first-of-type").addEventListener("click", ()=>{this.audioContext  = new (window.AudioContext || window.webkitAudioContext)();});

        //Al usar la API Drag and Drop
        this.createDragAndDrop();

        //llevar
        this.dragableActual = null;
        this.registroMovimientoTouchX = 0;
        this.registroMovimientoTouchY = 0;

        //API Page Visibility
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    shuffleElements(){
        //Aplicamos algoritmo Durstenfeld
        for(let i = this.elements.length-1; i > 0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }


    createElements(){
        //Ya estando los pilotos shuffleados, pillo el primero
        this.pilotoActual = this.elements.at(0);

        //var pilotSection = document.querySelector("main section"); //deberia pillar el primer section del main
        var pilotSection = $("main section:nth-of-type(2)"); //asi pilla todos los sections, hacer que pille solo el primero

        var imgPiloto = $("<img>");
        imgPiloto.attr({src: this.pilotoActual.source, alt: "Imagen del piloto"});

        pilotSection.append(imgPiloto);

        var pAvisoPiloto = $("<p></p>");
        pAvisoPiloto.text("¡Este ha sido el primer piloto en salir de la línea de meta!");
        var pIntro = $("<p></p>");
        pIntro.text("Es hora de poner a prueba tus conocimientos sobre la F1. 3, 2, 1...¡YA!");
        pilotSection.append(pAvisoPiloto);
        pilotSection.append(pIntro);
        


    }

    confirmarRespuestas(){
        var finalSection = $("section").last();

        var counterRespuestas = 0;
        //Observo cuantas respuestas se han puesto, y de las puestas las que sean correctas:
        
        for (var i = 0; i < 4; i++) {
            var article = $("article").eq(i);
    
            //var liHijos = article.children("li");
            //AS
            var liHijos = article.children("p");
    
            // Comprobamos si el artículo tiene al menos un <li> o exactamente dos hijos
            if (liHijos.length == 1) { //se ha puesto una respuesta
                counterRespuestas++;

                if(i == 0){
                    this.primerCampoSeleccionado = liHijos.first().text();
                }else if(i == 1){
                    this.segundoCampoSeleccionado = liHijos.first().text();
                }else{
                    this.tercerCampoSeleccionado = liHijos.first().text();
                }
            }
        }

        if(counterRespuestas == 3 && this.comprobarRespuestasEstablecidas()){

            this.reproducirAudio("./multimedia/audios/sonidosAPI/winMK.mp3");

            var pVictoria = $("<p>VICTORIA</p>");
            finalSection.append(pVictoria);

        }else{
            this.reproducirAudio("./multimedia/audios/sonidosAPI/loseMK.mp3");

            var pDerrota = $("<p>DERROTA</p>");
            finalSection.append(pDerrota);
        }

        //Tras acabar el juego, deshabilito las mecanicas
        var botonInputConfirmar = $("button");
        botonInputConfirmar.attr("disabled", true);

        $("li").each(function() {
            $(this).attr("draggable", false);
        });
    }

    comprobarRespuestasEstablecidas(){
        return this.primerCampoSeleccionado === this.elements.at(0).piloto && 
        this.segundoCampoSeleccionado === this.elements.at(0).nacionalidad && this.tercerCampoSeleccionado === this.elements.at(0).equipo;
    }


    //METODO API WEB AUDIO
    reproducirAudio(urlAudio){
        //Api key FreeSound.org
        //var apiKey = "tACxjQncYBvY0kQx4wB6I6fn8esN5uKoherEQ8fP";

        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        var audioElement = new Audio(urlAudio);
        
        this.currentAudioElement = audioElement;

        //var audioSource = this.audioContext.createMediaElementSource(audioElement);
        //audioSource.connect(this.audioContext.destination);

        if(this.audioContext.state === "suspended"){
            this.audioContext.resume();
        }

        //audioElement.play
        this.currentAudioElement.play().catch((error) => {
            console.error('Error al intentar reproducir el audio:', error);
        });

    }

    //METODOS DRAG AND DROP
    createDragAndDrop(){
        //declaro que elelementos se van a poder arrastar
        const elementosDraggables = document.querySelectorAll("li[draggable='true']");
        //declaro en que zonas se van a poder solar estos elementos
        const articleRespuesta = document.querySelectorAll("article"); // Las listas donde se pueden soltar

        elementosDraggables.forEach(elem => {
            elem.addEventListener("dragstart", this.handleDragStart);
            elem.addEventListener("dragend", this.handleDragEnd);

            //para moviles
            elem.addEventListener("touchstart", this.handleTouchStart.bind(this));
            elem.addEventListener("touchmove", this.handleTouchMove.bind(this));
            elem.addEventListener("touchend", this.handleTouchEnd.bind(this));
        });

        articleRespuesta.forEach(art => {
            art.addEventListener("dragover", this.handleDragOver);
            art.addEventListener("drop", this.handleDrop);

            //para moviles
            art.addEventListener("touchmove", this.handleTouchMoveOver.bind(this));
            art.addEventListener("touchend", this.handleTouchEndDrop.bind(this));
        });
    }

    handleDragStart(event) {
        event.dataTransfer.setData("text/plain", event.target.innerText);
        event.target.classList.add("dragging");
    }

    handleDragEnd(event) {
        event.target.classList.remove("dragging");
    }

    handleDragOver(event) {
        event.preventDefault(); //Necesario para permitir el drop.
    }

    handleDrop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        //Antes de soltar el elemento, me aseguro de borrar todo lo que hubiese dentro antes
        const articleRespuesta = event.target.closest("article");
        if (articleRespuesta) {
            // Eliminar todos los elementos li existentes pero mantener el encabezado (h5)
            Array.from(articleRespuesta.children).forEach(child => {
                if (child.tagName === "P") {  //LI
                    articleRespuesta.removeChild(child);
                }
            });
    
            //const droppedItem = document.createElement("li");
            //AS
            var respuestaArrastrada = document.createElement("p");
            respuestaArrastrada.textContent = data;
            respuestaArrastrada.setAttribute("draggable", "false");
    
            //Anadir el nuevo elemento al article
            articleRespuesta.appendChild(respuestaArrastrada);
    
            //
            respuestaArrastrada.addEventListener("dragstart", this.handleDragStart);
            respuestaArrastrada.addEventListener("dragend", this.handleDragEnd);
        }
    }

    /* Para movil */
    handleTouchStart(event) {
        const touch = event.touches[0]; // Primer punto de contacto
        this.dragableActual = event.target; // Guardamos el elemento que está siendo arrastrado
        this.registroMovimientoTouchX = touch.clientX; // Coordenada inicial X
        this.registroMovimientoTouchY = touch.clientY; // Coordenada inicial Y

        // Agregamos una clase visual para destacar el elemento arrastrado
        this.dragableActual.classList.add("dragging");
    }
    
    handleTouchMove(event) {
        event.preventDefault(); //necesario
    }
    
    handleTouchEnd(event) {
        this.dragableActual.classList.remove("dragging");

        const soltar = event.changedTouches[0];
        const articleRespestaEsc = document.elementFromPoint(soltar.clientX, soltar.clientY);

        if (articleRespestaEsc && articleRespestaEsc.tagName === "ARTICLE") {
            // Realizamos el drop simulando la lógica del mouse
            const data = this.dragableActual.textContent;
            const resp = document.createElement("p"); //li
            resp.textContent = data;
            resp.setAttribute("draggable", "false"); //true

            // Limpiamos la zona de destino
            Array.from(articleRespestaEsc.children).forEach(child => {
                if (child.tagName === "P") {  //LI
                    articleRespestaEsc.removeChild(child);
                }
            });

            
            articleRespestaEsc.appendChild(resp);

            //
            resp.addEventListener("touchstart", this.handleTouchStart.bind(this));
            resp.addEventListener("touchmove", this.handleTouchMove.bind(this));
            resp.addEventListener("touchend", this.handleTouchEnd.bind(this));
        }

        this.dragableActual = null;
        this.registroMovimientoTouchX = 0;
        this.registroMovimientoTouchY = 0;
    }
    
    handleTouchMoveOver(event) {
        event.preventDefault();
    }
    
    handleTouchEndDrop(event) {
        event.preventDefault(); 
    }



    //API Page Visibility
    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            //Se oculta la pagina, se pausa el audio
            this.pausarAudio(); // Método que pausará cualquier audio en reproducción
        } else if (document.visibilityState === 'visible') {
            //La pagina esta visible, se reproduce el audio
            this.reanudarAudio(); // Método para reanudar el audio o acciones
        }
    }

    pausarAudio() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }

        if (this.currentAudioElement) {
            this.currentAudioElement.pause();
        }
    }
    
    reanudarAudio() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
                                //para que solo continue si no ha acabado
        if (this.currentAudioElement && !this.currentAudioElement.ended) {
            this.currentAudioElement.play().catch((error) => {
                console.error('Error al intentar reanudar el audio:', error);
            });
        }
    }
}