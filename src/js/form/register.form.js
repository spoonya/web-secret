import FormValidation from '.';

export default function validateFormRegister() {
  const form = new FormValidation('#form-register', {
    userPhone: {
      isRequired: false
    },
    userAgreements: {
      isRequired: false
    }
  });
}
