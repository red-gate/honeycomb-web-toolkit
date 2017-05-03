const init = () => {
    const navs = document.querySelectorAll(".nav--vertical");
    for(let i=0; i<navs.length; i++) {
        let nav = navs[i];

        let as = nav.querySelectorAll("a");
        for(let a=0; a<as.length; a++) {
            let a = as[a];
            let href = a.getAttribute("href");
            if (!href) {
                a.addEventListener("click", e => {
                    e.preventDefault();

                    if(a.parentElement.classList.contains("nav--vertical__collapse")) {
                        nav.classList.toggle("nav--vertical--collapsed");
                    } else {
                        a.parentElement.classList.toggle("nav--vertical__active");
                    }
                });
            }
        }
    }
};

export default {
    init: init
};
