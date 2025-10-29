document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerError = document.getElementById('registerError');
    const auth = firebase.auth();

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        registerError.textContent = '';

        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Una vez creado el usuario, actualizamos su perfil para añadir el nombre
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                // Perfil actualizado, ahora redirigimos
                alert('¡Registro Exitoso! Serás redirigido a la página principal.');
                window.location.href = 'index.html';
            })
            .catch((error) => {
                // Manejo de errores
                console.error("Error en el registro:", error);
                registerError.textContent = error.message;
            });
    });
});
