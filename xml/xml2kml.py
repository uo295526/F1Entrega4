import xml.etree.ElementTree as ET


class Kml(object):
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self,nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        ET.SubElement(self.doc,'name').text = '\n' + nombre + '\n'
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls,'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls,'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls,'altitudeMode').text = '\n' + modoAltitud + '\n'

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = '\n' + color + '\n'
        ET.SubElement (linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self,nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def ver(self):
        """
        Muestra el archivo KML. Se utiliza para depurar
        """
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n')) #strip() elimina los '\n' del string
        else:
            print("Contenido = "    , self.raiz.text)

        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'): # Expresión XPath
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n')) #strip() elimina los '\n' del string
            else:
                print("Contenido = ", hijo.text)
            print("Atributos = ", hijo.attrib)

##Funcion que empleamos para recorrer nuestro arbol xml
def recorrerXML(archivoXML):
    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print ('No se encuentra el archivo xml a recorrer')
        exit()
    except ET.ParseError:
        print('Error procesando el archivo xml a recorrer')
        exit()

    ##Partimos de la raiz
    raiz = arbol.getroot()

    print("\nElemento raiz = ", raiz.tag)
    if raiz.text != None:
        print("Contenido = "    , raiz.text.strip('\n')) #strip() elimina los '\n' del string
    else:
        print("Contenido = "    , raiz.text)

    print("Atributos = "    , raiz.attrib)

    tramos = ""
    # Ahora recorremos el arbol una vez ya tratada la raiz para obtener la informacion que nos interesa
                                ##HAY QUE USAR EL NAMESPACE DEL XML
    #for hijo in raiz.findall('./{http://www.uniovi.es}circuito/{http://www.uniovi.es}tramos/{http://www.uniovi.es}tramo/*'): #Expresion XPath, obtenemos todos los tramos
    for hijoActual in raiz.findall('./{http://www.uniovi.es}circuito/{http://www.uniovi.es}puntosTramos/{http://www.uniovi.es}tramoActual/*'): #Expresion XPath, obtenemos todos los tramos
        #print(hijo.attrib.get("distancia"))
        print(hijoActual.attrib.get("distanciaTramo"))


def main():
    archivoXML = "circuitoEsquema.xml"

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print ('No se encuentra el archivo xml a recorrer')
        exit()
    except ET.ParseError:
        print('Error procesando el archivo xml a recorrer')
        exit()

    raiz = arbol.getroot()

    nombreKML = "circuito.kml"
    nuevoKML = Kml()

    for hijoActual in raiz.findall('./{http://www.uniovi.es}puntosTramos/{http://www.uniovi.es}tramoActual'):
        nombreTramo = hijoActual.get('nombreTramo')
        numTramo = hijoActual.find('./{http://www.uniovi.es}numSectorTramo').text #obtenemos el atributo distancia de cada tramo
        nombrePuntoFinalTramo = hijoActual.find('./{http://www.uniovi.es}puntoFinalTramo').get('nombrePuntoFinal')
        longitudTramo = float(hijoActual.find('./{http://www.uniovi.es}puntoFinalTramo').get('longitud'))
        latitudTramo = float(hijoActual.find('./{http://www.uniovi.es}puntoFinalTramo').get('latitud'))
        altitudTramo = float(hijoActual.find('./{http://www.uniovi.es}puntoFinalTramo').get('altitud'))

        nuevoKML.addPlacemark(numTramo,nombrePuntoFinalTramo,longitudTramo,latitudTramo,altitudTramo, 'relativeToGround')

    nuevoKML.ver()
    nuevoKML.escribir(nombreKML)

main()