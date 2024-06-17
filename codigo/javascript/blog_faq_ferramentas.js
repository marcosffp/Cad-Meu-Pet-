//função do navbar mobile
document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".mobile-menu-icon button");
    const menu = document.querySelector(".menu");
  
    menuIcon.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
  
    init();
  });


document.addEventListener("DOMContentLoaded", function () {
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach(button => {
    button.addEventListener("click", function () {
      const contentId = this.getAttribute("data-toggle");
      const content = document.getElementById(contentId);

      if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "block";
        this.textContent = "-";
      } else {
        content.style.display = "none";
        this.textContent = "+";
      }
    });
  });
});

