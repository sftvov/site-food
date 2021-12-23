burger.onclick = () => {
	toggleBurger();
};

function toggleBurger() {
	body.classList.toggle('_lock');
	burger.classList.toggle('_active');
	menu.classList.toggle('_active');
}

function closeBurger() {
	body.classList.remove('_lock');
	burger.classList.remove('_active');
	menu.classList.remove('_active');
}

menu.addEventListener('click', (e) => {
	if (e.target.tagName === 'A') {
		closeBurger();
	}
});
