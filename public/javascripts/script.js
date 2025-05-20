
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





// var acc = document.getElementsByClassName("accordion");
// var i;

// for (i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var panel = this.nextElementSibling;
//     if (panel.style.display === "block") {
//       panel.style.display = "none";
//     } else {
//       panel.style.display = "block";
//     }
//   });
// }

// let accOpen = false;

// document.querySelector('.accordion').addEventListener('click', () => {
//   const icon = document.querySelector('.acciconicon .fa-ellipsis-vertical');
//   if (!accOpen) {
//     // OPEN
//     gsap.to(icon, { rotate: 90, duration: 0.5 });
//     accOpen = true;
//   } else {
//     // CLOSE
//     gsap.to(icon, { rotate: 180, duration: 0.5 });
//     accOpen = false;
//   }
// });

// JavaScript (Place this after GSAP is loaded)





// const acc = document.getElementsByClassName("accordion");

// for (let i = 0; i < acc.length; i++) {
//   acc[i].addEventListener("click", function () {
//     this.classList.toggle("active");

//     const panel = this.nextElementSibling;
//     const icon = this.querySelector(".acciconicon .fa-ellipsis-vertical");

//     if (panel.style.maxHeight) {
//       // CLOSE PANEL
//       gsap.to(panel, {
//         maxHeight: 0,
//         opacity: 0,
//         duration: 0.5,
//         onComplete: () => {
//           panel.style.display = "none";
//           panel.style.maxHeight = null;
//         }
//       });

//       // ROTATE ICON BACK
//       if (icon) {
//         gsap.to(icon, { rotate: 0, duration: 0.5 });
//       }
//     } else {
//       // OPEN PANEL
//       panel.style.display = "block";
//       const fullHeight = panel.scrollHeight + "px";

//       gsap.fromTo(panel,
//         { maxHeight: 0, opacity: 0 },
//         { maxHeight: fullHeight, opacity: 1, duration: 0.5 }
//       );

//       // ROTATE ICON
//       if (icon) {
//         gsap.to(icon, { rotate: 90, duration: 0.5 });
//       }
//     }
//   });
// }













// document.addEventListener("DOMContentLoaded", () => {

//   /** 1️⃣  Pad each panel’s <p> to the width of its .accicon */
//   function updatePanelPadding() {
//     document.querySelectorAll(".accordion").forEach(btn => {
//       const iconBox = btn.querySelector(".accicon");
//       const panelP  = btn.nextElementSibling?.querySelector("p");

//       if (iconBox && panelP) {
//         const iconWidth = iconBox.getBoundingClientRect().width;
//         panelP.style.paddingLeft = `${iconWidth + 8}px`;   // +8 = small breathing room
//       }
//     });
//   }

//   updatePanelPadding();             // run once
//   window.addEventListener("resize", updatePanelPadding);  // keep in sync on resize

//   /** 2️⃣  Accordion toggle + GSAP animation (icon & panel) */
//   document.querySelectorAll(".accordion").forEach(btn => {
//     btn.addEventListener("click", () => {
//       btn.classList.toggle("active");

//       const panel = btn.nextElementSibling;
//       const icon  = btn.querySelector(".acciconicon .fa-ellipsis-vertical");

//       if (panel.style.maxHeight) {
//         // CLOSE
//         gsap.to(panel, {
//           maxHeight: 0,
//           opacity:   0,
//           duration:  0.5,
//           onComplete: () => {
//             panel.style.display  = "none";
//             panel.style.maxHeight = null;
//           }
//         });
//         if (icon) gsap.to(icon, { rotate: 0, duration: 0.5 });

//       } else {
//         // OPEN
//         panel.style.display = "block";
//         gsap.fromTo(
//           panel,
//           { maxHeight: 0, opacity: 0 },
//           { maxHeight: panel.scrollHeight + "px", opacity: 1, duration: 0.5 }
//         );
//         if (icon) gsap.to(icon, { rotate: 90, duration: 0.5 });
//       }
//     });
//   });

// });










document.addEventListener("DOMContentLoaded", () => {
    // 1️⃣ Set padding-left of each panel <p> based on .accicon width
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
  
    // // 2️⃣ Accordion toggle with GSAP + image switching
    // document.querySelectorAll(".accordion").forEach(btn => {
    //   btn.addEventListener("click", () => {
    //     btn.classList.toggle("active");
  
    //     const panel = btn.nextElementSibling;
    //     const imgOn = btn.querySelector(".acciconicon .on");
    //     const imgOff = btn.querySelector(".acciconicon .off");
  
    //     const isOpen = panel.style.maxHeight;
  
    //     if (isOpen) {
    //       // CLOSE
    //       gsap.to(panel, {
    //         maxHeight: 0,
    //         opacity: 0,
    //         duration: 0.5,
    //         onComplete: () => {
    //           panel.style.display = "none";
    //           panel.style.maxHeight = null;
    //         }
    //       });
  
    //       // Switch image to "off"
    //       if (imgOn) imgOn.style.display = "none";
    //       if (imgOff) imgOff.style.display = "block";
  
    //     } else {
    //       // OPEN
    //       panel.style.display = "block";
    //       gsap.fromTo(
    //         panel,
    //         { maxHeight: 0, opacity: 0 },
    //         { maxHeight: panel.scrollHeight + "px", opacity: 1, duration: 0.5 }
    //       );
  
    //       // Switch image to "on"
    //       if (imgOn) imgOn.style.display = "block";
    //       if (imgOff) imgOff.style.display = "none";
    //     }
    //   });
    // });
});