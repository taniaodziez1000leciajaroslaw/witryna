/**
 * Główny plik JavaScript dla strony Tania Odzież
 *
 * Tabela treści:
 * 1. PRZEŁĄCZNIK MOTYWU (DZIEŃ/NOC)
 * 2. MOBILNE MENU NAWIGACYJNE
 * 3. KARUZELA AKTUALNOŚCI Z FACEBOOKA
 * 4. LIGHTBOX DLA GALERII ZDJĘĆ
 * 5. FILTROWANIE SKLEPÓW (na podstronie sklepy.html)
 * 6. ANIMACJE PRZY PRZEWIJANIU (INTERSECTION OBSERVER)
 * 7. DYNAMICZNY LICZNIK CZASU DO NOWEJ DOSTAWY
 * 8. OBSŁUGA FORMULARZA KONTAKTOWEGO (AJAX)
 */

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    // 1. PRZEŁĄCZNIK MOTYWU (DZIEŃ/NOC)
    // ===================================================================
    const htmlElement = document.documentElement;

    /**
     * Synchronizuje stan wszystkich przełączników motywu (desktop i mobile).
     * @param {string} theme - Nazwa motywu ('light' lub 'dark').
     */
    const syncToggles = (theme) => {
        const isLight = theme === 'light';
        document.querySelectorAll('.theme-switch input[type="checkbox"]').forEach(toggle => {
            toggle.checked = isLight;
        });
    };

    /**
     * Aplikuje wybrany motyw, zapisuje go w localStorage i synchronizuje przełączniki.
     * @param {string} theme - Nazwa motywu ('light' lub 'dark').
     */
    const applyTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        syncToggles(theme);
    };

    /**
     * Dodaje nasłuchiwanie na zmianę stanu przełącznika motywu.
     * @param {HTMLElement} toggleInput - Element input typu checkbox.
     */
    const addThemeToggleListener = (toggleInput) => {
        toggleInput.addEventListener('change', (event) => {
            const newTheme = event.target.checked ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    };

    // Inicjalizacja motywu przy ładowaniu strony (sprawdza zapisany wybór lub ustawia domyślny).
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Dodanie logiki do głównego, desktopowego przełącznika.
    const mainThemeToggle = document.getElementById('theme-toggle');
    if (mainThemeToggle) {
        addThemeToggleListener(mainThemeToggle);
    }


    // ===================================================================
    // 2. MOBILNE MENU NAWIGACYJNE
    // ===================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        // Klonowanie przełącznika motywu z wersji desktop do menu mobilnego.
        const desktopToggleWrapper = document.querySelector('.theme-switch-wrapper');
        if (desktopToggleWrapper) {
            const mobileToggle = desktopToggleWrapper.cloneNode(true);
            mobileToggle.classList.add('mobile-theme-switch');

            // Zmiana ID i 'for', aby uniknąć duplikatów i zapewnić poprawne działanie.
            const mobileInput = mobileToggle.querySelector('input');
            const mobileLabel = mobileToggle.querySelector('label');
            const newId = 'mobile-theme-toggle';
            mobileInput.id = newId;
            mobileLabel.htmlFor = newId;

            mainNav.appendChild(mobileToggle);
            addThemeToggleListener(mobileInput); // Dodanie logiki do sklonowanego przełącznika.
            syncToggles(savedTheme); // Synchronizacja stanu sklonowanego przełącznika.
        }

        // Logika otwierania i zamykania menu mobilnego po kliknięciu w "hamburger".
        mobileNavToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');

            // Zmiana ikony hamburgera na "X" i z powrotem.
            const icon = mobileNavToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }


    // ===================================================================
    // 3. KARUZELA AKTUALNOŚCI Z FACEBOOKA
    // ===================================================================
    const newsCarousel = document.querySelector('.news-carousel-container');
    if (newsCarousel) {
        const newsSlides = newsCarousel.querySelectorAll('.news-slide');
        let currentNewsIndex = 0;

        if (newsSlides.length > 1) {
            setInterval(() => {
                newsSlides[currentNewsIndex].classList.remove('active');
                currentNewsIndex = (currentNewsIndex + 1) % newsSlides.length;
                newsSlides[currentNewsIndex].classList.add('active');
            }, 5500); // Zmieniaj slajd co 5.5 sekundy
        }
    }


    // ===================================================================
    // 4. LIGHTBOX DLA GALERII ZDJĘĆ
    // ===================================================================
    const galleryImages = document.querySelectorAll('.gallery-image-wrapper');
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeLightboxBtn = document.querySelector('.close-lightbox-btn');

    if (galleryImages.length > 0 && lightbox && lightboxImg && closeLightboxBtn) {
        // Funkcja otwierająca lightbox z klikniętym zdjęciem.
        const openLightbox = (e) => {
            const imgSrc = e.currentTarget.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.classList.add('active');
            document.body.classList.add('lightbox-open'); // Blokuje przewijanie tła
        };

        // Funkcja zamykająca lightbox.
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.classList.remove('lightbox-open'); // Odblokowuje przewijanie tła
        };

        // Dodanie nasłuchiwania na kliknięcie do każdego zdjęcia w galerii.
        galleryImages.forEach(item => {
            item.addEventListener('click', openLightbox);
        });

        // Obsługa zamykania: przycisk "X", kliknięcie obok zdjęcia, klawisz Escape.
        closeLightboxBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // ===================================================================
    // 5. FILTROWANIE SKLEPÓW (na podstronie sklepy.html)
    // ===================================================================
    const filterWojewodztwo = document.getElementById('filter-wojewodztwo');
    const filterMiasto = document.getElementById('filter-miasto');
    const storeCards = document.querySelectorAll('.store-card');

    if (filterWojewodztwo && filterMiasto && storeCards.length > 0) {
        const applyFilters = () => {
            const wojewodztwo = filterWojewodztwo.value;
            const miasto = filterMiasto.value;

            storeCards.forEach(card => {
                const cardWojewodztwo = card.dataset.wojewodztwo;
                const cardMiasto = card.dataset.miasto;

                const wojewodztwoMatch = (wojewodztwo === 'wszystkie') || (wojewodztwo === cardWojewodztwo);
                const miastoMatch = (miasto === 'wszystkie') || (miasto === cardMiasto);

                if (wojewodztwoMatch && miastoMatch) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        filterWojewodztwo.addEventListener('change', applyFilters);
        filterMiasto.addEventListener('change', applyFilters);
        applyFilters(); // Uruchomienie filtrowania przy załadowaniu strony
    }


    // ===================================================================
    // 6. ANIMACJE PRZY PRZEWIJANIU (INTERSECTION OBSERVER)
    // ===================================================================
    const animatedElements = document.querySelectorAll('.fade-in-up');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Gdy element wjedzie w pole widzenia, dodaj klasę .is-visible
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Przestań obserwować, aby animacja nie powtarzała się
                }
            });
        }, { threshold: 0.1 }); // Uruchom, gdy 10% elementu jest widoczne

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }


    // ===================================================================
    // 7. DYNAMICZNY LICZNIK CZASU DO NOWEJ DOSTAWY
    // ===================================================================
    const countdownTimer = document.getElementById('countdown-timer');
    if (countdownTimer) {
        // Elementy DOM do wyświetlania czasu
        const countdownMessageEl = document.getElementById('countdown-message');
        const timerContainerEl = document.getElementById('timer-container');
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        // --- KONFIGURACJA ---
        // Ustaw datę startową cyklu (jakąkolwiek przeszłą środę, od której liczony jest cykl co 2 tygodnie)
        const cycleStartDate = new Date('2024-05-01T09:00:00');

        // Funkcja obliczająca datę najbliższej przyszłej dostawy
        const calculateNextDelivery = () => {
            let nextDelivery = new Date(cycleStartDate.getTime());
            const now = new Date();
            // Pętla dodaje 14 dni, dopóki data dostawy nie będzie w przyszłości
            while (nextDelivery <= now) {
                nextDelivery.setDate(nextDelivery.getDate() + 14);
            }
            return nextDelivery;
        };

        // Funkcja aktualizująca licznik co sekundę
        const updateCountdown = () => {
            const targetDate = calculateNextDelivery();
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                timerContainerEl.style.display = 'none';
                countdownMessageEl.textContent = 'Nowa dostawa już dziś!';
                return;
            }

            timerContainerEl.style.display = 'flex';
            countdownMessageEl.textContent = 'Do następnej dostawy pozostało:';

            // Obliczenia czasu
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Funkcja pomocnicza do dodawania zera z przodu (np. 9 -> 09)
            const format = (num) => (num < 10 ? '0' + num : num);

            daysEl.textContent = format(days);
            hoursEl.textContent = format(hours);
            minutesEl.textContent = format(minutes);
            secondsEl.textContent = format(seconds);
        };

        setInterval(updateCountdown, 1000); // Uruchamiaj funkcję co sekundę
        updateCountdown(); // Uruchom od razu, nie czekając 1s
    }

});


// ===================================================================
// 8. OBSŁUGA FORMULARZA KONTAKTOWEGO (AJAX)
// ===================================================================
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Zapobiegaj domyślnemu przeładowaniu strony
        
        const form = e.target;
        const data = new FormData(form);
        
        try {
            // Asynchroniczne wysłanie danych do Formspree
            const response = await fetch(form.action, {
                method: form.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                // Jeśli wysyłka się powiodła
                formStatus.innerHTML = "Dziękujemy! Twoja wiadomość została wysłana.";
                formStatus.className = 'form-notification success';
                form.style.display = 'none'; // Ukryj formularz po wysłaniu
            } else {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            // Jeśli wystąpił błąd
            formStatus.innerHTML = "Wystąpił błąd. Spróbuj ponownie później.";
            formStatus.className = 'form-notification error';
        }
    });
}