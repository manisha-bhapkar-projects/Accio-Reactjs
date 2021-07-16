export function validateName(name) {
  const nameRegex = /^[a-zA-Z0-9 _:?&-]+$/;
  if (name && nameRegex.test(name.trim())) {
    return true;
  }
  return false;
}

export function validateNameWithRegex(name, nameRegex) {
  if (name && nameRegex.test(name.trim())) {
    return true;
  }
  return false;
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}$/;
  if (email && emailRegex.test(email.trim())) {
    return true;
  }
  return false;
}

export function validatePassword(password) {
  const passwordRegex = /((?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&]).{8,})/;
  if (password && passwordRegex.test(password)) {
    return true;
  }
  return false;
}

export function validateContact(contactNo) {
  const contactNoRegex = /^[6-9][0-9]{9}$/;
  if (contactNo && contactNoRegex.test(contactNo.trim())) {
    return true;
  }
  return false;
}

export function validateCharacterLength(text, maxLength) {
  if (text && text.trim().length <= maxLength) {
    return true;
  }
  return false;
}
