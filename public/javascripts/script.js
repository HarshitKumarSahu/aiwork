
gsap.to(".marquee", {
    x: "-100%",
    duration: 10, // Speed of marquee
    ease: "linear",
    repeat: -1 // Infinite loop
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



var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
