document.addEventListener('DOMContentLoaded', () => {
    const loginFormContainer = document.getElementById('loginFormContainer');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const successMessage = document.getElementById('successMessage');

    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const backToLogin = document.getElementById('backToLogin');

    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const loginEmail = document.getElementById('loginEmail');
    const rememberMe = document.getElementById('rememberMe');

    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    // --- Cambiar entre formularios ---
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
        loginError.textContent = '';
        registerError.textContent = '';
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
        loginError.textContent = '';
        registerError.textContent = '';
    });

    backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        successMessage.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // --- Recordar usuario ---
    if (localStorage.getItem('rememberedEmail')) {
        loginEmail.value = localStorage.getItem('rememberedEmail');
        rememberMe.checked = true;
    }

    // --- Registro ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.textContent = '';

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();

        if (!name || !email || !password) {
            registerError.textContent = 'Por favor, completa todos los campos.';
            return;
        }

        const users = JSON.parse(localStorage.getItem('users') || '{}');

        if (users[email]) {
            registerError.textContent = 'El correo electrónico ya está registrado.';
            return;
        }

        users[email] = { name, password };
        localStorage.setItem('users', JSON.stringify(users));

        registerForm.reset();
        registerFormContainer.style.display = 'none';
        successMessage.style.display = 'block';
    });

    // --- Login ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        loginError.textContent = '';

        const email = loginEmail.value.trim();
        const password = document.getElementById('loginPassword').value.trim();

        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[email];

        if (!user || user.password !== password) {
            loginError.textContent = 'El correo electrónico o la contraseña son incorrectos.';
            return;
        }

        if (rememberMe.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        alert(`¡Bienvenido, ${user.name}!`);
        window.location.href = 'index.html'; // redirige a la página principal
    });
});
