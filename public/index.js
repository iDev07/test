const slider_dev = document.querySelector(".hero_slider_dev");
const slides_dev = document.querySelectorAll(".slide_dev");
const prev_devBtn = document.querySelector(".nav_dev.prev_dev");
const next_devBtn = document.querySelector(".nav_dev.next_dev");

let currentIndex_dev = 0;
let startX_dev = 0;
let isDragging_dev = false;

function showSlide(index) {
  slides_dev.forEach((slide, i) => {
    slide.classList.remove("active", "prev_dev");
    if (i === index) {
      slide.classList.add("active");
    } else if (i === index - 1) {
      slide.classList.add("prev_dev");
    }
  });
}

prev_devBtn.addEventListener("click", () => {
  currentIndex_dev =
    (currentIndex_dev - 1 + slides_dev.length) % slides_dev.length;
  showSlide(currentIndex_dev);
});

next_devBtn.addEventListener("click", () => {
  currentIndex_dev = (currentIndex_dev + 1) % slides_dev.length;
  showSlide(currentIndex_dev);
});

slider_dev.addEventListener("mousedown", (e) => {
  isDragging_dev = true;
  startX_dev = e.clientX;
});

slider_dev.addEventListener("mouseup", (e) => {
  if (!isDragging_dev) return;
  isDragging_dev = false;
  const diff = e.clientX - startX_dev;

  if (diff > 50) {
    currentIndex_dev =
      (currentIndex_dev - 1 + slides_dev.length) % slides_dev.length;
  } else if (diff < -50) {
    currentIndex_dev = (currentIndex_dev + 1) % slides_dev.length;
  }

  showSlide(currentIndex_dev);
});

slider_dev.addEventListener("mouseleave", () => {
  isDragging_dev = false;
});
