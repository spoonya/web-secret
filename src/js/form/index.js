import IMask from 'imask';
import { API_CFG, DATA_ATTR, CLASSES } from '../constants';

const merge = require('lodash/merge');

class FormValidation {
  constructor(selector, userConfig) {
    this.form = document.querySelector(selector);
    if (!this.form) return;

    this.formElements = {
      inputs: {
        username: this.form.querySelector(DATA_ATTR.formUserName),
        userSecondName: this.form.querySelector(DATA_ATTR.formUserSecondName),
        userPhone: this.form.querySelector(DATA_ATTR.formPhone),
        userPassword: this.form.querySelector(DATA_ATTR.formPassword),
        userINN: this.form.querySelector(DATA_ATTR.formINN),
        userEmail: this.form.querySelector(DATA_ATTR.formEmail),
        userMsg: this.form.querySelector(DATA_ATTR.formMsg),
        userAgreements: [
          ...this.form.querySelectorAll(DATA_ATTR.formAgreement)
        ],
        userUpload: this.form.querySelector(DATA_ATTR.formUpload),
        userSelects: [...this.form.querySelectorAll(DATA_ATTR.formSelect)]
      },
      submit: this.form.querySelector(DATA_ATTR.formSubmit)
    };

    this.defaultConfig = {
      username: {
        isRequired: true,
        errors: {
          empty: 'Введите имя'
        }
      },
      userSecondName: {
        isRequired: true,
        errors: {
          empty: 'Введите фамилию'
        }
      },
      userPhone: {
        isRequired: true,
        maskLength: 17,
        maskOptions: {
          mask: '+{375}(00)000-00-00'
        },
        errors: {
          empty: 'Введите номер',
          invalid: 'Некорректный номер'
        }
      },
      userEmail: {
        isRequired: true,
        errors: {
          empty: 'Введите E-mail',
          invalid: 'Некорректный E-mail'
        }
      },
      userPassword: {
        isRequired: true,
        maxLength: 20,
        minLength: 8,
        errors: {
          empty: 'Введите пароль',
          getMaxLength(length) {
            return `Не более ${length} симовлов`;
          },
          getMinLength(length) {
            return `Минимум ${length} симвовлов`;
          }
        }
      },
      userAgreements: {
        isRequired: true,
        errors: {
          unchecked: 'Подтвердите согласие'
        }
      },
      userSelects: {
        isRequired: true,
        errors: {
          unselected: 'Выберите значение'
        }
      },
      userINN: {
        isRequired: true,
        errors: {
          alreadyExists:
            'Ваша компания уже зарегистрирована, пожалуйста, обратитесь к менеджеру вашего аккаунта или <a href="#" target="_blank"> напишите нам</a>',
          empty: 'Введите ИНН',
          getMaxLength(length) {
            return `Не более ${length} симовлов`;
          },
          getMinLength(length) {
            return `Минимум ${length} символов`;
          }
        },
        maxLength: 12,
        minLength: 9,
        maskOptions: {
          mask: Number
        }
      },
      userMsg: {
        isRequired: true,
        maxLength: 250,
        minLength: 8,
        errors: {
          empty: 'Введите сообщение',
          getMaxLength(length) {
            return `Не более ${length} симовлов`;
          },
          getMinLength(length) {
            return `Минимум ${length} символов`;
          }
        }
      },
      userUpload: {
        isRequired: false,
        extensions:
          /(\.doc|\.docx|\.odt|\.pdf|\.tex|\.txt|\.rtf|\.wps|\.wks|\.wpd\.ppt|\.pptx|\.png|\.jpg|\.jpeg)$/i,
        errors: {
          invalid: 'Неверный тип'
        }
      }
    };

    this.config = merge(this.defaultConfig, userConfig);

    if (this.formElements.inputs.userPhone) {
      IMask(
        this.formElements.inputs.userPhone,
        this.config.userPhone.maskOptions
      );
    }

    if (this.formElements.inputs.userINN) {
      IMask(this.formElements.inputs.userINN, this.config.userINN.maskOptions);
    }

    this._init();
  }

  _validateEmail(email) {
    const regex =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

    return regex.test(String(email).toLowerCase());
  }

  _selectFormControl(input) {
    return input.closest(DATA_ATTR.formControl);
  }

  _setError(input, message) {
    const formControl = this._selectFormControl(input);
    const error = formControl.querySelector(DATA_ATTR.formError);

    error.innerHTML = '';
    error.insertAdjacentHTML('beforeend', message);
    formControl.classList.remove(CLASSES.success);
    formControl.classList.add(CLASSES.error);
  }

  _setSuccess(input) {
    const formControl = this._selectFormControl(input);

    formControl.classList.remove(CLASSES.error);
    formControl.classList.add(CLASSES.success);
  }

  _checkUsername(username, usernameValue, config) {
    if (config.isRequired && !usernameValue) {
      this._setError(username, config.errors.empty);

      return false;
    }

    this._setSuccess(username);

    return true;
  }

  _checkuserSecondName(username, usernameValue, config) {
    if (config.isRequired && !usernameValue) {
      this._setError(username, config.errors.empty);

      return false;
    }

    this._setSuccess(username);

    return true;
  }

  _checkUserPhone(userPhone, userPhoneValue, config) {
    if (config.isRequired && !userPhoneValue) {
      this._setError(userPhone, config.errors.empty);

      return false;
    }

    if (userPhoneValue && userPhoneValue.length !== config.maskLength) {
      this._setError(userPhone, config.errors.invalid);

      return false;
    }

    this._setSuccess(userPhone);

    return true;
  }

  _checkUserEmail(userEmail, userEmailValue, config) {
    if (config.isRequired && !userEmailValue) {
      this._setError(userEmail, config.errors.empty);

      return false;
    }

    if (userEmailValue && !this._validateEmail(userEmailValue)) {
      this._setError(userEmail, config.errors.invalid);

      return false;
    }

    this._setSuccess(userEmail);

    return true;
  }

  _checkUserPassword(userPassword, userPasswordValue, config) {
    if (config.isRequired && !userPasswordValue) {
      this._setError(userPassword, config.errors.empty);

      return false;
    }

    if (
      userPasswordValue.length &&
      userPasswordValue.length > config.maxLength
    ) {
      this._setError(
        userPassword,
        config.errors.getMaxLength(config.maxLength)
      );

      return false;
    }

    if (
      userPasswordValue.length &&
      userPasswordValue.length < config.minLength
    ) {
      this._setError(
        userPassword,
        config.errors.getMinLength(config.minLength)
      );

      return false;
    }

    this._setSuccess(userPassword);

    return true;
  }

  _checkUserINN(userINN, userINNValue, config) {
    if (config.isRequired && !userINNValue) {
      this._setError(userINN, config.errors.empty);

      return false;
    }

    if (userINNValue.length && userINNValue.length > config.maxLength) {
      this._setError(userINN, config.errors.getMaxLength(config.maxLength));

      return false;
    }

    if (userINNValue.length && userINNValue.length < config.minLength) {
      this._setError(userINN, config.errors.getMinLength(config.minLength));

      return false;
    }

    this._setSuccess(userINN);

    return true;
  }

  _checkUserMessage(userMessage, userMessageValue, config) {
    if (config.isRequired && !userMessageValue) {
      this._setError(userMessage, config.errors.empty);

      return false;
    }

    if (userMessageValue.length && userMessageValue.length > config.maxLength) {
      this._setError(userMessage, config.errors.getMaxLength(config.maxLength));

      return false;
    }

    if (userMessageValue.length && userMessageValue.length < config.minLength) {
      this._setError(userMessage, config.errors.getMinLength(config.minLength));

      return false;
    }

    this._setSuccess(userMessage);

    return true;
  }

  _checkUserSelects(selects, config) {
    let isValid = true;

    selects.forEach((select) => {
      if (select.selectedIndex === 0 && config.isRequired) {
        isValid = false;
        this._setError(select, config.errors.unselected);
      } else {
        this._setSuccess(select);
      }
    });

    return isValid;
  }

  _checkAgreements(checkboxes, config) {
    let isValid = true;

    for (let i = 0; i < checkboxes.length; i++) {
      if (!checkboxes[i].checked && config.isRequired) {
        this._setError(checkboxes[i], config.errors.unchecked);

        isValid = false;
      } else {
        this._setSuccess(checkboxes[i]);
      }
    }

    return isValid;
  }

  _checkUpload(upload, config) {
    for (let i = 0; i < upload.files.length; i++) {
      const file = upload.files[i];

      if (!config.extensions.exec(file.name)) {
        this._setError(upload, config.errors.invalid);

        return false;
      }
    }

    this._setSuccess(upload);

    return true;
  }

  _clearInputs() {
    Object.values(this.formElements.inputs).forEach((input) => {
      if (!input) return;

      if (!Array.isArray(input)) {
        input.value = '';

        if (input.type === 'checkbox') {
          input.checked = false;
        }

        this._selectFormControl(input).classList.remove(
          CLASSES.success,
          CLASSES.error
        );
      } else {
        input.forEach((el) => {
          el.selectedIndex = 0;

          this._selectFormControl(el).classList.remove(
            CLASSES.success,
            CLASSES.error
          );
        });
      }
    });
  }

  _getInputValues() {
    const values = {};

    // eslint-disable-next-line no-restricted-syntax
    for (const item of Object.entries(this.formElements.inputs)) {
      const [key, input] = item;

      if (input) {
        if (!Array.isArray(input)) {
          values[key] = input.value || '';
        } else if (input.length) {
          input.forEach((el) => {
            values[el.value] = el.checked;
          });
        }
      }
    }

    return values;
  }

  async _checkInnExisting(userINN) {
    const res = await fetch(API_CFG.baseUrl);
    const data = await res.json();

    if (!data.length) return false;

    const isExists = data.find((item) => item.inn === userINN);

    return !!isExists;
  }

  async _addUserToDB(data) {
    this.form.classList.add(CLASSES.loading);
    this.formElements.submit.disabled = true;

    const values = {
      name: data.username,
      secondName: data.userSecondName,
      email: data.userEmail,
      password: data.userPassword,
      phone: data.phone,
      inn: data.userINN,
      newsletter: data.newsletter
    };

    if (await this._checkInnExisting(data.userINN)) {
      this.form.classList.remove(CLASSES.loading);
      this.formElements.submit.disabled = false;

      this._setError(
        this.formElements.inputs.userINN,
        this.config.userINN.errors.alreadyExists
      );

      return;
    }

    try {
      const res = await fetch(API_CFG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (res.ok) {
        this._clearInputs();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.form.classList.remove(CLASSES.loading);
      this.formElements.submit.disabled = false;
    }
  }

  _validateOnSubmit() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const isValid = [];

      if (this.formElements.inputs.username) {
        isValid.push(
          this._checkUsername(
            this.formElements.inputs.username,
            this.formElements.inputs.username.value.trim(),
            this.config.username
          )
        );
      }

      if (this.formElements.inputs.userSecondName) {
        isValid.push(
          this._checkUsername(
            this.formElements.inputs.userSecondName,
            this.formElements.inputs.userSecondName.value.trim(),
            this.config.userSecondName
          )
        );
      }

      if (this.formElements.inputs.userPhone) {
        isValid.push(
          this._checkUserPhone(
            this.formElements.inputs.userPhone,
            this.formElements.inputs.userPhone.value.trim(),
            this.config.userPhone
          )
        );
      }

      if (this.formElements.inputs.userEmail) {
        isValid.push(
          this._checkUserEmail(
            this.formElements.inputs.userEmail,
            this.formElements.inputs.userEmail.value.trim(),
            this.config.userEmail
          )
        );
      }

      if (this.formElements.inputs.userPassword) {
        isValid.push(
          this._checkUserPassword(
            this.formElements.inputs.userPassword,
            this.formElements.inputs.userPassword.value.trim(),
            this.config.userPassword
          )
        );
      }

      if (this.formElements.inputs.userMsg) {
        isValid.push(
          this._checkUserMessage(
            this.formElements.inputs.userMsg,
            this.formElements.inputs.userMsg.value.trim(),
            this.config.userMsg
          )
        );
      }

      if (this.formElements.inputs.userINN) {
        isValid.push(
          this._checkUserMessage(
            this.formElements.inputs.userINN,
            this.formElements.inputs.userINN.value.trim(),
            this.config.userINN
          )
        );
      }

      if (this.formElements.inputs.userSelects) {
        isValid.push(
          this._checkUserSelects(
            this.formElements.inputs.userSelects,
            this.config.userSelects
          )
        );
      }

      if (this.formElements.inputs.userAgreements) {
        isValid.push(
          this._checkAgreements(
            this.formElements.inputs.userAgreements,
            this.config.userAgreements
          )
        );
      }

      if (this.formElements.inputs.userUpload) {
        isValid.push(
          this._checkUpload(
            this.formElements.inputs.userUpload,
            this.config.userUpload
          )
        );
      }

      if (!isValid.includes(false)) {
        const inputValues = this._getInputValues();

        this._addUserToDB(inputValues);
      }
    });
  }

  _addRequiredMark() {
    Object.keys(this.formElements.inputs).forEach((key) => {
      if (this.formElements.inputs[key] && this.defaultConfig[key].isRequired) {
        if (Array.isArray(this.formElements.inputs[key])) {
          this.formElements.inputs[key].forEach((el) => {
            el.closest(DATA_ATTR.formControl).classList.add(CLASSES.required);
          });
        } else {
          this.formElements.inputs[key]
            .closest(DATA_ATTR.formControl)
            .classList.add(CLASSES.required);
        }
      }
    });
  }

  _init() {
    this._addRequiredMark();
    this._validateOnSubmit();
  }
}

export default FormValidation;
