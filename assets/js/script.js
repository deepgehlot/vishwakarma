console.clear();

const { gsap, imagesLoaded } = window;

const buttons = {
    prev: document.querySelector(".btn--left"),
    next: document.querySelector(".btn--right"),
};
const card1sContainerEl = document.querySelector(".card1s__wrapper");
const appBgContainerEl = document.querySelector(".app__bg");

const card1InfosContainerEl = document.querySelector(".info__wrapper");

buttons.next.addEventListener("click", () => swapcard1s("right"));

buttons.prev.addEventListener("click", () => swapcard1s("left"));

function swapcard1s(direction) {
    const currentcard1El = card1sContainerEl.querySelector(".current--card1");
    const previouscard1El = card1sContainerEl.querySelector(".previous--card1");
    const nextcard1El = card1sContainerEl.querySelector(".next--card1");

    const currentBgImageEl = appBgContainerEl.querySelector(".current--image");
    const previousBgImageEl = appBgContainerEl.querySelector(".previous--image");
    const nextBgImageEl = appBgContainerEl.querySelector(".next--image");

    changeInfo(direction);
    swapcard1sClass();

    removecard1Events(currentcard1El);

    function swapcard1sClass() {
        currentcard1El.classList.remove("current--card1");
        previouscard1El.classList.remove("previous--card1");
        nextcard1El.classList.remove("next--card1");

        currentBgImageEl.classList.remove("current--image");
        previousBgImageEl.classList.remove("previous--image");
        nextBgImageEl.classList.remove("next--image");

        currentcard1El.style.zIndex = "50";
        currentBgImageEl.style.zIndex = "-2";

        if (direction === "right") {
            previouscard1El.style.zIndex = "20";
            nextcard1El.style.zIndex = "30";

            nextBgImageEl.style.zIndex = "-1";

            currentcard1El.classList.add("previous--card1");
            previouscard1El.classList.add("next--card1");
            nextcard1El.classList.add("current--card1");

            currentBgImageEl.classList.add("previous--image");
            previousBgImageEl.classList.add("next--image");
            nextBgImageEl.classList.add("current--image");
        } else if (direction === "left") {
            previouscard1El.style.zIndex = "30";
            nextcard1El.style.zIndex = "20";

            previousBgImageEl.style.zIndex = "-1";

            currentcard1El.classList.add("next--card1");
            previouscard1El.classList.add("current--card1");
            nextcard1El.classList.add("previous--card1");

            currentBgImageEl.classList.add("next--image");
            previousBgImageEl.classList.add("current--image");
            nextBgImageEl.classList.add("previous--image");
        }
    }
}

function changeInfo(direction) {
    let currentInfoEl = card1InfosContainerEl.querySelector(".current--info");
    let previousInfoEl = card1InfosContainerEl.querySelector(".previous--info");
    let nextInfoEl = card1InfosContainerEl.querySelector(".next--info");

    gsap.timeline()
        .to([buttons.prev, buttons.next], {
            duration: 0.2,
            opacity: 0.5,
            pointerEvents: "none",
        })
        .to(
            currentInfoEl.querySelectorAll(".text"), {
                duration: 0.4,
                stagger: 0.1,
                translateY: "-120px",
                opacity: 0,
            },
            "-="
        )
        .call(() => {
            swapInfosClass(direction);
        })
        .call(() => initcard1Events())
        .fromTo(
            direction === "right" ?
            nextInfoEl.querySelectorAll(".text") :
            previousInfoEl.querySelectorAll(".text"), {
                opacity: 0,
                translateY: "40px",
            }, {
                duration: 0.4,
                stagger: 0.1,
                translateY: "0px",
                opacity: 1,
            }
        )
        .to([buttons.prev, buttons.next], {
            duration: 0.2,
            opacity: 1,
            pointerEvents: "all",
        });

    function swapInfosClass() {
        currentInfoEl.classList.remove("current--info");
        previousInfoEl.classList.remove("previous--info");
        nextInfoEl.classList.remove("next--info");

        if (direction === "right") {
            currentInfoEl.classList.add("previous--info");
            nextInfoEl.classList.add("current--info");
            previousInfoEl.classList.add("next--info");
        } else if (direction === "left") {
            currentInfoEl.classList.add("next--info");
            nextInfoEl.classList.add("previous--info");
            previousInfoEl.classList.add("current--info");
        }
    }
}

function updatecard1(e) {
    const card1 = e.currentTarget;
    const box = card1.getBoundingClientRect();
    const centerPosition = {
        x: box.left + box.width / 2,
        y: box.top + box.height / 2,
    };
    let angle = Math.atan2(e.pageX - centerPosition.x, 0) * (35 / Math.PI);
    gsap.set(card1, {
        "--current-card1-rotation-offset": `${angle}deg`,
    });
    const currentInfoEl = card1InfosContainerEl.querySelector(".current--info");
    gsap.set(currentInfoEl, {
        rotateY: `${angle}deg`,
    });
}

function resetcard1Transforms(e) {
    const card1 = e.currentTarget;
    const currentInfoEl = card1InfosContainerEl.querySelector(".current--info");
    gsap.set(card1, {
        "--current-card1-rotation-offset": 0,
    });
    gsap.set(currentInfoEl, {
        rotateY: 0,
    });
}

function initcard1Events() {
    const currentcard1El = card1sContainerEl.querySelector(".current--card1");
    currentcard1El.addEventListener("pointermove", updatecard1);
    currentcard1El.addEventListener("pointerout", (e) => {
        resetcard1Transforms(e);
    });
}

initcard1Events();

function removecard1Events(card1) {
    card1.removeEventListener("pointermove", updatecard1);
}

function init() {

    let tl = gsap.timeline();

    tl.to(card1sContainerEl.children, {
            delay: 0.15,
            duration: 0.5,
            stagger: {
                ease: "power4.inOut",
                from: "right",
                amount: 0.1,
            },
            "--card1-translateY-offset": "0%",
        })
        .to(card1InfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
            delay: 0.5,
            duration: 0.4,
            stagger: 0.1,
            opacity: 1,
            translateY: 0,
        })
        .to(
            [buttons.prev, buttons.next], {
                duration: 0.4,
                opacity: 1,
                pointerEvents: "all",
            },
            "-=0.4"
        );
}

const waitForImages = () => {
    const images = [...document.querySelectorAll("img")];
    const totalImages = images.length;
    let loadedImages = 0;
    const loaderEl = document.querySelector(".loader span");

    gsap.set(card1sContainerEl.children, {
        "--card1-translateY-offset": "100vh",
    });
    gsap.set(card1InfosContainerEl.querySelector(".current--info").querySelectorAll(".text"), {
        translateY: "40px",
        opacity: 0,
    });
    gsap.set([buttons.prev, buttons.next], {
        pointerEvents: "none",
        opacity: "0",
    });

    images.forEach((image) => {
        imagesLoaded(image, (instance) => {
            if (instance.isComplete) {
                loadedImages++;
                let loadProgress = loadedImages / totalImages;

                gsap.to(loaderEl, {
                    duration: 1,
                    scaleX: loadProgress,
                    backgroundColor: `hsl(${loadProgress * 120}, 100%, 50%`,
                });

                if (totalImages == loadedImages) {
                    gsap.timeline()
                        .to(".loading__wrapper", {
                            duration: 0.8,
                            opacity: 0,
                            pointerEvents: "none",
                        })
                        .call(() => init());
                }
            }
        });
    });
};

waitForImages();