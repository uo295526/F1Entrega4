CREATE DATABASE IF NOT EXISTS compendioF1;

USE compendioF1;

DROP TABLE IF EXISTS GanadorCarrera;
DROP TABLE IF EXISTS Carrera;
DROP TABLE IF EXISTS Piloto;
DROP TABLE IF EXISTS Circuito;
DROP TABLE IF EXISTS Equipo;

CREATE TABLE Equipo(
    idEquipo INT PRIMARY KEY,
    nombreEquipo VARCHAR(50) NOT NULL,
    fundacion YEAR NOT NULL
);

CREATE TABLE Circuito(
    idCircuito INT PRIMARY KEY,
    nombreCircuito VARCHAR(50) NOT NULL,
    pais VARCHAR(30) NOT NULL,
    longitudKm DECIMAL(4, 2) NOT NULL,
    numTramos INT NOT NULL
);

CREATE TABLE Piloto(
    idPiloto INT PRIMARY KEY,
    nombrePiloto VARCHAR(50) NOT NULL,
    paisPiloto VARCHAR(25) NOT NULL,
    edad INT NOT NULL,
    idEquipo INT,
    FOREIGN KEY (idEquipo) REFERENCES Equipo(idEquipo)
);

CREATE TABLE Carrera(
    idCarrera INT PRIMARY KEY,
    nombreCarrera VARCHAR(50) NOT NULL,
    fechaCarrera DATE NOT NULL,
    numEntradasVendidas INT NOT NULL CHECK (numEntradasVendidas >= 0),
    idCircuito INT,
    FOREIGN KEY (idCircuito) REFERENCES Circuito(idCircuito)
);

CREATE TABLE GanadorCarrera(
    idResultado INT PRIMARY KEY,
    tiempoMinObtenido DECIMAL(6, 2) NOT NULL,
    idCarrera INT,
    idPiloto INT,
    UNIQUE (idCarrera),
    FOREIGN KEY (idCarrera) REFERENCES Carrera(idCarrera),
    FOREIGN KEY (idPiloto) REFERENCES Piloto(idPiloto)
);