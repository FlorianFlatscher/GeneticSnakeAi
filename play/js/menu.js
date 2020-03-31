const s = document.querySelector("#start");
const menu = document.querySelector("#menu");

s.addEventListener("click", () => {
    start();
    const tl = new TimelineLite();
    tl.to(menu, 1, {borderRadius: "100%", top: "100%"});
});
