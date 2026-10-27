# inkoff — portfolio

Сайт-портфолио: Vicinity, Капри и всё остальное. React 19, Vite, TypeScript, без фреймворков для анимации:
Капри на странице рисует тот же WebGL-рендер, что и в [capri-desktop-russ](https://github.com/inkoffTTV/capri-desktop-russ)
(`src/capri/vendor`, код под MIT из [mochiiwuff/capri-desktop](https://github.com/mochiiwuff/capri-desktop)).

- `npm run dev` — локально, `npm run build` — сборка в `dist/`.
- Деплой: GitHub Pages через `.github/workflows/pages.yml` при пуше в `main`.
- Тексты на двух языках в `src/i18n/`, данные проектов в `src/content/projects.ts`.
- Капри: карточки проектов для неё «окна» — она садится на них при наведении, вселяется в них, спит через десять минут тишины.
  В консоли: `capri.poke()`, `capri.cheer()`, `capri.possess()`.

Capri / Project Capricorn, Cyberpunk и Cyberpunk: Edgerunners принадлежат CD PROJEKT RED, Studio Trigger и Netflix.
Фанатский сайт без аффилиации; изображения персонажа не покрываются лицензией на код.
