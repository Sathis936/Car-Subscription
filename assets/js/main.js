/* ==========================================================================
   VeloceDrive — Main Interactive Logic (INR ₹ Currency Edition)
   Powers Theme Switcher, TCO Calculator, Fleet Filtering, Pricing Configurator,
   Subscriber Dashboard Telemetry/Plan Manager, and Auth Portal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  try { initTheme(); } catch (e) { console.warn('Theme init:', e); }
  try { initMobileNav(); } catch (e) { console.warn('Mobile nav init:', e); }
  try { initFaqAccordions(); } catch (e) { console.warn('FAQ init:', e); }
  try { initOwnershipCalculator(); } catch (e) { console.warn('Calc init:', e); }
  try { initFleetCatalog(); } catch (e) { console.warn('Fleet init:', e); }
  try { initPricingConfigurator(); } catch (e) { console.warn('Pricing init:', e); }
  try { initSubscriberDashboard(); } catch (e) { console.warn('Dashboard init:', e); }
  try { initLoginPortal(); } catch (e) { console.warn('Login init:', e); }
  try { initContactForm(); } catch (e) { console.warn('Contact init:', e); }
  try { initContactMap(); } catch (e) { console.warn('Map init:', e); }
  try { initBlogPage(); } catch (e) { console.warn('Blog init:', e); }
  try { initServicesPage(); } catch (e) { console.warn('Services init:', e); }
  try { initGlobalFormValidation(); } catch (e) { console.warn('Form validation init:', e); }
  try { initStickyHeader(); } catch (e) { console.warn('Sticky header init:', e); }
  try { initRtl(); } catch (e) { console.warn('RTL init:', e); }
});

/* Helper: Format number in Indian Rupees (₹) */
function formatINR(amount) {
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

/* --------------------------------------------------------------------------
   1. Toast Notification Helper
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  let dotColor = 'var(--accent-emerald)';
  if (type === 'info') {
    toast.style.borderLeftColor = 'var(--accent-primary)';
    dotColor = 'var(--accent-primary)';
  } else if (type === 'warning') {
    toast.style.borderLeftColor = 'var(--accent-amber)';
    dotColor = '#f59e0b';
  } else if (type === 'error') {
    toast.style.borderLeftColor = '#ef4444';
    dotColor = '#ef4444';
  }

  toast.innerHTML = `
    <span style="color: ${dotColor}; font-weight: 800;">●</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 260);
  }, 3600);
}

/* --------------------------------------------------------------------------
   2. Theme Switcher (Dark Midnight Showroom / Light Daylight Studio)
   -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('velocedrive_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('velocedrive_theme', next);
      updateThemeIcons(next);
      showToast(
        next === 'dark'
          ? 'Switched to Midnight Showroom (Dark Theme)'
          : 'Switched to Daylight Studio (Light Theme)',
        'info'
      );
    });
  });
}

function updateThemeIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach((btn) => {
    btn.innerHTML =
      theme === 'dark'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    btn.setAttribute(
      'title',
      theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
    );
  });
}

/* --------------------------------------------------------------------------
   3. Mobile Navigation Drawer & Dropdown Handling
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  if (!navMenu) return;

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      menuBtn.classList.toggle('active', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('mobile-menu-open', isOpen);
    });
  }

  // Handle Dropdown Toggles (Desktop Click & Mobile Tap)
  const dropdownToggles = navMenu.querySelectorAll('.nav-dropdown-toggle');
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parent = toggle.closest('.nav-dropdown');
      if (!parent) return;
      const isOpen = parent.classList.contains('open');
      navMenu.querySelectorAll('.nav-dropdown').forEach((d) => {
        d.classList.remove('open');
        const t = d.querySelector('.nav-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        parent.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Regular nav links close the mobile menu
  navMenu.querySelectorAll('.nav-link:not(.nav-dropdown-toggle)').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      if (menuBtn) {
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('mobile-menu-open');
    });
  });

  // Dropdown items close the mobile menu and dropdown
  navMenu.querySelectorAll('.dropdown-item').forEach((item) => {
    item.addEventListener('click', () => {
      navMenu.classList.remove('open');
      if (menuBtn) {
        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('mobile-menu-open');
      const parent = item.closest('.nav-dropdown');
      if (parent) {
        parent.classList.remove('open');
        const t = parent.querySelector('.nav-dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close menus on outside click
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.nav-dropdown.open').forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });

    if (menuBtn && navMenu.classList.contains('open') && !navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      navMenu.classList.remove('open');
      menuBtn.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('mobile-menu-open');
    }
  });
}

/* --------------------------------------------------------------------------
   4. FAQ Accordions
   -------------------------------------------------------------------------- */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach((other) => other.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   5. Home Page: Subscription vs. Ownership & Leasing Calculator (INR ₹)
   -------------------------------------------------------------------------- */
function initOwnershipCalculator() {
  const msrpInput = document.getElementById('calcMsrp');
  const milesInput = document.getElementById('calcMiles');
  const swapsInput = document.getElementById('calcSwaps');

  if (!msrpInput || !milesInput) return;

  const updateCalc = () => {
    const msrp = parseInt(msrpInput.value, 10) || 6000000;
    const miles = parseInt(milesInput.value, 10) || 1200;
    const swaps = swapsInput ? parseInt(swapsInput.value, 10) : 3;

    const msrpDisplay = document.getElementById('calcMsrpVal');
    const milesDisplay = document.getElementById('calcMilesVal');
    const swapsDisplay = document.getElementById('calcSwapsVal');

    if (msrpDisplay) msrpDisplay.textContent = formatINR(msrp);
    if (milesDisplay) milesDisplay.textContent = `${miles.toLocaleString('en-IN')} mi/mo`;
    if (swapsDisplay) swapsDisplay.textContent = `${swaps} swaps/yr`;

    // Traditional Ownership Monthly TCO in INR (Loan + Depreciation + Insurance + Maintenance + Down Payment amortized)
    const monthlyLoanAndDepr = Math.round(msrp * 0.0175);
    const monthlyInsurance = Math.round(16500 + msrp * 0.0018);
    const monthlyMaintAndTires = Math.round(9500 + (miles / 1000) * 5200);
    const downPaymentAmortized = Math.round((msrp * 0.12) / 36);
    const totalOwnershipMonthly =
      monthlyLoanAndDepr + monthlyInsurance + monthlyMaintAndTires + downPaymentAmortized;

    // VeloceDrive All-Inclusive Subscription Rate in INR
    const baseSub = Math.round(msrp * 0.0155);
    const mileageAdj = miles > 1200 ? Math.round((miles - 1200) * 14) : 0;
    const totalSubMonthly = baseSub + mileageAdj;

    const monthlySavings = Math.max(12000, totalOwnershipMonthly - totalSubMonthly);
    const annualSavings = monthlySavings * 12;

    const ownOut = document.getElementById('calcOwnershipTotal');
    const subOut = document.getElementById('calcSubTotal');
    const saveOut = document.getElementById('calcAnnualSavings');
    const downSavedOut = document.getElementById('calcDownPaymentSaved');

    if (ownOut) ownOut.textContent = `${formatINR(totalOwnershipMonthly)}/mo`;
    if (subOut) subOut.textContent = `${formatINR(totalSubMonthly)}/mo`;
    if (saveOut) saveOut.textContent = `${formatINR(annualSavings)}/yr`;
    if (downSavedOut) {
      downSavedOut.textContent = `${formatINR(msrp * 0.12)} upfront cash kept`;
    }
  };

  msrpInput.addEventListener('input', updateCalc);
  milesInput.addEventListener('input', updateCalc);
  if (swapsInput) swapsInput.addEventListener('input', updateCalc);
  updateCalc();
}

/* --------------------------------------------------------------------------
   6. Fleet Catalog Filtering, Sorting, Search & Vehicle Specs Modal (INR ₹)
   -------------------------------------------------------------------------- */
const FLEET_VEHICLES = {
  'taycan-4s': {
    name: '2026 Porsche Taycan 4S Cross Turismo',
    category: 'Electric & Hybrid',
    tier: 'Apex Bespoke',
    price: 139900,
    power: '562 HP AWD',
    accel: '3.6s 0-60',
    range: '315 mi EPA',
    seats: '4 Adults + Cargo',
    insurance: 'Comprehensive ₹0 Deductible Included',
    delivery: 'Same-Day White-Glove Delivery',
    desc: 'Dual-motor all-wheel-drive electric grand tourer with adaptive air suspension, panoramic glass roof, and 800-volt ultra-fast charging architecture.'
  },
  'bmw-i5-m60': {
    name: '2026 BMW i5 M60 xDrive Sedan',
    category: 'Luxury Sedans',
    tier: 'Signature Reserve',
    price: 98900,
    power: '590 HP AWD',
    accel: '3.7s 0-60',
    range: '295 mi EPA',
    seats: '5 Adults',
    insurance: 'Comprehensive Coverage Included',
    delivery: 'Next-Day Doorstep Concierge',
    desc: 'Executive sport sedan combining M performance engineering with whisper-quiet electric propulsion, Bowers & Wilkins surround sound, and Highway Assistant.'
  },
  'rivian-r1s': {
    name: '2026 Rivian R1S Ascend Tri-Motor',
    category: 'Performance SUVs',
    tier: 'Apex Bespoke',
    price: 124900,
    power: '850 HP AWD',
    accel: '2.9s 0-60',
    range: '370 mi EPA',
    seats: '7 Passengers',
    insurance: 'All-Terrain & Road Hazard Covered',
    delivery: 'Available Now in All Metro Hubs',
    desc: 'Three-row adventure luxury SUV with independent air suspension, camp mode leveling, Meridian acoustic system, and unmatched all-weather capability.'
  },
  'mercedes-cle53': {
    name: '2026 Mercedes-AMG CLE 53 Coupe',
    category: 'Executive Coupes',
    tier: 'Signature Reserve',
    price: 104900,
    power: '443 HP 4MATIC+',
    accel: '4.0s 0-60',
    range: '440 mi Tank',
    seats: '4 Adults',
    insurance: 'Full Liability & Collision Included',
    delivery: 'Ready in 24 Hours',
    desc: 'Turbocharged inline-6 mild-hybrid grand touring coupe with rear-axle steering, AMG Ride Control, and Burmester 3D cockpit audio.'
  },
  'polestar-3': {
    name: '2026 Polestar 3 Long Range Dual Motor',
    category: 'Electric & Hybrid',
    tier: 'Essential Flex',
    price: 74900,
    power: '489 HP AWD',
    accel: '4.6s 0-60',
    range: '350 mi EPA',
    seats: '5 Adults',
    insurance: 'Comprehensive Coverage Included',
    delivery: 'Available for Immediate Dispatch',
    desc: 'Scandinavian aerodynamic performance SUV featuring torque vectoring dual-clutch rear drive, sustainable MicroTech interior, and LiDAR pilot assist.'
  },
  'audi-rs6': {
    name: '2026 Audi RS6 Avant Performance',
    category: 'Performance SUVs',
    tier: 'Apex Bespoke',
    price: 149900,
    power: '621 HP Quattro',
    accel: '3.3s 0-60',
    range: '410 mi Tank',
    seats: '5 + Wagon Utility',
    insurance: 'Apex Zero-Deductible Shield',
    delivery: 'Concierge Enclosed Carrier',
    desc: 'Twin-turbo V8 super-wagon delivering supercar acceleration alongside 59 cubic feet of cargo space and dynamic all-wheel steering.'
  },
  'genesis-gv80': {
    name: '2026 Genesis GV80 3.5T Prestige Coupe',
    category: 'Performance SUVs',
    tier: 'Signature Reserve',
    price: 89900,
    power: '409 HP e-SC',
    accel: '5.1s 0-60',
    range: '465 mi Tank',
    seats: '5 Passengers',
    insurance: 'Comprehensive Coverage Included',
    delivery: 'Next-Day Delivery',
    desc: 'Hand-stitched Nappa leather sanctuary with 27-inch OLED panoramic cockpit, Bang & Olufsen audio, and road-preview electronic suspension.'
  },
  'tesla-model3-perf': {
    name: '2026 Tesla Model 3 Performance Highland',
    category: 'Electric & Hybrid',
    tier: 'Essential Flex',
    price: 64900,
    power: '510 HP AWD',
    accel: '2.9s 0-60',
    range: '303 mi EPA',
    seats: '5 Adults',
    insurance: 'Comprehensive Coverage Included',
    delivery: 'Same-Day Express Activation',
    desc: 'Redesigned acoustic cabin with ventilated sport seats, adaptive damping suspension, rear passenger touchscreen, and Supercharger network access.'
  },
  'porsche-911-carrera': {
    name: '2026 Porsche 911 Carrera GTS Hybrid',
    category: 'Executive Coupes',
    tier: 'Apex Bespoke',
    price: 179900,
    power: '532 HP T-Hybrid',
    accel: '2.9s 0-60',
    range: '420 mi Tank',
    seats: '2+2 Coupe',
    insurance: 'Apex Track & Street Coverage',
    delivery: 'White-Glove Specialist Handover',
    desc: 'Iconic rear-engine sports coupe enhanced with electric exhaust turbocharger technology for instantaneous throttle response.'
  }
};

function initFleetCatalog() {
  const filterPills = document.querySelectorAll('.fleet-filter-pill');
  const tierSelect = document.getElementById('fleetTierFilter');
  const sortSelect = document.getElementById('fleetSortSelect');
  const searchInput = document.getElementById('fleetSearchInput');
  const vehicleGrid = document.getElementById('fleetGrid');
  const countBadge = document.getElementById('fleetResultCount');

  const applyFilters = () => {
    if (!vehicleGrid) return;
    const activePill = document.querySelector('.fleet-filter-pill.active');
    const selectedCategory = activePill ? activePill.dataset.category : 'all';
    const selectedTier = tierSelect ? tierSelect.value : 'all';
    const sortBy = sortSelect ? sortSelect.value : 'featured';
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const cards = Array.from(vehicleGrid.querySelectorAll('.vehicle-card'));
    let visibleCount = 0;

    cards.forEach((card) => {
      const cat = card.dataset.category || '';
      const tier = card.dataset.tier || '';
      const name = (card.dataset.name || '').toLowerCase();

      const matchCat = selectedCategory === 'all' || cat === selectedCategory;
      const matchTier = selectedTier === 'all' || tier === selectedTier;
      const matchSearch = !query || name.includes(query) || cat.toLowerCase().includes(query);

      if (matchCat && matchTier && matchSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (sortBy !== 'featured') {
      const sorted = cards.sort((a, b) => {
        const priceA = parseInt(a.dataset.price || '0', 10);
        const priceB = parseInt(b.dataset.price || '0', 10);
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        return 0;
      });
      sorted.forEach((c) => vehicleGrid.appendChild(c));
    }

    if (countBadge) {
      countBadge.textContent = `Showing ${visibleCount} Available Vehicle${visibleCount === 1 ? '' : 's'}`;
    }
  };

  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      applyFilters();
    });
  });

  if (tierSelect) tierSelect.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
  if (searchInput) searchInput.addEventListener('input', applyFilters);

  // Spec Modal Triggers (Works on both Home & Fleet pages)
  document.querySelectorAll('[data-vehicle-modal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const vehicleKey = btn.getAttribute('data-vehicle-modal');
      openVehicleModal(vehicleKey);
    });
  });

  const modalCloseBtn = document.getElementById('closeVehicleModal');
  const modalBackdrop = document.getElementById('vehicleSpecModal');
  if (modalCloseBtn && modalBackdrop) {
    modalCloseBtn.addEventListener('click', () => modalBackdrop.classList.remove('open'));
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('open');
    });
  }
}

function openVehicleModal(key) {
  const modal = document.getElementById('vehicleSpecModal');
  const data = FLEET_VEHICLES[key];
  if (!modal || !data) {
    showToast('Vehicle added to your subscription shortlist!', 'info');
    return;
  }

  document.getElementById('modalVehicleName').textContent = data.name;
  document.getElementById('modalVehicleCat').textContent = `${data.category} • ${data.tier}`;
  document.getElementById('modalVehicleDesc').textContent = data.desc;
  document.getElementById('modalVehiclePrice').textContent = `${formatINR(data.price)}/mo`;
  document.getElementById('modalSpecPower').textContent = data.power;
  document.getElementById('modalSpecAccel').textContent = data.accel;
  document.getElementById('modalSpecRange').textContent = data.range;
  document.getElementById('modalSpecSeats').textContent = data.seats;
  document.getElementById('modalSpecIns').textContent = data.insurance;
  document.getElementById('modalSpecDeliv').textContent = data.delivery;

  modal.classList.add('open');
}

/* --------------------------------------------------------------------------
   7. Pricing Plans Dynamic Term & Mileage Configurator (INR ₹)
   -------------------------------------------------------------------------- */
function initPricingConfigurator() {
  const termBtns = document.querySelectorAll('.term-btn');
  const mileageSelect = document.getElementById('pricingMileageSelect');

  if (!termBtns.length) return;

  const basePrices = {
    essential: 64900,
    signature: 98900,
    apex: 139900
  };

  let discountMultiplier = 1.0;
  let termLabel = 'Monthly Flex (Cancel Anytime)';

  const recalculatePricing = () => {
    const extraMileageCost = mileageSelect ? parseInt(mileageSelect.value, 10) : 0;

    const pEssential = Math.round((basePrices.essential * discountMultiplier + extraMileageCost) / 100) * 100;
    const pSignature = Math.round((basePrices.signature * discountMultiplier + extraMileageCost) / 100) * 100;
    const pApex = Math.round((basePrices.apex * discountMultiplier + extraMileageCost) / 100) * 100;

    const elEss = document.getElementById('priceEssential');
    const elSig = document.getElementById('priceSignature');
    const elApx = document.getElementById('priceApex');

    if (elEss) elEss.textContent = formatINR(pEssential);
    if (elSig) elSig.textContent = formatINR(pSignature);
    if (elApx) elApx.textContent = formatINR(pApex);

    document.querySelectorAll('.pricing-term-caption').forEach((cap) => {
      cap.textContent = termLabel;
    });
  };

  termBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      termBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      discountMultiplier = parseFloat(btn.dataset.multiplier || '1.0');
      termLabel = btn.dataset.label || 'Monthly Flex';
      recalculatePricing();
    });
  });

  if (mileageSelect) {
    mileageSelect.addEventListener('change', recalculatePricing);
  }
}

/* --------------------------------------------------------------------------
   8. Subscriber Dashboard Telemetry, Plan Manager & Swap Queue (INR ₹)
   -------------------------------------------------------------------------- */
function initSubscriberDashboard() {
  const viewPre = document.getElementById('viewPreLogin');
  const viewPost = document.getElementById('viewPostLogin');
  const btnPre = document.getElementById('btnModePreLogin');
  const btnPost = document.getElementById('btnModePostLogin');
  const authBadge = document.getElementById('dashAuthBadge');
  const authHint = document.getElementById('dashAuthHint');
  const navUserBadge = document.getElementById('navUserBadge');

  const setDashboardMode = (isLoggedIn, notify = false) => {
    if (isLoggedIn) {
      if (viewPre) viewPre.style.display = 'none';
      if (viewPost) viewPost.style.display = 'block';
      if (btnPre) btnPre.classList.remove('active');
      if (btnPost) btnPost.classList.add('active');
      if (authBadge) {
        authBadge.textContent = '🔐 Mode: Member Command Center (After Login)';
        authBadge.className = 'badge badge-emerald';
      }
      if (authHint) {
        authHint.textContent = 'Authenticated as Alex Morgan • Apex Bespoke Tier • Active Car: 2026 Porsche Taycan 4S.';
      }
      if (navUserBadge) navUserBadge.style.display = 'none';
      localStorage.setItem('velocedrive_logged_in', 'true');
      if (notify) showToast('Loaded Authenticated Member View (Apex Bespoke Tier)', 'success');
    } else {
      if (viewPre) viewPre.style.display = 'block';
      if (viewPost) viewPost.style.display = 'none';
      if (btnPre) btnPre.classList.add('active');
      if (btnPost) btnPost.classList.remove('active');
      if (authBadge) {
        authBadge.textContent = '👤 Mode: Guest Preview (Before Login)';
        authBadge.className = 'badge badge-blue';
      }
      if (authHint) {
        authHint.textContent = 'Viewing dashboard in Pre-Login Guest Mode. Switch to Member View to see live subscriber telemetry.';
      }
      if (navUserBadge) navUserBadge.style.display = 'none';
      localStorage.setItem('velocedrive_logged_in', 'false');
      if (notify) showToast('Switched to Pre-Login Guest Preview Mode', 'info');
    }
  };

  if (btnPre) {
    btnPre.addEventListener('click', () => setDashboardMode(false, true));
  }
  if (btnPost) {
    btnPost.addEventListener('click', () => setDashboardMode(true, true));
  }

  const preDemoBtn = document.getElementById('preLoginDemoBtn');
  if (preDemoBtn) {
    preDemoBtn.addEventListener('click', () => setDashboardMode(true, true));
  }

  const preBannerSwitchBtn = document.getElementById('preLoginBannerSwitchBtn');
  if (preBannerSwitchBtn) {
    preBannerSwitchBtn.addEventListener('click', () => setDashboardMode(true, true));
  }

  const postLogoutBtn = document.getElementById('postLoginLogoutBtn');
  if (postLogoutBtn) {
    postLogoutBtn.addEventListener('click', () => setDashboardMode(false, true));
  }

  // Pre-Login Interactive Plan Configurator
  const prePlanSelect = document.getElementById('preDashPlanSelect');
  const preMileagePack = document.getElementById('preDashMileagePack');
  const preRoof = document.getElementById('preAddonRoof');
  const prePermit = document.getElementById('preAddonPermit');
  const preTotalEl = document.getElementById('prePlanCalculatedTotal');

  const updatePrePlan = () => {
    if (!prePlanSelect) return;
    const base = parseInt(prePlanSelect.value, 10) || 139900;
    const miles = preMileagePack ? parseInt(preMileagePack.value, 10) : 0;
    const roof = preRoof && preRoof.checked ? 3800 : 0;
    const permit = prePermit && prePermit.checked ? 5400 : 0;
    const total = base + miles + roof + permit;
    if (preTotalEl) preTotalEl.textContent = `${formatINR(total)}/mo`;
  };

  if (prePlanSelect) prePlanSelect.addEventListener('change', updatePrePlan);
  if (preMileagePack) preMileagePack.addEventListener('change', updatePrePlan);
  if (preRoof) preRoof.addEventListener('change', updatePrePlan);
  if (prePermit) prePermit.addEventListener('change', updatePrePlan);
  updatePrePlan();

  // Initial State Check
  if (viewPre && viewPost) {
    const savedLogin = localStorage.getItem('velocedrive_logged_in');
    if (savedLogin === 'true') {
      setDashboardMode(true, false);
    } else {
      setDashboardMode(false, false);
    }
  }

  // Post-Login Live Plan Configurator
  const planSelect = document.getElementById('dashPlanSelect');
  const mileagePackSelect = document.getElementById('dashMileagePack');
  const addonCheckboxes = document.querySelectorAll('.dash-addon-checkbox');
  const totalBillEl = document.getElementById('dashNextBillAmount');
  const mileageCapEl = document.getElementById('dashMileageCapText');
  const mileageBarEl = document.getElementById('dashMileageProgressBar');

  if (planSelect) {
    const updateDashboardPlan = () => {
      const basePlanRate = parseInt(planSelect.value, 10) || 139900;
      const mileageAddRate = mileagePackSelect ? parseInt(mileagePackSelect.value, 10) : 0;
      let addonsTotal = 0;

      addonCheckboxes.forEach((cb) => {
        if (cb.checked) {
          addonsTotal += parseInt(cb.dataset.cost || '0', 10);
        }
      });

      const finalMonthly = basePlanRate + mileageAddRate + addonsTotal;
      if (totalBillEl) {
        totalBillEl.textContent = `${formatINR(finalMonthly)}`;
      }

      // Update mileage cap telemetry
      const extraMiles = mileageAddRate === 11500 ? 500 : mileageAddRate === 21500 ? 1000 : 0;
      const totalAllowance = 1500 + extraMiles;
      const usedMiles = 940;
      const pct = Math.min(100, Math.round((usedMiles / totalAllowance) * 100));

      if (mileageCapEl) {
        mileageCapEl.textContent = `${usedMiles.toLocaleString('en-IN')} / ${totalAllowance.toLocaleString('en-IN')} mi (${pct}%)`;
      }
      if (mileageBarEl) {
        mileageBarEl.style.width = `${pct}%`;
      }
    };

    planSelect.addEventListener('change', () => {
      updateDashboardPlan();
      showToast('Monthly subscription tier updated for next billing cycle.');
    });

    if (mileagePackSelect) {
      mileagePackSelect.addEventListener('change', () => {
        updateDashboardPlan();
        showToast('Monthly mileage allowance updated in real time.');
      });
    }

    addonCheckboxes.forEach((cb) => {
      cb.addEventListener('change', () => {
        updateDashboardPlan();
        showToast('Subscription add-on preference saved.');
      });
    });

    updateDashboardPlan();
  }

  // Queue Vehicle for Next Swap buttons
  document.querySelectorAll('.queue-swap-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const carName = btn.dataset.car || 'Selected Vehicle';
      const queuedBanner = document.getElementById('dashQueuedSwapVehicle');
      if (queuedBanner) {
        queuedBanner.textContent = carName;
      }
      document.querySelectorAll('.queue-swap-btn').forEach((b) => {
        b.textContent = 'Queue for Swap';
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btn.textContent = '✓ Queued for Nov 1 Swap';
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary');
      showToast(`${carName} queued for doorstep swap on Nov 1, 2026!`);
    });
  });

  // Dashboard Swap Filter Pills
  const dashSwapPills = document.querySelectorAll('.dash-swap-filter');
  dashSwapPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      dashSwapPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      const filterCat = pill.dataset.filter;
      document.querySelectorAll('.dash-swap-card').forEach((card) => {
        if (filterCat === 'all' || card.dataset.category === filterCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Download Invoice Buttons
  document.querySelectorAll('.download-invoice-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const invId = btn.dataset.invoice || 'INV-2026';
      showToast(`Downloading PDF statement ${invId}...`, 'info');
    });
  });
}

/* --------------------------------------------------------------------------
   9. Login Portal (Dummy Login with Toast Notification & Zero Redirect)
   -------------------------------------------------------------------------- */
function initLoginPortal() {
  const authTabs = document.querySelectorAll('.auth-tab');
  const authPanels = document.querySelectorAll('.auth-panel');
  const inlineToast = document.getElementById('loginInlineToast');
  const inlineToastText = document.getElementById('loginInlineToastText');

  let lastToastTime = 0;
  const triggerLoginToast = (msg) => {
    const now = Date.now();
    if (now - lastToastTime < 500) return;
    lastToastTime = now;
    showToast(msg, 'success');
    if (inlineToast) {
      if (inlineToastText) inlineToastText.textContent = msg;
      inlineToast.style.display = 'flex';
      inlineToast.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  authTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      authTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = tab.dataset.target;
      authPanels.forEach((panel) => {
        panel.style.display = panel.id === targetId ? 'block' : 'none';
      });
    });
  });

  const performLogin = (e) => {
    if (e) e.preventDefault();
    const loginForm = document.getElementById('subscriberLoginForm');
    if (loginForm && typeof validateSingleForm === 'function' && !validateSingleForm(loginForm)) {
      return false;
    }
    const emailInput = document.getElementById('loginEmail');
    const userEmail = emailInput && emailInput.value.trim() ? emailInput.value.trim() : 'alex.morgan@velocedrive.io';
    localStorage.setItem('velocedrive_logged_in', 'true');
    triggerLoginToast(`Login Successful! Signed in as ${userEmail} (Dummy Login — Redirect Disabled).`);
    return false;
  };

  const loginForm = document.getElementById('subscriberLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', performLogin);
  }

  const loginBtn = document.getElementById('loginSubmitBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', performLogin);
  }

  const performRegister = (e) => {
    if (e) e.preventDefault();
    const registerForm = document.getElementById('subscriberRegisterForm');
    if (registerForm && typeof validateSingleForm === 'function' && !validateSingleForm(registerForm)) {
      return false;
    }
    localStorage.setItem('velocedrive_logged_in', 'true');
    triggerLoginToast('Registration Successful! Your driver profile has been verified (Dummy Login — Redirect Disabled).');
    return false;
  };

  const registerForm = document.getElementById('subscriberRegisterForm');
  if (registerForm) {
    registerForm.addEventListener('submit', performRegister);
  }

  const regBtn = document.getElementById('registerSubmitBtn');
  if (regBtn) {
    regBtn.addEventListener('click', performRegister);
  }

  const performCorpLogin = (e) => {
    if (e) e.preventDefault();
    const corporateForm = document.getElementById('corporateLoginForm');
    if (corporateForm && typeof validateSingleForm === 'function' && !validateSingleForm(corporateForm)) {
      return false;
    }
    localStorage.setItem('velocedrive_logged_in', 'true');
    triggerLoginToast('Corporate Login Successful! Fleet console authenticated (Dummy Login — Redirect Disabled).');
    return false;
  };

  const corporateForm = document.getElementById('corporateLoginForm');
  if (corporateForm) {
    corporateForm.addEventListener('submit', performCorpLogin);
  }

  const corpBtn = document.getElementById('corporateSubmitBtn');
  if (corpBtn) {
    corpBtn.addEventListener('click', performCorpLogin);
  }

  const demoLoginBtn = document.getElementById('instantDemoLoginBtn');
  if (demoLoginBtn) {
    demoLoginBtn.addEventListener('click', (e) => {
      if (e) e.preventDefault();
      localStorage.setItem('velocedrive_logged_in', 'true');
      triggerLoginToast('Login Successful! Signed in as Alex Morgan • Apex Bespoke Tier (Dummy Login — Redirect Disabled).');
    });
  }
}

/* --------------------------------------------------------------------------
   10. Contact / Concierge Booking Form
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('conciergeForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (typeof validateSingleForm === 'function' && !validateSingleForm(contactForm)) {
      return false;
    }
    showToast('Concierge request received! A mobility advisor will contact you within 15 minutes.', 'success');
    contactForm.reset();
    if (typeof clearFormValidationState === 'function') {
      clearFormValidationState(contactForm);
    }
  });
}

/* --------------------------------------------------------------------------
   11. RTL (Right-to-Left) Direction Switcher
   -------------------------------------------------------------------------- */
function initRtl() {
  const savedDir = localStorage.getItem('velocedrive_dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  updateRtlButtons(savedDir);

  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      const next = current === 'rtl' ? 'ltr' : 'rtl';
      document.documentElement.setAttribute('dir', next);
      localStorage.setItem('velocedrive_dir', next);
      updateRtlButtons(next);
      showToast(
        next === 'rtl'
          ? 'Switched to RTL (Right-to-Left) Layout'
          : 'Switched to LTR (Left-to-Right) Layout',
        'info'
      );
    });
  });
}

function updateRtlButtons(dir) {
  const rtlBtns = document.querySelectorAll('.rtl-toggle-btn');
  rtlBtns.forEach((btn) => {
    if (dir === 'rtl') {
      btn.textContent = 'LTR';
      btn.setAttribute('title', 'Switch to Left-to-Right (LTR) Layout');
      btn.classList.add('active');
    } else {
      btn.textContent = 'RTL';
      btn.setAttribute('title', 'Switch to Right-to-Left (RTL) Layout');
      btn.classList.remove('active');
    }
  });
}

/* --------------------------------------------------------------------------
   12. Interactive Regional Hubs Map (Contact Page)
   -------------------------------------------------------------------------- */
function initContactMap() {
  const mapIframe = document.getElementById('contactMapIframe');
  const hubBtns = document.querySelectorAll('.map-hub-btn');
  if (!mapIframe || !hubBtns.length) return;

  const hubData = {
    mumbai: {
      title: 'Mumbai BKC Flagship',
      badge: 'Active Staging Hub • 65+ Vehicles',
      address: 'Maker Maxity, 4th Floor Luxury Wing, Bandra-Kurla Complex, Mumbai, Maharashtra 400051.',
      hours: '24/7 Staging & Valet',
      dispatch: '< 2 Hours Metro-wide',
      airport: 'CSMIA Terminal 2 VIP Tarmac',
      phone: '+91 (022) 6194-8800',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=72.8258%2C19.0450%2C72.8950%2C19.0850&layer=mapnik&marker=19.0657%2C72.8642',
      directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Maker+Maxity+Bandra+Kurla+Complex+Mumbai'
    },
    delhi: {
      title: 'Delhi NCR Hub',
      badge: 'Active Staging Hub • 50+ Vehicles',
      address: 'DLF Camellias Mobility Lounge, Golf Course Road, Sector 42, Gurugram, Haryana 122009.',
      hours: '24/7 Staging & Valet',
      dispatch: '< 2 Hours NCR-wide',
      airport: 'Indira Gandhi International (DEL) VIP',
      phone: '+91 (0124) 4892-100',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=77.0500%2C28.4700%2C77.1300%2C28.5200&layer=mapnik&marker=28.4950%2C77.0895',
      directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Golf+Course+Road+Sector+42+Gurugram'
    },
    bengaluru: {
      title: 'Bengaluru Metro Hub',
      badge: 'Active Staging Hub • 55+ Vehicles',
      address: 'UB City Luxury Fleet Studio, 24 Vittal Mallya Road, Bengaluru, Karnataka 560001.',
      hours: '24/7 Staging & Valet',
      dispatch: '< 2 Hours Tech Corridor',
      airport: 'Kempegowda International (BLR) VIP',
      phone: '+91 (080) 4122-7700',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=77.5600%2C12.9500%2C77.6350%2C12.9950&layer=mapnik&marker=12.9716%2C77.5960',
      directionsUrl: 'https://www.google.com/maps/search/?api=1&query=UB+City+Vittal+Mallya+Road+Bengaluru'
    },
    hyderabad: {
      title: 'Hyderabad Cyberabad Hub',
      badge: 'Active Staging Hub • 40+ Vehicles',
      address: 'Road No. 36, Jubilee Hills & Financial District Corridor, Hyderabad, Telangana 500033.',
      hours: '24/7 Staging & Valet',
      dispatch: '< 2 Hours HITEC City',
      airport: 'Rajiv Gandhi International (HYD) Valet',
      phone: '+91 (040) 2355-6600',
      mapUrl: 'https://www.openstreetmap.org/export/embed.html?bbox=78.3400%2C17.4100%2C78.4300%2C17.4700&layer=mapnik&marker=17.4399%2C78.3840',
      directionsUrl: 'https://www.google.com/maps/search/?api=1&query=Jubilee+Hills+Road+No+36+Hyderabad'
    }
  };

  const badgeEl = document.getElementById('hubBadge');
  const titleEl = document.getElementById('hubTitle');
  const addressEl = document.getElementById('hubAddress');
  const hoursEl = document.getElementById('hubHours');
  const dispatchEl = document.getElementById('hubDispatch');
  const airportEl = document.getElementById('hubAirport');
  const phoneEl = document.getElementById('hubPhone');
  const directionsEl = document.getElementById('hubDirectionsLink');

  hubBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const hubKey = btn.getAttribute('data-hub');
      const data = hubData[hubKey];
      if (!data) return;

      // Update button state
      hubBtns.forEach((b) => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline');

      // Update map iframe src
      mapIframe.src = data.mapUrl;

      // Update sidebar details
      if (badgeEl) badgeEl.textContent = data.badge;
      if (titleEl) titleEl.textContent = data.title;
      if (addressEl) addressEl.textContent = data.address;
      if (hoursEl) hoursEl.textContent = data.hours;
      if (dispatchEl) dispatchEl.textContent = data.dispatch;
      if (airportEl) airportEl.textContent = data.airport;
      if (phoneEl) phoneEl.textContent = data.phone;
      if (directionsEl) directionsEl.href = data.directionsUrl;

      showToast(`Viewing ${data.title} on interactive hub map.`, 'info');
    });
  });
}

/* --------------------------------------------------------------------------
   13. Sticky Header Scroll Monitor Across All Pages
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const headers = document.querySelectorAll('.site-header');
  if (!headers.length) return;

  const onScroll = () => {
    const isScrolled = window.scrollY > 15;
    headers.forEach((h) => {
      if (isScrolled) {
        h.classList.add('scrolled');
      } else {
        h.classList.remove('scrolled');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --------------------------------------------------------------------------
   14. Blog Editorial Intelligence: Live Filtering, Search, Clickable Cards & Reader Modal
   -------------------------------------------------------------------------- */
function initBlogPage() {
  const filterTabsContainer = document.getElementById('blogFilterTabs');
  const searchInput = document.getElementById('blogSearchInput');
  const blogCards = document.querySelectorAll('.blog-post-card');
  const emptyState = document.getElementById('blogEmptyState');
  const resetBtn = document.getElementById('resetBlogFiltersBtn');
  const articleModal = document.getElementById('blogArticleModal');

  if (!filterTabsContainer && !searchInput && !articleModal) return;

  const filterBtns = filterTabsContainer ? filterTabsContainer.querySelectorAll('.filter-btn') : [];

  let activeCategory = 'all';
  let searchQuery = '';

  // Article Database for Interactive Quick Read Modal
  const blogArticlesData = {
    'cover-story': {
      title: "The Financial Shift: Why India's Top Executives Are Choosing Car Subscriptions Over ₹20 Lakh Down Payments",
      badge: "Mobility Economics",
      badgeClass: "badge-emerald",
      meta: "October 12, 2026 • 6 min read",
      authorName: "Vikramaditya Singhania",
      authorRole: "Fleet Strategy Director",
      authorImg: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80",
      targetUrl: "pricing.html",
      actionText: "View All Subscription Tiers & Pricing →",
      takeaways: [
        "38% to 42% luxury vehicle depreciation over the first 24 months is entirely absorbed by VeloceDrive.",
        "Saves up to ₹25 Lakh in upfront capital outlay compared to purchasing, freeing funds for corporate investments.",
        "100% tax deductible operational expenditure (OpEx) for registered business entities in India."
      ],
      paragraphs: [
        "For decades, acquiring an executive luxury sedan or high-performance SUV in India required sinking upwards of ₹20 Lakh to ₹50 Lakh in non-productive down payments, followed by 5 years of steep EMIs and unpredictable maintenance overheads. In 2026, CFOs and entrepreneurs are rewriting that equation.",
        "By shifting vehicle acquisition from capital expenditure (CapEx) to monthly operational expenditure (OpEx), subscribers write off 100% of GST-compliant monthly fees against company balance sheets while avoiding catastrophic second-year depreciation hit curves.",
        "VeloceDrive's all-in subscription consolidates road tax, zero-depreciation insurance, bumper-to-bumper OEM maintenance, and doorstep concierge vehicle swaps into a single transparent monthly billing invoice."
      ]
    },
    'article-1': {
      title: "800V Architecture on Indian Expressways: Fast-Charging the Taycan 4S & Lotus Eletre",
      badge: "EV Technology",
      badgeClass: "badge-blue",
      meta: "Oct 8, 2026 • 5 min read",
      authorName: "Ananya Deshmukh",
      authorRole: "EV Infrastructure Specialist",
      authorImg: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=800&q=80",
      targetUrl: "fleet.html",
      actionText: "Explore Electric Vehicle Fleet →",
      takeaways: [
        "10% to 80% state-of-charge in just 18 minutes on 350kW DC hyperchargers.",
        "Tested across 1,200 km connecting Mumbai–Pune Expressway and Bangalore–Mysore Corridor.",
        "Dual-circuit active thermal conditioning prevents Indian summer thermal throttling."
      ],
      paragraphs: [
        "High-voltage 800-volt battery architecture has officially transformed cross-state EV mobility across India. Vehicles like the Porsche Taycan 4S and Lotus Eletre can ingest power at speeds topping 270kW, slashing charging stops to sub-20 minute coffee breaks.",
        "Our engineering team conducted an endurance audit covering Mumbai, Pune, and Bengaluru highway networks during peak summer heat (41°C). Thanks to active liquid-cooled battery conditioning, zero thermal throttling occurred throughout 1,200 km of sustained driving.",
        "Subscribers also enjoy complimentary access to VeloceDrive's dedicated DC Hypercharger partner network with priority bay booking via the mobile app."
      ]
    },
    'article-2': {
      title: "Bespoke Weekend Swaps: Trading Your Commuter EV for an All-Terrain 7-Seat SUV",
      badge: "Lifestyle & Swaps",
      badgeClass: "badge-amber",
      meta: "Oct 4, 2026 • 4 min read",
      authorName: "Rohan Malhotra",
      authorRole: "Head of Concierge Experience",
      authorImg: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
      targetUrl: "how-it-works.html",
      actionText: "Learn How Swaps Work →",
      takeaways: [
        "Doorstep valet arrival with fresh vehicle delivered in under 48 hours.",
        "Up to 6 complimentary weekend swaps included in Apex and Corporate subscription tiers.",
        "All personal settings, Spotify playlists, and telemetry sync across vehicles automatically."
      ],
      paragraphs: [
        "Why be constrained to a single automobile for 365 days? Monday through Friday, navigating urban traffic in a whisper-quiet electric sedan like the BMW i4 makes ultimate sense. But when Friday evening arrives and a mountain expedition beckons, you need 7 seats, high ground clearance, and all-wheel drive.",
        "With VeloceDrive's signature Concierge Swap privilege, subscribers schedule a doorstep swap with 48 hours notice. Our white-glove valet arrives with an impeccably detailed Defender 110 or Audi Q7, transferring your luggage and personal profiles seamlessly.",
        "Return Monday morning, and your weekday daily driver is waiting fully charged, detailed, and ready for work."
      ]
    },
    'article-3': {
      title: "Corporate Fleet Tax Optimization: Saving 30%+ with Consolidated Invoicing",
      badge: "Corporate Fleet",
      badgeClass: "badge-purple",
      meta: "Sep 29, 2026 • 7 min read",
      authorName: "Preeti Sengupta",
      authorRole: "Enterprise Mobility Advisor",
      authorImg: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80",
      targetUrl: "pricing.html",
      actionText: "View Corporate Subscription Tiers →",
      takeaways: [
        "Consolidated 100% OpEx invoicing structures bypass Indian asset depreciation caps.",
        "Zero balance sheet liabilities improve debt-to-equity ratios for venture-funded and listed firms.",
        "Customizable executive allowances with driver concierge and fleet mileage tracking."
      ],
      paragraphs: [
        "Corporate mobility programs across Mumbai BKC, Gurgaon Cyber Hub, and Bengaluru Tech Parks are undergoing a major structural evolution. Traditional company-owned fleets tie up crucial working capital and require dedicated fleet managers.",
        "Under VeloceDrive Corporate Leasing, enterprises secure custom vehicle fleets on month-to-month or annual terms. Every rupee spent is classified as operating expense, yielding up to 30% direct tax benefits under Indian tax provisions.",
        "Our enterprise dashboard provides HR and Finance leaders with consolidated billing, automated GST input tax credit matching, and individual executive mileage allocations."
      ]
    },
    'article-4': {
      title: "Inside Our 150-Point OEM Telemetry: Guaranteeing Factory-Fresh Performance",
      badge: "Engineering & Care",
      badgeClass: "badge-emerald",
      meta: "Sep 22, 2026 • 5 min read",
      authorName: "Kabir Mehta",
      authorRole: "Master Diagnostic Engineer",
      authorImg: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=800&q=80",
      targetUrl: "about.html",
      actionText: "Discover Our Engineering Standards →",
      takeaways: [
        "Laser wheel alignment and computerized suspension diagnostics before every handover.",
        "High-voltage battery state-of-health (SoH) verified above 96% on all fleet EVs.",
        "HEPA cabin air sanitization with multi-stage medical ozone purification."
      ],
      paragraphs: [
        "Every vehicle in the VeloceDrive fleet must feel, smell, and drive like it just rolled out of the OEM showroom in Stuttgart, Munich, or Coventry. Achieving that standard requires rigorous engineering discipline.",
        "Before any subscriber delivery or swap handover, our master technicians perform a computerized 150-point diagnostic scan. We test dynamic braking efficiency, brake rotor thickness, tire tread depth, battery module cell balance, and firmware integrity.",
        "The vehicle's cabin undergoes a multi-stage detailing process featuring medical-grade ozone decontamination and HEPA filter replacement, ensuring pristine air quality for you and your family."
      ]
    },
    'article-5': {
      title: "Doorstep Valet Deliveries: The New Normal for High-Net-Worth Mobility",
      badge: "VIP Concierge",
      badgeClass: "badge-blue",
      meta: "Sep 16, 2026 • 4 min read",
      authorName: "Sameer Varma",
      authorRole: "VIP Concierge Operations Lead",
      authorImg: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=800&q=80",
      targetUrl: "contact.html",
      actionText: "Book Doorstep Valet Concierge →",
      takeaways: [
        "Direct airport tarmac lounge and residence handover across major Indian metro airports.",
        "Digital pre-inspection checklist with high-resolution 360° photographic record.",
        "Fuel tank 100% full or EV battery charged to 95%+ prior to delivery."
      ],
      paragraphs: [
        "In the luxury sector, the greatest currency is time. The traditional dealership experience—spending hours in waiting rooms signing paperwork and listening to sales pitches—is obsolete for high-net-worth subscribers.",
        "VeloceDrive VIP Valet delivers your bespoke subscription vehicle directly to your private residence, corporate headquarters, or VIP tarmac lounge at Mumbai CSMIA Terminal 2 or Delhi IGI Airport.",
        "All identity verification and lease documentation are handled in advance digitally. Handover takes under 90 seconds: verify your digital key, step inside, and drive away."
      ]
    },
    'article-6': {
      title: "Autonomous Pilot Level 2+ in Metro Commutes: Real-World Highway Testing",
      badge: "Future Mobility",
      badgeClass: "badge-purple",
      meta: "Sep 10, 2026 • 6 min read",
      authorName: "Tara Kapoor",
      authorRole: "Autonomous Systems Specialist",
      authorImg: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      coverImg: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80",
      targetUrl: "fleet.html",
      actionText: "Explore Autonomous & Performance Fleet →",
      takeaways: [
        "Level 2+ hands-on driver assistance reduces stop-and-go commute fatigue by up to 65%.",
        "High-definition LiDAR and surround optical radar tailored for unpredictable traffic patterns.",
        "Adaptive distance control smoothly handles merging auto-rickshaws and two-wheelers."
      ],
      paragraphs: [
        "Peak hour traffic on the Western Express Highway in Mumbai or the Outer Ring Road in Bengaluru can turn even the most luxurious commute into a test of patience. That is where Level 2+ Advanced Driver Assistance Systems (ADAS) prove indispensable.",
        "Equipped with millimeter-wave radar, stereoscopic cameras, and AI neural processors, our newest vehicles maintain lane centering, regulate speed, and execute emergency autonomous braking with microsecond precision.",
        "Subscribers report arriving at their morning meetings refreshed and energized rather than drained by morning congestion."
      ]
    }
  };

  // Helper: Switch Active Category Tab
  function setCategory(category) {
    activeCategory = category || 'all';
    filterBtns.forEach((b) => {
      const cat = b.getAttribute('data-category');
      if (cat === activeCategory) {
        b.classList.add('active', 'btn-primary');
        b.classList.remove('btn-outline');
      } else {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      }
    });
    applyBlogFilters();
  }

  // Live Category and Search Filter Execution
  function applyBlogFilters() {
    let visibleCount = 0;
    blogCards.forEach((card) => {
      const cardCat = card.getAttribute('data-category');
      const text = card.textContent.toLowerCase();

      const matchesCat = activeCategory === 'all' || cardCat === activeCategory;
      const matchesSearch = !searchQuery || text.includes(searchQuery);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category Tab Clicks
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category') || 'all';
      setCategory(cat);
    });
  });

  // Category Badges on Cards (Click to Filter)
  document.querySelectorAll('.blog-category-badge').forEach((badge) => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const cat = badge.getAttribute('data-category');
      if (cat) {
        setCategory(cat);
        const articleGrid = document.getElementById('articleGrid');
        if (articleGrid) {
          articleGrid.scrollIntoView({ behavior: 'smooth' });
        }
        showToast(`Filtered by topic: ${cat.toUpperCase()}`, 'info');
      }
    });
  });

  // Search Input Query Listener
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      applyBlogFilters();
    });
  }

  // Reset Filters Button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      searchQuery = '';
      setCategory('all');
      showToast('Filters reset. All mobility articles visible.', 'info');
    });
  }

  // Quick Read Modal Functionality
  function openArticleModal(articleId) {
    const data = blogArticlesData[articleId];
    if (!data || !articleModal) return;

    const modalBadge = document.getElementById('modalArticleBadge');
    const modalMeta = document.getElementById('modalArticleMeta');
    const modalTitle = document.getElementById('modalArticleTitle');
    const modalAuthorImg = document.getElementById('modalAuthorImg');
    const modalAuthorName = document.getElementById('modalAuthorName');
    const modalAuthorRole = document.getElementById('modalAuthorRole');
    const modalCoverImg = document.getElementById('modalCoverImg');
    const modalTakeawaysList = document.getElementById('modalTakeawaysList');
    const modalText = document.getElementById('modalArticleText');
    const modalActionLink = document.getElementById('modalActionLink');

    if (modalBadge) {
      modalBadge.className = `badge ${data.badgeClass || 'badge-emerald'}`;
      modalBadge.textContent = data.badge;
    }
    if (modalMeta) modalMeta.textContent = data.meta;
    if (modalTitle) modalTitle.textContent = data.title;
    if (modalAuthorImg) {
      modalAuthorImg.src = data.authorImg;
      modalAuthorImg.alt = data.authorName;
    }
    if (modalAuthorName) modalAuthorName.textContent = data.authorName;
    if (modalAuthorRole) modalAuthorRole.textContent = data.authorRole;
    if (modalCoverImg) {
      modalCoverImg.src = data.coverImg;
      modalCoverImg.alt = data.title;
    }

    if (modalTakeawaysList) {
      modalTakeawaysList.innerHTML = (data.takeaways || [])
        .map((t) => `<li style="margin-bottom: 0.35rem;">${t}</li>`)
        .join('');
    }

    if (modalText) {
      modalText.innerHTML = (data.paragraphs || [])
        .map((p) => `<p style="margin: 0; color: var(--text-secondary); line-height: 1.8;">${p}</p>`)
        .join('');
    }

    if (modalActionLink) {
      modalActionLink.href = data.targetUrl || 'fleet.html';
      modalActionLink.textContent = data.actionText || 'Proceed to Page →';
    }

    articleModal.classList.add('open');
    articleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Update URL hash without jumping page
    try {
      history.replaceState(null, '', '#' + articleId);
    } catch (_) {}
  }

  function closeArticleModal() {
    if (!articleModal) return;
    articleModal.classList.remove('open');
    articleModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Remove hash if it references an article
    try {
      if (window.location.hash.startsWith('#article-') || window.location.hash === '#cover-story') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (_) {}
  }

  // Hook up Quick Read Buttons and Modal Triggers (Title, Image, Buttons)
  document.querySelectorAll('.blog-read-modal-btn, .blog-read-modal-trigger').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const articleId = trigger.getAttribute('data-article-id') || trigger.closest('[data-article-id]')?.getAttribute('data-article-id');
      if (articleId) {
        openArticleModal(articleId);
      }
    });
  });

  // Card Click Behavior:
  // - Clicking .blog-card-redirect-btn directly navigates to its page (pricing, fleet, how-it-works, etc.)
  // - Clicking anywhere else on the card opens the article reader modal
  const allInteractiveCards = document.querySelectorAll('.blog-post-card, .featured-lead-card');
  allInteractiveCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // If clicking directly on or within redirect button, let browser perform page redirect
      if (e.target.closest('.blog-card-redirect-btn')) {
        return;
      }

      // If clicking category badge, let badge listener handle it
      if (e.target.closest('.blog-category-badge')) {
        return;
      }

      // If clicking a standard external/nav link, let it proceed
      const link = e.target.closest('a');
      if (link && !link.classList.contains('blog-read-modal-trigger') && link.getAttribute('href') && !link.getAttribute('href').startsWith('javascript:') && !link.getAttribute('href').startsWith('#')) {
        return;
      }

      // Otherwise, open reader modal for this article
      e.preventDefault();
      const articleId = card.getAttribute('data-article-id');
      if (articleId && blogArticlesData[articleId]) {
        openArticleModal(articleId);
      }
    });
  });

  // Modal Close Events
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalFooterCloseBtn = document.getElementById('modalFooterCloseBtn');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeArticleModal);
  if (modalFooterCloseBtn) modalFooterCloseBtn.addEventListener('click', closeArticleModal);

  if (articleModal) {
    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) closeArticleModal();
    });
  }

  // Keyboard Navigation: Escape key closes modal or clears search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (articleModal && articleModal.classList.contains('open')) {
        closeArticleModal();
      } else if (searchInput && (document.activeElement === searchInput || searchInput.value.length > 0)) {
        searchInput.value = '';
        searchQuery = '';
        applyBlogFilters();
      }
    }
  });

  // Deep-linking: Support initial URL hash (e.g. #article-1 or #cover-story) or query params (?category=ev&article=article-2)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    const artParam = urlParams.get('article');
    const hash = window.location.hash ? window.location.hash.replace('#', '') : null;

    if (catParam) {
      setCategory(catParam);
    }

    const targetArticleId = artParam || hash;
    if (targetArticleId && blogArticlesData[targetArticleId]) {
      setTimeout(() => {
        openArticleModal(targetArticleId);
      }, 150);
    }
  } catch (_) {}

  // Newsletter Form Handler with Strict Email Format Verification
  const newsletterForm = document.getElementById('blogNewsletterForm');
  const newsletterEmail = document.getElementById('newsletterEmail');
  if (newsletterForm && newsletterEmail) {
    newsletterEmail.addEventListener('input', () => {
      if (newsletterEmail.value.trim().length > 0) {
        validateField(newsletterEmail, true);
      } else {
        newsletterEmail.classList.remove('is-invalid', 'is-valid');
        const hint = newsletterEmail.parentElement ? newsletterEmail.parentElement.querySelector('.form-field-hint') : null;
        if (hint) {
          hint.textContent = '';
          hint.style.display = 'none';
        }
      }
    });

    newsletterEmail.addEventListener('blur', () => {
      validateField(newsletterEmail, true);
    });

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const res = validateField(newsletterEmail, true);
      if (!res.valid) {
        newsletterEmail.focus();
        showToast(res.message || 'Please enter a valid email address in format: name@domain.com', 'error');
        return false;
      }
      showToast('Thank you for subscribing to VeloceDrive Dispatch! Latest briefing sent.', 'success');
      newsletterForm.reset();
      if (typeof clearFormValidationState === 'function') {
        clearFormValidationState(newsletterForm);
      }
    });
  }
}


/* --------------------------------------------------------------------------
   14. Services Page Interactive System (Filter & Booking Modal)
   -------------------------------------------------------------------------- */
function initServicesPage() {
  const filterTabs = document.querySelectorAll('.service-tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');
  const bookingModal = document.getElementById('serviceBookingModal');
  const modalCloseBtn = document.getElementById('closeServiceModalBtn');
  const bookingForm = document.getElementById('serviceBookingForm');
  const serviceTypeSelect = document.getElementById('serviceModalType');

  // 1. Category Filter Tabs
  if (filterTabs.length > 0 && serviceCards.length > 0) {
    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterCategory = btn.getAttribute('data-filter');

        serviceCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');
          if (filterCategory === 'all' || cardCategory === filterCategory) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 200);
          }
        });
      });
    });
  }

  // 2. Open Modal Triggers
  const openTriggers = document.querySelectorAll('[data-service-trigger]');
  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = trigger.getAttribute('data-service-name');
      if (serviceTypeSelect && serviceName) {
        serviceTypeSelect.value = serviceName;
      }
      if (bookingModal) {
        bookingModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // 3. Close Modal Handlers
  function closeModal() {
    if (bookingModal) {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('open')) {
      closeModal();
    }
  });

  // 4. Booking Form Submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof validateSingleForm === 'function' && !validateSingleForm(bookingForm)) {
        return false;
      }

      const randomRef = 'VD-SRV-' + Math.floor(1000 + Math.random() * 9000);
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Confirm Booking';
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Confirming Concierge...</span>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        showToast(`Service scheduled! Booking reference ${randomRef} confirmed via SMS & email.`, 'success');
        bookingForm.reset();
        if (typeof clearFormValidationState === 'function') {
          clearFormValidationState(bookingForm);
        }
        if (submitBtn) {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
        closeModal();
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   15. Global Universal Form Validation Engine
   Strict Name (letters only), Phone (numbers only), Email, & Number Verification
   -------------------------------------------------------------------------- */

function getFieldValidationType(input) {
  if (!input || input.tagName !== 'INPUT') return null;
  const dataVal = (input.getAttribute('data-validate') || '').toLowerCase();
  if (dataVal === 'name' || dataVal === 'phone' || dataVal === 'email' || dataVal === 'numeric') {
    return dataVal;
  }
  const id = (input.id || '').toLowerCase();
  const name = (input.name || '').toLowerCase();
  const type = (input.type || '').toLowerCase();
  const autocomplete = (input.getAttribute('autocomplete') || '').toLowerCase();

  if (type === 'email' || id.includes('email') || name.includes('email')) {
    return 'email';
  }
  if (type === 'tel' || id.includes('phone') || id.includes('mobile') || name.includes('phone') || name.includes('mobile')) {
    return 'phone';
  }
  if (id === 'regzip' || id.includes('zip') || id.includes('pincode') || input.getAttribute('inputmode') === 'numeric') {
    return 'numeric';
  }
  if (
    id === 'concname' || id === 'servicebookingname' || id === 'regfirstname' || id === 'reglastname' ||
    autocomplete === 'name' || autocomplete === 'given-name' || autocomplete === 'family-name' ||
    id.includes('name') || name.includes('name')
  ) {
    return 'name';
  }
  return null;
}

function enforceInputRestrictions(input) {
  const vType = getFieldValidationType(input);
  if (!vType) return;

  const oldVal = input.value;
  let cleaned = oldVal;
  const start = input.selectionStart;

  if (vType === 'name') {
    // Letters and single spaces alone
    cleaned = cleaned.replace(/[^A-Za-z\s]/g, '').replace(/\s{2,}/g, ' ');
  } else if (vType === 'phone') {
    // Numbers alone (10 to 15 digits)
    cleaned = cleaned.replace(/[^0-9]/g, '').slice(0, 15);
  } else if (vType === 'numeric') {
    cleaned = cleaned.replace(/[^0-9]/g, '');
    if (input.id === 'regZip' && cleaned.length > 6) {
      cleaned = cleaned.slice(0, 6);
    }
  } else if (vType === 'email') {
    cleaned = cleaned.replace(/\s+/g, '');
  }

  if (oldVal !== cleaned) {
    input.value = cleaned;
    if (typeof start === 'number') {
      const diff = oldVal.length - cleaned.length;
      const newPos = Math.max(0, start - diff);
      try { input.setSelectionRange(newPos, newPos); } catch (_) {}
    }
  }
}

function validateField(input, showFeedback = true) {
  if (!input || input.disabled || input.type === 'hidden') return { valid: true };

  enforceInputRestrictions(input);

  const vType = getFieldValidationType(input);
  const val = (input.value || '').trim();
  const isRequired = input.hasAttribute('required') || input.required;

  let hintEl = input.parentElement ? input.parentElement.querySelector('.form-field-hint') : null;

  const setHint = (msg, isError) => {
    if (!showFeedback) return;
    if (!hintEl && input.parentElement) {
      hintEl = document.createElement('span');
      hintEl.className = 'form-field-hint';
      input.parentElement.appendChild(hintEl);
    }
    if (hintEl) {
      hintEl.textContent = msg;
      hintEl.className = `form-field-hint ${isError ? 'is-error' : 'is-valid'}`;
      hintEl.style.display = msg ? 'block' : 'none';
    }
    if (isError) {
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    } else {
      input.classList.remove('is-invalid');
      if (val) input.classList.add('is-valid');
      else input.classList.remove('is-valid');
    }
  };

  const clearHint = () => {
    input.classList.remove('is-invalid', 'is-valid');
    if (hintEl) {
      hintEl.textContent = '';
      hintEl.style.display = 'none';
    }
  };

  if (!val) {
    if (isRequired) {
      const msg = (vType === 'email' || input.type === 'email')
        ? 'Email address is required in format: name@domain.com'
        : 'This field is required.';
      if (showFeedback) setHint(msg, true);
      return { valid: false, message: msg };
    }
    clearHint();
    return { valid: true };
  }

  if (vType === 'name') {
    const lettersOnlyRegex = /^[A-Za-z\s]{2,50}$/;
    if (!lettersOnlyRegex.test(val) || val.replace(/\s+/g, '').length < 2) {
      const msg = 'Name must contain letters alone (min 2 characters).';
      if (showFeedback) setHint(msg, true);
      return { valid: false, message: msg };
    }
    setHint('✓ Valid name format', false);
    return { valid: true };
  }

  if (vType === 'phone') {
    const digitsOnlyRegex = /^[0-9]{10,15}$/;
    if (!digitsOnlyRegex.test(val)) {
      const msg = val.length < 10
        ? `Phone must contain numbers alone (at least 10 digits; ${val.length}/10 entered).`
        : 'Phone must contain numbers alone (10 to 15 digits).';
      if (showFeedback) setHint(msg, true);
      return { valid: false, message: msg };
    }
    setHint('✓ Valid phone number', false);
    return { valid: true };
  }

  if (vType === 'numeric') {
    if (input.id === 'regZip') {
      const zipRegex = /^[0-9]{6}$/;
      if (!zipRegex.test(val)) {
        const msg = 'PIN code must contain numbers alone (6 digits).';
        if (showFeedback) setHint(msg, true);
        return { valid: false, message: msg };
      }
    } else {
      const numRegex = /^[0-9]+$/;
      if (!numRegex.test(val)) {
        const msg = 'Numbers alone should be entered.';
        if (showFeedback) setHint(msg, true);
        return { valid: false, message: msg };
      }
    }
    setHint('✓ Valid number format', false);
    return { valid: true };
  }

  if (vType === 'email') {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val)) {
      const msg = 'Please enter a valid email address in format: name@domain.com';
      if (showFeedback) setHint(msg, true);
      return { valid: false, message: msg };
    }
    setHint('✓ Valid email format', false);
    return { valid: true };
  }

  if (input.type === 'date' && isRequired && !val) {
    const msg = 'Please select a date.';
    if (showFeedback) setHint(msg, true);
    return { valid: false, message: msg };
  }

  if (input.checkValidity && !input.checkValidity()) {
    const msg = input.validationMessage || 'Please enter a valid value.';
    if (showFeedback) setHint(msg, true);
    return { valid: false, message: msg };
  }

  clearHint();
  return { valid: true };
}

function validateSingleForm(form) {
  if (!form) return true;
  const controls = form.querySelectorAll('input, select, textarea');
  let firstInvalid = null;
  let firstMessage = '';

  controls.forEach((ctrl) => {
    const res = validateField(ctrl, true);
    if (!res.valid && !firstInvalid) {
      firstInvalid = ctrl;
      firstMessage = res.message;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
    let labelText = '';
    if (firstInvalid.parentElement) {
      const label = firstInvalid.parentElement.querySelector('label');
      if (label) {
        labelText = label.textContent.replace('*', '').trim();
      }
    }
    const prefix = labelText ? `${labelText}: ` : '';
    showToast(`${prefix}${firstMessage}`, 'warning');
    return false;
  }
  return true;
}

function clearFormValidationState(form) {
  if (!form) return;
  form.querySelectorAll('.form-input').forEach((el) => {
    el.classList.remove('is-invalid', 'is-valid');
  });
  form.querySelectorAll('.form-field-hint').forEach((el) => {
    el.textContent = '';
    el.style.display = 'none';
  });
}

function initGlobalFormValidation() {
  // 1. Instant keystroke filtering: block non-allowed characters as user types
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    if (!target || target.tagName !== 'INPUT') return;
    if (e.ctrlKey || e.metaKey || e.altKey || !e.key || e.key.length !== 1) return;

    const vType = getFieldValidationType(target);
    if (!vType) return;

    if (vType === 'name') {
      // Letters and spaces alone
      if (!/[A-Za-z\s]/.test(e.key)) {
        e.preventDefault();
      }
    } else if (vType === 'phone' || vType === 'numeric') {
      // Numbers alone
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    } else if (vType === 'email') {
      // No spaces
      if (e.key === ' ') {
        e.preventDefault();
      }
    }
  }, true);

  // 2. Real-time cleaning on input (handles paste, autocomplete, drag-drop, mobile IME)
  document.addEventListener('input', (e) => {
    const target = e.target;
    if (target && target.tagName === 'INPUT') {
      enforceInputRestrictions(target);
      if (target.classList.contains('is-invalid') || target.classList.contains('is-valid')) {
        validateField(target, true);
      }
    }
  }, true);

  // 3. Validation on field blur
  document.addEventListener('blur', (e) => {
    const target = e.target;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
      if (target.value && target.value.trim().length > 0) {
        validateField(target, true);
      }
    }
  }, true);

  // 4. Capture-phase form submission interception for any form across the website
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form && form.tagName === 'FORM') {
      if (!validateSingleForm(form)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
      }
    }
  }, true);
}





