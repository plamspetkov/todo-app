const theme = document.documentElement;
theme.classList.add('dark');
const srOnly = document.querySelector('.sr-only');

function setTheme() {
	console.log(theme.classList);
	if (theme.classList.contains('dark')) {
		theme.classList.remove('dark');
		theme.classList.add('light');
		srOnly.innerHTML = 'Dark Theme';
	} else {
		theme.classList.remove('light');
		theme.classList.add('dark');
		srOnly.innerHTML = 'Light Theme';
	}
}
