document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const storage = firebase.storage();

    const form = document.getElementById('contenido-form');
    const formTitle = document.getElementById('form-title');

    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');

    let user = null;

    auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            user = firebaseUser;
            initForm();
        } else {
            alert('Debes iniciar sesión para crear contenido.');
            window.location.href = 'index.html';
        }
    });

    function initForm() {
        if (tipo === 'noticia') {
            formTitle.innerText = 'Crear Nueva Noticia';
        } else if (tipo === 'publicidad') {
            formTitle.innerText = 'Crear Nueva Publicidad';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const titulo = document.getElementById('titulo').value;
            const descripcion = document.getElementById('descripcion').value;
            const imagenFile = document.getElementById('imagen').files[0];

            if (!imagenFile) {
                alert('Por favor, sube una imagen.');
                return;
            }

            try {
                // 1. Subir la imagen a Firebase Storage
                const filePath = `/${tipo}/${user.uid}/${Date.now()}_${imagenFile.name}`;
                const fileRef = storage.ref(filePath);
                const snapshot = await fileRef.put(imagenFile);

                // 2. Obtener la URL de la imagen
                const imageUrl = await snapshot.ref.getDownloadURL();

                // 3. Guardar los datos en Firestore
                const collectionName = tipo === 'noticia' ? 'noticias' : 'publicidad';
                await db.collection(collectionName).add({
                    titulo,
                    descripcion,
                    imageUrl,
                    userId: user.uid,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                alert('¡Contenido creado con éxito!');
                window.location.href = 'cuenta.html';

            } catch (error) {
                console.error('Error al crear el contenido:', error);
                alert('Hubo un error al guardar. Por favor, inténtalo de nuevo.');
            }
        });
    }
});
