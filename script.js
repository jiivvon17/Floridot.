let selectedFlower = null;

/* 꽃 목록 */
const flowerList = {
  top: ["images/daisy.png", "images/tulip.png"],
  middle: ["images/stock.png"],
  base: ["images/baby.png"]
};

const canvas = document.getElementById("canvas");

/* 썸네일 표시 */
function showFlowers(type) {
  document.querySelectorAll(".thumbs").forEach(el => el.innerHTML = "");
  const box = document.getElementById(`thumb-${type}`);
  if (!box) return;

  flowerList[type].forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.onclick = () => addFlower(src, type);
    box.appendChild(img);
  });
}

/* 꽃 생성 */
function addFlower(src, type) {
  const wrap = document.createElement("div");
  wrap.className = "flower-wrap";
  wrap.style.left = "200px";
  wrap.style.top = "150px";
  wrap.dataset.rotate = 0;
  wrap.dataset.scale = 1;

  wrap.style.zIndex =
    type === "base" ? 1 : type === "middle" ? 2 : 3;

  const img = document.createElement("img");
  img.src = src;
  img.className = "flower";

  const handle = document.createElement("div");
  handle.className = "transform-handle";

  wrap.appendChild(img);
  wrap.appendChild(handle);
  canvas.appendChild(wrap);

  makeDraggable(wrap);
  makeTransformable(wrap, handle);

  wrap.addEventListener("pointerdown", e => {
    e.stopPropagation();
    selectFlower(wrap);
  });

  selectFlower(wrap);
}

/* 선택 */
function selectFlower(el) {
  if (selectedFlower) selectedFlower.classList.remove("selected");
  selectedFlower = el;
  el.classList.add("selected");
}

/* 드래그 */
function makeDraggable(el) {
  let startX, startY, startLeft, startTop;

  el.addEventListener("pointerdown", e => {
    if (e.target.classList.contains("transform-handle")) return;

    startX = e.clientX;
    startY = e.clientY;
    startLeft = el.offsetLeft;
    startTop = el.offsetTop;

    function move(e) {
      el.style.left = startLeft + (e.clientX - startX) + "px";
      el.style.top = startTop + (e.clientY - startY) + "px";
    }

    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
  });
}

/* 회전 + 크기 */
function makeTransformable(wrap, handle) {
  handle.addEventListener("pointerdown", e => {
    e.stopPropagation();

    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const startAngle =
      Math.atan2(e.clientY - cy, e.clientX - cx);

    const startRotate = Number(wrap.dataset.rotate);
    const startScale = Number(wrap.dataset.scale);
    const startDist =
      Math.hypot(e.clientX - cx, e.clientY - cy);

    function move(e) {
      const angle =
        Math.atan2(e.clientY - cy, e.clientX - cx);
      let rotate =
        startRotate + (angle - startAngle) * 180 / Math.PI;

      if (Math.abs(rotate) < 6) rotate = 0;

      let dist =
        Math.hypot(e.clientX - cx, e.clientY - cy);
      let scale =
        Math.max(0.3, startScale * (dist / startDist));

      wrap.dataset.rotate = rotate;
      wrap.dataset.scale = scale;
      wrap.style.transform =
        `rotate(${rotate}deg) scale(${scale})`;
    }

    function stop() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", stop);
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", stop);
  });
}

/* 삭제 버튼 */
document.getElementById("deleteBtn").addEventListener("click", () => {
  if (!selectedFlower) return;
  selectedFlower.remove();
  selectedFlower = null;
});