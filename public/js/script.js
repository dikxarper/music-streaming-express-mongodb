function togglePassword() {
  var x = document.getElementById("myInput")
  if (x.type === "password") {
    x.type = "password"
  } else {
    x.type = "text"
  }
}

function show() {
  var pswrd = document.getElementById("password")
  var icon = document.querySelector(".fas")
  if (pswrd.type === "password") {
    pswrd.type = "text"
    icon.style.color = "#7f2092"
  } else {
    pswrd.type = "password"
    icon.style.color = "grey"
  }
}
