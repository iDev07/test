const slider = document.querySelector(".hero-slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".nav.prev");
const nextBtn = document.querySelector(".nav.next");

let currentIndex = 0;
let startX = 0;
let isDragging = false;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active", "prev");
    if (i === index) {
      slide.classList.add("active");
    } else if (i === index - 1) {
      slide.classList.add("prev");
    }
  });
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});

slider.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
});

slider.addEventListener("mouseup", (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = e.clientX - startX;

  if (diff > 50) {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  } else if (diff < -50) {
    currentIndex = (currentIndex + 1) % slides.length;
  }

  showSlide(currentIndex);
});

slider.addEventListener("mouseleave", () => {
  isDragging = false;
});
