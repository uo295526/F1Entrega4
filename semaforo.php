<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1Desktop/Juegos</title>
    <link href="multimedia/imagenes/favicon.ico" rel="icon" >
    <meta name ="author" content="UO295526">
    <meta name ="description" content ="Juegos: Semaforo" />
    <meta name ="keywords" content ="HTML, CSS, JavaScript, PHP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" /> <!--asi asociamos mas hojas de estilo-->
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />

    <script src="js/semaforo.js"></script>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
</head>

<body>
    <header>        <!--No confundir con head. Head es parte intrinseca del html y header la seccion de arriba de la pagina-->
        <h1><a href="index.html" title="enlace al indice">F1Desktop</a></h1>
        <nav>
            <a href="index.html" title="enlace al indice">Index</a>  <!--importante el title por usabilidad-->
            <a href="piloto.html" title="enlace a la pagina del piloto">Piloto</a> <!--lo "activamos" pues es enlace a la propia pagina-->
            <a href="noticias.html" title="enlace a la pagina de noticias">Noticias</a>
            <a href="calendario.html" title="enlace a la pagina del calendario">Calendario</a>
            <a href="meteorologia.html" title="enlace a la pagina de meteorologia">Meteorologia</a>
            <a href="circuito.html" title="enlace a la pagina de circuito">Circuito</a>
            <a href="viajes.php" title="enlace a la pagina de viajes">Viajes</a>
            <a href="juegos.html" title="enlace a la pagina de juegos" class="active">Juegos</a>
        </nav>
        <!--este h1 y nav, al ser comun de todas las paginas, lo metemos en un header comun de todas-->
      </header>

    <?php
        class Record {
            protected $server;
            protected $user;
            protected $pass;
            protected $dbname;

            public function __construct(){
                $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->dbname = "records";
            }

            //metodo que una vez submitteado el cuestionario gestiona la informacion
            public function tratarForm(){
                //_POST para acceder a las variables en PHP pasadas al servidor
                $nombre = $_POST["nombre"]; //obtenemos los inputs en base al name enviados al servidor con POST
                $apellidos = $_POST["apellidos"];
                $nivel = $_POST["nivel"];
                $tiempo = $_POST["tiempo"];

                //establecemos la conexion con la bd en el servidor
                $dbConection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
                //preparamos la consulta a realizar (crear tabla registro) en la base de datos con mysqli
                $consultaInsertRegistro = "INSERT INTO registro (nombre, apellidos, nivel, tiempo) values (?, ?, ?, ?)";
                
                
                if($dbConection->connect_errno){
                    echo "Error de conexión: " . $dbConection->connect_error;
                }else{
                    //echo $dbConection->host_info . "\r\n";
                    //preparamos la consulta
                    $query = $dbConection->prepare($consultaInsertRegistro);
                    //etsablecemos los tipos de sus param
                    $query->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo); //le pasamos los params a la consulta
                            //los param: string, string, double, double

                    //ejecutamos la consulta
                    $query->execute();

                    //cerramos la consulta y la conexion
                    $query->close();
                    $dbConection->close();

                    //una vez almacenado se muestra el ranking
                    //$this->mostrarTopRecords(); 
                }
            }

            public function mostrarTopRecords(){
                //obtengo el nivel del intento en el semaforo, para luego hacer la consulta del ranking
                $nivel = $_POST["nivel"];

                //establecemos la conexion con la bd en el servidor
                $dbConection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
                //preparamos la consulta a realizar (crear tabla registro) en la base de datos con mysqli
                $consultaGetTopRegistros = "SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10"; //cojo los diez con mejor tiempo del nivel establecido

                //preparamos la consulta
                $query = $dbConection->prepare($consultaGetTopRegistros);
                //etsablecemos su param (solo el nivel, double)
                $query->bind_param("d", $nivel);

                $query->execute();

                //Al ser una consulta select, asi podemos ver lo obtenido por esta
                $topResultadosObtenidos = $query->get_result();

                $query->close();
                $dbConection->close();

                //Y ahora que tengo los resultados en $topResultadosObtenidos, los escribo en lista ordenada
                //Para escribir con php, se usa el echo

                //echo "<h4>Ranking del nivel de dificultad {$nivel} </h4>";

                echo "<section>";
                echo "<h4>Ranking del nivel de dificultad {$nivel} </h4>";
                echo "<ol>";
                //Recorro los resultados obtenidos y implemento cada uno como li
                while($actualResult = $topResultadosObtenidos->fetch_assoc()){ //voy obteniendo cada uno hasta agotar la lista(bucle)
                    echo "<li>Usuario: " . htmlspecialchars($actualResult['nombre']) . " " . htmlspecialchars($actualResult['apellidos']) . ". Tiempo: " . htmlspecialchars($actualResult['tiempo']) . "</li>";
                }
                echo "</ol>";
                echo "</section>";
            }

        }
    ?>



    <p>Estás en: <a href="index.html" title="enlace al indice">Inicio</a> >> <a href="juegos.html" title="enlace a pagina juegos">Juegos</a> >> Semaforo</p> <!--migas entre header y main, pues va a ser algo identico en el resto de html-->

    <section>
        <h2>Menú de juegos</h2>
        <nav>
            <a href="memoria.html" title="enlace al juego de memoria">Memoria</a>
            <a href="semaforo.php" title="enlace al juego de velocidad">Semáforo</a>
            <a href="api.html" title="enlace al juego de trivia">Trivia</a>
            <a href="php/libre.php" title="enlace al compendio de F1">Compendio</a>
        </nav>
    </section>

    <main>
        <h2>Juego de Semaforo</h2>

        <script>
            var juego = new Semaforo();
        </script>

        <section>
            <h3>Registro de datos de partida</h3>
            <p>Acaba tu partida para guardar tus registros y ver el Ranking de otros jugadores.</p>

            <?php
                if(count($_POST)>0){  //SE HA REALIZADO UNA PETICION (DADO AL BOTON DEL FORM)
                    $record = new Record();
                    $record->tratarForm();
                    $record->mostrarTopRecords();
                }
            ?>
        </section>
    </main>
    
</body>
</html>