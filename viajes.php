<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1Desktop/Viajes</title>
    <link href="multimedia/imagenes/favicon.ico" rel="icon" />
    <meta name ="author" content="UO295526"/>
    <meta name ="description" content ="Viajes" />
    <meta name ="keywords" content ="HTML, CSS, JavaScript, PHP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> <!--asi asociamos mas hojas de estilo-->

    <script src="js/viajes.js"></script>
    
    <!---->
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>        <!--No confundir con head. Head es parte intrinseca del html y header la seccion de arriba de la pagina-->
      <h1><a href="index.html" title="enlace al indice">F1Desktop</a></h1>
      <nav>
          <a href="index.html" title="enlace al indice">Index</a>  <!--importante el title por usabilidad-->
          <a href="piloto.html" title="enlace a la pagina del piloto">Piloto</a> <!--lo "activamos" pues es enlace a la propia pagina-->
          <a href="noticias.html" title="enlace a la pagina de noticias">Noticias</a>
          <a href="calendario.html" title="enlace a la pagina del calendario">Calendario</a>
          <a href="meteorologia.html" title="enlace a la pagina de meteorologia">Meteorologia</a>
          <a href="circuito.html" title="enlace a la pagina de circuito">Circuito</a>
          <a href="viajes.php" title="enlace a la pagina de viajes" class="active">Viajes</a>
          <a href="juegos.html" title="enlace a la pagina de juegos">Juegos</a>
      </nav>
      <!--este h1 y nav, al ser comun de todas las paginas, lo metemos en un header comun de todas-->
    </header>


    <?php
        class Carrusel {
            protected $capital;
            protected $pais;
            public function __construct($capital, $pais){
                $this->capital = $capital;
                $this->pais = $pais;
            }

            public function establecerCarrusel(){

                //NOTA AL VALIDAR CON LIGHTHOSE. SI NO SE EJECUTA EN MODO INCOGNITO, LAS COOKIES DE TERCEROS DEL PROPIO FLICKR AFECTA Al APARTADO DE BUENAS PRACTICAS
                //DE EJECUTARSE EN MODO INCOGNITO, ESTE PROBLEMA DESAPARECE. Comento esto para hacer saber que esto esta comprobado

                //mi key de flickr
                $key = "c7c08b347cd13d541076d0c2b944d2ff";
                $numImagenes = 10;

                //Preparo la conexion a flickr, con los requisitos que me interesan (diez fotos, json, le paso la capital, ...)
                $urlFlickr = "https://api.flickr.com/services/feeds/photos_public.gne?&api_key=" .$key. "&tags=" .$this->capital. "&per_page=" .$numImagenes. "&format=json&nojsoncallback=1";
                
                $respuesta = file_get_contents($urlFlickr);
                //del json lo paso a un array
                $json = json_decode($respuesta);
                
                if($json==null) {
                    echo "<h3>Error con el archivo JSON</h3>";
                }

                //YA OBTENIDAS LAS IMAGENES, AHORA TOCA ESCRIBIRLAS EN EL FICHERO (HACER USO DEL JS PARA HACER EL FUNCIONAMIENTO DE PASAR FOTOS)
                //pongo el carrusel en un section/article

                //echo "<section>";
                echo "<article>";
                echo "<h3>Carrusel de imágenes</h3>";

                //Para el css, no deberiamos crear uno especifico, probar con cosas como "div+article(carrusel)", "main > article:nth-child(?):nth-of-type(1)", y similares
                //a mu malas pues uno aparte y animo

                //voy cogiendo las imagenes del json devuelto, que las contiene
                for($i=0; $i < $numImagenes; $i++){
                    $titulo = $json->items[$i]->title;
                    $URLfoto = $json->items[$i]->media->m;       
                    print "<img alt='".$titulo."' src='".$URLfoto."' />";
                }
                //Botones del carrusel
                echo "<button> &lt; </button>";
                echo "<button> &gt; </button>";

                //echo "</section>";
                echo "</article>";
            }
        }

        class Moneda{
            protected $monedaLocal;
            protected $monedaACambiar;

            public function __construct($siglasMonedaLocal, $siglasMonedaCambio){
                $this->monedaLocal = $siglasMonedaLocal;
                $this->monedaACambiar = $siglasMonedaCambio;
            }

            public function realizarCambioMoneda(){
                $apiMonedaKey = "62c190deeb8067c2b67faa6b";
                $apiUrl = "https://v6.exchangerate-api.com/v6/".$apiMonedaKey."/latest/".$this->monedaLocal;

                $respuesta = file_get_contents($apiUrl);

                if($respuesta){
                    $json = json_decode($respuesta);

                    echo "<article>";
                    echo "<h3>Cambio de moneda local</h3>";

                    if ($json->result == 'success') {
                        //ratio moneda
                        $relacionMoneda = $json->conversion_rates->{$this->monedaACambiar};
                        
                        // Imprimir el resultado
                        echo "<p>La relación entre su moneda local, $this->monedaLocal, y la moneda de Países Bajos, $this->monedaACambiar, es de: $relacionMoneda.</p>";
                        $equivalMonedaUnEuro = 1 * $relacionMoneda;
                        $equivalMonedaDiezEuros = 10 * $relacionMoneda;
                        echo "<p>Es decir, que 1 $this->monedaLocal es equivalente a $equivalMonedaUnEuro en $this->monedaACambiar, así como 10 $this->monedaLocal es equivalente a $equivalMonedaDiezEuros en $this->monedaACambiar.</p>";

                    } else {
                        echo "<p>Error: No se pudieron obtener los datos del tipo de cambio.</p>";
                    }

                    echo "</article>";
                }
            }
        }
    ?>

    <p>Estás en: <a href="index.html" title="enlace al indice">Inicio</a> >> Viajes</p> <!--migas entre header y main, pues va a ser algo identico en el resto de html-->

    <main>

    <h2>Viajes</h2>
    
    <p>Sírvete de esta página para hacer de tus futuros viajes la mejor experiencia posible. ¡Bon voyage!</p>
    <section>
        <h3>Información del destino del viaje: Ámsterdam, Países Bajos</h3> <!--puedo meter el h4 dentro: section>h4+article o similar-->
        <?php
            $carruselFotos = new Carrusel("Amsterdam", "Paises Bajos");
            $carruselFotos->establecerCarrusel();

            $intercambioMoneda = new Moneda("EUR", "EUR");
            $intercambioMoneda->realizarCambioMoneda(); //PARA NO GASTAR USOS DE API DE MAS, DESCOMENTAR AL USAR
        ?>
    </section>

    <!-- <h3>Mapa estático</h3>
    <input type="button" value="Obtener mapa" disabled = "true" onClick = "viajes.getMapaEstaticoGoogle();"/> -->

    <section>
        <h3>Mapa estático</h3>
        <input type="button" value="Obtener mapa" disabled onClick = "viajes.getMapaEstaticoGoogle();"/>

    </section>

    <!--Mapa dinamico-->
    <section>
        <h3>Mapa dinámico</h3>
        <input type="button" value="Obtener mapa" disabled onClick = "viajes.initMapDinamico();"/>
            <div>
                <h4>Aquí se mostrará el mapa dinámico</h4>

            </div>
    </section>

    </main>

    
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBpjvnYhWbCL9HaKT239KRjgmAnf5_CEjU&loading=async"></script>
    <script>
        var viajes = new Viajes();

        viajes.configurarAccionesCarrusel();
    </script>

    <!-- <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU&callback=miMapa.initMap"></script> -->

</body>
</html>