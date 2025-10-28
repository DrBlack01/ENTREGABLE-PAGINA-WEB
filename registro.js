document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.textContent = '';

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (localStorage.getItem(email)) {
            registerError.textContent = 'El correo electrónico ya está registrado.';
            return;
        }

        const user = { name, password };
        localStorage.setItem(email, JSON.stringify(user));

        alert('¡Registro Exitoso! Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
    });
});
