<template>
  <form 
    class="app-login-from"
  >
    <h5>Login to your account</h5>
    <div class="form-group">
      <label for="app-login-from-email-input">
        Email address
      </label>
      <input
        id="app-login-from-email-input"
        v-model="name"
        type="email"
        class="form-control form-control-sm is-invalid"
        aria-describedby="app-login-from-email-input-help"
        placeholder="Enter email"
        required
        minlength="8"
        autocomplete 
        @input="onFormInputChange"
      >
      <small
        id="app-login-from-email-input-help"
        class="form-text text-muted"
      >
        We'll never share your email with anyone else.
      </small>
    </div>
    <div class="form-group">
      <label for="app-login-from-password-input">
        Password
      </label>
      <input
        id="app-login-from-password-input"
        v-model="password"
        :minlength="minlength"
        type="password"
        class="form-control form-control-sm is-invalid"
        placeholder="Password"
        required
        autocomplete
        @input="onFormInputChange"
      >
    </div>
    <div class="form-row">
      <button 
        type="button"
        class="btn col btn-outline-secondary mx-2"
        @click="signUp"
      >
        Sign up
      </button>
      <button 
        type="button" 
        class="btn col btn-outline-secondary mx-2"
        @click="tryLogin"
      >
        Login
      </button>
    </div>
  </form>
</template>

<script>
'use strict'

function setValidationClass(element, valid) {
    if (valid) {
        element.classList.remove('is-invalid');
        element.classList.add('is-valid');
    } else {
        element.classList.add('is-invalid');
        element.classList.remove('is-valid');
    }

}
function validateForm(){
    let valid = false;
    const element = document.querySelector('.app-login-from');
    if (element) {
        valid = element.checkValidity();
    }
    return valid;
}
function postNewUserDataToServer(name, password) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', '/user/create-new-account');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(`name=${name}&password=${password}`);
        request.onload = function(ev) {
            resolve(ev.currentTarget);
        }
    })
}
function loginUserOnServer(name, password) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('POST', '/user/authorize');
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(`name=${name}&password=${password}`);
        request.onload = function(ev) {
            resolve(ev.currentTarget);
        }
    })
}
function createHttpActionItem(res, method) {
    let responseObject = {}
    try {
        responseObject = JSON.parse(res.responseText);
    } catch(err) {

    }
    return {
        httpMethod: method,
        responseURL: res.responseURL,
        status: res.status,
        statusText: res.statusText,
        response: res.response,
        responseText: responseObject,
    }
}
export default {
    name: 'AppLoginForm',
    data:  () => {
            return {
                formIsValid: false,
                name: '',
                password: '',
                minlength: 4,
            };
    },
    methods: {
        onFormInputChange: (event) => {
            const valid = event.target.checkValidity();
            setValidationClass(event.target, valid);
        },
        signUp(event) {
            this.formIsValid = validateForm();
            if (this.formIsValid) {
                postNewUserDataToServer(this.name, this.password)
                .then(res => {
                    console.log(res);
                    this.$store.commit('actionTracer/addHTTPAction', createHttpActionItem(res, 'POST'));
                }).catch(err => err);
            }
        },
        tryLogin() {
            this.formIsValid = validateForm();
            if (this.formIsValid) {
                loginUserOnServer(this.name, this.password)
                .then(res => {
                    this.$store.commit('actionTracer/addHTTPAction',createHttpActionItem(res, 'POST'));
                     if (res.status === 200) {
                        this.$router.push({path: 'dashboard'})
                    }
                }).catch(err => err);
            }
        },
    },
};
</script>
<style lang="scss" scoped>
.app-login-from {
  z-index: 1;
  position: relative;
  border-radius: 5px;
  background: inherit;
  box-shadow: 1px 1px 2px 3px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  color: #ffffff;
  overflow: hidden;
  &::before {
    content: "";
    z-index: -1;
    background: transparent url("~assets/main-background.jpg") right no-repeat;
    background-size: 200%;
    filter: blur(10px);
    position: absolute;
    top: -5px;
    right: -5px;
    left: -5px;
    bottom: -5px;
  }
  .form-group {
    display: flex;
    flex-flow: column;
    justify-content: baseline;
    * {
      align-self: baseline;
    }
  }
}
</style>

