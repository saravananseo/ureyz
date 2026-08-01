/* =========================================================
   UREYZ — App Logic
   Dream Chests · Discovery Wheel · Nav · Reveals · PWA install
   ========================================================= */
(function(){
  'use strict';

  /* ---------- Boot loader ---------- */
  window.addEventListener('load', function(){
    var boot = document.getElementById('boot');
    setTimeout(function(){ boot.classList.add('hide'); }, 1200);
  });

  /* ---------- Top nav scroll state ---------- */
  var topnav = document.getElementById('topnav');
  var lastY = 0;
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if (y > 40) topnav.classList.add('scrolled');
    else topnav.classList.remove('scrolled');
    lastY = y;
    updateActiveTab(y);
    updateActProgress();
  }
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- Mobile drawer ---------- */
  var hamburger = document.getElementById('hamburger');
  var drawer = document.getElementById('drawer');
  hamburger.addEventListener('click', function(){
    var open = drawer.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  drawer.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){
      drawer.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });

  /* ---------- Bottom tab bar active state ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'));
  var tabTargets = tabs.map(function(t){ return document.getElementById(t.dataset.target); });
  function updateActiveTab(y){
    var current = tabTargets[0];
    for (var i=0;i<tabTargets.length;i++){
      var el = tabTargets[i];
      if (el && el.offsetTop - 120 <= y + window.innerHeight/2) current = el;
    }
    tabs.forEach(function(t){
      t.classList.toggle('active', document.getElementById(t.dataset.target) === current);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealTargets = document.querySelectorAll(
    '.shift-copy, .shift-visual, .act-card, .tier-card, .why-card, .journey-step, .wheel-widget, .vip-strip-copy, .gallery-strip img, .category .orbit-wrap, .category-tag, .final-mark'
  );
  revealTargets.forEach(function(el, i){
    el.classList.add('reveal');
    el.style.transitionDelay = (Math.min(i%6,6) * 70) + 'ms';
  });
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold:0.15 });
  revealTargets.forEach(function(el){ io.observe(el); });

  /* ---------- Act progress bar ---------- */
  var actsSection = document.getElementById('acts');
  var actProgress = document.getElementById('actProgress');
  function updateActProgress(){
    if (!actsSection) return;
    var rect = actsSection.getBoundingClientRect();
    var vh = window.innerHeight;
    var total = rect.height + vh * 0.5;
    var passed = vh - rect.top;
    var pct = Math.max(0, Math.min(1, passed / total));
    actProgress.style.width = (pct*100) + '%';
  }

  /* ---------- Hero stat counters ---------- */
  var counted = false;
  var heroStats = document.querySelectorAll('.hstat-num');
  function runCounters(){
    if (counted) return;
    counted = true;
    heroStats.forEach(function(el){
      var target = parseInt(el.dataset.count, 10);
      var dur = 1200, start = null;
      function step(ts){
        if (!start) start = ts;
        var p = Math.min(1, (ts-start)/dur);
        el.textContent = Math.floor(p*target);
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    });
  }
  setTimeout(runCounters, 900);

  /* ---------- Dream Chests ---------- */
  var CHESTS = [
    { icon:'💚', label:'Health' },
    { icon:'💰', label:'Wealth' },
    { icon:'❤️', label:'Love' },
    { icon:'🤝', label:'Relationships' },
    { icon:'✈️', label:'Travel' },
    { icon:'🎓', label:'Education' },
    { icon:'📈', label:'Business' },
    { icon:'🎁', label:'Giving Back' },
    { icon:'🥂', label:'Lifestyle' },
    { icon:'🎨', label:'Creativity' },
    { icon:'👑', label:'Legacy' }
  ];

  var chestGrid = document.getElementById('chestGrid');
  var chestCountEl = document.getElementById('chestCount');
  var openedCount = 0;

  function makeBurst(){
    var wrap = document.createElement('div');
    wrap.className = 'burst';
    for (var i=0;i<10;i++){
      var s = document.createElement('span');
      var angle = (Math.PI*2/10) * i;
      var dist = 46 + Math.random()*18;
      s.style.setProperty('--bx', Math.cos(angle)*dist + 'px');
      s.style.setProperty('--by', Math.sin(angle)*dist + 'px');
      s.style.animationDelay = (Math.random()*80) + 'ms';
      wrap.appendChild(s);
    }
    return wrap;
  }

  CHESTS.forEach(function(c, idx){
    var chest = document.createElement('button');
    chest.type = 'button';
    chest.className = 'chest';
    chest.setAttribute('aria-label', 'Dream Chest ' + (idx+1) + ' — tap to open');

    var num = String(idx+1).padStart(2,'0');
    chest.innerHTML =
      '<div class="chest-face">' +
        '<span class="chest-num">CHEST ' + num + '</span>' +
        '<span class="chest-lock">&#128274;</span>' +
        '<span class="chest-hint">Tap to open</span>' +
      '</div>' +
      '<div class="chest-back">' +
        '<span class="chest-icon">' + c.icon + '</span>' +
        '<span class="chest-label">' + c.label + '</span>' +
      '</div>';

    chest.appendChild(makeBurst());

    chest.addEventListener('click', function(){
      if (chest.classList.contains('opened')) return;
      chest.classList.add('bursting');
      chest.classList.add('opened');
      openedCount++;
      chestCountEl.textContent = openedCount;
      showToast('Dream Chest ' + num + ' — ' + c.label + ' unlocked ✦');
      setTimeout(function(){ chest.classList.remove('bursting'); }, 750);
      if (openedCount === CHESTS.length){
        setTimeout(function(){ showToast('All 11 dreams revealed — your night begins ✦'); }, 500);
      }
    });

    chestGrid.appendChild(chest);
  });

  /* ---------- Discovery Wheel ---------- */
  var WHEEL_OUTCOMES = [
    'Health', 'Business', 'Love', 'Giving Back', 'Wealth',
    'Lifestyle', 'Relationships', 'Creativity', 'Travel', 'Legacy', 'Education'
  ];
  var wheelDisc = document.getElementById('wheelDisc');
  var spinBtn = document.getElementById('spinBtn');
  var wheelResult = document.getElementById('wheelResult');
  var currentRotation = 0;
  var spinning = false;

  spinBtn.addEventListener('click', function(){
    if (spinning) return;
    spinning = true;
    wheelResult.textContent = 'Spinning…';
    var slice = 360 / WHEEL_OUTCOMES.length;
    var choiceIdx = Math.floor(Math.random() * WHEEL_OUTCOMES.length);
    var target = 360*5 + (360 - (choiceIdx*slice) - slice/2);
    currentRotation += target;
    wheelDisc.style.transform = 'rotate(' + currentRotation + 'deg)';
    setTimeout(function(){
      spinning = false;
      wheelResult.textContent = 'Tonight, start with: ' + WHEEL_OUTCOMES[choiceIdx];
      showToast('Discovery Wheel landed on ' + WHEEL_OUTCOMES[choiceIdx]);
    }, 3300);
  });

  /* ---------- Toast ---------- */
  var toast = document.getElementById('toast');
  var toastTimer = null;
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 2600);
  }

  /* ---------- PWA install prompt ---------- */
  var deferredPrompt = null;
  var installBtn = document.getElementById('installBtn');
  var heroInstallBtn = document.getElementById('heroInstallBtn');
  var finalInstallBtn = document.getElementById('finalInstallBtn');
  var drawerInstall = document.getElementById('drawerInstall');

  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });

  function triggerInstall(){
    if (deferredPrompt){
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function(choice){
        if (choice.outcome === 'accepted') showToast('Thanks — installing UREYZ ✦');
        deferredPrompt = null;
        installBtn.hidden = true;
      });
    } else {
      showToast('Use your browser menu → "Add to Home Screen" to install');
    }
  }
  [heroInstallBtn, finalInstallBtn, installBtn, drawerInstall].forEach(function(btn){
    if (btn) btn.addEventListener('click', triggerInstall);
  });

  window.addEventListener('appinstalled', function(){
    installBtn.hidden = true;
    showToast('UREYZ installed — welcome in ✦');
  });

  /* ---------- Service worker registration ---------- */
  if ('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('sw.js').catch(function(){ /* silent */ });
    });
  }

  /* init */
  onScroll();
})();
