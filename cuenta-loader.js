
document.addEventListener('DOMContentLoaded', () => {
    const auth = firebase.auth();
    const db = firebase.firestore();

    const noticiasContainer = document.getElementById('user-noticias-container');
    const publicidadContainer = document.getElementById('user-publicidad-container');
    
    // UID de la cuenta de Administrador
    const adminUid = 'RT88Noyp1VdyMheyh4VOcTUWhqA2';

    auth.onAuthStateChanged(user => {
        if (user) {
            // El usuario es admin si su UID coincide
            const isAdmin = user.uid === adminUid;
            loadUserContent('noticias', noticiasContainer, user, isAdmin);
            loadUserContent('publicidad', publicidadContainer, user, isAdmin);
        } else {
            console.log("Usuario no autenticado, redirigiendo...");
            window.location.href = 'index.html';
        }
    });

    function loadUserContent(collectionName, container, user, isAdmin) {
        if (!container) return;

        // Si es admin, carga todo el contenido. Si no, solo el del usuario.
        let query = isAdmin ? db.collection(collectionName) : db.collection(collectionName).where("userId", "==", user.uid);

        query.get()
            .then(querySnapshot => {
                if (querySnapshot.empty) {
                    container.innerHTML = `<p class="text-light col-12">No hay contenido de este tipo para mostrar.</p>`;
                    return;
                }

                let contentHtml = '';
                querySnapshot.forEach(doc => {
                    const item = doc.data();
                    const itemId = doc.id;

                    const titulo = item.titulo || 'Título no disponible';
                    const descripcion = item.descripcion || '';
                    const imageUrl = item.imageUrl || 'img/placeholder.svg';
                    const fecha = item.createdAt && item.createdAt.seconds ? 
                                  new Date(item.createdAt.seconds * 1000).toLocaleDateString() : 'Fecha no disponible';
                    const tipoSingular = collectionName.slice(0, -1);

                    // El botón de editar solo aparece en el contenido propio (o si eres admin)
                    const canEdit = item.userId === user.uid || isAdmin;

                    const card = `
                        <div class="col-md-4 mb-4" id="card-${itemId}">
                            <div class="card card-noticia h-100 shadow-sm">
                                <img src="${imageUrl}" class="card-img-top" alt="${titulo}">
                                <div class="card-body d-flex flex-column">
                                    <h6 class="card-title"><span class="text-newsletter">${titulo}</span></h6>
                                    <p class="card-text text-newsletter flex-grow-1">${descripcion.substring(0, 100)}...</p>
                                    <p class="card-text"><small class="text-newsletter">${fecha}</small></p>
                                    <div class="mt-auto">
                                        ${canEdit ? `<a href="crear-contenido.html?tipo=${tipoSingular}&id=${itemId}" class="btn btn-secondary btn-sm">Editar</a>` : ''}
                                        ${isAdmin ? `<button class="btn btn-danger btn-sm ms-2" data-collection="${collectionName}" data-id="${itemId}">Eliminar</button>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    contentHtml += card;
                });
                container.innerHTML = contentHtml;
                
                // Añadir listeners a los botones de eliminar después de crear el HTML
                if (isAdmin) {
                    addDeleteButtonListeners(container);
                }
            })
            .catch(error => {
                console.error(`Error al cargar ${collectionName}: `, error);
                container.innerHTML = `<p class="text-danger col-12">No se pudo cargar el contenido. Revisa las reglas de Firestore y los índices.</p>`;
            });
    }

    function addDeleteButtonListeners(container) {
        container.querySelectorAll('.btn-danger').forEach(button => {
            button.addEventListener('click', (e) => {
                const docId = e.target.dataset.id;
                const collection = e.target.dataset.collection;
                
                if (confirm('¿Estás seguro de que quieres eliminar este contenido permanentemente?')) {
                    deleteContent(collection, docId);
                }
            });
        });
    }

    function deleteContent(collection, docId) {
        db.collection(collection).doc(docId).delete()
            .then(() => {
                console.log("Documento eliminado con éxito");
                // Eliminar la tarjeta de la vista
                const cardElement = document.getElementById(`card-${docId}`);
                if (cardElement) {
                    cardElement.remove();
                }
            })
            .catch(error => {
                console.error("Error al eliminar el documento: ", error);
                alert('No se pudo eliminar el contenido.');
            });
    }
});
