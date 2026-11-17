/* ==========================================================================
   LOGIKA INTERAKTIF PONDOK PESANTREN MODERN AL-HIKMAH (VANILLA JS)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------------------------------------
    // 1. WIDGET WAKTU SALAT, JAM REAL-TIME, KALENDER HIJRIAH & COUNTDOWN
    // ----------------------------------------------------------------------
    const hijriDisplay = document.getElementById("hijriDisplay");
    const liveClock = document.getElementById("liveClock");
    const nextPrayerName = document.getElementById("nextPrayerName");
    const nextPrayerCountdown = document.getElementById("nextPrayerCountdown");
    const countdownTimer = document.getElementById("countdownTimer");

    function updateHijriAndClock() {
        const now = new Date();

        // Format Kalender Hijriah Otomatis (Intl API)
        try {
            const hijriFormatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
            hijriDisplay.textContent = hijriFormatter.format(now);
        } catch (e) {
            hijriDisplay.textContent = "17 Jumadil Awal 1448 H";
        }

        // Jam Real-Time WIB
        const timeStr = now.toLocaleTimeString("id-ID", { hour12: false });
        liveClock.textContent = `${timeStr} WIB`;

        // Penentuan Waktu Salat Berikutnya
        const prayers = [
            { name: "Subuh", time: "04:15" },
            { name: "Dzuhur", time: "11:45" },
            { name: "Ashar", time: "15:05" },
            { name: "Maghrib", time: "17:50" },
            { name: "Isya", time: "19:00" }
        ];

        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        let upcoming = null;

        document.querySelectorAll(".prayer-item").forEach(el => el.classList.remove("active-prayer"));

        for (let i = 0; i < prayers.length; i++) {
            const [ph, pm] = prayers[i].time.split(":").map(Number);
            const pMinutes = ph * 60 + pm;
            if (pMinutes > currentMinutes) {
                upcoming = { ...prayers[i], diff: pMinutes - currentMinutes, index: i };
                break;
            }
        }

        if (!upcoming) {
            const [sh, sm] = prayers[0].time.split(":").map(Number);
            upcoming = {
                name: "Subuh",
                time: prayers[0].time,
                diff: (24 * 60 - currentMinutes) + (sh * 60 + sm),
                index: 0
            };
        }

        const prayerItems = document.querySelectorAll(".prayer-item");
        if (prayerItems[upcoming.index]) {
            prayerItems[upcoming.index].classList.add("active-prayer");
        }

        const hoursLeft = Math.floor(upcoming.diff / 60);
        const minsLeft = upcoming.diff % 60;
        nextPrayerName.textContent = `${upcoming.name} (${upcoming.time} WIB)`;
        nextPrayerCountdown.textContent = `Menuju adzan dalam ${hoursLeft} jam ${minsLeft} menit`;

        // Hitung Mundur Agenda Besar Pesantren (14 Hari ke depan)
        const targetAgenda = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 8, 0, 0);
        const diffMs = targetAgenda - now;
        const d = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const h = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diffMs / (1000 * 60)) % 60);
        countdownTimer.textContent = `${d}h ${h}j ${m}m`;
    }

    setInterval(updateHijriAndClock, 1000);
    updateHijriAndClock();

    // ----------------------------------------------------------------------
    // 2. DARK MODE TOGGLE (TEMA SIANG / MALAM KALIGRAFI)
    // ----------------------------------------------------------------------
    const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");

    themeToggle.addEventListener("click", () => {
        const htmlEl = document.documentElement;
        const isDark = htmlEl.getAttribute("data-theme") === "dark";
        const nextTheme = isDark ? "light" : "dark";
        htmlEl.setAttribute("data-theme", nextTheme);
        themeIcon.textContent = nextTheme === "dark" ? "☀️" : "🌙";
    });

    // ----------------------------------------------------------------------
    // 3. VIRTUAL TOUR 360° & DENAH INTERAKTIF
    // ----------------------------------------------------------------------
    const campusSpots = {
        masjid: {
            title: "Masjid Jami' Al-Hikmah Center",
            category: "Pusat Ibadah & Halaqah",
            capacity: "Kapasitas: 2.500 Jamaah",
            desc: "Masjid utama berarsitektur bioklimatik tanpa tiang tengah, dilengkapi akustik studio untuk murottal dan sirkulasi udara alami yang sejuk sepanjang hari.",
            features: ["✓ Smart Sound System", "✓ Zona Halaqah Tahfidz", "✓ Air Wudhu Daur Ulang"],
            icon: "🕌",
            gradient: "linear-gradient(135deg, #0B3B2E, #165B49, #C6A355, #0B3B2E)"
        },
        asrama: {
            title: "Asrama Smart Dormitory Ibnu Sina",
            category: "Hunian Santri Modern",
            capacity: "Kapasitas: 4-6 Santri / Kamar",
            desc: "Kamar asrama ergonomis dengan loker pintar berbasis RFID, ruang belajar bersama, layanan laundry harian, dan pengawasan Musyrif 24 jam.",
            features: ["✓ Akses Pintu Kartu RFID", "✓ Ventilasi Sehat & AC", "✓ Klinik Kesehatan 24 Jam"],
            icon: "🛏️",
            gradient: "linear-gradient(135deg, #103742, #1D6356, #B89342, #103742)"
        },
        lab: {
            title: "Laboratorium AI, Robotik & Sains Terpadu",
            category: "Teknologi & Riset Santri",
            capacity: "Fasilitas: 80 Workstation",
            desc: "Pusat pengembangan perangkat lunak, kecerdasan buatan (AI), IoT pertanian pesantren, serta eksperimen fisika-biologi berstandar olimpiade.",
            features: ["✓ High-Speed Fiber Optic", "✓ Kit Robotik & IoT", "✓ Studio Podcast & Multimedia"],
            icon: "💻",
            gradient: "linear-gradient(135deg, #092C36, #135D4B, #D1A94E, #092C36)"
        },
        perpus: {
            title: "Perpustakaan Digital & Maktabah Turats",
            category: "Pusat Literasi Islam & Sains",
            capacity: "Koleksi: 18.000+ Kitab & Buku",
            desc: "Menghadirkan ribuan koleksi Kitab Kuning (Turats) bersanad serta akses jurnal digital internasional dalam ruang baca kedap suara.",
            features: ["✓ E-Maktabah Syamilah", "✓ Ruang Diskusi Bahtsul Masail", "✓ Co-Working Space Santri"],
            icon: "📚",
            gradient: "linear-gradient(135deg, #2C2213, #0B3B2E, #C6A355, #2C2213)"
        },
        sport: {
            title: "Sunnah Sport Arena & Lapangan Terpadu",
            category: "Kebugaran & Ekstrakurikuler",
            capacity: "Area Terbuka Hijau 2,4 Ha",
            desc: "Fasilitas olahraga memanah (Archery), berkuda, kolam renang tertutup terpisah putra-putri, serta lapangan futsal dan basket.",
            features: ["✓ Lapangan Panahan Standar", "✓ Kolam Renang Syar'i", "✓ Lintasan Lari Sintetis"],
            icon: "🏹",
            gradient: "linear-gradient(135deg, #0F3D23, #1D6E42, #C6A355, #0F3D23)"
        }
    };

    const panoCanvas = document.getElementById("panoramaCanvas");
    const panoArt = document.getElementById("panoArt");
    const panoDegree = document.getElementById("panoDegree");
    let currentYaw = 180;
    let autoRotateInterval = null;

    function renderSpot(spotKey) {
        const data = campusSpots[spotKey];
        document.getElementById("spotCategory").textContent = data.category;
        document.getElementById("spotCapacity").textContent = data.capacity;
        document.getElementById("spotTitle").textContent = data.title;
        document.getElementById("spotDesc").textContent = data.desc;
        panoArt.textContent = `${data.icon} Panorama 360° ${data.title}`;
        panoCanvas.style.backgroundImage = data.gradient;

        const featContainer = document.getElementById("spotFeatures");
        featContainer.innerHTML = data.features.map(f => `<span>${f}</span>`).join("");
    }

    function updatePanoramaAngle(delta) {
        currentYaw = (currentYaw + delta + 360) % 360;
        panoDegree.textContent = `${Math.round(currentYaw)}°`;
        const pos = (currentYaw / 360) * 100;
        panoCanvas.style.backgroundPosition = `${pos}% 50%`;
    }

    document.querySelectorAll(".map-hotspot").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".map-hotspot").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderSpot(btn.dataset.spot);
        });
    });

    document.getElementById("panoLeft").addEventListener("click", () => updatePanoramaAngle(-30));
    document.getElementById("panoRight").addEventListener("click", () => updatePanoramaAngle(30));
    document.getElementById("panoAuto").addEventListener("click", (e) => {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
            e.target.textContent = "🔄 Auto-Rotate 360°";
        } else {
            autoRotateInterval = setInterval(() => updatePanoramaAngle(4), 80);
            e.target.textContent = "⏸ Hentikan Putar";
        }
    });

    // Drag Panorama dengan Mouse
    let isDraggingPano = false;
    let startX = 0;
    panoCanvas.addEventListener("mousedown", (e) => { isDraggingPano = true; startX = e.clientX; });
    window.addEventListener("mouseup", () => { isDraggingPano = false; });
    window.addEventListener("mousemove", (e) => {
        if (!isDraggingPano) return;
        const dx = e.clientX - startX;
        startX = e.clientX;
        updatePanoramaAngle(dx * 0.45);
    });

    renderSpot("masjid");

    // ----------------------------------------------------------------------
    // 4. KALKULATOR SIMULASI BIAYA PENDIDIKAN
    // ----------------------------------------------------------------------
    const pricingData = {
        smp: { label: "SMP IT", pangkal: 14500000, kitab: 2850000, bulanan: 1450000 },
        sma: { label: "SMA Sains", pangkal: 16000000, kitab: 3200000, bulanan: 1600000 },
        takhassus: { label: "Takhassus", pangkal: 12500000, kitab: 2500000, bulanan: 1350000 }
    };

    const dormAddons = {
        reguler: { label: "Reguler", pangkalAdd: 0, bulananAdd: 200000 },
        eksekutif: { label: "Smart Dorm AC", pangkalAdd: 2500000, bulananAdd: 550000 },
        premier: { label: "Premier Bilingual", pangkalAdd: 4500000, bulananAdd: 900000 }
    };

    let selectedLevel = "smp";
    let selectedDorm = "reguler";

    function formatIDR(num) {
        return "Rp " + num.toLocaleString("id-ID");
    }

    function calculateCost() {
        const base = pricingData[selectedLevel];
        const dorm = dormAddons[selectedDorm];
        const discountRate = parseFloat(document.getElementById("scholarshipSelect").value) || 0;

        const pangkalTotal = base.pangkal + dorm.pangkalAdd;
        const kitabTotal = base.kitab;

        let addonTotal = 0;
        ["addonCoding", "addonSanad", "addonIelts"].forEach(id => {
            const el = document.getElementById(id);
            if (el.checked) addonTotal += parseInt(el.value, 10);
        });

        const discountAmount = Math.round(pangkalTotal * discountRate);
        const totalInitial = pangkalTotal + kitabTotal + addonTotal - discountAmount;
        const monthlyTotal = base.bulanan + dorm.bulananAdd;

        document.getElementById("selectedSummaryTag").textContent = `${base.label} • ${dorm.label}`;
        document.getElementById("costPangkal").textContent = formatIDR(pangkalTotal);
        document.getElementById("costKitab").textContent = formatIDR(kitabTotal);
        document.getElementById("costAddon").textContent = formatIDR(addonTotal);
        document.getElementById("costDiscount").textContent = `- ${formatIDR(discountAmount)}`;
        document.getElementById("totalInitialCost").textContent = formatIDR(totalInitial);
        document.getElementById("monthlyCost").innerHTML = `${formatIDR(monthlyTotal)} <small>/ bulan</small>`;
    }

    document.querySelectorAll("#levelOptions .pill-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#levelOptions .pill-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedLevel = btn.dataset.level;
            calculateCost();
        });
    });

    document.querySelectorAll("#dormOptions .pill-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#dormOptions .pill-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedDorm = btn.dataset.dorm;
            calculateCost();
        });
    });

    ["addonCoding", "addonSanad", "addonIelts", "scholarshipSelect"].forEach(id => {
        document.getElementById(id).addEventListener("change", calculateCost);
    });

    calculateCost();

    // ----------------------------------------------------------------------
    // 5. DASHBOARD MONITORING SANTRI (PORTAL WALI)
    // ----------------------------------------------------------------------
    const studentsData = [
        {
            initials: "AZ",
            name: "Ahmad Zaki Al-Farisi",
            classInfo: "SMP Kelas 9A • Asrama Ibnu Sina",
            mentor: "Musyrif Halaqah: Ust. H. Salman Al-Hafidz, Lc.",
            juz: 18,
            lastSetoran: "QS. Al-Kahfi Ayat 85-110 (Mumtaz)",
            semesterTarget: 92,
            worshipScore: "Skor Istiqomah: 98%",
            balance: 425000,
            worship: [
                { name: "Salat Fardhu Berjamaah di Masjid", status: "35/35 Waktu (100%)" },
                { name: "Qiyamul Lail & Tahajud", status: "7/7 Malam (Istiqomah)" },
                { name: "Dzikir Al-Ma'tsurat Pagi & Petang", status: "Tuntas Harian" },
                { name: "Puasa Sunnah Senin & Kamis", status: "Terlaksana" }
            ],
            transactions: [
                { item: "Koperasi Santri (Buku Tulis & Pena)", cost: "- Rp 18.500", time: "Hari ini, 13:10" },
                { item: "Kantin Sehat (Jus Kurma & Roti)", cost: "- Rp 12.000", time: "Kemarin, 16:20" },
                { item: "Top-Up Wali Santri (Transfer VA)", cost: "+ Rp 200.000", time: "3 Hari lalu" }
            ]
        },
        {
            initials: "AH",
            name: "Aisyah Humaira Zahra",
            classInfo: "SMA Sains Kelas 11 • Asrama Rabiah Al-Adawiyah",
            mentor: "Musyrifah Halaqah: Ustadzah Nabila Al-Hafidzah, M.Ag.",
            juz: 26,
            lastSetoran: "QS. Az-Zumar Ayat 32-55 (Mumtaz Murtafi')",
            semesterTarget: 97,
            worshipScore: "Skor Istiqomah: 99%",
            balance: 580000,
            worship: [
                { name: "Salat Fardhu Berjamaah", status: "35/35 Waktu (100%)" },
                { name: "Qiyamul Lail & Witir", status: "7/7 Malam (Istiqomah)" },
                { name: "Muraja'ah Mandiri Ba'da Maghrib", status: "2 Juz / Pekan" },
                { name: "Salat Sunnah Dhuha", status: "7/7 Hari" }
            ],
            transactions: [
                { item: "Maktabah (Kitab Tafsir Jalalain)", cost: "- Rp 45.000", time: "Hari ini, 10:05" },
                { item: "Kantin Putri (Madu & Susu Hangat)", cost: "- Rp 14.000", time: "Kemarin, 19:40" },
                { item: "Laundry Ekstra Selimut", cost: "- Rp 10.000", time: "4 Hari lalu" }
            ]
        },
        {
            initials: "MF",
            name: "Muhammad Al-Fatih",
            classInfo: "Takhassus Sanad • Asrama Imam Syafi'i",
            mentor: "Musyrif Sanad: Syaikh Dr. Abdul Karim Al-Muqri",
            juz: 30,
            lastSetoran: "Khatam Setoran Sanad Riwayat Hafs 'an 'Ashim",
            semesterTarget: 100,
            worshipScore: "Skor Istiqomah: 100%",
            balance: 310000,
            worship: [
                { name: "Salat Fardhu Shaf Pertama", status: "35/35 Waktu (100%)" },
                { name: "Tahajud 1 Juz per Malam", status: "7/7 Malam" },
                { name: "Setoran Sima'an 5 Juz Sekali Duduk", status: "Lulus Mumtaz" },
                { name: "Mentoring Tahsin Adik Kelas", status: "Aktif" }
            ],
            transactions: [
                { item: "Koperasi (Siwak & Parfum Non-Alkohol)", cost: "- Rp 22.000", time: "Hari ini, 08:15" },
                { item: "Kantin Sehat (Kurma Ajwa & Habbatussauda)", cost: "- Rp 25.000", time: "2 Hari lalu" }
            ]
        }
    ];

    let activeStudentIndex = 0;

    function renderStudentPortal(index) {
        activeStudentIndex = index;
        const s = studentsData[index];
        document.getElementById("studentAvatar").textContent = s.initials;
        document.getElementById("studentName").textContent = s.name;
        document.getElementById("studentClass").textContent = s.classInfo;
        document.getElementById("studentMentor").textContent = s.mentor;
        document.getElementById("tahfidzJuz").textContent = `${s.juz} Juz`;
        document.getElementById("lastSetoran").innerHTML = `Setoran Terakhir: <b>${s.lastSetoran}</b>`;
        document.getElementById("semesterTarget").textContent = `${s.semesterTarget}% Tercapai`;
        document.getElementById("semesterBar").style.width = `${s.semesterTarget}%`;
        document.getElementById("worshipScore").textContent = s.worshipScore;
        document.getElementById("walletBalance").textContent = formatIDR(s.balance);

        // Lingkaran SVG (Keliling r=50 adalah ~314)
        const circumference = 314;
        const offset = circumference - (s.juz / 30) * circumference;
        document.getElementById("tahfidzCircle").style.strokeDashoffset = offset;

        document.getElementById("worshipList").innerHTML = s.worship.map(w => `
            <div class="worship-item">
                <span>${w.name}</span>
                <strong style="color: var(--emerald-mid)">${w.status}</strong>
            </div>
        `).join("");

        document.getElementById("transactionList").innerHTML = s.transactions.map(t => `
            <div class="tx-item">
                <div>
                    <strong>${t.item}</strong>
                    <div style="font-size:0.74rem;color:var(--text-secondary)">${t.time}</div>
                </div>
                <strong>${t.cost}</strong>
            </div>
        `).join("");
    }

    document.querySelectorAll(".switch-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".switch-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderStudentPortal(parseInt(btn.dataset.student, 10));
        });
    });

    document.getElementById("btnTopUp").addEventListener("click", () => {
        const s = studentsData[activeStudentIndex];
        s.balance += 50000;
        s.transactions.unshift({
            item: "Top-Up Instan Portal Wali",
            cost: "+ Rp 50.000",
            time: "Baru saja"
        });
        renderStudentPortal(activeStudentIndex);
    });

    renderStudentPortal(0);

    // ----------------------------------------------------------------------
    // 6. JADWAL HARIAN SANTRI (INTERACTIVE TIMELINE)
    // ----------------------------------------------------------------------
    const dailySchedule = [
        { time: "03:30 - 04:45", title: "Qiyamul Lail & Subuh Berjamaah", cat: "ibadah", badge: "Spiritual & Adab (100%)", desc: "Santri melaksanakan salat Tahajud, dzikir pagi, dan salat Subuh berjamaah di Masjid Jami'." },
        { time: "04:45 - 06:15", title: "Halaqah Tahfidz Al-Qur'an Pagi", cat: "ibadah", badge: "Tahfidz Bersanad", desc: "Setoran hafalan baru (Ziyadah) di hadapan Musyrif bersanad dengan target 1-2 halaman per hari." },
        { time: "07:00 - 11:30", title: "KBM Sains, Matematika & Bilingual", cat: "sains", badge: "Kurikulum Nasional + Cambridge", desc: "Pembelajaran interaktif di kelas pintar menggunakan Bahasa Arab dan Inggris." },
        { time: "11:45 - 13:30", title: "Dzuhur Berjamaah & Qailulah (Istirahat Siang)", cat: "ibadah", badge: "Sunnah Nabawiyah", desc: "Salat Dzuhur berjamaah, makan siang bergizi, dilanjutkan tidur siang singkat (Qailulah) agar fokus kembali segar." },
        { time: "13:30 - 15:00", title: "Lab Coding AI, Robotik & Kajian Kitab Kuning", cat: "sains", badge: "Integrasi Turats & Teknologi", desc: "Sesi praktikum pemrograman Python/Web, riset sains, serta kajian Nahwu-Sharaf dan Fiqih." },
        { time: "15:30 - 17:00", title: "Olahraga Sunnah (Memanah, Futsal, Renang)", cat: "karakter", badge: "Kebugaran & Karakter", desc: "Pengembangan fisik, kepemimpinan ekstrakurikuler, dan olahraga sore di Sunnah Sport Arena." },
        { time: "18:00 - 20:30", title: "Maghrib, Muraja'ah Tahfidz & Kajian Tafsir", cat: "ibadah", badge: "Penguatan Hafalan", desc: "Muraja'ah berpasangan (Tasmi'), salat Isya berjamaah, dan pendalaman tafsir Al-Qur'an." },
        { time: "20:30 - 22:00", title: "Belajar Mandiri Terbimbing & Istirahat Malam", cat: "karakter", badge: "Disiplin & Adab Tidur", desc: "Evaluasi harian bersama wali asrama, persiapan materi esok hari, dan tidur malam tepat waktu." }
    ];

    const timelineTrack = document.getElementById("timelineTrack");

    function renderTimeline(filter = "all") {
        const filtered = filter === "all" ? dailySchedule : dailySchedule.filter(item => item.cat === filter);
        timelineTrack.innerHTML = filtered.map((item, idx) => `
            <div class="timeline-node ${idx === 0 ? "active" : ""}" data-idx="${idx}">
                <small>${item.time} WIB</small>
                <strong>${item.title}</strong>
            </div>
        `).join("");

        if (filtered.length > 0) updateTimelineDetail(filtered[0]);

        timelineTrack.querySelectorAll(".timeline-node").forEach(node => {
            node.addEventListener("click", () => {
                timelineTrack.querySelectorAll(".timeline-node").forEach(n => n.classList.remove("active"));
                node.classList.add("active");
                const chosen = filtered[parseInt(node.dataset.idx, 10)];
                updateTimelineDetail(chosen);
            });
        });
    }

    function updateTimelineDetail(item) {
        document.getElementById("tlTime").textContent = `${item.time} WIB`;
        document.getElementById("tlTitle").textContent = item.title;
        document.getElementById("tlDesc").textContent = item.desc;
        document.getElementById("tlCategoryBadge").textContent = item.badge;
    }

    document.querySelectorAll(".filter-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            renderTimeline(chip.dataset.timefilter);
        });
    });

    renderTimeline("all");

    // ----------------------------------------------------------------------
    // 7. GALERI KARYA & PRESTASI FILTERABLE
    // ----------------------------------------------------------------------
    const projectsData = [
        { title: "Aplikasi 'Smart Tajwid AI' Pendeteksi Makhraj", cat: "it", tag: "Aplikasi & AI", author: "Tim Coding Santri SMA Kelas 11", desc: "Aplikasi berbasis Machine Learning untuk mengoreksi panjang-pendek bacaan tajwid secara real-time." },
        { title: "Juara 1 Musabaqah Hifdzil Qur'an 30 Juz ASEAN", cat: "juara", tag: "Prestasi Internasional", author: "M. Al-Fatih (Program Takhassus)", desc: "Meraih peringkat tertinggi kategori 30 Juz bersanad dengan nilai sempurna pada aspek tajwid dan fashahah." },
        { title: "Kitab Ringkasan Ushul Fiqih Kontemporer & FinTech", cat: "karya", tag: "Karya Tulis Turats", author: "Majelis Bahtsul Masail Santri", desc: "Karya tulis ilmiah berbahasa Arab-Indonesia yang membahas hukum transaksi keuangan digital modern." },
        { title: "Sistem Irigasi Hidroponik Otomatis Berbasis IoT", cat: "it", tag: "Robotik & IoT", author: "Klub Sains SMP Islam Terpadu", desc: "Sensor kelembaban otomatis bertenaga surya yang menyuplai sayur organik segar untuk dapur pesantren." },
        { title: "Medali Emas Olimpiade Sains Nasional (OSN) Fisika", cat: "juara", tag: "Juara Nasional", author: "Aisyah Humaira (Kelas 11 Sains)", desc: "Membuktikan santri penghafal Al-Qur'an mampu unggul di bidang sains murni tingkat nasional." },
        { title: "Kamus Digital Mufradat 3 Bahasa (Arab-Inggris-ID)", cat: "karya", tag: "Literasi Bahasa", author: "Departemen Bahasa OPPM", desc: "Buku saku dan kamus web interaktif berisi 5.000 kosakata percakapan harian di lingkungan pesantren." }
    ];

    let activeGalleryCat = "all";

    function renderGallery() {
        const query = document.getElementById("projectSearch").value.toLowerCase();
        const filtered = projectsData.filter(p => {
            const matchCat = activeGalleryCat === "all" || p.cat === activeGalleryCat;
            const matchText = p.title.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.author.toLowerCase().includes(query);
            return matchCat && matchText;
        });

        const grid = document.getElementById("projectsGrid");
        if (filtered.length === 0) {
            grid.innerHTML = `<div class="bento-card">Tidak ditemukan karya dengan kata kunci tersebut.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(p => `
            <div class="project-card">
                <div>
                    <span class="badge-gold">${p.tag}</span>
                    <h3 style="margin: 10px 0 6px;">${p.title}</h3>
                    <p style="font-size: 0.88rem; color: var(--text-secondary);">${p.desc}</p>
                </div>
                <div style="font-size: 0.8rem; font-weight: 700; color: var(--emerald-mid); border-top: 1px solid var(--border); padding-top: 10px;">
                    👤 ${p.author}
                </div>
            </div>
        `).join("");
    }

    document.getElementById("projectSearch").addEventListener("input", renderGallery);
    document.querySelectorAll("#galleryTabs .tab-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll("#galleryTabs .tab-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeGalleryCat = btn.dataset.cat;
            renderGallery();
        });
    });

    renderGallery();

    // ----------------------------------------------------------------------
    // 8. POJOK KAJIAN & AUDIO MUROTTAL (DENGAN WEB AUDIO HARMONIC SYNTH)
    // ----------------------------------------------------------------------
    const audioTracks = [
        { title: "QS. Ar-Rahman (Ayat 1 - 25) - Maqam Nahawand", artist: "Qari: Muhammad Al-Fatih (Santri Takhassus 30 Juz)", type: "Murottal Santri Terbaik", duration: 225, notes: [220, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63] },
        { title: "QS. Al-Mulk (Ayat 1 - 15) - Irama Kurdi", artist: "Qari: Ahmad Zaki Al-Farisi (Juara 1 MHQ)", type: "Murottal Syahdu Malam", duration: 195, notes: [196, 207.65, 233.08, 261.63, 293.66, 261.63, 233.08] },
        { title: "Tausiyah Pengasuh: Menjaga Adab Sebelum Ilmu di Era AI", artist: "KH. Dr. Luqman Al-Hakim, M.A.", type: "Podcast Kajian Pondok", duration: 310, notes: [174.61, 196, 220, 261.63, 220, 196] },
        { title: "QS. Al-Kahfi (Ayat 1 - 10) - Pelindung Fitnah Akhir Zaman", artist: "Qari'ah: Aisyah Humaira Zahra", type: "Murottal Jumat Berkah", duration: 180, notes: [261.63, 293.66, 311.13, 349.23, 392, 349.23] }
    ];

    let currentTrackIdx = 0;
    let isPlaying = false;
    let currentProgress = 0;
    let audioTimer = null;
    let audioCtx = null;
    let noteStep = 0;

    const playlistContainer = document.getElementById("playlistContainer");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const soundwave = document.getElementById("soundwave");
    const audioSeek = document.getElementById("audioSeek");

    function formatDuration(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = Math.floor(sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function playGentleTone(freq) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === "suspended") audioCtx.resume();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + 0.25);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.1);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 1.15);
        } catch (err) {
            // Abaikan jika browser memblokir autoplay audio
        }
    }

    function renderPlaylist() {
        playlistContainer.innerHTML = audioTracks.map((t, idx) => `
            <div class="playlist-item ${idx === currentTrackIdx ? "active" : ""}" data-idx="${idx}">
                <div>
                    <strong style="display:block;font-size:0.9rem;">${t.title}</strong>
                    <span style="font-size:0.78rem;color:var(--text-secondary);">${t.artist}</span>
                </div>
                <span class="badge-gold">${formatDuration(t.duration)}</span>
            </div>
        `).join("");

        playlistContainer.querySelectorAll(".playlist-item").forEach(item => {
            item.addEventListener("click", () => {
                loadTrack(parseInt(item.dataset.idx, 10), true);
            });
        });
    }

    function loadTrack(idx, autoStart = false) {
        currentTrackIdx = (idx + audioTracks.length) % audioTracks.length;
        const track = audioTracks[currentTrackIdx];
        currentProgress = 0;
        audioSeek.value = 0;
        document.getElementById("currentTrackType").textContent = track.type;
        document.getElementById("currentTrackTitle").textContent = track.title;
        document.getElementById("currentTrackArtist").textContent = track.artist;
        document.getElementById("currentTimeText").textContent = "00:00";
        document.getElementById("totalTimeText").textContent = formatDuration(track.duration);
        renderPlaylist();
        if (autoStart) startPlayback();
    }

    function startPlayback() {
        isPlaying = true;
        playPauseBtn.textContent = "⏸ Jeda Audio";
        soundwave.classList.add("playing");
        clearInterval(audioTimer);
        audioTimer = setInterval(() => {
            const track = audioTracks[currentTrackIdx];
            currentProgress++;
            const notes = track.notes;
            playGentleTone(notes[noteStep % notes.length]);
            noteStep++;

            if (currentProgress >= track.duration) {
                loadTrack(currentTrackIdx + 1, true);
                return;
            }
            document.getElementById("currentTimeText").textContent = formatDuration(currentProgress);
            audioSeek.value = Math.round((currentProgress / track.duration) * 100);
        }, 1000);
    }

    function stopPlayback() {
        isPlaying = false;
        playPauseBtn.textContent = "▶ Putar Audio";
        soundwave.classList.remove("playing");
        clearInterval(audioTimer);
    }

    playPauseBtn.addEventListener("click", () => {
        if (isPlaying) stopPlayback();
        else startPlayback();
    });

    document.getElementById("prevTrackBtn").addEventListener("click", () => loadTrack(currentTrackIdx - 1, isPlaying));
    document.getElementById("nextTrackBtn").addEventListener("click", () => loadTrack(currentTrackIdx + 1, isPlaying));

    audioSeek.addEventListener("input", () => {
        const track = audioTracks[currentTrackIdx];
        currentProgress = Math.round((audioSeek.value / 100) * track.duration);
        document.getElementById("currentTimeText").textContent = formatDuration(currentProgress);
    });

    loadTrack(0, false);

    // ----------------------------------------------------------------------
    // 9. ASISTEN AI PENERIMAAN SANTRI BARU (PSB) 24 JAM
    // ----------------------------------------------------------------------
    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotWindow = document.getElementById("chatbotWindow");
    const chatbotClose = document.getElementById("chatbotClose");
    const chatMessages = document.getElementById("chatMessages");
    const chatForm = document.getElementById("chatForm");
    const chatInput = document.getElementById("chatInput");

    function appendMessage(text, sender = "bot") {
        const div = document.createElement("div");
        div.className = `chat-bubble ${sender}`;
        div.innerHTML = text;
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(question) {
        const q = question.toLowerCase();
        if (q.includes("biaya") || q.includes("uang") || q.includes("spp") || q.includes("simulasi")) {
            const totalNow = document.getElementById("totalInitialCost").textContent;
            const monthlyNow = document.getElementById("monthlyCost").textContent;
            return `Berdasarkan <b>Kalkulator Simulasi</b> yang sedang Anda pilih di halaman ini, total biaya masuk awal adalah <b>${totalNow}</b> (bisa dicicil 3x) dengan syahriyah bulanan <b>${monthlyNow}</b> sudah mencakup makan 3x sehari, asrama, dan laundry.`;
        }
        if (q.includes("syarat") || q.includes("daftar") || q.includes("berkas")) {
            return `<b>Syarat Pendaftaran PSB 2026/2027:</b><br>1. Mengisi formulir online<br>2. Fotokopi KK, Akta Kelahiran & Rapor 2 semester terakhir<br>3. Mengikuti tes baca Al-Qur'an, wawancara adab, dan tes potensi akademik (bisa dilakukan secara <i>online</i> via Zoom maupun <i>offline</i>).`;
        }
        if (q.includes("kurikulum") || q.includes("24 jam") || q.includes("it") || q.includes("coding")) {
            return `Kami menerapkan <b>Kurikulum Integratif 24 Jam</b>: Pagi hari fokus pada Tahfidz Bersanad & Kurikulum Sains Nasional/Cambridge, siang hari praktikum <b>AI, Coding & Kajian Kitab Turats</b>, serta pembiasaan adab & bahasa Arab-Inggris di asrama.`;
        }
        if (q.includes("beasiswa") || q.includes("hafidz") || q.includes("diskon")) {
            return `Tersedia <b>Beasiswa Tahfidz & Prestasi</b>:<br>• Hafal 5 Juz: Diskon Uang Pangkal 15%<br>• Hafal 15 Juz / Juara Nasional: Diskon 30%<br>• Hafal 30 Juz Mutqin: <b>Potongan 50% s.d. Bebas Biaya Pangkal</b>.`;
        }
        return `Terima kasih atas pertanyaannya! Untuk informasi tersebut, Ayah/Bunda dapat mencoba fitur <b>Kalkulator Biaya</b> di atas atau langsung terhubung dengan Panitia PSB kami melalui WhatsApp resmi di <b>0812-3456-7890</b>.`;
    }

    chatbotToggle.addEventListener("click", () => {
        chatbotWindow.classList.toggle("open");
    });

    chatbotClose.addEventListener("click", () => {
        chatbotWindow.classList.remove("open");
    });

    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;
        appendMessage(userText, "user");
        chatInput.value = "";
        setTimeout(() => {
            appendMessage(getBotResponse(userText), "bot");
        }, 350);
    });

    document.querySelectorAll(".prompt-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const q = chip.dataset.q;
            appendMessage(q, "user");
            setTimeout(() => {
                appendMessage(getBotResponse(q), "bot");
            }, 300);
        });
    });

    document.getElementById("sendSimulationToBot").addEventListener("click", () => {
        chatbotWindow.classList.add("open");
        const q = "Mohon rincian simulasi biaya pendidikan yang baru saja saya hitung.";
        appendMessage(q, "user");
        setTimeout(() => {
            appendMessage(getBotResponse("simulasi biaya"), "bot");
        }, 300);
    });
});