
gsap.to(".marquee", {
    x: "-100%",
    duration: 10, // Speed of marquee
    ease: "linear",
    repeat: -1 // Infinite loop
});
document.querySelectorAll(".page5bottomelems").forEach((elem) => {
    let toggle = elem.querySelector(".acc-toggle");
    let content = elem.querySelector(".acc-content");
    let cross = elem.querySelector(".vertical");

    // Set initial styles using GSAP
    gsap.set(content, { height: 0, opacity: 0, display: "none" });

    toggle.addEventListener("click", function () {
        let isOpen = content.classList.contains("open");

        // Close all other open accordions
        document.querySelectorAll(".acc-content").forEach((el) => {
            if (el !== content) {
                gsap.to(el, { height: 0, opacity: 0, duration: 0.5, ease: "power2.out", display: "none" });
                el.classList.remove("open");
            }
        });

        document.querySelectorAll(".cross").forEach((el) => {
            if (el !== cross) {
                gsap.to(el, { rotate: 0, duration: 0.3, ease: "power1.out" });
            }
        });

        if (isOpen) {
            gsap.to(content, { height: 0, opacity: 0, duration: 0.5, ease: "power2.out", display: "none" });
            gsap.to(cross, { rotate: 90, duration: 0.5, ease: "power1.out" });
            content.classList.remove("open");
        } else {
            let height = content.scrollHeight;
            gsap.to(content, { height: height, opacity: 1, duration: 0.5, ease: "power2.out", display: "block" });
            gsap.to(cross, { rotate: 0, duration: 0.5, ease: "power1.out" });
            content.classList.add("open");
        }
    });
});

let menuOpen = false;

document.querySelector('.menuiconicon').addEventListener('click', () => {
  const icon = document.querySelector('.menuiconicon .fa-ellipsis-vertical');
  const navright = document.querySelector('.navright');
//   const navrightWidth = navright.innerWidth
const navrightHeight = navright.getBoundingClientRect().height / 2;


  if (!menuOpen) {
    // OPEN
    gsap.to(icon, { rotate: 90, duration: 0.5 });
    gsap.to(navright, { top: `${navrightHeight}`, duration: 0.5, ease: "power2.out" });
    menuOpen = true;
  } else {
    // CLOSE
    gsap.to(icon, { rotate: 180, duration: 0.5 });
    gsap.to(navright, { top: -250, duration: 0.5, ease: "power2.in" });
    menuOpen = false;
  }
});




