-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-10-2025 a las 04:40:44
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ratonamotors`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caracteristicas_vehiculo`
--

CREATE TABLE `caracteristicas_vehiculo` (
  `id_caracteristica` int(11) NOT NULL,
  `id_vehiculo` int(11) NOT NULL,
  `version` varchar(100) DEFAULT NULL,
  `num_puertas` int(11) DEFAULT NULL,
  `tipo_combustible` varchar(30) DEFAULT NULL,
  `motor` varchar(50) DEFAULT NULL,
  `transmision` varchar(30) DEFAULT NULL,
  `aire_acondicionado` tinyint(1) DEFAULT 0,
  `direccion` varchar(30) DEFAULT NULL,
  `control_traccion` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caracteristicas_vehiculo`
--

INSERT INTO `caracteristicas_vehiculo` (`id_caracteristica`, `id_vehiculo`, `version`, `num_puertas`, `tipo_combustible`, `motor`, `transmision`, `aire_acondicionado`, `direccion`, `control_traccion`) VALUES
(1, 1, '2.5 Intens', 5, 'Gasolina', '2.5', 'Automatica', 1, 'Hidraulica', '4x4'),
(2, 2, 'LT', 5, 'Gasolina', '1.4', 'Manual', 1, 'Electrica', '4x2'),
(3, 3, 'Grand Touring', 5, 'Gasolina', '2.5', 'Automatica', 1, 'Electrica', 'AWD'),
(4, 4, 'XEI', 4, 'Gasolina', '1.8', 'Automatica', 1, 'Hidraulica', '4x2'),
(5, 5, 'Exclusive', 5, 'Gasolina', '1.6', 'CVT', 1, 'Electrica', '4x2'),
(6, 6, '1.6 Sense', 5, 'Gasolina', '1.6', 'Manual', 1, 'Hidraulica', '4x2'),
(7, 7, 'EX 1.4', 5, 'Gasolina', '1.4', 'Automatica', 1, 'Electrica', '4x2'),
(8, 8, '', 4, 'Gasolina', '1.6', 'Manual', 1, 'Hidraulica', '4x2'),
(9, 9, '', 4, 'Gasolina', '1.6', 'Manual', 1, 'Hidraulica', '4x2'),
(10, 10, '', 4, 'Gasolina', '1.6', 'Manual', 1, 'Hidraulica', '4x2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `apellido`, `documento`, `telefono`, `email`, `direccion`, `fecha_registro`) VALUES
(1, 'Juan', 'Pérez', '1094567890', '3201234567', 'juan.perez@email.com', 'Calle 15 #20-30, Pereira', '2025-10-16 20:11:21'),
(2, 'Ana', 'Martínez', '1095678901', '3112345678', 'ana.martinez@email.com', 'Carrera 8 #12-45, Dosquebradas', '2025-10-16 20:11:21'),
(3, 'Luis', 'Torres', '1096789012', '3123456789', 'luis.torres@email.com', 'Avenida 30 de Agosto #50-20, Pereira', '2025-10-16 20:11:21'),
(4, 'Liliana Patricia', 'Ramirez Aguirre', '42111335', '3113383829', 'ramirezaguirrelilianapatricia@gmail.com', 'Manzana 21 Casa 25 Hacienda Cuba', '2025-10-26 05:15:23'),
(5, 'Albeiro', 'Muñoz', '1088826616', '3113383829', 'albeiro@gmail.com', 'Pereira', '2025-10-28 22:10:44'),
(6, 'Persival', 'Valorant', '42111443', '3239695886', 'persi@gmail.com', 'Dosquebradas', '2025-10-28 23:21:37'),
(7, 'Lucia', 'Martinez', '1088826617', '3234771735', 'luci@gmail.com', 'dosquebradas', '2025-10-29 03:35:36');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes_vehiculo`
--

CREATE TABLE `imagenes_vehiculo` (
  `id_imagen` int(11) NOT NULL,
  `id_vehiculo` int(11) NOT NULL,
  `url_imagen` varchar(500) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `es_principal` tinyint(1) DEFAULT 0,
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `imagenes_vehiculo`
--

INSERT INTO `imagenes_vehiculo` (`id_imagen`, `id_vehiculo`, `url_imagen`, `orden`, `es_principal`, `fecha_subida`) VALUES
(1, 1, 'koleos/koleos1.jpeg', 0, 1, '2025-10-26 23:26:13'),
(2, 1, 'koleos/koleos2.webp', 1, 0, '2025-10-26 23:26:13'),
(3, 1, 'koleos/koleos3.webp', 2, 0, '2025-10-26 23:26:13'),
(4, 2, 'spark/spark1.jpeg', 0, 1, '2025-10-26 23:55:18'),
(5, 2, 'spark/spark2.webp', 1, 0, '2025-10-26 23:55:18'),
(6, 2, 'spark/spark3.jpeg', 2, 0, '2025-10-26 23:55:18'),
(7, 3, 'cx-5/cx-5.jpg', 0, 1, '2025-10-27 01:06:48'),
(8, 3, 'cx-5/cx-51.webp', 1, 0, '2025-10-27 01:06:48'),
(9, 3, 'cx-5/cx52.webp', 2, 0, '2025-10-27 01:06:48'),
(10, 5, 'kicks/kicks1.jpg', 0, 1, '2025-10-27 01:11:42'),
(11, 5, 'kicks/kicks2.png', 1, 0, '2025-10-27 01:11:42'),
(12, 5, 'kicks/kicks3.webp', 2, 0, '2025-10-27 01:11:42'),
(13, 6, 'march/march1.webp', 0, 1, '2025-10-27 01:29:39'),
(14, 6, 'march/march2.webp', 1, 0, '2025-10-27 01:29:39'),
(15, 6, 'march/march3.jpeg', 2, 0, '2025-10-27 01:29:39'),
(16, 7, 'rio/rio1.jpeg', 0, 1, '2025-10-27 01:35:08'),
(17, 7, 'rio/rio2.jpg', 1, 0, '2025-10-27 01:35:08'),
(18, 7, 'rio/rio3.webp', 2, 0, '2025-10-27 01:35:08'),
(19, 8, '8_1761663344_0_logan2.jpeg', 0, 1, '2025-10-28 14:55:44'),
(20, 8, '8_1761663344_1_logan1.jpg', 0, 0, '2025-10-28 14:55:44'),
(21, 9, 'ford-fiesta-9/1761690691_0_ford1.webp', 0, 1, '2025-10-28 22:31:31'),
(22, 9, 'ford-fiesta-9/1761690691_1_ford2.webp', 0, 0, '2025-10-28 22:31:31'),
(23, 10, 'ford-fiesta-10/1761693492_0_fiesta.webp', 0, 1, '2025-10-28 23:18:12'),
(24, 10, 'ford-fiesta-10/1761693492_1_fiesta1.jpg', 0, 0, '2025-10-28 23:18:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pruebas_manejo`
--

CREATE TABLE `pruebas_manejo` (
  `id_prueba` int(11) NOT NULL,
  `id_vehiculo` int(11) NOT NULL,
  `id_cliente` int(11) DEFAULT NULL,
  `nombre_solicitante` varchar(100) DEFAULT NULL,
  `apellido_solicitante` varchar(100) DEFAULT NULL,
  `documento_solicitante` varchar(20) DEFAULT NULL,
  `telefono_solicitante` varchar(15) DEFAULT NULL,
  `email_solicitante` varchar(100) DEFAULT NULL,
  `fecha_prueba` date NOT NULL,
  `hora_prueba` time NOT NULL,
  `id_empleado_asignado` int(11) DEFAULT NULL,
  `estado` enum('pendiente','confirmada','completada','cancelada') DEFAULT 'pendiente',
  `observaciones` text DEFAULT NULL,
  `fecha_solicitud` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pruebas_manejo`
--

INSERT INTO `pruebas_manejo` (`id_prueba`, `id_vehiculo`, `id_cliente`, `nombre_solicitante`, `apellido_solicitante`, `documento_solicitante`, `telefono_solicitante`, `email_solicitante`, `fecha_prueba`, `hora_prueba`, `id_empleado_asignado`, `estado`, `observaciones`, `fecha_solicitud`) VALUES
(1, 7, NULL, 'Valeria', 'Muñoz', '1088826616', '3127564653', 'valmr0110@gmail.com', '2025-10-29', '11:30:00', 3, 'completada', '', '2025-10-28 13:29:26'),
(2, 5, NULL, 'Raul', 'Camacho', '1088312862', '3014560875', 'ramirezaguirrelilianapatricia@gmail.com', '2025-10-30', '10:32:00', NULL, 'pendiente', '', '2025-10-28 22:32:48'),
(3, 10, NULL, 'Juan Jose', 'Arango', '1057321742', '3113884421', 'juan.arango@gmail.com', '2025-10-29', '08:00:00', 3, 'confirmada', '', '2025-10-28 23:20:07'),
(4, 1, NULL, 'Luis', 'Muñoz', '4622698', '3113383829', 'luis@gmail.com', '2025-10-30', '11:34:00', NULL, 'pendiente', '', '2025-10-29 03:34:12');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('administrador','empleado') NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellido`, `email`, `password`, `rol`, `telefono`, `fecha_registro`, `activo`) VALUES
(1, 'Carlos', 'Ramírez', 'admin@ratonamotors.com', 'admin123', 'administrador', '3001234567', '2025-10-16 20:10:45', 1),
(2, 'María', 'González', 'maria@ratonamotors.com', 'empleado123', 'empleado', '3109876543', '2025-10-16 20:10:45', 1),
(3, 'Brayan', 'Cataño', 'brayancatano@gmail.com', '123456789', 'empleado', '3234771734', '2025-10-28 01:15:46', 1),
(4, 'Juan', 'Arango', 'arangojuan@gmail.com', 'minimo', 'empleado', '3113383829', '2025-10-28 01:24:47', 0),
(5, 'Luisa', 'Ramirez', 'lui@gmail.com', '123456', 'empleado', '3145677954', '2025-10-28 22:09:44', 1),
(7, 'Samanta', 'Rogriguez', 'sami@gmail.com', '678910', 'empleado', '249065950', '2025-10-28 23:26:41', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos`
--

CREATE TABLE `vehiculos` (
  `id_vehiculo` int(11) NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `año` int(11) NOT NULL,
  `color` varchar(40) NOT NULL,
  `precio` decimal(12,2) NOT NULL,
  `kilometraje` int(11) DEFAULT 0,
  `estado` enum('nuevo','usado') NOT NULL DEFAULT 'nuevo',
  `imagen_url` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `disponible` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vehiculos`
--

INSERT INTO `vehiculos` (`id_vehiculo`, `marca`, `modelo`, `año`, `color`, `precio`, `kilometraje`, `estado`, `imagen_url`, `fecha_registro`, `disponible`) VALUES
(1, 'Renault', 'Koleos', 2021, 'Blanco', 89500000.00, 0, 'nuevo', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500', '2025-10-16 20:12:17', 1),
(2, 'Chevrolet', 'Spark', 2023, 'Rojo', 45000000.00, 0, 'nuevo', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500', '2025-10-16 20:12:17', 1),
(3, 'Mazda', 'CX-5', 2022, 'Gris', 125000000.00, 0, 'nuevo', 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=500', '2025-10-16 20:12:17', 0),
(4, 'Toyota', 'Corolla', 2020, 'Negro', 65000000.00, 35000, 'usado', 'https://images.unsplash.com/photo-1623869675781-80aa31bbaa9e?w=500', '2025-10-16 20:12:17', 0),
(5, 'Nissan', 'Kicks', 2023, 'Azul', 78000000.00, 0, 'nuevo', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500', '2025-10-16 20:12:17', 1),
(6, 'Nissan', 'March', 2018, 'Gris', 38500000.00, 25000, 'usado', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', '2025-10-27 01:22:20', 1),
(7, 'Kia', 'Rio', 2020, 'Negro', 62500000.00, 15000, 'usado', 'https://images.unsplash.com/photo-1618844351225-44b3e3f1e3e4', '2025-10-27 01:23:26', 1),
(8, 'Renault', 'Logan', 2025, 'Gris', 60000000.00, 10000, 'usado', NULL, '2025-10-28 14:55:44', 1),
(9, 'Ford', 'Fiesta', 2020, 'Blanco', 59800000.00, 40000, 'usado', NULL, '2025-10-28 22:31:31', 1),
(10, 'Ford', 'Fiesta', 2024, 'Negro', 49900000.00, 25000, 'usado', NULL, '2025-10-28 23:18:12', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id_venta` int(11) NOT NULL,
  `id_vehiculo` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `precio_venta` decimal(12,2) NOT NULL,
  `forma_pago` enum('contado','financiado','tarjeta_credito','transferencia') NOT NULL,
  `fecha_venta` timestamp NOT NULL DEFAULT current_timestamp(),
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id_venta`, `id_vehiculo`, `id_cliente`, `id_usuario`, `precio_venta`, `forma_pago`, `fecha_venta`, `observaciones`) VALUES
(1, 4, 1, 2, 65000000.00, 'financiado', '2025-10-16 20:13:10', 'Venta con financiación a 48 meses'),
(2, 3, 2, 1, 125000000.00, '', '2025-10-28 01:31:26', ''),
(3, 10, 1, 1, 60000000.00, '', '2025-10-28 23:22:44', '');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `caracteristicas_vehiculo`
--
ALTER TABLE `caracteristicas_vehiculo`
  ADD PRIMARY KEY (`id_caracteristica`),
  ADD KEY `id_vehiculo` (`id_vehiculo`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- Indices de la tabla `imagenes_vehiculo`
--
ALTER TABLE `imagenes_vehiculo`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `id_vehiculo` (`id_vehiculo`);

--
-- Indices de la tabla `pruebas_manejo`
--
ALTER TABLE `pruebas_manejo`
  ADD PRIMARY KEY (`id_prueba`),
  ADD KEY `id_vehiculo` (`id_vehiculo`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_empleado_asignado` (`id_empleado_asignado`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  ADD PRIMARY KEY (`id_vehiculo`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id_venta`),
  ADD KEY `id_vehiculo` (`id_vehiculo`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caracteristicas_vehiculo`
--
ALTER TABLE `caracteristicas_vehiculo`
  MODIFY `id_caracteristica` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `imagenes_vehiculo`
--
ALTER TABLE `imagenes_vehiculo`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `pruebas_manejo`
--
ALTER TABLE `pruebas_manejo`
  MODIFY `id_prueba` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `vehiculos`
--
ALTER TABLE `vehiculos`
  MODIFY `id_vehiculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id_venta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `caracteristicas_vehiculo`
--
ALTER TABLE `caracteristicas_vehiculo`
  ADD CONSTRAINT `caracteristicas_vehiculo_ibfk_1` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `imagenes_vehiculo`
--
ALTER TABLE `imagenes_vehiculo`
  ADD CONSTRAINT `imagenes_vehiculo_ibfk_1` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pruebas_manejo`
--
ALTER TABLE `pruebas_manejo`
  ADD CONSTRAINT `pruebas_manejo_ibfk_1` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`),
  ADD CONSTRAINT `pruebas_manejo_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `pruebas_manejo_ibfk_3` FOREIGN KEY (`id_empleado_asignado`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_vehiculo`) REFERENCES `vehiculos` (`id_vehiculo`),
  ADD CONSTRAINT `ventas_ibfk_2` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  ADD CONSTRAINT `ventas_ibfk_3` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
