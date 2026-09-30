// Page d'administration des emails KYRAN (le token n'est jamais stocké)
(function () {
  'use strict';

  var currentMode = 'custom';
  var API_URL = 'https://kyran-webhook-production.up.railway.app';

  function setMode(mode) {
    currentMode = mode;
    document.querySelectorAll('.tab-btn').forEach(function(b, i) {
      b.classList.toggle('active', (mode === 'custom' && i === 0) || (mode === 'shipping' && i === 1));
    });
    document.getElementById('fields-custom').style.display = mode === 'custom' ? 'block' : 'none';
    document.getElementById('fields-shipping').style.display = mode === 'shipping' ? 'block' : 'none';
  }

  async function handleSend(e) {
    e.preventDefault();
    var btn = document.getElementById('submit-btn');
    var statusBox = document.getElementById('status-box');
    var token = document.getElementById('admin-token').value.trim();
    var email = document.getElementById('client-email').value.trim();
    var name = document.getElementById('client-name').value.trim();

    statusBox.className = 'status-msg';
    statusBox.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';

    try {
      var endpoint = currentMode === 'custom' ? '/api/send-custom-email' : '/api/shipping';
      var payload = {};

      if (currentMode === 'custom') {
        payload = {
          to: email,
          customerName: name,
          subject: document.getElementById('email-subject').value.trim(),
          message: document.getElementById('email-message').value.trim(),
          actionText: document.getElementById('email-btn-text').value.trim() || null,
          actionUrl: document.getElementById('email-btn-url').value.trim() || null
        };
      } else {
        var tracking = document.getElementById('ship-tracking').value.trim();
        payload = {
          customerEmail: email,
          customerName: name,
          orderId: document.getElementById('ship-order').value.trim(),
          carrier: document.getElementById('ship-carrier').value.trim(),
          trackingNumber: tracking,
          trackingUrl: tracking ? 'https://www.laposte.fr/outils/suivre-vos-envois?code=' + encodeURIComponent(tracking) : '',
          estimatedDelivery: '2 à 4 jours ouvrés'
        };
      }

      var res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(payload)
      });

      var data = await res.json().catch(function () { return {}; });
      if (!res.ok) throw new Error(data.error || 'Erreur lors de l\'envoi');

      statusBox.textContent = '✓ Email envoyé avec succès à ' + email + ' !';
      statusBox.className = 'status-msg success';
      if (currentMode === 'custom') {
        document.getElementById('email-message').value = '';
      }
    } catch (err) {
      statusBox.textContent = '✗ ' + err.message;
      statusBox.className = 'status-msg error';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Envoyer l\'email officiel';
    }
  }

  document.querySelectorAll('.tab-btn').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
  });
  document.getElementById('email-form').addEventListener('submit', handleSend);
})();
