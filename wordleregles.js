const pageOne = document.getElementById("rules-one")
const pageTwo = document.getElementById("rules-two")
const pageBtn = document.getElementById("page-btn")

pageBtn.addEventListener("click", () => {
    pageOne.style.display = pageOne.style.display === "none" ? "block" : "none"
    pageTwo.style.display = pageOne.style.display === "none" ? "block" : "none"
    pageBtn.innerText = pageBtn.innerText === "Passer a Page 2" ? "Retourner a Page 1" : "Passer a Page 2"
})