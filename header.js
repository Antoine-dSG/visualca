function toggleRank2Dropdown(event) {
  event.stopPropagation();

  const dropdownContent = document.getElementById('rank2-dropdown');
  if (!dropdownContent) {
    return;
  }

  const button = event.currentTarget;
  const isOpen = dropdownContent.classList.toggle('show');
  button.setAttribute('aria-expanded', String(isOpen));
}

document.addEventListener('click', () => {
  const dropdownContent = document.getElementById('rank2-dropdown');
  const button = document.querySelector('.dropbtn');

  if (!dropdownContent || !button) {
    return;
  }

  if (dropdownContent.classList.contains('show')) {
    dropdownContent.classList.remove('show');
    button.setAttribute('aria-expanded', 'false');
  }
});