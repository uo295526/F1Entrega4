class Memoria{
    
    elements = [{
            element: "RedBull",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
        },{
            element: "RedBull",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"
        },{
            element: "McLaren",
            source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
        },{
            element: "McLaren",
            source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"
        },{
            element: "Alpine",
            source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
        },{
            element: "Alpine",
            source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"
        },{
            element: "AstonMartin",
            source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
        },{
            element: "AstonMartin",
            source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"
        },{
            element: "Ferrari",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
        },{
            element: "Ferrari",
            source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"
        },{
            element: "Mercedes",
            source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
        },{
            element: "Mercedes",
            source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"
    }];

    hasFlippedCard;
    lockBoard;
    firstCard;
    secondCard;

    constructor(){
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        /* Por comentarios de pruebas de usabilidad, delego esto en el boton de empezar a jugar
        this.shuffleElements();
        this.createElements();
        this.addEventListeners(); 
        */

        var botonInicio = document.querySelector("section:nth-of-type(2) > button");
        botonInicio.addEventListener("click", this.empezarJuego.bind(this));
    }

    empezarJuego(){
        this.shuffleElements(); 
        this.createElements(); 
        this.addEventListeners();

        document.querySelector("section:nth-of-type(2)  > button").remove();
    }

    shuffleElements(){
        //Aplicamos algoritmo Durstenfeld
        for(let i = this.elements.length-1; i > 0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    //Cuando se levantan dos distintas
    unflipCards(){ //Bloquea tablero, voltea las cartas ya bocarriba, resetea tablero
        this.lockBoard = true;
        
        setTimeout(()=>{
            this.firstCard.removeAttribute("data-state"); //lo eliminamos por reestableceremos la carta
            this.secondCard.removeAttribute("data-state");

            this.resetBoard();
        }, 1000); //CAMBIO PRUEBAS USABILIDAD: pasarlo de 2500 a algo mas reducido por peticion de los usuarios
        
    }

    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false; 
        this.lockBoard = false;
    }

    /*ASEGURARSE DE LA COMPROBACION*/
    checkForMatch(){
        (this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element")) ? this.disableCards() : this.unflipCards();
    }

    //SE HA COGIDO UN PAR CORRECTO, SE DEJAN REVELADAS (PERMA)
    disableCards(){ 
        this.firstCard.setAttribute("data-state", "revealed"); 
        this.secondCard.setAttribute("data-state", "revealed"); 
        this.resetBoard();

        //Pruebas usabilidad: Comprobacion si se ha acabado el juego
        this.comprobarVictoria();
    }


    createElements(){
        var cardsSection = document.querySelector("section:nth-of-type(2)");
        
        for(let i = 0; i < this.elements.length; i++){
             var article = document.createElement("article");
            article.setAttribute("data-element", this.elements.at(i).element);
            var encabezado = document.createElement("h3"); 
            encabezado.textContent = "Tarjeta de Memoria";
            var img = document.createElement("img"); 
            img.alt = this.elements.at(i).element; 
            img.src = this.elements.at(i).source; 
            
            article.appendChild(encabezado);
            article.appendChild(img);
            
            cardsSection.appendChild(article);
        }
    }

    //PULSACIONES SOBRE LAS CARTAS
    addEventListeners(){
        var articlesCartas = document.querySelectorAll("section:nth-of-type(2) article"); //todos los articles (cartas) del section
        
        articlesCartas.forEach(card => 
            {card.addEventListener("click", this.flipCard.bind(card, this))
                });
    }

    flipCard(game){ 
        //comprobaciones de "uso indebido"
        if(this.getAttribute("data-state") == "revealed" || game.lockBoard || this.firstCard === this){   //this.firstCard creo que es game.
            return;
        }

        //no ha habido errores, flipeamos la carta
        this.setAttribute("data-state", "flip");

        //comprobamos si ya se ha sacado una antes y si se ha hecho comparamos
        if(!game.hasFlippedCard){ 
            game.hasFlippedCard = true; //es la primera en levantarse, activamos esta flag
            game.firstCard = this;
        }else{
            game.secondCard = this;
            game.checkForMatch();
        }
    }

    //Metodo de PRUEBAS DE USABILIDAD
    comprobarVictoria(){
        const tarjetasSection = document.querySelectorAll("section:nth-of-type(2) article");
        var counterRestantes = 0;

        // Contamos cuántas cartas aún no están reveladas
        tarjetasSection.forEach(tarjeta => {
            if (tarjeta.getAttribute("data-state") !== "revealed") {
                counterRestantes++;
            }
        });

        // Si no quedan cartas por revelar, mostramos el mensaje
        if (counterRestantes === 0) {
            var pAvisoFinal = document.createElement("p");
            pAvisoFinal.textContent = "¡Juego completado!";
            document.querySelector("main").appendChild(pAvisoFinal);
        }
    }
}