function validate() {
  const pass = document.getElementById("password");
  const confpass = document.getElementById("c-password");
  const email = document.getElementById("email");
  const phone = document.getElementById("pno");
  const aadhar = document.getElementById("aadhar");
  const state = document.getElementById("state");
  //Array of Indian state
  const stateReg = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"];
  const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
  const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const phoneReg = /^[0-9]{10}$/
  if (pass.value != confpass.value) {
    alert("Passwords do not match");
    pass.value = "";
    confpass.value = "";
  }
  else if (!passReg.test(pass.value)) {
    alert("Password must contain at least one lowercase letter, one uppercase letter, one number and one special character, and at least 8 or more characters");
    pass.value = "";
    confpass.value = "";
  }
  if (!phoneReg.test(phone.value)) {
    alert("Phone number must be of 10 digits");
    phone.value = "";
  }
  if (aadhar.value.length != 12) {
    alert("Aadhar number must be of 12 digits");
    aadhar.value = "";
  }
  if (!stateReg.includes(state.value)) {
    alert("Invalid state");
    state.value = "";
  }
}
