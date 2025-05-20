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

document.addEventListener("DOMContentLoaded", () => {
    function updatePanelPadding() {
      document.querySelectorAll(".accordion").forEach(btn => {
        const iconBox = btn.querySelector(".accicon");
        const panelP = btn.nextElementSibling?.querySelector("p");
  
        if (iconBox && panelP) {
          const iconWidth = iconBox.getBoundingClientRect().width;
          panelP.style.paddingLeft = `${iconWidth + 8}px`;
        }
      });
    }
    updatePanelPadding();
    window.addEventListener("resize", updatePanelPadding);
    const yearSpan = document.querySelector(".year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  
});