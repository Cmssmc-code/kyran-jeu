(function () {
  'use strict';

  function initReadingProgress() {
    var bar = document.querySelector('.reading-progress__bar');
    if (!bar) return;

    function update() {
      var doc = document.documentElement;
      var scrollTop = doc.scrollTop || document.body.scrollTop;
      var height = doc.scrollHeight - doc.clientHeight;
      bar.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + '%';
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function getStickyOffset() {
    var header = document.querySelector('kyran-header') || document.querySelector('.site-header');
    var headerH = header ? header.offsetHeight : 76;
    var jumpNav = document.querySelector('.blog-jump-nav');
    var jumpNavH = (jumpNav && jumpNav.classList.contains('is-stuck')) ? jumpNav.offsetHeight : 0;
    return headerH + jumpNavH + 20;
  }

  function scrollToTarget(target) {
    if (!target) return;
    var offset = getStickyOffset();
    var top = target.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop) - offset;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'smooth'
    });
  }

  function initTocSpy() {
    var links = document.querySelectorAll('.article-sidebar .sticky-toc a[href^="#"]');
    if (!links.length) return;

    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var el = document.getElementById(id);
      if (el) sections.push({ link: link, el: el });
    });

    function setActive(id) {
      links.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
      });
      document.querySelectorAll('.blog-jump-nav a[href^="#"]').forEach(function (link) {
        var isTarget = link.getAttribute('href') === '#' + id;
        link.classList.toggle('is-active', isTarget);
        if (isTarget) {
          var track = document.querySelector('.blog-jump-nav__track');
          if (track) {
            var left = link.offsetLeft - (track.clientWidth / 2) + (link.clientWidth / 2);
            track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
          }
        }
      });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      );
      sections.forEach(function (s) { observer.observe(s.el); });
    }
  }

  function initJumpNavSync() {
    document.querySelectorAll('.blog-jump-nav a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function () {
        document.querySelectorAll('.blog-jump-nav a').forEach(function (l) {
          l.classList.remove('is-active');
        });
        link.classList.add('is-active');
      });
    });
  }

  function initSmoothAnchors() {
    document.querySelectorAll('.sticky-toc a[href^="#"], .blog-jump-nav a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href').slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        scrollToTarget(target);
        if (history.replaceState) history.replaceState(null, '', '#' + id);
      });
    });

    if (window.location.hash) {
      var initialTarget = document.getElementById(window.location.hash.slice(1));
      if (initialTarget) {
        setTimeout(function () {
          scrollToTarget(initialTarget);
        }, 150);
      }
    }
  }

  function initShareCopy() {
    document.querySelectorAll('[data-copy-url]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var url = btn.getAttribute('data-copy-url');
        if (!url) return;
        var done = function () {
          var prev = btn.textContent;
          btn.textContent = 'Copié !';
          btn.classList.add('is-copied');
          setTimeout(function () {
            btn.textContent = prev;
            btn.classList.remove('is-copied');
          }, 2000);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(done).catch(function () {
            window.prompt('Copier le lien :', url);
          });
        } else {
          window.prompt('Copier le lien :', url);
        }
      });
    });
  }

  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      var show = (window.scrollY || document.documentElement.scrollTop) > 600;
      btn.hidden = !show;
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initStickyJumpNav() {
    var jumpNav = document.querySelector('.blog-jump-nav');
    if (!jumpNav) return;
    var hero = document.querySelector('.blog-article-hero');
    if (!hero) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var pastHero = (window.scrollY || document.documentElement.scrollTop) > (hero.offsetHeight - 60);
          jumpNav.classList.toggle('is-stuck', pastHero);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReadingProgress();
    initTocSpy();
    initJumpNavSync();
    initSmoothAnchors();
    initShareCopy();
    initBackToTop();
    initStickyJumpNav();
  });
})();
