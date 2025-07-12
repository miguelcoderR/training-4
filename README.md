# PetCare Center

Welcome to PetCare Center, a single-page application (SPA) designed to manage pet care services. Built with vanilla JavaScript and a custom hash-based router, it delivers a smooth, reload-free experience.

---

## Table of Contents

- [Features](#features)  
- [Technology Stack](#technology-stack)  
- [Prerequisites](#prerequisites)  
- [Installation & Setup](#installation--setup)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **User Authentication**  
  Secure registration, login, and logout workflows.

- **Role-Based Access Control**  
  - Customers manage their own pets and submit stay requests.  
  - Workers view all users, manage every pet, and handle all stay requests.

- **Pet Management**  
  - Customers can add, view, edit, and delete their pets.  
  - Workers can view and maintain the entire pet roster.

- **Stay Management**  
  - Customers submit requests for pet stays.  
  - Workers review, approve, or reject stay requests.

- **Client-Side Routing**  
  Smooth navigation between views without a full page reload.

- **Simulated Backend**  
  All API interactions are abstracted in `main.js` to mimic RESTful calls.

---

## Technology Stack

- HTML5  
- CSS3  
- JavaScript (ES6+)  
- Custom hash-based router  
- Simulated RESTful API integration  

---

## Prerequisites

- A modern web browser with ES6+ support.  
- (Optional) Node.js and npm if you want to serve locally via `http-server`.

---

## Installation & Setup

1. Clone the repository and enter its directory:  
   ```bash
   git clone [REPOSITORY_URL]
   cd petcare-center
