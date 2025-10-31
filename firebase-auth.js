// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkxlqUp62T9Wk0akvB2tId0lNDqrYkn7Y",
  authDomain: "login-auth-e4264.firebaseapp.com",
  projectId: "login-auth-e4264",
  storageBucket: "login-auth-e4264.appspot.com",
  messagingSenderId: "145501257905",
  appId: "1:145501257905:web:26824409dca17ff311e290",
  measurementId: "G-7QYX8DXFHR"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const loginForm = document.getElementById('login-form');
const loginItem = document.getElementById('login-item');
const userMenu = document.getElementById('user-menu');
const userInitialIcon = document.getElementById('user-initial-icon');
const logoutButton = document.getElementById('logout-button');
const userEmailSpan = document.getElementById('user-email');

auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in.
    loginItem.style.display = 'none';
    userMenu.style.display = 'block';

    db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists && doc.data().nombre) {
            userInitialIcon.innerText = doc.data().nombre.charAt(0).toUpperCase();
        } else {
            userInitialIcon.innerText = user.email.charAt(0).toUpperCase();
        }
    });

    if(userEmailSpan) {
      userEmailSpan.innerText = user.email;
    }
  } else {
    // User is signed out.
    loginItem.style.display = 'block';
    userMenu.style.display = 'none';
    if(userEmailSpan) {
      userEmailSpan.innerText = "";
    }
  }
});

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
    
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
    
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
          modal.hide();
          alert('¡Has iniciado sesión con éxito!');
        })
        .catch((error) => {
          let message = "Ocurrió un error al iniciar sesión.";
          if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            message = "El correo o la contraseña son incorrectos.";
          } else if (error.code === 'auth/invalid-email') {
            message = "El formato del correo electrónico no es válido.";
          }
          alert(message);
        });
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      auth.signOut().then(() => {
        alert('Has cerrado la sesión.');
      });
    });
}
