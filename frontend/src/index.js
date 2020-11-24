/* -------------------------------------------------- */
/* APP */
/* -------------------------------------------------- */

const app = new App()
let appState = {...app.state}
const baseUrl = app.baseUrl

/* -------------------------------------------------- */
/* PAGE */
/* -------------------------------------------------- */

const domElements = {
  authButtons: document.querySelectorAll('.ModalTrigger'),
  page: document.querySelector('.Page'),
  landing: document.querySelector('.Info'),
  modalClose: document.querySelector('.FormModal-close'),
  formModal: document.querySelector('.FormModal'),
  lightSwitch: document.querySelector('.LightSwitch'),
  blackout: document.querySelector('.Blackout'),
  nameField: document.querySelector('input[name="firstName"]'),
  nameRow: document.querySelector('.Form-name'),
  emailField: document.querySelector('input[name="email"]'),
  emailRow: document.querySelector('.Form-email'),
  passwordField: document.querySelector('input[name="password"]'),
  passwordRow: document.querySelector('.Form-password'),
  passwordConfirmationField: document.querySelector('input[name="passwordConfirmation"]'),
  passwordConfirmationRow: document.querySelector('.Form-confirmation'),
  formSubmit: document.querySelector('.Form-submitButton'),
}

const updateAppStateFlags = (...stateItems) => {
  for (const item of stateItems) {
    appState[item] = !appState[item]
  }
  console.log(appState)
}

const displayFormModal = () => {
  if (appState["isLoginSelected"]) {
    const {
      nameRow,
      passwordConfirmationRow
    } = domElements

   

    passwordConfirmationRow.parentNode.removeChild(passwordConfirmationRow)
    nameRow.parentNode.removeChild(nameRow)
  }
  domElements.formModal.classList.add('Visible')
  domElements.formModal.classList.add('Login')
  domElements.blackout.style.display = 'block'
  updateAppStateFlags("isFormVisible")
}

const hideFormModal = () => {
  domElements.formModal.classList.remove('Visible')
  domElements.blackout.style.display = 'none'

  if (appState["isLoginSelected"]) {
    updateAppStateFlags("isLoginSelected", "isFormVisible")
    restoreForm()
  } else {
    updateAppStateFlags("isSignupSelected", "isFormVisible")
  }
}

const restoreForm = () => {
  const {
    nameRow,
    emailRow,
    passwordRow,
    passwordConfirmationRow
  } = domElements

  emailRow.insertAdjacentElement('beforebegin', nameRow)
  passwordRow.insertAdjacentElement('afterend', passwordConfirmationRow)
}

const resetPage = () => {
  const activeView = document.querySelector('.Profile')
  activeView.parentNode.removeChild(activeView)
  domElements.landing.classList.remove('Hide')
}

/* -------------------------------------------------- */
/* USER RELATED */
/* -------------------------------------------------- */

const buildFormData = (flag) => {
  
  const {
    nameField,
    emailField,
    passwordField,
    passwordConfirmationField
  } = domElements

  const formData = {
    first_name: nameField.value,
    email: emailField.value,
    password: passwordField.value,
    password_confirmation: passwordConfirmationField.value
  }

  if (flag === "sessions") delete formData.password_confirmation

  return formData
}

const buildConfigObject = (formData) => {
  const configObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    user: JSON.stringify(formData)
  }
  
  return configObject
}

const enableUserAccess = (flag, obj) => {
  debugger
  fetch(`${baseUrl}/${flag}`, obj, {
      credentials: 'include'
    })
    .then(response => response.json())
    .then(json => handleSession(json.data))
    .catch(error => console.log(error.message))
}

const handleSession = (data) => {
  if (data.status === "created") {
    createUser(data)
  } else if (data["logged_out"]) {
    destroyUser()
    resetPage()
  }

  updateAppStateFlags("isUserLoggedIn")
}

const createUser = (data) => {
  const userData = data.object
  const {
    id,
    first_name,
    email
  } = userData
  const newUser = new User(id, first_name, email)
  setCurrentUser(newUser)
}

const setCurrentUser = (user) => {
  appState["currentUser"] = user
}

const destroyUser = () => {
  appState["currentUser"] = {}
}

/* -------------------------------------------------- */
/* EVENT LISTENERS */
/* -------------------------------------------------- */


domElements.authButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.className.includes("login")) {
      updateAppStateFlags("isLoginSelected")
    } else {
      event.preventDefault()
      updateAppStateFlags("isSignupSelected")
    }
    displayFormModal()
  })
})

domElements.modalClose.addEventListener('click', () => {
  hideFormModal()
})

domElements.formSubmit.addEventListener('click', e => {
  e.preventDefault()

  let flag = appState["isLoginSelected"] ? "sessions" : "users"
  const formData = buildFormData(flag)
  const configObject = buildConfigObject(formData)

  enableUserAccess(flag, configObject)
  hideFormModal()
})

console.log("testing...")