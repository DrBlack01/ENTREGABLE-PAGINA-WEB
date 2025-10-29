document.addEventListener('DOMContentLoaded', () => {

    // --- Verificación de Firebase ---
    if (typeof firebase === 'undefined' || typeof firebase.auth === 'undefined') {
        console.error('Error: Firebase SDK no se ha cargado correctamente.');
        alert('Error crítico: La autenticación no puede funcionar. Revisa la consola para más detalles.');
        return;
    }

    // --- Inicialización ---
    const auth = firebase.auth();

    // --- Elementos del DOM ---
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const successContainer = document.getElementById('success-container');

    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const backToLoginButton = document.getElementById('back-to-login-button');

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');

    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // --- Lógica para cambiar de formularios ---
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            registerFormContainer.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            registerFormContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }

    if (backToLoginButton) {
        backToLoginButton.addEventListener('click', (e) => {
            e.preventDefault();
            successContainer.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }

    // --- Lógica de Registro ---
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            registerError.textContent = ''; // Limpiar errores previos

            const email = registerEmail.value;
            const password = registerPassword.value;

            auth.createUserWithEmailAndPassword(email, password)
                .then(userCredential => {
                    // Registro exitoso
                    registerForm.reset();
                    registerFormContainer.style.display = 'none';
                    successContainer.style.display = 'block';
                })
                .catch(error => {
                    // Manejo de errores de registro
                    if (error.code === 'auth/email-already-in-use') {
                        registerError.textContent = 'Este correo ya está en uso.';
                    } else if (error.code === 'auth/invalid-email') {
                        registerError.textContent = 'El formato del correo es inválido.';
                    } else if (error.code === 'auth/weak-password') {
                        registerError.textContent = 'La contraseña debe tener al menos 6 caracteres.';
                    } else {
                        registerError.textContent = 'Ocurrió un error inesperado.';
                        console.error('Error de registro:', error);
                    }
                });
        });
    }

    // --- Lógica de Inicio de Sesión ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginError.textContent = ''; // Limpiar errores previos

            const email = loginEmail.value;
            const password = loginPassword.value;

            auth.signInWithEmailAndPassword(email, password)
                .then(userCredential => {
                    // Login exitoso
                    alert('¡Bienvenido de nuevo!');
                    window.location.href = 'index.html'; // Redirigir a la página principal
                })
                .catch(error => {
                    // Manejo de errores de login
                    loginError.textContent = 'Correo o contraseña incorrectos.';
                    console.error('Error de inicio de sesión:', error);
                });
        });
    }
});
