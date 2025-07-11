export const landingView = `
  <section class="landing-page">
    <h1>Bienvenidos al Centro de Cuidado de Mascotas</h1>
    <p>El mejor lugar para dejar a tu mejor amigo.</p>
    <div class="landing-actions">
      <a href="#login" class="btn btn-primary">Iniciar Sesión</a>
      <a href="#register" class="btn btn-secondary">Registrarse</a>
    </div>
  </section>
`;

export const loginView = `
  <section class="auth-form">
    <h2>Iniciar Sesión</h2>
    <form id="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" required>
      </div>
      <button type="submit" class="btn btn-success">Entrar</button>
    </form>
    <p class="auth-switch">¿No tienes cuenta? <a href="#register">Regístrate aquí</a></p>
  </section>
`;

export const registerView = `
  <section class="auth-form">
    <h2>Registro</h2>
    <form id="register-form">
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" required>
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" required>
      </div>
      <button type="submit" class="btn btn-success">Crear Cuenta</button>
    </form>
    <p class="auth-switch">¿Ya tienes cuenta? <a href="#login">Inicia sesión</a></p>
  </section>
`;

export const notFoundView = `
  <section class="not-found">
    <h2>404</h2>
    <h3>Página No Encontrada</h3>
    <p>Lo sentimos, la página que buscas no existe.</p>
    <a href="#/" class="btn btn-primary">Volver al Inicio</a>
  </section>
`;

export const dashboardView = (user) => {
  if (user.rolId === 'worker') {
    return `
      <section class="dashboard-worker">
        <h2>Dashboard del Trabajador</h2>
        <p>Bienvenido, ${user.nombre}.</p>
        <div id="worker-content">
          <h3>Gestión de Mascotas</h3>
          <p>Aquí se mostrarán todas las mascotas del sistema.</p>
          <button id="logout-btn" class="btn btn-danger">Cerrar Sesión</button>
        </div>
      </section>
    `;
  } else if (user.rolId === 'customer') {
    return `
      <section class="dashboard-customer">
        <h2>Dashboard del Cliente</h2>
        <p>Bienvenido, ${user.nombre}.</p>
        <div id="customer-content">
          <h3>Mis Mascotas</h3>
          <p>Aquí se mostrarán las mascotas de ${user.nombre}.</p>
          <button id="add-pet-btn" class="btn btn-primary">Añadir Mascota</button>
          <button id="logout-btn" class="btn btn-danger">Cerrar Sesión</button>
        </div>
      </section>
    `;
  }
};