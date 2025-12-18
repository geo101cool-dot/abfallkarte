// Startpunkt: Haßloch
const map = L.map('map').setView([49.242, 8.259], 15);

// OpenStreetMap Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Marker für eigene Position
let myMarker = null;

// GPS verfolgen
if ("geolocation" in navigator) {
  navigator.geolocation.watchPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (!myMarker) {
        myMarker = L.circleMarker([lat, lng], {
          radius: 8,
          color: 'blue',
          fillColor: 'blue',
          fillOpacity: 0.8
        }).addTo(map);

        map.setView([lat, lng], 16);
      } else {
        myMarker.setLatLng([lat, lng]);
      }
    },
    error => {
      alert("Standort konnte nicht ermittelt werden.");
    },
    {
      enableHighAccuracy: true
    }
  );
} else {
  alert("GPS wird von diesem Gerät nicht unterstützt.");
}
