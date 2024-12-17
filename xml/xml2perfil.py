#-------------------------------------------------------------------------------
# Programa que pasa archivo xml a un altimetria.svg mediante python
#-------------------------------------------------------------------------------
import xml.etree.ElementTree as ET

def generar_svg(archivoXML, archivoSVG, ancho=600, alto=300):

    infoTramosCircuito = []

    try:
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo xml a recorrer')
        exit()
    except ET.ParseError:
        print('Error procesando el archivo xml a recorrer')
        exit()

    raiz = arbol.getroot()
    ns = {'ns': 'http://www.uniovi.es'}


    for tramo in raiz.findall('.//ns:tramoActual', ns):
        try:
            distanciaTramo = tramo.find('.//ns:distanciaTramo', ns)
            distanciaTramoPars = float(distanciaTramo.text)
            punto_final = tramo.find('.//ns:puntoFinalTramo', ns)
            altitud = float(punto_final.attrib['altitud'])  #Obtengo la altitud, que es atributo del puntoFinal del tramo
            infoTramosCircuito.append((distanciaTramoPars, altitud))
        except (AttributeError, ValueError):
            print(f"Fallo al tratar los tramos del circuito.")

    with open(archivoSVG, 'w') as svg:  #Creo el .svg de altimetría
        svg.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
        svg.write(f'<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="{ancho}" height="{alto}">\n')  #2.0

        # Pongo un fondo azul, por estética más que nada
        svg.write(f'<rect width="{ancho}" height="{alto}" fill="lightblue" />\n')

        margen = 0.1
        XInicial = ancho * 0.08
        YInicial = alto * 0.9
        margenDeGrafica = 1.1  #Para hacer un poco de espacio y se vea mejor

        # Incremento del eje X
        distanciaTopePuntos = sum([tramoActual[0] for tramoActual in infoTramosCircuito]) * margenDeGrafica
        incEjeX = (ancho * 0.85) / (distanciaTopePuntos)

        # Incremento del eje Y
        altitudTope = max([tramoActual[1] for tramoActual in infoTramosCircuito]) * margenDeGrafica
        incEjeY = (alto * 0.85) / (altitudTope - 10) #asi hagoque empiece desde 10 el eje y

        puntosTramos = []
        xActual = XInicial

        # Creo de antemano los ejes de coordenadas, primero X y después Y
        svg.write(f'<line x1="{XInicial}" y1="{YInicial}" x2="{XInicial + (ancho * 0.85)}" y2="{YInicial}" stroke="black" stroke-width="1" />\n')
        svg.write(f'<line x1="{XInicial}" y1="{YInicial}" x2="{XInicial}" y2="{YInicial - (alto * 0.85)}" stroke="black" stroke-width="1" />\n')


        comprobacionFinalY = max(1, int((altitudTope - 10) / 5))
        # "Leyenda" del eje Y, comenzando desde 10
        for i in range(10, int(altitudTope) + 1, comprobacionFinalY):
            marcador = YInicial - (i - 10) * incEjeY  # Restamos 10 para ajustar a la nueva escala
            svg.write(f'<line x1="{XInicial - 5}" y1="{marcador}" x2="{XInicial}" y2="{marcador}" stroke="black" stroke-width="2"/>\n')
            svg.write(f'<text x="{XInicial - 30}" y="{marcador + 5}" font-size="8">{i} msnm</text>\n')

        comprobacionFinalX = max(1, int(distanciaTopePuntos / 10))
        # "Leyenda" del eje X
        for i in range(0, int(distanciaTopePuntos) + 1, comprobacionFinalX):
            marcador = XInicial + (i * incEjeX)
            svg.write(f'<line x1="{marcador}" y1="{YInicial}" x2="{marcador}" y2="{YInicial + 5}" stroke="black" stroke-width="3" />\n')
            svg.write(f'<text x="{marcador - 10}" y="{YInicial + 20}" font-size="12">{i} m</text>\n')


        # Recorrer los tramos y calcular la posición de cada punto
        for distanciaTramos, altitud in infoTramosCircuito:
            xPos = xActual + distanciaTramos * incEjeX
            yPos = YInicial - (altitud - 10) * incEjeY  #- 10 para ajustar al nuevo inicio del eje Y
            puntosTramos.append((xPos, yPos))

            xActual = xPos
            #puntos para hacerlo mas visual
            svg.write(f'<circle cx="{xPos}" cy="{yPos}" r="6" fill="red" />\n')

        #LOS PUNTOS DE LA GRAFICA
        acumPuntos = " " #string voy anadiendo
        acumPuntos = acumPuntos.join([f"{x},{y}" for x, y in puntosTramos])
        svg.write(f'<polyline points="{acumPuntos}" style="fill:none;stroke:red;stroke-width:4" />\n')


        svg.write('</svg>\n')

#-------------------------------------------------------------------------------
#Llamada al propio metodo con los archivos correspondientes
#
def main():
    generar_svg('circuitoEsquema.xml', 'perfil.svg', ancho=450, alto=225)  #ancho=600, alto=300

if __name__ == '__main__':
    main()