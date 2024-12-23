const pageOne = document.getElementById("cs-rules-one")
const pageTwo = document.getElementById("cs-rules-two")
const pageBtn = document.getElementById("cs-page-btn")

pageBtn.addEventListener("click", () => {
    pageOne.style.display = pageOne.style.display === "none" ? "block" : "none"
    pageTwo.style.display = pageOne.style.display === "none" ? "block" : "none"
    pageBtn.innerText = pageBtn.innerText === "Passer a Page 2" ? "Retourner a Page 1" : "Passer a Page 2"
})