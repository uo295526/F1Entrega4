-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-12-2024 a las 20:02:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `records`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro`
--

CREATE TABLE `registro` (
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `nivel` double NOT NULL,
  `tiempo` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro`
--

INSERT INTO `registro` (`nombre`, `apellidos`, `nivel`, `tiempo`) VALUES
('Paco', 'Galaxias', 0.5, 12.273),
('Jose', 'Limo', 0.8, 0.371),
('Dalinar', 'Kholin', 0.5, 0.679),
('Kaladin', 'Muere', 0.8, 0.489),
('Szeth', 'Vallano', 0.2, 0.764),
('Shallan', 'Davar', 0.5, 0.27),
('Jasnah', 'Kholin', 0.5, 0.453),
('Roca', 'ComeCu', 0.5, 0.493),
('Chuso', 'Montero', 0.5, 0.134),
('Churro', 'Motero', 0.5, 0.298),
('Frigo', 'Adri', 0.2, 1.189),
('Yoel', 'Ramirez', 0.5, 0.407),
('El', 'Lopen', 0.8, 0.427),
('Eshonai', 'Pars', 0.2, 0.458),
('Venli', 'Pars', 0.2, 0.639),
('Pacum', 'Pacum', 0.5, 0.436),
('Heimer', 'Dinger', 0.5, 0.482),
('Altria', 'Caster', 0.8, 0.287),
('Oberon', 'Vortigern', 0.2, 0.413),
('Pepe', 'Roncino', 0.8, 0.447),
('Edward', 'Elric', 0.2, 0.372),
('Tomas', 'Roncero', 0.8, 0.387),
('Jordi', 'Wild', 0.8, 0.615),
('Fernando', 'Alonso', 0.2, 0.438),
('Eustaquio', 'Abichuela', 0.2, 1.099),
('John', 'Roblox', 0.2, 0.423),
('Lucas', 'Fortnite', 0.2, 0.428),
('Ilu', 'TV', 0.8, 0.397),
('Yo', 'Yoel', 0.2, 8.789),
('Jovani', 'Vazquez', 0.8, 0.099),
('Adolin', 'Kholin', 0.8, 0.582);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
