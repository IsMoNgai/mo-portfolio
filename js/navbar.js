let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let header = document.querySelector('header');

var scrollableElement = document.body;

scrollableElement.addEventListener('wheel', checkScrollDirection);

header.classList.remove('nav');

function checkScrollDirection(event) {
  if (checkScrollDirectionIsUp(event)) {
    header.classList.remove('nav');
  } else {
    header.classList.add('nav');
  }
}

function checkScrollDirectionIsUp(event) {
    if (event.wheelDelta) {
        return event.wheelDelta > 0;
    }
    return event.deltaY < 0;
}

function JumpView(section) {
  const element = document.getElementById(section);
  element.scrollIntoView();
}

menu.addEventListener('click', () => {
    console.log("hello");
    navbar.classList.toggle('open');
})

document.querySelectorAll('.navbar').forEach(n => n.addEventListener('click', ()=>{
    navbar.classList.remove('open');
}))

