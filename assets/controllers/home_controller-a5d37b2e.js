import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    this.events();
    this.gsapEvents();
    this.initSlider();
    this.menuSections();
    this.smoothScroll();
  }

  events() {
    const hoverImages = this.element.querySelectorAll(".hover-image");
    hoverImages.forEach((image) => {
      image.addEventListener("mouseenter", this.changeImage.bind(this));
      image.addEventListener("mouseleave", this.resetImage.bind(this));
    });

    const copyAddress = this.element.querySelectorAll(".copy-address");

    copyAddress.forEach((address) => {
      address.addEventListener("click", () => {
        const valueToCopy = address.getAttribute("data-copy-value");
        const button = address.parentNode;
        navigator.clipboard.writeText(valueToCopy).then(() => {
          address.innerHTML = "COPIED !";
          button.classList.add("scale-110");
          setTimeout(() => {
            address.textContent = "COPY";
            button.classList.remove("scale-110");
          }, 1000);
        });
      });
    });
  }

  menuSections() {
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    const updateActiveLink = () => {
      let currentSection = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          currentSection = section.id;
        }
      });

      links.forEach((link) => {
        if (link.getAttribute("href") === `#${currentSection}`) {
          link.classList.add("text-2xl");
        } else {
          link.classList.remove("text-2xl");
        }
      });
    };

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink();
  }

  smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute("href")).scrollIntoView({
          behavior: "smooth",
        });
      });
    });
  }

  gsapEvents() {
    const fadeInElements = this.element.querySelectorAll(".pop-in-target");

    fadeInElements.forEach((element) => {
      gsap.set(element, {
        opacity: 0,
        scale: 0.5,
        y: 20,
      });

      gsap.fromTo(
        element,
        {
          opacity: 0,
          scale: 0.5,
          y: 20,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // Logo Slide in top
    const svgElements = document.querySelectorAll(".svg-fade-in");

    setTimeout(() => {
      const timeline = gsap.timeline();

      timeline
        .fromTo(
          svgElements,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1,
            ease: "power4.inOut",
          }
        )
        .add(() => {
          fadeInBwob();
        });
    }, 300);

    function fadeInBwob() {
      const smallBwob = document.querySelectorAll("#o-bwob-circle-container");

      gsap.fromTo(
        smallBwob,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 1 }
      );
    }

    const bwobLogoBwob = this.element.querySelector("#o-bwob-circle #Bras_D");
    gsap.set(bwobLogoBwob, {
      transformOrigin: "bottom left",
    });

    gsap.to(bwobLogoBwob, {
      rotation: 8,
      duration: 0.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Bwob on swing in "About"
    gsap.to(".bwob-swing-animation", {
      rotation: 10,
      duration: 1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Smoke in "About"
    gsap.to(".bwob-smoke-animation", {
      y: -100,
      scale: 1.1,
      opacity: 0,
      duration: 2,
      ease: "power1.out",
      repeat: -1,
      delay: gsap.utils.random(0, 1),
    });

    // Big $BWOB at bottom in "Community"
    const parallaxElements = this.element.querySelectorAll(
      ".bwob-parallax-animation"
    );

    parallaxElements.forEach((element) => {
      const startY = element.dataset.startY
        ? parseFloat(element.dataset.startY)
        : 150;
      const endY = element.dataset.endY
        ? parseFloat(element.dataset.endY)
        : -100;

      gsap.fromTo(
        element,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 3,
          ease: "power4.inOut",
        }
      );

      gsap.fromTo(
        element,
        {
          y: startY,
        },
        {
          y: endY,
          ease: "power1.out",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }

  changeImage(event) {
    const link = event.currentTarget;
    const image = link.querySelector("img");
    const newImage = link.dataset.hoverImage;
    const zoomEffect = link.dataset.zoomEffect === "true";

    image.style.transition = "transform 0.5s ease-in-out";
    image.style.transform = "scale(1)";

    if (newImage) {
      if (zoomEffect) {
        image.style.transform = "scale(1.08)";
      }
      image.src = newImage;
    }
  }

  resetImage(event) {
    const link = event.currentTarget;
    const image = link.querySelector("img");
    const baseImage = link.dataset.baseImage;

    if (baseImage) {
      image.src = baseImage;
    }

    image.style.transition = "transform 0.5s ease-in-out";
    image.style.transform = "scale(1)";
  }

  initSlider() {
    const swiper = new Swiper(".swiper-container", {
      centeredSlides: true,
      loop: true,
      breakpoints: {
        640: {
          slidesPerView: 3,
          spaceBetween: -30,
        },
        1024: {
          slidesPerView: 5,
          spaceBetween: -50,
        },
      },
      on: {
        slideChange: function () {
          const slides = this.slides;
          const activeIndex = this.activeIndex;

          slides.forEach((slide) => {
            slide.classList.remove(
              "visible-slide",
              "level-1",
              "level-2",
              "level-3"
            );
          });

          slides[activeIndex]?.classList.add("visible-slide", "level-1");
          slides[
            (activeIndex - 1 + slides.length) % slides.length
          ]?.classList.add("visible-slide", "level-2");
          slides[(activeIndex + 1) % slides.length]?.classList.add(
            "visible-slide",
            "level-2"
          );
          slides[
            (activeIndex - 2 + slides.length) % slides.length
          ]?.classList.add("visible-slide", "level-3");
          slides[(activeIndex + 2) % slides.length]?.classList.add(
            "visible-slide",
            "level-3"
          );
        },
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });
  }
}
