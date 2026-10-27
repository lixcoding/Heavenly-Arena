// ======================================================
// HEAVENLY ARENA — SELEÇÃO DE PERSONAGENS
// ======================================================
//
// Seleção em turnos: o Player 1 (vermelho) escolhe primeiro e
// depois o Player 2 (azul). Só UM lado escolhe por vez; o outro
// mostra o que já foi confirmado.
//
// Esta tela só decide QUEM luta. Ela grava no sessionStorage e
// abre o game.html, onde o players.js lê esses valores:
//
//   selectedCharacterP1  -> posição do personagem em characters.js
//   selectedCharacterP2  -> idem
//   gameMode             -> "automatico" | "local"
//
// Controles:
//   mouse            passar por cima = foco, clicar = escolher
//   setas            mover o cursor
//   Enter / Espaço   escolher (de novo no mesmo = iniciar a luta)
//   Esc / Backspace  desfazer a última escolha
//   R                aleatório        M   liga/desliga o som


// ======================
// CONFIGURAÇÃO
// ======================

// index  = posição do personagem no array `characters` (characters.js).
//          É ESSE número que vai para selectedCharacterP1/P2.
//          Se você reordenar characters.js, atualize aqui também.
// 
// sprite = imagem grande mostrada ao fundo (pode ser o portrait por
//          enquanto, ou uma arte de corpo inteiro). null = só a letra.

// thumb  = (opcional) imagem do quadradinho. Se faltar, usa o sprite.

// style / skills / stats = (opcionais) dados da ficha. Os números
//          vêm do characters.js e os nomes das skills do skill.js.

const ROSTER = [
  {
    index: 0,
    name: "Van",
    sprite: "../assets/portrait/van/selectsheet.png",
    thumb: "../assets/portrait/lance/lanceDefaultPortrait.png",
    style: "Lutador",
    skills: { passive: "Rainbolt", active: "Shockwave" },
    stats: { hp: 120, power: 15, speed: 9 }
  },
  {
    index: 1,
    name: "Lance",
    sprite: "../assets/portrait/lance/lanceDefaultPortrait.png",
    style: "archetype: BloodThirsty",
    skills: { passive: "Vampirism", active: "Sword Dance" },
    stats: { hp: 100, power: 5, speed: 7 }
  },
  {
    index: 2,
    name: "Stephany",
    sprite: "../assets/portrait/stephanny/stephannyDefaultPortrait.jpg",
    style: "Archetype: Sadistic",
    skills: { passive: "Toxic", active: "SludgeBomb" },
    stats: { hp: 100, power: 10, speed: 11 }
  },
  { index: 3, name: "x", sprite: null },
  { index: 4, name: "y", sprite: null },
  { index: 5, name: "ellios", sprite: null }
];

// valor máximo de cada status (a barra cheia)
const STAT_MAX = { hp: 150, power: 15, speed: 11 };

// quantidade mínima de quadrados (os que faltam ficam vazios)
const MIN_SLOTS = 30;

const GAME_PAGE = "game.html";

const KEY_P1 = "selectedCharacterP1";
const KEY_P2 = "selectedCharacterP2";
const KEY_MODE = "gameMode";
const KEY_MUTED = "selecaoMuted";

const MODES = { automatico: "Automático", local: "Local" };
const DEFAULT_MODE = "automatico";

// tempo da animação de saída antes de abrir o jogo
const LEAVE_DELAY = 700;


// ======================
// ESTADO
// ======================

const selected = { 1: null, 2: null };

// quem está escolhendo agora (1 ou 2)
let activePlayer = 1;

// ordem das escolhas, usada pelo "desfazer"
let pickOrder = [];

// posição do cursor em `slots`
let cursor = -1;

// true durante a roleta do aleatório
let busy = false;

// true depois de apertar LUTAR
let leaving = false;

let lastChooseAt = 0;

// { entry: item do ROSTER ou null, el: <button> }
const slots = [];

const UNSET = Symbol("unset");
const shown = { 1: UNSET, 2: UNSET };

const reduceMotion = window.matchMedia
  && window.matchMedia("(prefers-reduced-motion: reduce)").matches;


// ======================
// ELEMENTOS
// ======================

const $ = (id) => document.getElementById(id);

const screen = $("screen");
const rosterEl = $("roster");
const cursorEl = $("roster-cursor");
const startButton = $("btn-start");
const undoButton = $("btn-undo");
const randomButton = $("btn-random");
const soundButton = $("btn-sound");
const hint = $("selection-hint");

function grab(p) {

  const g = (name) => $(`${name}-p${p}`);

  return {
    side: g("side"),
    art: g("preview"),
    stage: g("stage"),
    img: g("preview-img"),
    ph: g("placeholder"),
    label: g("label"),
    tab: g("tab"),
    state: g("state"),
    name: g("preview-name"),
    style: g("style"),
    passive: g("passive"),
    active: g("active"),
    wipeName: g("wipe-name"),
    bars: { hp: g("bar-hp"), power: g("bar-power"), speed: g("bar-speed") },
    vals: { hp: g("val-hp"), power: g("val-power"), speed: g("val-speed") }
  };
}

const ui = { 1: grab(1), 2: grab(2) };


// ======================
// STORAGE
// ======================

// sessionStorage pode lançar erro em alguns navegadores/modos,
// então tudo passa por estas duas funções.

function storageGet(key) {
  try { return sessionStorage.getItem(key); } catch (error) { return null; }
}

function storageSet(key, value) {
  try { sessionStorage.setItem(key, String(value)); return true; } catch (error) { return false; }
}


// ======================
// MODO DE JOGO
// ======================

function resolveMode() {

  // 1. ?modo=local na URL (o menu pode usar isso)
  const fromUrl = new URLSearchParams(location.search).get("modo");

  // 2. gameMode salvo pelo menu
  const fromStorage = storageGet(KEY_MODE);

  const mode = fromUrl || fromStorage || DEFAULT_MODE;

  return MODES[mode] ? mode : DEFAULT_MODE;
}

const gameMode = resolveMode();

$("mode-label").textContent = "Modo: " + MODES[gameMode];
$("mode-short").textContent = MODES[gameMode];


// ======================
// SOM (gerado por código, sem arquivos)
// ======================

let audio = null;
let muted = storageGet(KEY_MUTED) === "1";

// navegadores só liberam áudio depois de um clique/tecla
function unlockAudio() {

  if (audio) {
    if (audio.state === "suspended") audio.resume();
    return;
  }

  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  if (!AudioCtx) return;

  try { audio = new AudioCtx(); } catch (error) { audio = null; }
}

window.addEventListener("pointerdown", unlockAudio);
window.addEventListener("keydown", unlockAudio);

function tone(freq, duration, options = {}) {

  if (muted || !audio) return;

  const t0 = audio.currentTime + (options.delay || 0);
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = options.type || "square";
  osc.frequency.setValueAtTime(freq, t0);

  if (options.to) {
    osc.frequency.exponentialRampToValueAtTime(options.to, t0 + duration);
  }

  gain.gain.setValueAtTime(options.gain ?? 0.05, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

const sfx = {
  move: () => tone(720, 0.04, { gain: 0.025 }),
  undo: () => tone(300, 0.12, { to: 180 }),

  pick: (player) => {
    tone(player === 1 ? 520 : 660, 0.08, { type: "sawtooth" });
    tone(player === 1 ? 780 : 990, 0.14, { delay: 0.07 });
  },

  start: () => {
    [440, 554, 659, 880].forEach((freq, i) => {
      tone(freq, 0.16, { type: "sawtooth", delay: i * 0.07 });
    });
  }
};

function renderSound() {
  soundButton.textContent = "♪ Som: " + (muted ? "off" : "on");
  soundButton.setAttribute("aria-pressed", String(!muted));
}

function toggleMute() {

  muted = !muted;

  storageSet(KEY_MUTED, muted ? "1" : "0");

  renderSound();

  if (!muted) sfx.move();
}


// ======================
// UTILIDADES
// ======================

// reinicia uma animação CSS
function retrigger(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hueFor(text) {

  let hash = 0;

  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) % 360;
  }

  return hash;
}

function realSlots() {
  return slots.map((slot, i) => (slot.entry ? i : -1)).filter((i) => i >= 0);
}

function slotOf(entry) {
  return slots.findIndex((slot) => slot.entry === entry);
}


// ======================
// LISTA DE PERSONAGENS
// ======================

function buildRoster() {

  rosterEl.querySelectorAll(".slot").forEach((node) => node.remove());
  slots.length = 0;

  const total = Math.max(MIN_SLOTS, ROSTER.length);

  for (let i = 0; i < total; i++) {

    const entry = ROSTER[i] || null;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "slot";

    const letter = document.createElement("span");

    letter.className = "slot-letter";

    // ---------- espaço vazio ----------

    if (!entry) {

      button.classList.add("is-empty");
      button.disabled = true;
      button.tabIndex = -1;
      button.setAttribute("aria-label", "Espaço vazio");

      letter.textContent = "?";
      button.appendChild(letter);

      rosterEl.appendChild(button);
      slots.push({ entry: null, el: button });

      continue;
    }

    // ---------- personagem ----------

    button.dataset.index = String(entry.index);
    button.setAttribute("aria-label", entry.name);
    button.style.setProperty("--hue", String(hueFor(entry.name)));

    letter.textContent = entry.name.charAt(0).toUpperCase();
    button.appendChild(letter);

    const thumb = entry.thumb || entry.sprite;

    if (thumb) {

      const img = document.createElement("img");

      img.src = thumb;
      img.alt = "";
      img.loading = "lazy";

      // arquivo faltando: some a imagem e fica a letra
      img.addEventListener("error", () => img.remove());

      button.appendChild(img);
    }

    const name = document.createElement("span");

    name.className = "slot-name";
    name.textContent = entry.name;
    button.appendChild(name);

    for (const player of [1, 2]) {

      const pick = document.createElement("span");

      pick.className = "pick pick-" + player;
      pick.textContent = String(player);
      button.appendChild(pick);
    }

    const position = slots.length;

    button.addEventListener("mouseenter", () => {
      if (!busy && !leaving && cursor !== position) moveCursor(position);
    });

    button.addEventListener("focus", () => {
      if (!busy && !leaving && cursor !== position) moveCursor(position);
    });

    button.addEventListener("click", (event) => {

      // Enter/Espaço em botão focado também gera "click": o teclado
      // já é tratado em handleKey, então ignoramos esse clique.
      if (event.detail === 0) return;

      if (busy || leaving) return;

      moveCursor(position, { silent: true });
      choose(entry);
    });

    rosterEl.appendChild(button);
    slots.push({ entry, el: button });
  }

  $("roster-count").textContent =
    String(ROSTER.length).padStart(2, "0") + " LUTADORES";
}

// ao tirar o mouse da lista, o cursor volta para o escolhido
rosterEl.addEventListener("mouseleave", () => {

  if (busy || leaving) return;

  const chosen = selected[activePlayer];

  if (!chosen) return;

  const position = slotOf(chosen);

  if (position >= 0 && position !== cursor) {
    moveCursor(position, { silent: true });
  }
});


// ======================
// CURSOR
// ======================

function placeCursor(instant) {

  const slot = slots[cursor];

  if (!slot) {
    cursorEl.style.opacity = "0";
    return;
  }

  if (instant) cursorEl.style.transition = "none";

  cursorEl.style.opacity = "1";
  cursorEl.style.transform =
    `translate(${slot.el.offsetLeft}px, ${slot.el.offsetTop}px)`;

  if (instant) {
    void cursorEl.offsetWidth;
    cursorEl.style.transition = "";
  }
}

function moveCursor(position, options = {}) {

  if (!slots[position] || !slots[position].entry) return;

  cursor = position;

  slots.forEach((slot, i) => slot.el.classList.toggle("is-cursor", i === cursor));

  placeCursor(options.instant);

  if (!options.silent) sfx.move();

  renderAll();
}

// quantos quadrados cabem em cada linha (depende da largura da tela)
function columns() {

  const firstTop = slots[0].el.offsetTop;

  let count = 0;

  for (const slot of slots) {

    if (slot.el.offsetTop !== firstTop) break;

    count++;
  }

  return Math.max(1, count);
}

function navigate(direction) {

  if (cursor < 0) {
    moveCursor(realSlots()[0]);
    return;
  }

  let target = cursor;

  if (direction === "left" || direction === "right") {

    const step = direction === "right" ? 1 : -1;

    let i = cursor;

    for (let n = 0; n < slots.length; n++) {

      i = (i + step + slots.length) % slots.length;

      if (slots[i].entry) {
        target = i;
        break;
      }
    }

  } else {

    const step = (direction === "down" ? 1 : -1) * columns();

    let i = cursor + step;

    // pula espaços vazios na mesma coluna
    while (i >= 0 && i < slots.length && !slots[i].entry) i += step;

    if (i >= 0 && i < slots.length) target = i;
  }

  if (target !== cursor) moveCursor(target);
}


// ======================
// ESCOLHA
// ======================

function choose(entry) {

  const player = activePlayer;

  selected[player] = entry;

  pickOrder = pickOrder.filter((p) => p !== player);
  pickOrder.push(player);

  lastChooseAt = performance.now();

  sfx.pick(player);

  // quem ainda não escolheu assume a vez
  const other = player === 1 ? 2 : 1;

  if (!selected[other]) activePlayer = other;

  renderAll();

  retrigger(ui[player].side, "just-locked");
}

// Enter/Espaço
function confirmCursor() {

  if (busy || leaving) return;

  const slot = slots[cursor];

  if (!slot || !slot.entry) return;

  const current = selected[activePlayer];

  // com os dois escolhidos, Enter de novo no mesmo = lutar
  if (
    selected[1] && selected[2] &&
    current && current.index === slot.entry.index &&
    performance.now() - lastChooseAt > 350
  ) {
    startGame();
    return;
  }

  choose(slot.entry);
}

function setActive(player) {

  if (busy || leaving || activePlayer === player) return;

  activePlayer = player;

  const chosen = selected[player];

  if (chosen) {
    moveCursor(slotOf(chosen), { silent: true });
  } else {
    renderAll();
  }

  sfx.move();
}

function undo() {

  if (busy || leaving || pickOrder.length === 0) return;

  const player = pickOrder.pop();

  selected[player] = null;

  // o P1 sempre escolhe primeiro: se ele ficou sem lutador, a vez é dele
  activePlayer = selected[1] ? player : 1;

  sfx.undo();

  renderAll();
}


// ======================
// ALEATÓRIO (roleta)
// ======================

async function randomPick() {

  if (busy || leaving) return;

  const real = realSlots();

  if (real.length === 0) return;

  const finalPosition = real[Math.floor(Math.random() * real.length)];

  if (reduceMotion || real.length === 1) {
    moveCursor(finalPosition, { silent: true });
    choose(slots[finalPosition].entry);
    return;
  }

  busy = true;
  randomButton.classList.add("is-rolling");

  const steps = 16;

  let delay = 45;
  let last = cursor;

  for (let n = 0; n < steps; n++) {

    let position = finalPosition;

    if (n < steps - 1) {

      do {
        position = real[Math.floor(Math.random() * real.length)];
      } while (position === last);
    }

    // durante a roleta `busy` é true, então movemos direto
    cursor = position;
    slots.forEach((slot, i) => slot.el.classList.toggle("is-cursor", i === cursor));
    placeCursor();
    sfx.move();
    renderAll();

    last = position;

    await wait(delay);

    delay *= 1.12;
  }

  busy = false;
  randomButton.classList.remove("is-rolling");

  choose(slots[finalPosition].entry);
}


// ======================
// DESENHO DA TELA
// ======================

// o que mostrar em cada lado:
// - quem está escolhendo: o personagem sob o cursor
// - o outro: o personagem já confirmado
function getView(player) {

  if (player === activePlayer) {

    const entry = (slots[cursor] && slots[cursor].entry) || selected[player];

    const confirmed =
      entry && selected[player] && entry.index === selected[player].index;

    return { entry, state: confirmed ? "ready" : "choosing" };
  }

  const entry = selected[player];

  return { entry, state: entry ? "ready" : "waiting" };
}

function showEntry(player, entry) {

  const u = ui[player];

  shown[player] = entry;

  // ----- nome, estilo, skills -----

  u.name.textContent = entry ? entry.name : "PLAYER " + player;
  retrigger(u.name, "swap");

  u.style.textContent = (entry && entry.style) || "—";
  u.passive.textContent = (entry && entry.skills && entry.skills.passive) || "—";
  u.active.textContent = (entry && entry.skills && entry.skills.active) || "—";

  // ----- status -----

  for (const key of Object.keys(STAT_MAX)) {

    const value = entry && entry.stats ? entry.stats[key] : null;

    u.bars[key].style.setProperty(
      "--v",
      value == null ? "0" : String(Math.min(1, value / STAT_MAX[key]))
    );

    u.vals[key].textContent = value == null ? "—" : String(value);
  }

  // ----- arte -----

  u.art.classList.remove("has-image");
  u.img.removeAttribute("src");
  u.img.alt = "";

  const showLetter = () => {
    u.ph.textContent = entry ? entry.name.charAt(0).toUpperCase() : "?";
    u.ph.hidden = false;
  };

  if (!entry) {
    showLetter();
    return;
  }

  if (!entry.sprite) {
    showLetter();
    retrigger(u.stage, "anim-in");
    return;
  }

  u.ph.hidden = true;

  u.img.onload = () => {

    if (shown[player] !== entry) return;

    u.art.classList.add("has-image");
    retrigger(u.stage, "anim-in");
  };

  // arquivo faltando: cai para a letra
  u.img.onerror = () => {

    if (shown[player] !== entry) return;

    u.art.classList.remove("has-image");
    showLetter();
    retrigger(u.stage, "anim-in");
  };

  u.img.alt = entry.name;
  u.img.src = entry.sprite;
}

function renderSide(player) {

  const u = ui[player];

  const { entry, state } = getView(player);

  u.side.classList.toggle("is-active", activePlayer === player);
  u.side.classList.toggle("is-locked", state === "ready");

  u.state.textContent =
    { ready: "PRONTO", choosing: "ESCOLHENDO", waiting: "AGUARDANDO" }[state];

  if (shown[player] !== entry) showEntry(player, entry);
}

let lastTurn = 0;

function renderTurn() {

  screen.dataset.active = String(activePlayer);

  const ready = Boolean(selected[1] && selected[2]);

  $("turn-label").textContent = "PLAYER " + activePlayer;
  $("turn-sub").textContent = ready ? "PRONTO PARA LUTAR" : "ESCOLHA SEU LUTADOR";

  if (lastTurn !== activePlayer) {

    retrigger($("turn-label"), "swap");

    lastTurn = activePlayer;
  }

  for (const player of [1, 2]) {

    const on = activePlayer === player;

    ui[player].tab.classList.toggle("is-on", on);
    ui[player].tab.setAttribute("aria-pressed", String(on));
  }

  cursorEl.dataset.player = "P" + activePlayer;
}

function renderMarks() {

  for (const slot of slots) {

    if (!slot.entry) continue;

    const p1 = selected[1] && selected[1].index === slot.entry.index;
    const p2 = selected[2] && selected[2].index === slot.entry.index;

    slot.el.classList.toggle("pick-p1", Boolean(p1));
    slot.el.classList.toggle("pick-p2", Boolean(p2));
    slot.el.setAttribute("aria-pressed", String(Boolean(p1 || p2)));
  }
}

function renderFooter() {

  const ready = Boolean(selected[1] && selected[2]);

  screen.classList.toggle("is-ready", ready);

  startButton.disabled = !ready || leaving;
  undoButton.disabled = pickOrder.length === 0 || busy || leaving;

  if (!selected[1]) {
    hint.textContent = "Player 1 (vermelho): escolha seu lutador";
  } else if (!selected[2]) {
    hint.textContent = `${selected[1].name} escolhido. Agora é a vez do Player 2 (azul).`;
  } else {
    hint.textContent = `${selected[1].name} vs ${selected[2].name} — pronto para lutar!`;
  }
}

function renderAll() {

  renderSide(1);
  renderSide(2);
  renderTurn();
  renderMarks();
  renderFooter();
}


// ======================
// INICIAR / VOLTAR
// ======================

function startGame() {

  if (!selected[1] || !selected[2] || leaving) return;

  // o valor guardado é o número do personagem em characters.js
  const saved =
    storageSet(KEY_P1, selected[1].index) &&
    storageSet(KEY_P2, selected[2].index) &&
    storageSet(KEY_MODE, gameMode);

  if (!saved) {

    // sem storage a escolha não chegaria ao jogo
    alert("Não foi possível salvar a escolha neste navegador.");

    return;
  }

  leaving = true;

  ui[1].wipeName.textContent = selected[1].name;
  ui[2].wipeName.textContent = selected[2].name;

  sfx.start();

  renderFooter();

  screen.classList.add("leaving");

  setTimeout(() => {
    location.href = GAME_PAGE;
  }, reduceMotion ? 0 : LEAVE_DELAY);
}


// ======================
// EVENTOS
// ======================

startButton.addEventListener("click", startGame);
undoButton.addEventListener("click", undo);
randomButton.addEventListener("click", randomPick);
soundButton.addEventListener("click", toggleMute);

$("btn-back").addEventListener("click", () => history.back());

// Depois de clicar com o mouse, o botão não deve ficar com o foco:
// senão Enter/Espaço apertariam esse botão de novo em vez de
// escolher o lutador. (Cliques vindos do teclado têm detail 0.)
document.addEventListener("click", (event) => {

  if (event.detail === 0) return;

  const button = event.target.closest && event.target.closest("button");

  if (button && button !== startButton) button.blur();
});

// Voltar do jogo pelo navegador pode reabrir a página como ela estava
// (cache de navegação). Sem isto ela voltaria travada na transição.
window.addEventListener("pageshow", (event) => {

  if (!event.persisted) return;

  leaving = false;
  busy = false;

  screen.classList.remove("leaving");
  randomButton.classList.remove("is-rolling");

  renderAll();
});

for (const player of [1, 2]) {
  ui[player].tab.addEventListener("click", () => setActive(player));
  ui[player].label.addEventListener("click", () => setActive(player));
}

function handleKey(event) {

  if (event.ctrlKey || event.metaKey || event.altKey || leaving) return;

  switch (event.key) {

    case "ArrowLeft":
    case "ArrowRight":
    case "ArrowUp":
    case "ArrowDown":
      event.preventDefault();
      if (!busy) navigate(event.key.replace("Arrow", "").toLowerCase());
      break;

    case "Enter":
    case " ": {

      // botões normais (voltar, lutar, desfazer...) funcionam sozinhos
      const button = event.target.closest && event.target.closest("button");

      if (button && !button.classList.contains("slot")) return;

      event.preventDefault();
      confirmCursor();
      break;
    }

    case "Escape":
    case "Backspace":
      event.preventDefault();
      undo();
      break;

    case "r":
    case "R":
      randomPick();
      break;

    case "m":
    case "M":
      toggleMute();
      break;
  }
}

document.addEventListener("keydown", handleKey);


// ======================
// PARALLAX (segue o mouse)
// ======================

if (!reduceMotion) {

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = 0;

  const step = () => {

    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    screen.style.setProperty("--mx", currentX.toFixed(3));
    screen.style.setProperty("--my", currentY.toFixed(3));

    const moving =
      Math.abs(targetX - currentX) > 0.001 ||
      Math.abs(targetY - currentY) > 0.001;

    frame = moving ? requestAnimationFrame(step) : 0;
  };

  window.addEventListener("pointermove", (event) => {

    if (event.pointerType === "touch") return;

    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;

    if (!frame) frame = requestAnimationFrame(step);
  });
}


// ======================
// RESTAURAR ESCOLHA ANTERIOR
// ======================

// ao voltar do jogo (ou recarregar) a tela já mostra a última escolha

function restore(player, key) {

  const saved = storageGet(key);

  if (saved === null) return;

  const entry = ROSTER.find((item) => String(item.index) === saved);

  if (entry) {
    selected[player] = entry;
    pickOrder.push(player);
  }
}


// ======================
// INÍCIO
// ======================

buildRoster();

restore(1, KEY_P1);
restore(2, KEY_P2);

activePlayer = selected[1] ? 2 : 1;

renderSound();

// cursor começa no escolhido (se houver) ou no primeiro personagem
const startPosition =
  selected[activePlayer] ? slotOf(selected[activePlayer]) : realSlots()[0];

moveCursor(startPosition, { silent: true, instant: true });

// o cursor depende do tamanho dos quadrados: refaz se a tela mudar
window.addEventListener("resize", () => placeCursor(true));

if (window.ResizeObserver) {
  new ResizeObserver(() => placeCursor(true)).observe(rosterEl);
}

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => placeCursor(true));
}
