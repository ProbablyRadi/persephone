// Home character selection and the standalone photo gallery.
// Loaded before app.js; shared functions remain available to the other scripts.

function galleryItems() {
    if (typeof GALLERY_ITEMS === 'undefined' || !Array.isArray(GALLERY_ITEMS))
        return [];
    return GALLERY_ITEMS.filter(item => item && typeof item.src === 'string' && item.src.trim());
}

function galleryAttribute(value) {
    return esc(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function galleryMarkup() {
    const photos = galleryItems();

    if (!photos.length) {
        return `<section class="gallery-carousel is-empty" aria-label="Gallery">
            <div class="gallery-empty">
                <div class="gallery-icon" aria-hidden="true">▧</div>
                <h2>Gallery</h2>
                <p>Photos and their stories will appear here.</p>
            </div>
        </section>`;
    }

    const slides = photos.map((photo, index) => `
        <figure class="gallery-slide" role="group" aria-roledescription="slide"
                aria-label="${index + 1} of ${photos.length}" ${index ? 'hidden aria-hidden="true"' : 'aria-hidden="false"'}>
            <img src="${galleryAttribute(photo.src)}"
                 alt="${galleryAttribute(photo.alt || photo.title || 'Gallery photograph')}"
                 loading="lazy">
            <figcaption>
                <strong>${esc(photo.title || `Photo ${index + 1}`)}</strong>
                ${photo.description ? `<span>${esc(photo.description)}</span>` : ''}
            </figcaption>
        </figure>
    `).join('');

    const controls = photos.length > 1 ? `
        <button class="gallery-arrow is-previous" type="button" data-gallery-action="previous" aria-label="Previous gallery photo">‹</button>
        <button class="gallery-arrow is-next" type="button" data-gallery-action="next" aria-label="Next gallery photo">›</button>
        <div class="gallery-dots" role="group" aria-label="Choose gallery photo">
            ${photos.map((photo, index) => `<button type="button" class="gallery-dot"
                data-gallery-action="go" data-gallery-index="${index}"
                aria-label="Show gallery photo ${index + 1}" aria-current="${index === 0}"></button>`).join('')}
        </div>` : '';

    return `<section class="gallery-carousel" role="region" aria-roledescription="carousel"
                     aria-label="Gallery" tabindex="0">
        <div class="gallery-slides">${slides}</div>
        <span class="gallery-count" aria-live="polite">Gallery · 1 / ${photos.length}</span>
        ${controls}
    </section>`;
}

// Keep the controls in place while changing slides so keyboard focus is not
// lost when a visitor uses the previous/next buttons or numbered dots.
function setGallerySlide(gallery, requestedIndex) {
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    if (!slides.length)
        return;

    const index = ((requestedIndex % slides.length) + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
        const selected = slideIndex === index;
        slide.hidden = !selected;
        slide.setAttribute('aria-hidden', String(!selected));
    });
    gallery.querySelectorAll('.gallery-dot').forEach((dot, dotIndex) => {
        dot.setAttribute('aria-current', String(dotIndex === index));
    });
    const counter = gallery.querySelector('.gallery-count');
    if (counter)
        counter.textContent = `Gallery · ${index + 1} / ${slides.length}`;
    gallery.dataset.activeIndex = String(index);
}

function enableGallery() {
    const gallery = app.querySelector && app.querySelector('.gallery-carousel:not(.is-empty)');
    if (!gallery)
        return;

    function step(delta) {
        const index = Number(gallery.dataset.activeIndex || 0);
        setGallerySlide(gallery, index + delta);
    }

    gallery.addEventListener('click', event => {
        const button = event.target.closest('button[data-gallery-action]');
        if (!button)
            return;
        const action = button.dataset.galleryAction;
        if (action === 'previous')
            step(-1);
        else if (action === 'next')
            step(1);
        else if (action === 'go')
            setGallerySlide(gallery, Number(button.dataset.galleryIndex));
    });

    gallery.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            step(event.key === 'ArrowLeft' ? -1 : 1);
        }
    });

    // On touch screens, visitors can swipe as well as use the arrow buttons.
    let touchX = null;
    gallery.addEventListener('touchstart', event => {
        touchX = event.changedTouches[0]?.screenX ?? null;
    }, { passive: true });
    gallery.addEventListener('touchend', event => {
        if (touchX == null)
            return;
        const movement = event.changedTouches[0].screenX - touchX;
        if (Math.abs(movement) > 55)
            step(movement > 0 ? -1 : 1);
        touchX = null;
    }, { passive: true });
}

// CSS variables containing relative URLs resolve against the consuming stylesheet.
// Make these absolute so moving the stylesheet cannot move the image location.
function homeImageUrl(assetPath) {
    return assetPath ? galleryAttribute(new URL(assetPath, document.baseURI).href) : '';
}

function home() {
    app.className = 'home-page';
    nav.innerHTML = '';
    const homePlayerIds = Object.keys(DATA);
    app.innerHTML = `<h1>FC26 Career Wiki</h1><div class="home-tiles">${homePlayerIds.map(id => {
        const playerData = DATA[id];
        const homeBackground = playerData.homeBackground || '';
        const tileClass = homeBackground
            ? 'home-player-tile has-character-background'
            : 'home-player-tile';

        return `
            <a
                class="${tileClass}"
                href="#${id}"
                style="
                    --club-crest: url('${homeImageUrl(playerData.homeCrest)}');
                    --character-background: url('${homeImageUrl(homeBackground)}');
                "
            >
                <span>${playerData.flag} ${playerData.displayName || playerData.name}</span>
            </a>
        `;
    }).join('')}</div>
    <div class="home-actions">
        <a class="home-gallery-link" href="#gallery" aria-label="Open photo gallery">Photo gallery →</a>
    </div>`;
}

function galleryPage() {
    app.className = 'gallery-page';
    nav.innerHTML = '';
    app.innerHTML = `
        <div class="gallery-page-header">
            <a class="gallery-back-link" href="#home">← Back to character select</a>
            <h1>Photo gallery</h1>
            <p>Photos of Rens Adisea, Jordan Vale and Vasiliki Dimitriou.</p>
        </div>
        ${galleryMarkup()}
    `;
    enableGallery();
}
