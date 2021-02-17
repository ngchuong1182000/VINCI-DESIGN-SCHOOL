"use strict";

var iconLoading = document.getElementById("loading");
var btnsubmit = document.getElementById("submit");
var fileUpload = document.getElementById("image-upload");
var lessonTitle = document.getElementById("lessonTitle");
var lessonDescription = document.getElementById("lessonDescription");

var validation = function validation() {
  var title = lessonTitle.value;
  var description = lessonDescription.value;
  var file = fileUpload.value;

  if (title && description && file) {
    return true;
  }

  return false;
};

btnsubmit.addEventListener("click", function (e) {
  if (validation()) {
    iconLoading.style.display = "flex";
  }
});