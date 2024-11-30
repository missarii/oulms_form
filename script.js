// Check if the user is on a mobile device or desktop and load the appropriate CSS file
function loadAppropriateStylesheet() {
  const styleSheet = document.getElementById('styleSheet');
  if (window.innerWidth > 600) {
    styleSheet.href = "styles-desktop.css"; // Desktop CSS
  } else {
    styleSheet.href = "styles.css"; // Mobile CSS
  }
}

// Toggle password visibility
function togglePassword() {
  const passwordField = document.getElementById('password');
  passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
}

// Run on initial load
loadAppropriateStylesheet();

// Adjust the stylesheet dynamically if the user resizes the window
window.addEventListener('resize', loadAppropriateStylesheet);

