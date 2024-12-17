<!DOCTYPE HTML>

<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1Desktop/Juegos/Compendio</title>
    <link href="../multimedia/imagenes/favicon.ico" rel="icon" >
    <meta name ="author" content="UO295526">
    <meta name ="description" content ="Compendio" />
    <meta name ="keywords" content ="HTML, CSS, JavaScript, PHP" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" /> 

    <link rel="stylesheet" type="text/css" href="../estilo/librePHP.css" /> 
</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>        <!--No confundir con head. Head es parte intrinseca del html y header la seccion de arriba de la pagina-->
      <h1><a href="index.html" title="enlace al indice">F1Desktop</a></h1>
      <nav>
          <a href="../index.html" title="enlace al indice">Index</a>  <!--importante el title por usabilidad-->
          <a href="../piloto.html" title="enlace a la pagina del piloto">Piloto</a> <!--lo "activamos" pues es enlace a la propia pagina-->
          <a href="../noticias.html" title="enlace a la pagina de noticias">Noticias</a>
          <a href="../calendario.html" title="enlace a la pagina del calendario">Calendario</a>
          <a href="../meteorologia.html" title="enlace a la pagina de meteorologia">Meteorologia</a>
          <a href="../circuito.html" title="enlace a la pagina de circuito">Circuito</a>
          <a href="../viajes.php" title="enlace a la pagina de viajes">Viajes</a>
          <a href="../juegos.html" title="enlace a la pagina de juegos" class="active">Juegos</a>
      </nav>
      <!--este h1 y nav, al ser comun de todas las paginas, lo metemos en un header comun de todas-->
    </header>


    <?php
        class infoF1Rankings{
            protected $server;
            protected $user;
            protected $pass;
            protected $dbname;

            public function __construct(){
                $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->dbname = "compendioF1";

            }

            //Primera opcion
            public function configurarBaseDatos(){
                $serverConection = new mysqli($this->server, $this->user, $this->pass); //, $this->dbname no pues primero tengo que crearla

                if($serverConection->connect_errno){
                    echo "Error de conexión: " . $serverConection->connect_error;
                }else{
                    //ya establecida la conexcion, trabajamos


                    $dbDataBaseCreation = file_get_contents("BBDD/bdLibre.sql"); //bdLibre.sql

                    $serverConection->multi_query($dbDataBaseCreation);
                    
                    $serverConection->close();

                    echo "Base de Datos inicilizada correctamente";
                }
            }

            //Segunda opcion
            public function cargaDatosDBDesdeCSV($archivoDatosCSV){
                $conection = new mysqli($this->server, $this->user, $this->pass, $this->dbname); 

                if($conection->connect_errno){
                    echo "Error de conexión: " . $conection->connect_error;
                }else{

                    $tablaActual = null;

                    $csv = fopen($archivoDatosCSV, "r");

                    //crao el array separando por lineas y delimitando por comas    se recorre hasta acabarlo
                    while (($linea = fgetcsv($csv, 0, ",")) !== false) {
                        
                        //no es un valor, si no el "flag" de la tabla sobre la que anadir. Se establece en la var y se continua sin hacer nada en la bd
                        //es el flag pues son las unicas lineas en tener un unico elemento
                        if (count($linea) === 1) {
                            $tablaActual = trim($linea[0]);
                            continue;
                        }
                        //caso de un valor, no un "flag" de tabla
                        switch ($tablaActual) {
                            case 'Equipo':
                                $consulta = "INSERT INTO Equipo (idEquipo, nombreEquipo, fundacion) VALUES (?, ?, ?)";
                                $consultaPrep = $conection->prepare($consulta);
                                $consultaPrep->bind_param("iss", $linea[0], $linea[1], $linea[2]);
                                break;
                
                            case 'Circuito':
                                $consulta = "INSERT INTO Circuito (idCircuito, nombreCircuito, pais, longitudKm, numTramos) VALUES (?, ?, ?, ?, ?)";
                                $consultaPrep = $conection->prepare($consulta);
                                $consultaPrep->bind_param("issdi", $linea[0], $linea[1], $linea[2], $linea[3], $linea[4]);
                                break;
                
                            case 'Piloto':
                                $consulta = "INSERT INTO Piloto (idPiloto, nombrePiloto, paisPiloto, edad, idEquipo) VALUES (?, ?, ?, ?, ?)";
                                $consultaPrep = $conection->prepare($consulta);
                                $consultaPrep->bind_param("issii", $linea[0], $linea[1], $linea[2], $linea[3], $linea[4]);
                                break;
                
                            case 'Carrera':
                                $consulta = "INSERT INTO Carrera (idCarrera, nombreCarrera, fechaCarrera, numEntradasVendidas, idCircuito) VALUES (?, ?, ?, ?, ?)";
                                $consultaPrep = $conection->prepare($consulta);
                                $consultaPrep->bind_param("issii", $linea[0], $linea[1], $linea[2], $linea[3], $linea[4]);
                                break;
                
                            case 'GanadorCarrera':
                                $consulta = "INSERT INTO GanadorCarrera (idResultado, tiempoMinObtenido, idCarrera, idPiloto) VALUES (?, ?, ?, ?)";
                                $consultaPrep = $conection->prepare($consulta);
                                $consultaPrep->bind_param("idii", $linea[0], $linea[1], $linea[2], $linea[3]);
                                break;
                        }
                
                        // Ejecutar la consulta preparada
                        if (!$consultaPrep->execute()) {
                            echo "Error al insertar en $tablaActual: " . $consultaPrep->error;
                        }
                        $consultaPrep->close(); // Cerrar el statement después de cada ejecución
                    }
                
                    fclose($csv); // Cerrar el archivo CSV
                    $conection->close(); // Cerrar la conexión
                    echo "Datos importados correctamente.";
                }
            }

            //Tercera opcion
            public function exportarACSV(){
                $conection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                if ($conection->connect_errno) {
                    echo "Error de conexión: " . $conection->connect_error;
                }else{
                    // Nombre del archivo a exportar
                    $archivoExportarCSV = "datosExportados.csv";
                    $csv = fopen($archivoExportarCSV, "w");

                    $listadoTablas = ["Equipo", "Circuito", "Piloto", "Carrera", "GanadorCarrera"];

                    foreach ($listadoTablas as $tabla) {
                        // Escribir un encabezado para cada tabla
                        fwrite($csv, "$tabla\n");

                        // Obtener y escribir los datos de la tabla
                        $resultDatos = $conection->query("SELECT * FROM $tabla");
                        while ($fila = $resultDatos->fetch_assoc()) {
                            fputcsv($csv, $fila);
                        }

                        // Línea en blanco como separación entre tablas
                        fwrite($csv, "\n");
                    }

                    fclose($csv);
                }

                $conection->close();

                echo "Datos exportados correctamente a $archivoExportarCSV.";
            }


            //MEtodos del compendio, no de bd
            public function obtenerPilotosConMasVictorias() {
                $conection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                if ($conection->connect_errno) {
                    echo "Error de conexión: " . $conection->connect_error;
                }else{
                    $consulta = "SELECT p.nombrePiloto, COUNT(gc.idResultado) AS victorias FROM Piloto p JOIN GanadorCarrera gc ON p.idPiloto = gc.idPiloto
                    GROUP BY p.idPiloto ORDER BY victorias DESC LIMIT 3";

                    $resultadoConsulta = $conection->query($consulta);
                    echo "<h4>Podio de pilotos con más victorias</h4>";
                    echo "<ol>";
                    while ($actual = $resultadoConsulta->fetch_assoc()) {
                        echo "<li>".$actual['nombrePiloto']." -> ". $actual['victorias'] ." victorias</li>";
                    }
                    echo "</ol>";
                }

                $conection->close();
            }

            public function obtenerCarrerasConMasEntradasVendidas() {
                $conection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                if ($conection->connect_errno) {
                    echo "Error de conexión: " . $conection->connect_error;
                }else{
                    $consulta = "SELECT nombreCarrera, fechaCarrera, numEntradasVendidas FROM Carrera ORDER BY numEntradasVendidas DESC LIMIT 5 ";

                    $resultadoConsulta = $conection->query($consulta);
                    echo "<h4>Las carreras registradas con más entradas vendidas</h4>";
                    echo "<ol>";
                    while ($actual = $resultadoConsulta->fetch_assoc()) {
                        echo "<li>".$actual['nombreCarrera']. " (" .$actual['fechaCarrera'] . ") ". " -> ".$actual['numEntradasVendidas']." entradas vendidas</li>";
                    }
                    echo "</ol>";
                }

                $conection->close();
            }

            public function obtenerVictoriasPorPiloto($nombrePiloto) {
                $conection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

                if ($conection->connect_errno) {
                    echo "Error de conexión: " . $conection->connect_error;
                }else{
                    $consulta = "SELECT c.nombreCarrera, c.fechaCarrera FROM Carrera c JOIN GanadorCarrera gc ON c.idCarrera = gc.idCarrera JOIN Piloto p ON gc.idPiloto = p.idPiloto WHERE p.nombrePiloto = ?";

                    $consultaPrep = $conection->prepare($consulta);
                    $consultaPrep->bind_param("s", $nombrePiloto);
                    $consultaPrep->execute();
                    $resultadoConsulta = $consultaPrep->get_result();

                    if ($resultadoConsulta->num_rows > 0) {
                        echo "<h4>Victorias de $nombrePiloto</h4>";
                        echo "<ul>";
                        while ($actual = $resultadoConsulta->fetch_assoc()) {
                            echo "<li>".$actual['nombreCarrera']." - ".$actual['fechaCarrera']."</li>";
                        }
                        echo "</ul>";
                    } else {
                        echo "<h4>No se encontró al piloto ".$nombrePiloto." o no tiene victorias registradas</h4>";
                    }

                    $consultaPrep->close();
                }
                $conection->close();
            }

            public function mostrarCircuitosMayorLongitud() {
                $conection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            
                if ($conection->connect_errno) {
                    echo "Error de conexión: ". $conection->connect_error;
                } else {
                    // Consulta para obtener los circuitos con mayor longitud, ordenados de mayor a menor
                    $consulta = "SELECT nombreCircuito, numTramos, longitudKm FROM Circuito ORDER BY longitudKm DESC LIMIT 5";
            
                    $resultadoConsulta = $conection->query($consulta);
            
                    if ($resultadoConsulta->num_rows > 0) {
                        echo "<h4>Circuitos con mayor longitud</h4>";
                        echo "<ul>";
                        while ($actual = $resultadoConsulta->fetch_assoc()) {
                            echo "<li>".htmlspecialchars($actual['nombreCircuito']).", de ".$actual['longitudKm']." km, con ".$actual['numTramos']." tramos</li>";
                        }
                        echo "</ul>";
                    } else {
                        echo "No se encontraron circuitos.";
                    }
            
                    $conection->close();
                }
            }
         }
    ?>

    <p>Estás en: <a href="../index.html" title="enlace al indice">Inicio</a> >> <a href="../juegos.html" title="enlace a pagina juegos">Juegos</a> >> Compendio</p>

    <main>
        <section>
            <h2>Menú de juegos</h2>
            <nav>
                <a href="../memoria.html" title="enlace al juego de memoria">Memoria</a>
                <a href="../semaforo.php" title="enlace al juego de velocidad">Semáforo</a>
                <a href="../api.html" title="enlace al juego de trivia">Trivia</a>
                <a href="libre.php" title="enlace al compendio de F1">Compendio</a>
            </nav>
        </section>

        <h2>Compendio actualizado de la F1</h2>
        
        <section>
            <h3>Acciones de la base de datos</h3>
            <form action="#" method="post" enctype="multipart/form-data">
                <button type="submit" name="inicializarBD">Inicializar Base de Datos</button>
                <label>Seleccionar CSV que importar: <input type="file" name="archivoCSV" accept=".csv"></label>
                <button type="submit" name="cargarDesdeCSV">Importar CSV seleccionado</button>
                <button type="submit" name="exportarCSV">Exportar datos a CSV</button>
            </form> 
        </section>

        <section>
            <h3>Acceder al Compendio de F1</h3>

            <form action="#" method="post">
                <label>Nombre y Apellido del Piloto: <input type="text"name="nombrePiloto"></label>
                <button type="submit" name="buscarVictorias">Buscar victorias del piloto</button>
                <button type="submit" name="pilotosMasVictorias">Ver el Podio de pilotos con más victorias</button>
                <button type="submit" name="carrerasMasEntradas">Ver las carreras con más entradas vendidas</button>
                <button type="submit" name="circuitosMayorLongitud">Ver circuitos de mayor longitud</button>
            </form>
        </section>


        <?php
            $infoF1 = new infoF1Rankings();
            
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                if (isset($_POST['inicializarBD'])) {
                    $infoF1->configurarBaseDatos();
                }
            
                if (isset($_POST['cargarDesdeCSV']) && isset($_FILES['archivoCSV'])) {
                    if ($_FILES['archivoCSV']['error'] === UPLOAD_ERR_OK){
                        $rutaArchivo = $_FILES['archivoCSV']['tmp_name'];
                        $infoF1->cargaDatosDBDesdeCSV($rutaArchivo);
                    }else{
                        echo "Debes seleccionar un archivo del que importar antes";
                    }
                }
            
                if (isset($_POST['exportarCSV'])) {
                    $infoF1->exportarACSV();
                }

                //Del compendio

                if (isset($_POST['pilotosMasVictorias'])) {
                    $infoF1->obtenerPilotosConMasVictorias();
                }

                if (isset($_POST['carrerasMasEntradas'])) {
                    $infoF1->obtenerCarrerasConMasEntradasVendidas();
                }

                if (isset($_POST['buscarVictorias']) && !empty($_POST['nombrePiloto'])) {
                    $nombrePiloto = $_POST['nombrePiloto'];
                    $infoF1->obtenerVictoriasPorPiloto($nombrePiloto);
                }

                if (isset($_POST['circuitosMayorLongitud'])) {
                    $infoF1->mostrarCircuitosMayorLongitud();
                }
            }
        ?>

    </main>

</body>
</html>