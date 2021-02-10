var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
  var currentScrollPos = window.pageYOffset;
  console.log("prevScrollpos " + prevScrollpos);
  console.log("currentScrollPos " + currentScrollPos);

  if (currentScrollPos == 0) {
    document.getElementById("navbar").style.backgroundColor = "rgba(255, 0, 0, 0)";
  }
  if (currentScrollPos > 1) {
    document.getElementById("navbar").style.backgroundColor = "black";
  }
  if (prevScrollpos > currentScrollPos) {
    document.getElementById("navbar").classList.remove("hide")
  } else {
    document.getElementById("navbar").classList.add("hide")
  }
  prevScrollpos = currentScrollPos;
}

