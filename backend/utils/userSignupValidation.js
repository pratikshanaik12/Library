function validatePassword(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/;
  const hasLowerCase = /[a-z]/;
  const hasNumbers = /[0-9]/;
  const hasNonalphas = /[\W_]/;  // Non-alphanumeric characters

  if (password.trim().length < minLength) {
      return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!hasUpperCase.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!hasLowerCase.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!hasNumbers.test(password)) {
      return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!hasNonalphas.test(password)) {
      return { valid: false, message: 'Password must contain at least one special character.' };
  }

  return { valid: true, message: 'Password is valid.' };
}

function validateUserInput(user) {
  if (!user.username || !user.username.trim()) {
      return { valid: false, message: 'Please provide a username' };
  }
  if (!user.email || !user.email.trim()) {
      return { valid: false, message: 'Please provide an email address' };
  }
  if (!user.firstname || !user.firstname.trim()) {
      return { valid: false, message: 'Please provide a firstname' };
  }
  if (!user.lastname || !user.lastname.trim()) {
      return { valid: false, message: 'Please provide a lastname' };
  }
  if (!['librarian', 'customer'].includes(user.role)) {
      return { valid: false, message: 'Invalid user type' };
  }

  const passwordCheck = validatePassword(user.password);
  if (!passwordCheck.valid) {
      return passwordCheck;
  }

  // You can add more validation rules as needed
  return { valid: true, message: 'user input validated' };
}

module.exports = {
  validatePassword,
  validateUserInput
};
