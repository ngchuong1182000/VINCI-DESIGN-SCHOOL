"use strict";

var iconLoading = document.getElementById("loading");
var btnsubmit = document.getElementById("submit");
var input = document.getElementsByTagName("input");

var validation = function validation() {
  var isSubmit = false;

  for (var i = 0; i < input.length; i++) {
    var value = input[i].value;

    if (value.length !== 0) {
      isSubmit = true;
    }
  }

  return isSubmit;
};

btnsubmit.addEventListener("click", function (e) {
  if (validation()) {
    iconLoading.style.display = "flex";
  }
});