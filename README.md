# Heavenly Arena

Jogo **autobattler de arena** feito com HTML5, CSS e JavaScript puro, com renderização em `<canvas>`. Dois lutadores se movem sozinhos dentro de uma arena, colidem, atacam e usam habilidades. Quem fica sem vida primeiro perde. O jogador escolhe os lutadores e assiste à luta.

> **Status:** BETA 0.13. O projeto está em desenvolvimento ativo e algumas partes ainda estão incompletas (veja [Problemas conhecidos](#problemas-conhecidos)).

**Demo:** https://heavenly-arena.pages.dev/

---

## Como jogar

1. Abra a página inicial e vá para a **tela de seleção de personagens**.
2. Escolha o lutador do Jogador 1 e o do Jogador 2.
3. A luta começa em `game.html`. Os dois lutadores se movem e atacam automaticamente.

Se o jogo for aberto direto em `game.html`, sem escolha prévia, ele usa os padrões: **Stephany** (P1) contra **Lance** (P2).

## Como rodar localmente

Não há build nem dependências. Qualquer servidor estático serve. A raiz do site é a pasta `public/`:

```bash
cd public
python -m http.server 8080
```

Abra `http://localhost:8080/`.

> Evite abrir os HTML com duplo clique (`file://`). O comportamento difere de um servidor real, principalmente em caminhos e `sessionStorage`. O `.vscode/launch.json` já tem uma configuração para o Chrome em `localhost:8080`.

---

## Personagens

| # | Personagem | Estilo | Passiva | Ativa |
|---|---|---|---|---|
| 0 | **Van** | Sem arma (corpo a corpo) | *Rainbolt*: ganha velocidade a cada colisão | *Shockwave* (a implementar) |
| 1 | **Lance** | Espada orbital | *vampirism*: recupera vida ao acertar | *Sword Dance*: aumenta velocidade, giro da espada e esquiva por um tempo |
| 2 | **Stephany** | Cauda (corrente de segmentos) | *Toxic*: a cada 5 acertos envenena o alvo e o veneno evolui | *SludgeBomb*: onda de veneno, poça que reduz velocidade e pode atordoar |
| 3 | **Ellios Logan** | Espada orbital | *(em desenvolvimento)* | *(em desenvolvimento)* |

O número é a posição do personagem no array `characters` de `scripts/characters.js`. É esse índice que a tela de seleção grava para o jogo ler.

## Arenas

Definidas em `scripts/arena.js`. A arena ativa é a linha `const arena = arenaMaps.map2`.

| Mapa | Formato |
|---|---|
| `map1` | Retângulo |
| `map2` | Oval *(padrão)* |
| `map3` | Círculo |
| `map4` | Hexágono |

---

## Estrutura do projeto

```
public/
├── index.html                 # entrada: leva à seleção de personagens
├── css/
│   └── ui.css                 # HUD do jogo (barras, moldura, portraits, slots)
├── html/
│   ├── selectCharacter.html   # tela de seleção (+ selectCharacter.css, selecao.js)
│   └── game.html              # a luta (canvas + HUD)
├── scripts/                   # toda a lógica do jogo (detalhada abaixo)
└── assets/                    # imagens: portraits, armas, UI
```

### Fluxo entre as páginas

```
index.html → html/selectCharacter.html → html/game.html
                     │                        ▲
                     └── sessionStorage ──────┘
                 (selectedCharacterP1 / selectedCharacterP2 = índice em characters[])
```

A seleção só decide **quem** luta e grava o índice no `sessionStorage`. `scripts/players.js` lê esse índice (`readSelectedCharacter`) e cria os jogadores.

### Scripts (`public/scripts/`)

Os scripts são carregados por `<script>` em ordem, sem módulos, e **a ordem importa**, porque tudo compartilha o escopo global. Cada arquivo tem uma responsabilidade:

| Área | Arquivos | Função |
|---|---|---|
| Dados | `assets.js`, `characters.js`, `skill.js` | Imagens, personagens e configuração das habilidades |
| Jogadores | `players.js` | Cria `player1` e `player2` a partir dos dados |
| Habilidades | `skillFunction.js`, `skillSystem.js`, `skillUpdate.js`, `skillBar.js`, `skillDraw.js` | Lógica, gatilhos, efeitos contínuos, barra de carga e desenho |
| Eventos e estados | `events.js`, `effects.js`, `states.js` | Eventos de combate, veneno e outros efeitos, stun e casting |
| Combate | `combat.js`, `colision.js` | Dano, crítico, esquiva, colisão e knockback |
| Movimento | `movement.js`, `arena.js`, `subarchetypeSystem.js`, `subarchetypeDB.js` | Movimento, paredes da arena e comportamento (atacar ou recuar) |
| Armas | `weapon.js`, `weaponDraw.js` | Espada orbital e cauda, com hitboxes |
| Desenho e UI | `draw.js`, `ui.js` | Canvas, barras de HP/skill e textos de dano |
| Núcleo | `main.js` | Loop principal |

### Ciclo de cada frame (`main.js`)

```
update():  comportamento → movimento → armas → colisões e combate
           → barra de skill → objetos de skill → efeitos → eventos/passivas
           → estados → cooldowns → verifica fim de jogo
render():  arena → objetos de skill → jogadores → HUD → armas → textos de dano
```

### Sistema de habilidades

Cada habilidade é dividida em partes, para separar configuração, lógica e estado:

| Peça | Arquivo | O que guarda |
|---|---|---|
| Configuração | `skill.js` (`skill[nome]`) | Nome, gatilho, valores fixos |
| Lógica | `skillFunction.js` (`skillFunction[nome]`) | O que a passiva e a ativa fazem |
| Estado por jogador | `player.skillObjects` | Contadores e efeitos temporários |
| Gatilhos | `events.js` + `skillSystem.js` | Eventos (`weaponHit`, `Collision`, `damageTaken`…) que acionam passivas |

- **Passiva:** dispara quando um evento do tipo configurado em `trigger` acontece.
- **Ativa:** uma barra enche com o tempo e com golpes (`chargeTime`, `chargeHit`). Quando está cheia, a skill é usada. Se a função devolve `false` (não pôde ser usada), a barra não é gasta.

> As habilidades são buscadas pelo **nome** do personagem (`skill[player.character.name]`).

## Como adicionar um personagem

1. `scripts/characters.js`: adicione o objeto do personagem (stats, arma, `hudPortrait`, `skills`).
2. `scripts/skill.js`: adicione uma entrada com **o mesmo `name`** do personagem.
3. `scripts/skillFunction.js`: adicione a lógica da passiva e da ativa com o mesmo nome.
4. `scripts/subarchetypeDB.js`: defina o comportamento (ou reutilize `Aggressive`/`Defensive`).
5. `scripts/assets.js`: registre os portraits e as armas.
6. `assets/`: coloque as imagens (nomes em minúsculas, sem espaços).
7. `html/selecao.js`: inclua o personagem na lista da tela de seleção.

---

## Problemas conhecidos

- **Ellios Logan está incompleto**: faltam o retrato, as imagens em `assets.js`, a entrada em `skill.js` e o comportamento em `subarchetypeDB.js`. Escolhê-lo trava o jogo.
- **Van contra Van trava**: em `combat.js`, o fim de `unarmedCombat` usa `player1.active1.chargeHit`. O correto é `active1.chargeHit` e `active2.chargeHit`.
- `html/aa.html` é uma sobra de teste e referencia arquivos que não existem.
- A *Shockwave* da Van ainda não tem efeito.
- Em `assets/ui/hpbar/` há arquivos antigos sem uso, com espaços e parênteses no nome.

## Roadmap

Anotado em `public/lembretes.txt`:

- Interface universal de passivas (slot com ícone, descrição e progresso).
- Portraits completos para todos os personagens (hoje só o de dano está implementado).
- Ajuste (nerf) da lentidão da poça da Stephany.
- *Game feel*: screen shake ao receber dano, partículas e som de colisão, hitstop em críticos e habilidades, e curvas de transição suaves na interface.

---

*Projeto independente de Lix Coding.*
