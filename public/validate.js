function validate() {
  const v1 = document.getElementById("password");
  const v2 = document.getElementById("c-password");
  if (v1.value != v2.value) {
    alert("Passwords do not match");
    v1.value = "";
    v2.value = "";
  } else {
    alert("User Created");
  }
}
