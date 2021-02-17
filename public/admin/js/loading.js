
const iconLoading = document.getElementById("loading");
const btnsubmit = document.getElementById("submit");
const input = document.getElementsByTagName("input");

const validation = () => {
  let isSubmit = false;
  for (let i = 0; i < input.length; i++) {
    let value = input[i].value;
    if (value.length !== 0) {
      isSubmit = true
    }
  }
  return isSubmit
}

btnsubmit.addEventListener("click", function (e) {
  if (validation()) {
    iconLoading.style.display = "flex";
  }
})
