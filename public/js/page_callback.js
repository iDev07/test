(function (jQuery) {
  samo.page_ready = false;
  jQuery(function () {
    samo.page_ready = true;
  });

  samo.page_callback = function (page, samo_action, params) {
    if (!samo.page_ready) {
      setTimeout(function () {
        samo.page_callback(page, samo_action, params);
      }, 0);
      return;
    }

    // Your custom callback here

    const slides = document.querySelectorAll(".slide");
    const nextBtn = document.querySelector(".next");
    const prevBtn = document.querySelector(".prev");
    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active");
      });
      slides[index].classList.add("active");
    }

    nextBtn.addEventListener("click", () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    });

    prevBtn.addEventListener("click", () => {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    });
    if (page === "") {
      // Если на главной странице (page пустой), редирект на search_tour
      window.location.href = "/search_tour";
    }

    /*
         console.log(arguments);
         switch (page) {
         case 'search_tour':
         if (samo_action == 'TOWNFROMINC' || samo_action == 'default_action') {
         if (params.TOWNFROMINC == 2) {
         jQuery.notify('Вы выбрали вылет из нужного города!');
         }
         }
         break;
         default:
         break;
         }
         */
    return;
  };
})(samo.jQuery);
