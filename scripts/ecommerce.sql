USE apctest

INSERT INTO categorias (categoria_id, datecreated, descripcion, nombre, status) VALUES
(1, '2025-04-06', 'Monitores de funciones vitales para uso clínico', 'Monitores', 1),
(2, '2025-04-06', 'Instrumentos para auscultación médica', 'Estetoscopios', 1),
(3, '2025-04-06', 'Medidores digitales y análogos de presión', 'Tensiómetros', 1),
(4, '2025-04-06', 'Camillas plegables y fijas para atención médica', 'Camillas', 1),
(5, '2025-04-06', 'Dispositivos para reanimación cardiopulmonar', 'Desfibriladores', 1);

INSERT INTO productos (producto_id, sku, datecreated, descripcion, imagen, nombre_producto, precio, status, stock, categoria_id, tipo) VALUES
(1, 'MON-001', '2025-04-06', 'Monitor multiparámetro de 10 pulgadas con pantalla LCD a color y múltiples funciones de monitoreo.', 'https://rymelectromedica.com/wp-content/uploads/2022/03/10-EDAN.png', 'Monitor Multiparámetro 10"', 1899.90, 1, 12, 1, 'producto'),
(2, 'EST-002', '2025-04-06', 'Estetoscopio de doble campana de alta precisión, ideal para uso clínico y hospitalario.', 'https://www.femmto.health/wp-content/uploads/2022/10/BK3006-1.png', 'Estetoscopio Doble Campana', 120.50, 1, 50, 2, 'producto'),
(3, 'TEN-003', '2025-04-06', 'Tensiómetro digital automático con brazalete ajustable de 22-45cm y memoria de usuario.', 'https://saludencasa.com/78879-large_default/tensiometro-digital-de-brazo-automatico-brazalete-22-45cm-con-memoria-pantalla-grande-blanco-ye660d-yuwell.jpg', 'Tensiómetro Digital YE660D', 249.99, 1, 30, 3, 'producto'),
(4, 'CAM-004', '2025-04-06', 'Camilla portátil de aluminio, tres secciones, ligera y plegable, ideal para emergencias.', 'https://hmmedical.pe/wp-content/uploads/2021/08/Camilla-Portatil-de-Aluminio-3-Secciones-TotalRecovery.png', 'Camilla Portátil 3 Secciones', 950.00, 1, 20, 4, 'producto'),
(5, 'DES-005', '2025-04-06', 'Desfibrilador externo automático SP1 con instrucciones de voz y fácil uso en emergencias.', 'https://auromed.pe/wp-content/uploads/2024/04/deacumedicalsp1.jpg', 'DEA CU Medical SP1', 3290.00, 1, 5, 5, 'producto');
(6, null, '2025-05-15', 'Descripcion servicio 1', null, 'Servicio 1', 500.00, null, null, null, 'servicio');
(7, null, '2025-05-15', 'Descripcion servicio 2', null, 'Servicio 2', 500.00, null, null, null, 'servicio');

INSERT INTO catalogo (catalogo_id, precio_oferta, producto_id) VALUES
(1, 1699.90, 1),
(2, 99.90, 2),
(3, 219.99, 3),
(4, 850.00, 4),
(5, 2990.00, 5);
