document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const form = document.getElementById('contenido-form');
    const formTitle = document.getElementById('form-title');
    const submitButton = form.querySelector('button[type="submit"]');
    
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo');
    const docId = urlParams.get('id'); // ID del documento a editar

    // UID de la cuenta de Administrador para la validación
    const adminUid = 'RT88Noyp1VdyMheyh4VOcTUWhqA2';
    let user = null;

    auth.onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            user = firebaseUser;
            initForm();
        } else {
            alert('Debes iniciar sesión para realizar esta acción.');
            window.location.href = 'index.html';
        }
    });

    async function initForm() {
        const collectionName = tipo === 'noticia' ? 'noticias' : 'publicidad';

        if (docId) {
            // --- MODO EDICIÓN ---
            formTitle.innerText = `Editar ${tipo === 'noticia' ? 'Noticia' : 'Publicidad'}`;
            submitButton.innerText = 'Actualizar';

            try {
                const docRef = db.collection(collectionName).doc(docId);
                const doc = await docRef.get();

                if (doc.exists) {
                    const data = doc.data();
                    const isOwner = data.userId === user.uid;
                    const isAdmin = user.uid === adminUid;

                    if (!isOwner && !isAdmin) {
                        alert('No tienes permiso para editar este contenido.');
                        window.location.href = 'cuenta.html';
                        return;
                    }
                    document.getElementById('titulo').value = data.titulo;
                    document.getElementById('descripcion').value = data.descripcion;
                    document.getElementById('imagenUrl').value = data.imageUrl;
                    document.getElementById('ctaTexto').value = data.ctaTexto || '';
                    document.getElementById('ctaUrl').value = data.ctaUrl || '';
                } else {
                    alert('El contenido que intentas editar no existe.');
                    window.location.href = 'cuenta.html';
                }
            } catch (error) {
                console.error('Error al cargar los datos para editar:', error);
                alert('No se pudieron cargar los datos para la edición.');
            }

        } else {
            // --- MODO CREACIÓN ---
            formTitle.innerText = `Crear Nueva ${tipo === 'noticia' ? 'Noticia' : 'Publicidad'}`;
            submitButton.innerText = 'Guardar';
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            submitButton.disabled = true;
            submitButton.innerText = docId ? 'Actualizando...' : 'Guardando...';

            const titulo = document.getElementById('titulo').value;
            const descripcion = document.getElementById('descripcion').value;
            const imageUrl = document.getElementById('imagenUrl').value;
            const ctaTexto = document.getElementById('ctaTexto').value;
            const ctaUrl = document.getElementById('ctaUrl').value;

            const data = {
                titulo,
                descripcion,
                imageUrl,
                ctaTexto,
                ctaUrl,
                userId: user.uid,
            };

            try {
                if (docId) {
                    await db.collection(collectionName).doc(docId).update(data);
                    alert('¡Contenido actualizado con éxito!');
                } else {
                    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    await db.collection(collectionName).add(data);
                    alert('¡Contenido creado con éxito!');
                }
                window.location.href = 'cuenta.html';

            } catch (error) {
                console.error('Error al guardar el contenido:', error);
                alert('Hubo un error al guardar. Por favor, inténtalo de nuevo.');
                submitButton.disabled = false;
                submitButton.innerText = docId ? 'Actualizar' : 'Guardar';
            }
        });
    }
});
