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

   const categories = {
    makeup: ['makeup01.jpg','makeup02.jpg','makeup03.jpg','makeup04.jpg','makeup05.jpg','makeup06.jpg'],
    lash: ['lash01.jpg','lash02.jpg','lash03.jpg','lash04.jpg','lash05.jpg','lash06.jpg'],
    microblading: ['microblade01.jpg','microblade02.jpg','microblade03.jpg','microblade04.jpg','microblade05.jpg','microblade06.jpg']
  };

  const galleryModal = document.getElementById('galleryModal');
  const galleryModalGrid = document.getElementById('modalGalleryGrid');
  const galleryModalTitle = galleryModal?.querySelector('.modal-title');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lbPrev = document.getElementById('lightboxPrev');
  const lbNext = document.getElementById('lightboxNext');
  const lbClose = document.querySelector('.lightbox-close');

  let currentCategory = null, currentIndex = 0, currentArray = [];

  function openGalleryModal(cat) {
    if (!categories[cat]) return;
    currentCategory = cat;
    currentArray = categories[cat];
    galleryModalTitle.textContent = cat.charAt(0).toUpperCase() + cat.slice(1) + ' — Portfolio';
    galleryModal.setAttribute('aria-hidden', 'false');
    galleryModalGrid.innerHTML = '';

    currentArray.forEach((file, i) => {
      const div = document.createElement('div');
      div.className = 'modal-thumb';
      const img = document.createElement('img');
      img.src = `./assets/media/${file}`;
      img.alt = `${cat} ${i+1}`;
      img.addEventListener('click', () => openLightbox(i));
      div.appendChild(img);
      galleryModalGrid.appendChild(div);
    });
  }

  function closeGalleryModal() { galleryModal.setAttribute('aria-hidden', 'true'); }
  function openLightbox(i) { currentIndex = i; lightboxImg.src = `./assets/media/${currentArray[currentIndex]}`; lightbox.setAttribute('aria-hidden', 'false'); }
  function closeLightbox() { lightbox.setAttribute('aria-hidden', 'true'); }

  document.querySelectorAll('.category-item').forEach(item => item.addEventListener('click', () => openGalleryModal(item.dataset.category)));
  galleryModal?.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeGalleryModal));
  galleryModal?.addEventListener('click', e => { if (e.target === galleryModal) closeGalleryModal(); });

  lbPrev?.addEventListener('click', () => { currentIndex = (currentIndex-1+currentArray.length)%currentArray.length; openLightbox(currentIndex); });
  lbNext?.addEventListener('click', () => { currentIndex = (currentIndex+1)%currentArray.length; openLightbox(currentIndex); });
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (lightbox?.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'ArrowLeft') lbPrev.click();
      if (e.key === 'ArrowRight') lbNext.click();
      if (e.key === 'Escape') closeLightbox();
    } else if (galleryModal?.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') closeGalleryModal();
    }
  });

  /* ==============================
     BOOKING FORM SUBMIT
  ============================== */
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const service = form.querySelector('select').value;
    const dateTime = form.querySelector('input[type="datetime-local"]').value;

    try {
      const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec', {
        method: 'POST',
        body: JSON.stringify({ name, email, service, dateTime }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (result.status === 'taken') alert(`${dateTime} is already booked. Please select another time.`);
      else { alert(`Thank you, ${name}! Your appointment for ${service} is confirmed on ${dateTime}.`); form.reset(); }
    } catch(err) { console.error(err); alert('Error submitting appointment.'); }
  });