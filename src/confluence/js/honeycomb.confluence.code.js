const titles = document.querySelectorAll('.code__title');

const init = () => {
    collapseAll();

    for (var i=0; i<titles.length; i++) {
        titles[i].addEventListener('click', function() {       
            const code = this.nextElementSibling;               
            if (code.style.display === 'none') {

                // Display code
                code.style.display = 'block';

                this.style.marginBottom = '0';
                this.setAttribute('data-code-open', 'true');

            } else {

                // Hide code
                code.style.display = 'none';

                this.style.marginBottom = '1rem';
                this.setAttribute('data-code-open', 'false');
            }
        });
    }
};

const collapseAll = () => {
    const codes = document.querySelectorAll('.code__title + .prettyprint');
    
    for (let i=0; i<codes.length; i++) {
        codes[i].style.display = 'none';
    }
    
    for (let a=0; a<titles.length; a++) {
        titles[a].style.marginBottom = '1rem';
        titles[a].setAttribute('data-code-open', 'false');
        titles[a].innerHTML += ' <small class="float-right">Toggle source code</small>';
    }
};

export default {
    init
};