// 🔥 Firebase Konfiguration (MUSST du einmal anlegen)
const firebaseConfig = {
  apiKey: "DEIN_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  databaseURL: "https://DEIN_PROJEKT.firebaseio.com",
  projectId: "DEIN_PROJEKT",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const auth = firebase.auth();

// 🔐 Anonym anmelden
auth.signInAnonymously();

// 🗺️ Karte
const map = L.map('map').setView([49.242, 8.259], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// 👤 Eigener Marker
const myMarker = L.circleMarker([0,0], {radius:8, color:'blue'}).addTo(map);

// 👥 Andere Personen
const userMarkers = {};

// 📍 GPS Tracking
navigator.geolocation.watchPosition(pos => {
  const { latitude, longitude } = pos.coords;
  myMarker.setLatLng([latitude, longitude]);

  const uid = auth.currentUser.uid;
  db.ref('users/' + uid).set({
    lat: latitude,
    lng: longitude
  });
});

// 🔄 Andere Nutzer anzeigen
db.ref('users').on('value', snap => {
  const users = snap.val() || {};
  Object.keys(users).forEach(uid => {
    if (uid === auth.currentUser?.uid) return;

    if (!userMarkers[uid]) {
      userMarkers[uid] = L.circleMarker([0,0], {
        radius:8,
        color:'red'
      }).addTo(map);
    }
    userMarkers[uid].setLatLng([users[uid].lat, users[uid].lng]);
  });
});
