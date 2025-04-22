function loadSlide(slidePath, element) {
  document.getElementById("slide-frame").src = slidePath;
  document.querySelectorAll(".slide-item").forEach(item => {
    item.classList.remove("active");
  });
  element.classList.add("active");
}
