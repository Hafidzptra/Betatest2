// Menginstal service worker
self.addEventListener('install', function(event) {
    console.log('Service Worker terinstal.');
    self.skipWaiting(); // Agar service worker langsung aktif tanpa menunggu
});

// Mengaktifkan service worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker diaktifkan.');
    return self.clients.claim(); // Menjamin service worker mulai mengambil alih semua client
});

// Mendengarkan pesan dari script utama
self.addEventListener('message', function(event) {
    const alarmData = event.data;

    // Cek apakah pesan berisi data alarm (waktu dan pesan notifikasi)
    if (alarmData && alarmData.time && alarmData.message) {
        const timeToAlarm = alarmData.time - Date.now();

        // Jika waktu alarm masih di masa depan, set timeout
        if (timeToAlarm > 0) {
            setTimeout(() => {
                // Tampilkan notifikasi
                self.registration.showNotification('Alarm', {
                    body: alarmData.message,
                    icon: 'https://via.placeholder.com/100',
                    vibrate: [200, 100, 200], // Getaran
                    requireInteraction: true // Notifikasi tetap muncul sampai diinteraksi
                });

                // Setelah notifikasi muncul, Anda bisa menyetel ulang alarm untuk minggu depan di sini jika diinginkan
            }, timeToAlarm);
        }
    }
});

// Menangani notifikasi jika user mengklik notifikasi
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Tutup notifikasi saat diklik

    // Arahkan user kembali ke aplikasi jika dia mengklik notifikasi
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(function(clientList) {
            if (clientList.length > 0) {
                // Jika sudah ada window terbuka, fokus pada yang itu
                return clientList[0].focus();
            }
            // Jika tidak ada, buka tab baru dengan aplikasi Anda
            return clients.openWindow('/');
        })
    );
});
