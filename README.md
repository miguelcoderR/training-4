# PetCare Center

Bienvenido a **PetCare Center**, una aplicación de página única (SPA) diseñada para gestionar servicios de cuidado de mascotas. Construida con JavaScript puro y un enrutador liviano, PetCare Center ofrece una experiencia fluida y reactiva sin recargas completas de página.

---

## Tabla de contenido

- [Características](#características)  
- [Tecnologías](#tecnologías)  
- [Requisitos previos](#requisitos-previos)  
- [Instalación y puesta en marcha](#instalación-y-puesta-en-marcha)  
- [Estructura del proyecto](#estructura-del-proyecto)  
- [Rutas de la API](#rutas-de-la-api)  
- [Contribuir](#contribuir)  
- [Licencia](#licencia)  

---

## Características

- **Autenticación de usuarios**  
  Registro, inicio de sesión y cierre de sesión seguros.

- **Control de acceso por roles**  
  - **Clientes**: gestionan sus propias mascotas y solicitan estancias.  
  - **Trabajadores**: revisan todos los usuarios, mascotas y solicitudes de estancia.

- **Gestión de mascotas**  
  Clientes pueden crear, leer, actualizar y eliminar sus mascotas.  
  Trabajadores pueden ver y administrar todas las mascotas.

- **Gestión de estancias**  
  Clientes envían solicitudes de estancia.  
  Trabajadores revisan, aprueban o rechazan dichas solicitudes.

- **Enrutamiento cliente-side**  
  Navegación instantánea entre vistas usando un router basado en hash.

- **Backend simulado**  
  Interacción con una API RESTful ficticia manejada desde `main.js`.

---

## Tecnologías

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Router personalizado (hash-based)  
- Simulación de API REST  

---

## Requisitos previos

- Navegador moderno con soporte ES6+.  
- (Opcional) Node.js + npm para servidor local (`http-server`).

---

## Instalación y puesta en marcha

1. Clona el repositorio:  
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd petcare-center
