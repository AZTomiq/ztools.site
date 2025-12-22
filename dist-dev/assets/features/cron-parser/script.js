document.addEventListener('DOMContentLoaded', () => {
  const cronInput = document.getElementById('cron-input');
  const cronReadable = document.getElementById('cron-readable');
  const exampleBtns = document.querySelectorAll('.example-btn');

  function parseCron() {
    const valet = cronInput.value.trim();
    if (!valet) {
      cronReadable.innerText = '';
      return;
    }

    try {
      // Get current locale
      const locale = document.documentElement.lang === 'vi' ? 'vi' : 'en';

      const description = cronstrue.toString(valet, {
        locale: locale,
        use24HourTimeFormat: true
      });

      cronReadable.innerText = description;
      cronReadable.classList.remove('text-red-500');
      cronReadable.classList.add('text-primary');
    } catch (e) {
      const errorMsg = document.documentElement.lang === 'vi' ? 'Biểu thức Cron không hợp lệ' : 'Invalid Cron expression';
      cronReadable.innerText = errorMsg;
      cronReadable.classList.remove('text-primary');
      cronReadable.classList.add('text-red-500');
    }
  }

  cronInput.addEventListener('input', parseCron);

  exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      cronInput.value = btn.dataset.cron;
      parseCron();
      // Visual feedback
      btn.classList.add('border-primary');
      setTimeout(() => btn.classList.remove('border-primary'), 300);
    });
  });

  // Initial parse
  parseCron();
});
