export interface Project {
  id: 'vicinity' | 'capri'
  repo: string
  accent: 'green' | 'red'
  links: { repo: string; releases?: string; site?: string; download?: string }
  stack: string[]
  image?: string
}
export const projects: Project[] = [
  {
    id: 'vicinity',
    repo: 'inkoffTTV/Vicinity',
    accent: 'green',
    links: {
      repo: 'https://github.com/inkoffTTV/Vicinity',
      releases: 'https://github.com/inkoffTTV/Vicinity/releases',
      download: 'https://github.com/inkoffTTV/Vicinity/releases/latest',
      site: 'https://chat.13-143-162-211.sslip.io',
    },
    stack: ['C++17', 'Drogon', 'Qt 6 / QML', 'TypeScript', 'React', 'Electron', 'WebRTC', 'SQLite', 'Docker', 'Nginx'],
  },
  {
    id: 'capri',
    repo: 'inkoffTTV/capri-desktop-russ',
    accent: 'red',
    links: { repo: 'https://github.com/inkoffTTV/capri-desktop-russ' },
    stack: ['Electron', 'WebGL', 'JavaScript', 'PowerShell', 'Ollama'],
    image: 'capri/cutin-grin.png',
  },
]
export const stack = [
  { name: 'C++17', group: 'backend' }, { name: 'Drogon', group: 'backend' }, { name: 'SQLite', group: 'backend' }, { name: 'WebRTC', group: 'backend' },
  { name: 'Qt 6 / QML', group: 'client' }, { name: 'TypeScript', group: 'client' }, { name: 'React', group: 'client' }, { name: 'Electron', group: 'client' }, { name: 'WebGL', group: 'client' },
  { name: 'Docker', group: 'ops' }, { name: 'Nginx', group: 'ops' }, { name: 'TURN', group: 'ops' }, { name: 'PowerShell', group: 'ops' }, { name: 'Ollama', group: 'ops' },
]
export const links = { telegram: 'https://t.me/outfxxxtd', telegramHandle: '@outfxxxtd', github: 'https://github.com/inkoffTTV', source: 'https://github.com/inkoffTTV/inkoffTTV.github.io' }
