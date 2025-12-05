document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.booking-form');
  if (!form) return;

  /* ==============================
     SERVICE MODAL
  ============================== */
  const servicesData = {
    makeup: [
      { name: 'Soft Glam', price: '$60', duration: '1 hr', desc: 'Natural glam look with lashes included.' },
      { name: 'Full Glam', price: '$80', duration: '1.5 hr', desc: 'Bold, glamorous makeup for events.' },
      { name: 'Bridal / Wedding', price: '$120', duration: '2 hr', desc: 'Long-lasting makeup for weddings.' }
    ],
    lash: [
      { name: 'Classic Lash', price: '$50', duration: '1 hr', desc: 'Natural individual lash extensions.' },
      { name: 'Hybrid Lash', price: '$65', duration: '1.5 hr', desc: 'Mix of classic + volume lashes.' },
      { name: 'Volume Lash', price: '$80', duration: '2 hr', desc: 'Full, fluffy lash look.' },
      { name: 'Cat Eye', price: '$85', duration: '2 hr', desc: 'Dramatic winged style.' }
    ],
    microblading: [
      { name: 'Standard Microblading', price: '$200', duration: '2 hr', desc: 'Semi-permanent eyebrow shaping.' },
      { name: 'Ombré / Powder Brows', price: '$250', duration: '2.5 hr', desc: 'Soft, shaded brows.' },
      { name: 'Touch Up', price: '$100', duration: '1 hr', desc: 'Maintain your brows.' }
    ]
  };

  const serviceModal = document.getElementById('serviceModal');
  const serviceModalTitle = serviceModal?.querySelector('.modal-title');
  const serviceModalContent = serviceModal?.querySelector('.modal-content');
  const serviceModalClose = serviceModal?.querySelector('.modal-close');

  document.querySelectorAll('.grid-card[data-category]').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      if (!category || !servicesData[category]) return;

      serviceModalTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Services';
      serviceModalContent.innerHTML = '';

      servicesData[category].forEach(service => {
        const div = document.createElement('div');
        div.className = 'modal-service';
        div.innerHTML = `
          <h4>${service.name} — ${service.price}</h4>
          <p><strong>Duration:</strong> ${service.duration}</p>
          <p>${service.desc}</p>
          <button class="book-now">Book Now</button>
        `;
        div.querySelector('.book-now').addEventListener('click', () => {
          serviceModal.setAttribute('aria-hidden', 'true');
          const select = form.querySelector('select');
          if (select) {
            const exists = Array.from(select.options).some(opt => opt.value === service.name);
            if (exists) select.value = service.name;
          }
          const dateInput = form.querySelector('input[type="datetime-local"]');
          if (dateInput) {
            dateInput.style.border = '2px solid #2563eb';
            dateInput.focus();
            setTimeout(() => { dateInput.style.border = ''; }, 2000);
          }
          document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth' });
        });
        serviceModalContent.appendChild(div);
      });

      serviceModal.setAttribute('aria-hidden', 'false');
    });
  });

  serviceModalClose?.addEventListener('click', () => serviceModal.setAttribute('aria-hidden', 'true'));
  serviceModal?.addEventListener('click', e => { if (e.target === serviceModal) serviceModal.setAttribute('aria-hidden', 'true'); });