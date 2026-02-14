/* ===== EXHIBITOR PORTAL UI ===== */
(function(){
  var overlay = document.getElementById('modalOverlay');
  var openBtn = document.getElementById('openModalBtn');
  var closeBtn = document.getElementById('modalClose');
  var gateBox = document.getElementById('gateBox');
  var pricingSection = document.getElementById('pricingSection');
  var welcomeBar = document.getElementById('welcomeBar');
  var welcomeName = document.getElementById('welcomeName');
  var logoutBtn = document.getElementById('logoutBtn');
  var dashboard = document.getElementById('exhibitorDashboard');
  var tabs = document.querySelectorAll('.modal-tab');

  var formReg = document.getElementById('formRegister');
  var formLogin = document.getElementById('formLogin');
  var formSuccess = document.getElementById('formSuccess');

  var regStep1 = document.getElementById('regStep1');
  var regStep2 = document.getElementById('regStep2');
  var regNextBtn = document.getElementById('regNextBtn');
  var regBackBtn = document.getElementById('regBackBtn');
  var regSubmitBtn = document.getElementById('regSubmit');
  var regSteps = document.querySelectorAll('.reg-step-indicator');

  /* Check existing session */
  if(typeof MWF_Auth !== 'undefined' && MWF_Auth.isLoggedIn()){
    unlockPortal(MWF_Auth.getSession());
  }

  /* Open modal */
  if(openBtn) openBtn.addEventListener('click', function(){
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  /* Close modal */
  function closeModal(){
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if(regStep1){ regStep1.style.display = ''; regStep2.style.display = 'none'; }
    if(regNextBtn) regNextBtn.style.display = '';
    if(regBackBtn) regBackBtn.style.display = 'none';
    if(regSubmitBtn) regSubmitBtn.style.display = 'none';
    updateStepIndicator(1);
  }
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(overlay) overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeModal(); });

  /* Tabs */
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      if(formReg) formReg.classList.toggle('active', tab.dataset.tab === 'register');
      if(formLogin) formLogin.classList.toggle('active', tab.dataset.tab === 'login');
      if(formSuccess) formSuccess.style.display = 'none';
      clearErrors();
      if(regStep1){ regStep1.style.display = ''; regStep2.style.display = 'none'; }
      if(regNextBtn) regNextBtn.style.display = '';
      if(regBackBtn) regBackBtn.style.display = 'none';
      if(regSubmitBtn) regSubmitBtn.style.display = 'none';
      updateStepIndicator(1);
    });
  });

  /* Register: Step 1 → Step 2 */
  if(regNextBtn) regNextBtn.addEventListener('click', function(){
    var fn = document.getElementById('regFirstName').value.trim();
    var ln = document.getElementById('regLastName').value.trim();
    var em = document.getElementById('regEmail').value.trim();
    var pw = document.getElementById('regPassword').value;
    var pw2 = document.getElementById('regPasswordConfirm').value;
    var err = document.getElementById('regError');

    if(!fn || !ln || !em || !pw){ showError(err, 'Bitte füllen Sie alle Pflichtfelder aus.'); return; }
    if(!em.includes('@') || !em.includes('.')){ showError(err, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'); return; }
    if(pw.length < 6){ showError(err, 'Das Passwort muss mindestens 6 Zeichen lang sein.'); return; }
    if(pw !== pw2){ showError(err, 'Die Passwörter stimmen nicht überein.'); return; }

    hideError(err);
    regStep1.style.display = 'none';
    regStep2.style.display = 'block';
    regNextBtn.style.display = 'none';
    regBackBtn.style.display = '';
    regSubmitBtn.style.display = '';
    updateStepIndicator(2);
  });

  /* Register: Back to Step 1 */
  if(regBackBtn) regBackBtn.addEventListener('click', function(){
    regStep2.style.display = 'none';
    regStep1.style.display = '';
    regNextBtn.style.display = '';
    regBackBtn.style.display = 'none';
    regSubmitBtn.style.display = 'none';
    updateStepIndicator(1);
  });

  /* Register: Submit */
  if(regSubmitBtn) regSubmitBtn.addEventListener('click', function(){
    var priv = document.getElementById('regPrivacy').checked;
    var err = document.getElementById('regError');
    if(!priv){ showError(err, 'Bitte akzeptieren Sie die Datenschutzerklärung.'); return; }
    hideError(err);

    var data = {
      firstName: document.getElementById('regFirstName').value.trim(),
      lastName: document.getElementById('regLastName').value.trim(),
      email: document.getElementById('regEmail').value.trim(),
      password: document.getElementById('regPassword').value,
      company: document.getElementById('regCompany').value.trim(),
      vatId: (document.getElementById('regVatId') || {}).value || '',
      phone: (document.getElementById('regPhone') || {}).value || '',
      street: (document.getElementById('regStreet') || {}).value || '',
      zip: (document.getElementById('regZip') || {}).value || '',
      city: (document.getElementById('regCity') || {}).value || ''
    };

    var result = MWF_Auth.register(data);
    if(!result.success){ showError(err, result.error); return; }

    formReg.classList.remove('active');
    formSuccess.style.display = 'block';
    setTimeout(function(){
      closeModal();
      unlockPortal(result.session);
      formSuccess.style.display = 'none';
      formReg.classList.add('active');
    }, 1500);
  });

  /* Login: Submit */
  var loginSubmitBtn = document.getElementById('loginSubmit');
  if(loginSubmitBtn) loginSubmitBtn.addEventListener('click', function(){
    var em = document.getElementById('loginEmail').value.trim();
    var pw = document.getElementById('loginPassword').value;
    var err = document.getElementById('loginError');

    if(!em || !em.includes('@')){ showError(err, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'); return; }
    if(!pw){ showError(err, 'Bitte geben Sie Ihr Passwort ein.'); return; }

    var result = MWF_Auth.login(em, pw);
    if(!result.success){ showError(err, result.error); return; }

    hideError(err);
    formLogin.classList.remove('active');
    formSuccess.style.display = 'block';
    setTimeout(function(){
      closeModal();
      unlockPortal(result.session);
      formSuccess.style.display = 'none';
      formLogin.classList.add('active');
    }, 1500);
  });

  /* Logout */
  if(logoutBtn) logoutBtn.addEventListener('click', function(){
    MWF_Auth.logout();
    if(pricingSection) pricingSection.classList.remove('unlocked');
    if(welcomeBar) welcomeBar.classList.remove('visible');
    if(gateBox) gateBox.style.display = '';
    if(dashboard) dashboard.classList.remove('visible');
  });

  function unlockPortal(session){
    if(gateBox) gateBox.style.display = 'none';
    if(welcomeName) welcomeName.textContent = session.name;
    if(welcomeBar) welcomeBar.classList.add('visible');
    if(pricingSection) pricingSection.classList.add('unlocked');
    if(dashboard){
      dashboard.classList.add('visible');
      var dn = document.getElementById('dashboardName');
      var dc = document.getElementById('dashboardCompany');
      if(dn) dn.textContent = session.name;
      if(dc) dc.textContent = session.company || '\u2014';
    }
    setTimeout(function(){
      if(pricingSection) pricingSection.scrollIntoView({ behavior:'smooth', block:'center' });
    }, 300);
  }

  function updateStepIndicator(step){
    regSteps.forEach(function(s, i){
      s.classList.toggle('active', i < step);
      s.classList.toggle('current', i === step - 1);
    });
  }

  function showError(el, msg){ if(el){ el.textContent = msg; el.style.display = 'block'; } }
  function hideError(el){ if(el) el.style.display = 'none'; }
  function clearErrors(){ document.querySelectorAll('.form-error').forEach(function(e){ e.style.display = 'none'; }); }
})();
