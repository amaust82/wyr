(function () {
  const card = document.getElementById("card");
  const optionAText = document.querySelector("#optionA p");
  const optionBText = document.querySelector("#optionB p");
  const justForFun = document.getElementById("justForFun");
  const progress = document.getElementById("progress");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const shuffleBtn = document.getElementById("shuffleBtn");
  const duelToggle = document.getElementById("duelToggle");
  const tallyEl = document.getElementById("tally");

  const SWIPE_THRESHOLD = 100;

  let deck = [];
  let index = 0;
  let duelMode = false;
  let tally = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function newDeck() {
    deck = shuffle(QUESTIONS);
    index = 0;
  }

  function resetTally() {
    tally = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    updateTallyUI();
  }

  function render() {
    const q = deck[index];
    optionAText.textContent = q.a;
    optionBText.textContent = q.b;
    justForFun.hidden = !!q.dim;
    progress.textContent = `${index + 1} / ${deck.length}`;
    card.style.transform = "";
    card.classList.remove("leaning-a", "leaning-b");
  }

  function advance() {
    index += 1;
    if (index >= deck.length) {
      deck = shuffle(QUESTIONS);
      index = 0;
    }
    render();
  }

  function goPrev() {
    index = (index - 1 + deck.length) % deck.length;
    render();
  }

  function commitChoice(direction) {
    // direction: -1 for left (option A), 1 for right (option B)
    const q = deck[index];
    if (duelMode && q.dim) {
      const letter = direction < 0 ? q.dim[0] : q.dim[1];
      tally[letter] += 1;
      updateTallyUI();
    }
  }

  function updateTallyUI() {
    document.querySelectorAll(".tally-row").forEach((row) => {
      const pair = row.dataset.pair;
      const leftLetter = pair[0];
      const rightLetter = pair[1];
      const left = tally[leftLetter];
      const right = tally[rightLetter];
      const total = left + right;
      const leftPct = total === 0 ? 50 : (left / total) * 100;
      const rightPct = 100 - leftPct;
      const leftFill = row.querySelector('[data-side="left"]');
      const rightFill = row.querySelector('[data-side="right"]');
      leftFill.style.width = leftPct + "%";
      rightFill.style.width = rightPct + "%";
      row.querySelector(".tally-label:first-child").textContent = `${leftLetter} ${left}`;
      row.querySelector(".tally-label:last-child").textContent = `${rightLetter} ${right}`;
    });
  }

  // --- Drag / swipe handling (pointer events cover touch + mouse) ---
  let dragging = false;
  let startX = 0;
  let currentX = 0;

  function onPointerDown(e) {
    dragging = true;
    startX = e.clientX;
    currentX = startX;
    card.setPointerCapture(e.pointerId);
    card.classList.add("dragging");
  }

  function onPointerMove(e) {
    if (!dragging) return;
    currentX = e.clientX;
    const deltaX = currentX - startX;
    const rotate = deltaX / 18;
    card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    card.classList.toggle("leaning-a", deltaX < -20);
    card.classList.toggle("leaning-b", deltaX > 20);
  }

  function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    card.classList.remove("dragging");
    const deltaX = currentX - startX;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      const direction = deltaX < 0 ? -1 : 1;
      const flyOut = direction * window.innerWidth;
      card.style.transition = "transform 0.35s ease";
      card.style.transform = `translateX(${flyOut}px) rotate(${direction * 20}deg)`;
      commitChoice(direction);
      setTimeout(() => {
        card.style.transition = "";
        advance();
      }, 220);
    } else {
      card.style.transition = "transform 0.25s ease";
      card.style.transform = "";
      card.classList.remove("leaning-a", "leaning-b");
      setTimeout(() => {
        card.style.transition = "";
      }, 250);
    }
  }

  card.addEventListener("pointerdown", onPointerDown);
  card.addEventListener("pointermove", onPointerMove);
  card.addEventListener("pointerup", onPointerUp);
  card.addEventListener("pointercancel", onPointerUp);

  // --- Buttons + keyboard ---
  nextBtn.addEventListener("click", advance);
  prevBtn.addEventListener("click", goPrev);
  shuffleBtn.addEventListener("click", () => {
    newDeck();
    resetTally();
    render();
  });

  duelToggle.addEventListener("change", () => {
    duelMode = duelToggle.checked;
    tallyEl.hidden = !duelMode;
    if (duelMode) resetTally();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") advance();
    if (e.key === "ArrowLeft") goPrev();
  });

  // --- Init ---
  newDeck();
  resetTally();
  render();
})();
