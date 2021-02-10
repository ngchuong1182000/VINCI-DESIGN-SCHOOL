let vds__input = document.getElementsByClassName("vds__input");


var checkbox = document.querySelector("input[name=checkbox]");
checkbox.addEventListener('change', function () {
  if (this.checked) {
    document.getElementById("btn").disabled = false;
    document.getElementById("btn").style.backgroundColor = "rgba(0, 0, 0, 1)";
  } else {
    document.getElementById("btn").disabled = true;
    document.getElementById("btn").style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  }
});