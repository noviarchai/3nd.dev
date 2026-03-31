const fs = require('fs');
let html = fs.readFileSync('/tmp/nex-index.html', 'utf8');

const edits = [
  // Remove Companies from nav
  ['<li><a href="index.html#companies">Companies</a></li>\n', ''],
  ['<li><a href="status.html" class="btn">Status</a></li>\n', ''],
  
  // Remove Companies and Status from mobile menu
  ['<a href="index.html#companies" onclick="toggleMobileMenu()">Companies</a>\n', ''],
  ['<a href="status.html" onclick="toggleMobileMenu()">Status</a>\n', ''],
  
  // Change hero badge
  ['<div class="hero-badge">Autonomous AI Operations — Live</div>', '<div class="hero-badge">🚀 Building What\'s Next</div>'],
  
  // Change hero headline  
  ['We Build <span class="gradient">AI Companies</span> That Run Themselves', 'We Build <span class="gradient">Software Products</span> That Scale'],
  
  // Change hero description - remove AI/agent language
  ['nex.monster is an AI-native holding company. We create, launch, and scale businesses 24/7 — powered by autonomous agents that never sleep, never quit, and never stop building.',
   'nex.monster is a product studio and holding company. We create, launch, and scale software businesses — from SaaS products to developer tools, built fast and built to last.'],
  
  // Change hero sub
  ['<p class="hero-sub">12 businesses conceived. 4 in active development. $0 human overtime paid.</p>\n', ''],
  
  // Change stats section
  ['Hours/Day Agents Run', 'Hour Operation'],
  ['Human Bottlenecks', 'Ideas In Motion'],
  
  // Change "agent swarms" description  
  ['Our agent swarms handle everything — research, build, launch, optimize. Humans set direction, AI does the work.',
   'We handle everything — research, build, launch, optimize. Fast execution, lean operations, great products.'],
  
  // Change testimonial
  ["If you're not building with autonomous agents, you're already falling behind.",
   "If you're not leveraging modern tools and workflows, you're already falling behind."],
  
  // Remove AI Researcher testimonial  
  ['<div class="proof-name">AI Researcher</div><div class="proof-title">Anonymous, credible</div>\n', ''],
  
  // Change FAQ answers that mention agents
  ['Whether you\'re a non-technical founder with an idea or a technical person who wants to offload execution — we adapt to your level.',
   'Whether you\'re a non-technical founder with an idea or a technical person who wants to offload execution — we handle the heavy lifting.'],
   
  ['We don\'t have the overhead of a human team. Our agents work 24/7, don\'t require management, and can scale instantly.',
   'We work lean and fast, without the overhead of a large team.'],
   
  ['our agents can build a version of it', 'we can build a version of it'],
  
  ['Our agents work in parallel around the clock', 'We work in parallel around the clock'],
  
  // Change CTA section
  ['Our agents are already working. The question isn\'t whether we\'re building the future — it\'s whether you want in.',
   'We\'re always building. The question isn\'t whether we\'re creating the future — it\'s whether you want in.'],
  
  ['Our agents are standing by and respond within hours', 'We respond to every inquiry personally'],
];

edits.forEach(([from, to]) => {
  html = html.split(from).join(to);
});

fs.writeFileSync('/tmp/nex-index-edited.html', html);
console.log('Done. Lines:', html.split('\n').length);
