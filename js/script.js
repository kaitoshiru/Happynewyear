const envelopes = document.querySelectorAll(".envelope");
const fireworkScreen = document.getElementById("firework-screen");
const canvas = document.getElementById("firework-canvas");
const ctx = canvas.getContext("2d");
const music = document.getElementById("tet-music");
const bigText = document.querySelector(".big-text");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

let particles = [];
let animationRunning = false;
let fireworkInterval = null;

// ================== DATA ==================

const envelopesData = [
  {
    wish: "🧧 Chúc bạn một năm mới an yên trong tâm hồn, rực rỡ trong ước mơ  và trọn vẹn trong từng khoảnh khắc.",
    music: "audio/muaxuanoi.mp3"
  },
  {
    wish: "💰 Chúc bạn một năm mới luôn đủ mạnh mẽ để vượt qua thử thách  và đủ dịu dàng để tận hưởng hạnh phúc.",
    music: "audio/nangxuan.mp3"
  },
  {
    wish: "🌸 Năm mới chúc bạn đủ sức khỏe để theo đuổi điều mình yêu  và đủ dũng cảm để chạm tới điều mình mơ.",
    music: "audio/ngaytetqueem.mp3"
  },
  {
    wish: "🚀 Chúc bạn một năm bình an trước hết, thành công sau đó  và hạnh phúc ở mọi chặng đường.",
    music: "audio/ngayxuan.mp3"
  },
  {
    wish: "🎉 Mong năm mới mang đến cho bạn nhiều cơ hội mới, nhiều nụ cười mới  và thật nhiều điều đáng nhớ.",
    music: "audio/tetlatet.mp3"
  }
];

// ================== FIREWORK PRO ==================

function createFirework() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height / 2;
  explode(x, y);
}

function explode(x, y) {
  const count = 120;
  const hue = Math.random() * 360;

  for (let i = 0; i < count; i++) {
    particles.push({
      x,
      y,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 6 + 2,
      friction: 0.98,
      gravity: 0.08,
      alpha: 1,
      hue
    });
  }
}

function animate() {
  if (!animationRunning) return;

  requestAnimationFrame(animate);

  // tạo vệt mờ đuôi
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "lighter";

  particles.forEach((p, index) => {
    p.speed *= p.friction;
    p.x += Math.cos(p.angle) * p.speed;
    p.y += Math.sin(p.angle) * p.speed + p.gravity;
    p.alpha -= 0.012;

    if (p.alpha <= 0) {
      particles.splice(index, 1);
      return;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.alpha})`;
    ctx.fill();
  });
}

// ================== SEQUENCE ==================

function startSequence(wishText, musicSrc) {

  document.querySelector(".screen").style.display = "none";
  fireworkScreen.style.display = "flex";

  animationRunning = true;
  particles = [];

  music.pause();
  music.currentTime = 0;
  music.src = musicSrc;
  music.play();

  animate();
  fireworkInterval = setInterval(createFirework, 900);

  // 🔥 tách theo 2 khoảng trắng
  const parts = wishText.split("  ").map(p => p.trim());

  let delay = 3500;

  parts.forEach((part) => {
    setTimeout(() => {

      bigText.classList.remove("show");
      bigText.innerHTML = part;
      void bigText.offsetWidth;
      bigText.classList.add("show");

    }, delay);

    delay += 6000;
  });

  // 🎆 dòng cuối
  setTimeout(() => {

    bigText.classList.remove("show");
    bigText.innerHTML = `<span class="final-text">✨ Chúc Mừng Năm Mới ✨</span>`;
    void bigText.offsetWidth;
    bigText.classList.add("show");

  }, delay + 1000);

  music.onended = () => {
    animationRunning = false;
    clearInterval(fireworkInterval);
  };
}

// ================== CLICK ==================

envelopes.forEach(env => {
  env.addEventListener("click", () => {
    const id = env.dataset.id;
    const selected = envelopesData[id];
    startSequence(selected.wish, selected.music);
  });
});
