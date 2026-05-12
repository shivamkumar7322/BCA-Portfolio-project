  (function() {
      // MOBILE MENU TOGGLE (hamburger)
      const mobileToggle = document.getElementById('mobile-menu');
      const navList = document.getElementById('nav-list');

      if (mobileToggle && navList) {
          mobileToggle.addEventListener('click', function(e) {
              e.stopPropagation();
              navList.classList.toggle('active');
          });
      }

      // Helper: check if mobile viewport
      function isMobileView() {
          return window.innerWidth <= 768;
      }

      // Function to manage dropdowns for mobile: attach click toggles only on mobile
      let mobileDropdownHandlers = [];

      function initMobileDropdowns() {
          // remove all previous listeners if any (clean re-init)
          if (window._dropdownCleanup && typeof window._dropdownCleanup === 'function') {
              window._dropdownCleanup();
          }

          const dropdownParents = document.querySelectorAll('.has-dropdown');
          const submenuParents = document.querySelectorAll('.has-submenu');
          const allTogglers = [...dropdownParents, ...submenuParents];

          const clickHandlerMap = new Map();

          function handleTogglerClick(e) {
              // only handle if mobile view
              if (!isMobileView()) return;
              const targetLink = e.currentTarget;
              const parentLi = targetLink.closest('li');
              if (!parentLi) return;

              // find the immediate dropdown/submenu inside this li
              let dropdownMenu = null;
              if (parentLi.classList.contains('has-dropdown')) {
                  dropdownMenu = parentLi.querySelector(':scope > .dropdown');
              } else if (parentLi.classList.contains('has-submenu')) {
                  dropdownMenu = parentLi.querySelector(':scope > .submenu, :scope > .submenu-right');
              }
              if (!dropdownMenu) return;

              e.preventDefault();
              // Toggle display of this dropdown
              if (dropdownMenu.style.display === 'block') {
                  dropdownMenu.style.display = 'none';
              } else {
                  // optional: close other open dropdowns (better UX)
                  document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                      if (menu !== dropdownMenu) {
                          menu.style.display = 'none';
                      }
                  });
                  dropdownMenu.style.display = 'block';
              }
          }

          // attach event listeners only for mobile mode initially and update on resize
          function attachMobileEvents() {
              allTogglers.forEach(toggler => {
                  const link = toggler.querySelector(':scope > a');
                  if (link && !clickHandlerMap.has(link)) {
                      link.addEventListener('click', handleTogglerClick);
                      clickHandlerMap.set(link, handleTogglerClick);
                  }
              });
          }

          function detachMobileEvents() {
              allTogglers.forEach(toggler => {
                  const link = toggler.querySelector(':scope > a');
                  if (link && clickHandlerMap.has(link)) {
                      link.removeEventListener('click', clickHandlerMap.get(link));
                      clickHandlerMap.delete(link);
                  }
              });
              // also hide any leftover open dropdowns
              document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                  menu.style.display = '';
              });
          }

          function applyBasedOnViewport() {
              if (isMobileView()) {
                  // disable any inline hover styles interference: but we already hide by default via css (display: none)
                  // ensure all dropdowns are hidden initially for fresh mobile
                  document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                      menu.style.display = '';
                      // css already display: none for mobile media, but if inline style conflict remove
                      if (window.getComputedStyle(menu).display !== 'none') {
                          // since media query hides them but we also control via display, let's reset to ''
                          menu.style.display = '';
                      }
                  });
                  attachMobileEvents();
              } else {
                  detachMobileEvents();
                  // revert to desktop: ensure all dropdowns have no inline display style
                  document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                      menu.style.display = '';
                  });
              }
          }

          applyBasedOnViewport();
          window.addEventListener('resize', function() {
              applyBasedOnViewport();
              // if mobile view becomes desktop we also close the mobile menu if open
              if (!isMobileView() && navList.classList.contains('active')) {
                  navList.classList.remove('active');
              }
              // reset all inline dropdown styles on resize for consistency
              if (!isMobileView()) {
                  document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                      menu.style.display = '';
                  });
              }
          });

          // close dropdowns when clicking outside on mobile (optional)
          document.addEventListener('click', function(e) {
              if (!isMobileView()) return;
              let target = e.target;
              let isInsideNav = target.closest('.nav-links');
              if (!isInsideNav && navList && navList.classList.contains('active')) {
                  // if click outside nav and menu open, close menu
                  navList.classList.remove('active');
              }
              // close all dropdowns if click outside any dropdown toggler area
              const isInsideDropdownToggle = target.closest('.has-dropdown, .has-submenu');
              if (!isInsideDropdownToggle) {
                  document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                      menu.style.display = 'none';
                  });
              }
          });

          // store cleanup for re-init if needed
          window._dropdownCleanup = function() {
              detachMobileEvents();
          };
      }

      initMobileDropdowns();

      // fix for any nested submenu on desktop hover (already works perfect via CSS)
      // Add a small patch for mobile to maintain submenu parent click and prevent double hiding
      // Ensure search icon basic click alert
      const searchIcon = document.querySelector('.search-box i');
      if (searchIcon) {
          searchIcon.addEventListener('click', function() {
              let inputVal = document.querySelector('.search-box input').value;
              if (inputVal.trim() !== "") {
                  alert(`Searching for: ${inputVal}`);
              } else {
                  alert("Please enter search keyword.");
              }
          });
      }

      // apply now button smooth preview
      const applyBtn = document.querySelector('.apply-now-btn');
      if (applyBtn) {
          applyBtn.addEventListener('click', (e) => {
              e.preventDefault();
              alert("Application portal coming soon! Stay tuned.");
          });
      }

      // login demo
      const loginBtn = document.querySelector('.login-btn');
      if (loginBtn) {
          loginBtn.addEventListener('click', (e) => {
              e.preventDefault();
              alert("Student/Admin login portal will be launched shortly.");
          });
      }

      // for desktop user, ensure if window resizes from mobile to desktop -> remove all inline display from dropdowns
      window.addEventListener('resize', function() {
          if (!isMobileView()) {
              document.querySelectorAll('.dropdown, .submenu, .submenu-right').forEach(menu => {
                  menu.style.display = '';
              });
          }
      });

      // handle online apply demo
      const onlineApply = document.querySelector('.online a');
      if (onlineApply) {
          onlineApply.addEventListener('click', (e) => {
              e.preventDefault();
              alert("Online application form for BCA & other courses will be available soon.");
          });
      }

      // make sure all links with # show popup demo without breaking page
      const allNavLinks = document.querySelectorAll('.nav-links a');
      allNavLinks.forEach(link => {
          if (link.getAttribute('href') === '#') {
              link.addEventListener('click', (e) => {
                  if (!link.closest('.online')) {
                      e.preventDefault();
                      alert("Navigate to: " + link.innerText.trim() + " — Coming soon!");
                  }
              });
          }
      });
  })();


  function openSemester(evt, semName) {
      var i, tabcontent, tablinks;

      // Saare contents hide karo
      tabcontent = document.getElementsByClassName("tab-content");
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].classList.remove("show");
      }

      // Saare active classes hatao
      tablinks = document.getElementsByClassName("tab-link");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].classList.remove("active");
      }

      // Current tab show karo aur button ko active karo
      document.getElementById(semName).classList.add("show");
      evt.currentTarget.classList.add("active");
  }