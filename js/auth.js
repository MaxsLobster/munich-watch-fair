/* ===== AUTHENTICATION SYSTEM ===== */
/* localStorage-based auth, structured for future API backend */

var MWF_Auth = (function(){
  var STORAGE_KEY = 'mwf_users';
  var SESSION_KEY = 'mwf_session';

  function hashPassword(pw){
    var hash = 0;
    for(var i = 0; i < pw.length; i++){
      var ch = pw.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash |= 0;
    }
    return 'h_' + Math.abs(hash).toString(36);
  }

  function getUsers(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e){ return []; }
  }

  function saveUsers(users){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  function getSession(){
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch(e){ return null; }
  }

  function setSession(user){
    var session = {
      email: user.email,
      name: user.firstName + ' ' + user.lastName,
      company: user.company || '',
      loggedInAt: Date.now()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession(){
    localStorage.removeItem(SESSION_KEY);
  }

  return {
    register: function(data){
      var users = getUsers();
      if(users.find(function(u){ return u.email === data.email; })){
        return { success: false, error: 'Diese E-Mail-Adresse ist bereits registriert.' };
      }
      var user = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        passwordHash: hashPassword(data.password),
        company: data.company || '',
        vatId: data.vatId || '',
        phone: data.phone || '',
        street: data.street || '',
        zip: data.zip || '',
        city: data.city || '',
        createdAt: Date.now()
      };
      users.push(user);
      saveUsers(users);
      return { success: true, session: setSession(user) };
    },

    login: function(email, password){
      var users = getUsers();
      var user = users.find(function(u){ return u.email === email; });
      if(!user) return { success: false, error: 'Kein Konto mit dieser E-Mail-Adresse gefunden.' };
      if(user.passwordHash !== hashPassword(password))
        return { success: false, error: 'Falsches Passwort. Bitte versuchen Sie es erneut.' };
      return { success: true, session: setSession(user) };
    },

    logout: function(){ clearSession(); },

    isLoggedIn: function(){ return getSession() !== null; },

    getSession: function(){ return getSession(); },

    getProfile: function(){
      var session = getSession();
      if(!session) return null;
      var users = getUsers();
      return users.find(function(u){ return u.email === session.email; }) || null;
    }
  };
})();
