import type { Dict } from './ru'
export const en: Dict = {
  nav: { projects: 'Projects', stack: 'Stack', about: 'About', contact: 'Contact', settings: 'Settings' },
  hero: {
    eyebrow: 'PROJECT CAPRICORN // developer from Sochi',
    name: 'inkoff',
    tagline: 'I build Vicinity, a messenger with its own server, and teach Capri to live on the desktop.',
    cta: 'See projects',
    cta2: 'Get in touch',
    hint: 'Move your cursor towards Capri. She will notice.',
  },
  ticker: {
    showing: 'SHOWING', editing: 'EDITING', running: 'RUNNING', searching: 'SEARCHING', thinking: 'THINKING', idle: 'BORED', watching: 'WATCHING', sec: 's',
    targets: ['portfolio', 'Vicinity', 'capri-desktop-russ', '"what else to break"', 'npm run build', 'you'],
  },
  projects: {
    title: 'Projects',
    eyebrow: 'MISSION REPORT',
    stars: 'stars', forks: 'forks', updated: 'updated', lang: 'language', repo: 'Repository', releases: 'Releases', site: 'Open in browser', download: 'Download for Windows',
    vicinity: {
      tag: 'a messenger with its own server',
      desc: 'Direct messages and group chats, servers with text and voice channels, calls with camera and screen sharing. Runs in the browser, as a Windows app and on the phone, one account everywhere.',
      bullets: [
        ['Voice and calls', 'voice channels, WebRTC calls, screen sharing up to 1440p 60 fps, with system audio in the app'],
        ['Security', 'two-factor auth, email confirmation, ALTCHA captcha, active sessions list'],
        ['Looks', 'themes, nickname styles, profile theme with automatic contrast, 20 app icons'],
        ['Self-hosting', 'Docker Compose, TURN server, backups and one-command updates'],
      ],
    },
    capri: {
      tag: 'a construct on your desktop',
      desc: 'The Russian edition of desktop Capri. She sits on your windows, teleports to your mouse when Claude Code, Codex or Antigravity wait for permission, glitches on errors and goes wild with joy when the task is done. Talks to you through a local model, no subscriptions.',
      bullets: [
        ['Frame-by-frame', 'a WebGL shader at 12 fps "on twos", like the anime'],
        ['Lives in the system', 'perches on windows, peeks from the edges, possesses windows'],
        ['Her own brain', 'Ollama, LM Studio, llama.cpp or a key to a cloud model'],
      ],
    },
  },
  stack: { title: 'Stack', eyebrow: 'SEARCHING "stack"', note: 'What Vicinity and Capri are built with.' },
  about: {
    title: 'About',
    eyebrow: 'WHO IS THIS',
    p1: 'Developer from Sochi. I like products that live entirely with me: my server, my client, my build.',
    p2: 'Vicinity grew out of wanting a messenger for friends without anyone else\'s servers. Capri showed up because code is more fun to write when a construct from Night City is watching.',
    facts: [['City', 'Sochi'], ['Time zone', 'UTC+3'], ['Open to', 'freelance and collaboration']],
  },
  contact: {
    title: 'Contact',
    eyebrow: 'CALL',
    lead: 'Telegram is fastest. Issues and pull requests are welcome too.',
    telegram: 'Message on Telegram',
    github: 'GitHub',
  },
  settings: { title: 'Settings', lang: 'Language', theme: 'Theme', motion: 'Motion', dark: 'Dark', light: 'Light', full: 'Full', less: 'Less', close: 'Close' },
  footer: {
    rights: 'Capri / Project Capricorn, Cyberpunk and Cyberpunk: Edgerunners belong to CD PROJEKT RED, Studio Trigger and Netflix. A fan site with no affiliation.',
    source: 'Site source',
  },
  boot: { loading: 'Loading', nogl: 'WebGL is unavailable, Capri is resting. Projects and contacts are still here.' },
}
