// carousel.js - slider simple para home
document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  if (!carousel) return;
  const slides = carousel.querySelectorAll(".slide");
  if (!slides.length) return;
  let idx = 0;
  const total = slides.length;
  const setPos = () => carousel.style.transform = `translateX(-${idx*100}%)`;
  document.getElementById("carousel-next")?.addEventListener("click", ()=> { idx = (idx+1)%total; setPos(); });
  document.getElementById("carousel-prev")?.addEventListener("click", ()=> { idx = (idx-1+total)%total; setPos(); });
  let timer = setInterval(()=> { idx = (idx+1)%total; setPos(); }, 4500);
  carousel.addEventListener("mouseenter", ()=> clearInterval(timer));
  carousel.addEventListener("mouseleave", ()=> timer = setInterval(()=> { idx=(idx+1)%total; setPos(); }, 4500));
});
