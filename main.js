let nav = document.querySelectorAll('.nav__item');
console.log(nav)


nav.forEach(e => {
    e.addEventListener('click', () => {
        e.classList.remove('nav__item-active')
        e.classList.add('nav__item-active')
    })
})
