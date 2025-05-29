const authForm = document.getElementById('auth-form');
const authContainer = document.getElementById('auth-container');
const formTitle = document.getElementById('form-title');
const switchText = document.querySelector('.switch');

const ocrInput = document.getElementById("image-input");
const ocrResult = document.getElementById("ocr-result");
const ocrStatus = document.getElementById("ocr-status");

const ocrPage = document.getElementById('ocr-page');
const logoutBtn = document.getElementById('logout-btn');

let isLogin = true;
const users = {};

function renderForm() {
  if (isLogin) {
    formTitle.textContent = 'Login';
    authForm.innerHTML = `
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Login</button>
      <button type="button" class="social-btn facebook">Sign in with Facebook</button>
      <button type="button" class="social-btn google">Sign in with Google</button>
    `;
    switchText.innerHTML = `Don't have an account? <a href="#" onclick="toggleForm(event)">Sign Up</a>`;
  } else {
    formTitle.textContent = 'Sign Up';
    authForm.innerHTML = `
      <input type="text" id="name" placeholder="Full Name" required />
      <input type="email" id="email" placeholder="Email" required />
      <input type="password" id="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    `;
    switchText.innerHTML = `Already have an account? <a href="#" onclick="toggleForm(event)">Login</a>`;
  }

  // Reattach listeners to new social buttons
  document.querySelector('.social-btn.google')?.addEventListener('click', onGoogleSignIn);
  document.querySelector('.social-btn.facebook')?.addEventListener('click', onFacebookSignIn);
}

function toggleForm(event) {
  event.preventDefault();
  isLogin = !isLogin;
  renderForm();
}

authForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value.trim();
  const name = document.getElementById('name')?.value.trim();

  if (isLogin) {
    if (users[email] && users[email] === password) {
      authContainer.style.display = 'none';
      ocrPage.style.display = 'block';
      ocrResult.value = '';
      ocrStatus.textContent = 'Upload an image to extract text.';
    } else {
      alert("Incorrect email or password, or you haven't signed up yet.");
    }
  } else {
    if (users[email]) {
      alert("This email is already registered.");
    } else {
      users[email] = password;
      alert(`Signed up successfully as ${name}. Please log in now.`);
      isLogin = true;
      renderForm();
    }
  }
});

logoutBtn.addEventListener('click', () => {
  ocrPage.style.display = 'none';
  authContainer.style.display = 'block';
  isLogin = true;
  renderForm();
  ocrResult.value = '';
  ocrStatus.textContent = 'Upload an image to extract text.';
});

ocrInput.addEventListener("change", function () {
  const file = ocrInput.files[0];
  if (!file) return;

  ocrStatus.textContent = "Processing image...";

  Tesseract.recognize(file, 'eng', {
    logger: m => {
      if (m.status === 'recognizing text') {
        ocrStatus.textContent = `Progress: ${Math.floor(m.progress * 100)}%`;
      }
    }
  }).then(({ data: { text } }) => {
    ocrResult.value = text;
    ocrStatus.textContent = "Text extraction complete.";
  }).catch(error => {
    console.error(error);
    ocrStatus.textContent = "Failed to extract text.";
  });
});

// ---- GOOGLE SIGN IN ----
function onGoogleSignIn() {
  google.accounts.id.initialize({
    client_id: '873463258384-sdccq6jbbheqask870sn3vid6cai46mt.apps.googleusercontent.com',
    callback: handleGoogleCredentialResponse,
  });

  google.accounts.id.prompt();
}

function handleGoogleCredentialResponse(response) {
  console.log('Encoded JWT ID token: ' + response.credential);
  authContainer.style.display = 'none';
  ocrPage.style.display = 'block';
  ocrResult.value = '';
  ocrStatus.textContent = 'Upload an image to extract text.';
}

// ---- FACEBOOK SIGN IN ----
function onFacebookSignIn() {
  FB.login(response => {
    if (response.authResponse) {
      FB.api('/me', { fields: 'name,email' }, userInfo => {
        console.log('Good to see you, ' + userInfo.name + '.');
        authContainer.style.display = 'none';
        ocrPage.style.display = 'block';
        ocrResult.value = '';
        ocrStatus.textContent = 'Upload an image to extract text.';
      });
    } else {
      console.log('User cancelled Facebook login.');
    }
  }, { scope: 'email' });
}

window.fbAsyncInit = function () {
  FB.init({
    appId: 'YOUR_FACEBOOK_APP_ID',
    cookie: true,
    xfbml: false,
    version: 'v17.0'
  });
};

// Initial form render
renderForm();
