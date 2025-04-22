// Update the slide navigation to highlight the current slide
function updateNav() {
  const navContainer = document.getElementById("slide-nav");
  navContainer.innerHTML = "";

  slides.forEach((_, index) => {
    const navItem = document.createElement("span");
    navItem.innerText = index + 1;
    navItem.classList.add("nav-item");

    if (index === currentSlide) {
      navItem.classList.add("active");
      // Add active class to the corresponding navigation button
      navItem.classList.add("active-button");
    } else {
      navItem.classList.remove("active-button");
    }

    navItem.onclick = () => goToSlide(index);
    navContainer.appendChild(navItem);
  });
}
