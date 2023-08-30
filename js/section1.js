const field = document.body;
const rekt = field.getBoundingClientRect();

const fieldX = rekt.left + rekt.width / 2;
const fieldY = rekt.top + rekt.height / 2;

const bounce = document.getElementById('ball');

bounce.addEventListener('animationend', () => {
    $('#s1').fadeIn("slow");
    $('#s2').fadeIn("slow");
    $('#s3').fadeIn("slow");
    $('#s4').fadeIn("slow");
    $('#s5').fadeIn("slow");
    $('.face').fadeIn("slow");
    $('.eyes').fadeIn("slow");
    $('#intro').fadeOut("slow");
});

document.addEventListener('mousemove', (pos) => {
    console.log(pos)

    const mouseX = pos.clientX;
    const mouseY = pos.clientY;

    const angleDeg = angle(mouseX, mouseY, fieldX, fieldY);

    console.log(angleDeg)

    const eyes = document.querySelectorAll('.eye')
    eyes.forEach(eye => {
        eye.style.transform = `rotate(${angleDeg}deg)`;
    })
})

function angle(cx, cy, ex, ey) {
    const dy = ey - cy;
    const dx = ex - cx;
    const rad = Math.atan2(dy, dx);
    const deg = rad * 180 / Math.PI;
    return deg;
}