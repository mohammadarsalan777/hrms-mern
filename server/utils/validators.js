export function validateEmail(email) {
  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
  return emailRegex.test(email);
}

export function validatePassword(password) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    
  return passwordRegex.test(password);
}

export function validateIndianPhone(phone) {
  const indianPhoneRegex = /^(?:\+91|91)?[6-9]\d{9}$/;
  return indianPhoneRegex.test(phone);
}

export function validateDOB(dob, minAge = 18) {
  const birthDate = new Date(dob);
  const today = new Date();

  if (isNaN(birthDate.getTime())) return false;
  if (birthDate > today) return false;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= minAge;
}
