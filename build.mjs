import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const content = JSON.parse(fs.readFileSync(path.join(root, 'content/site.json'), 'utf8'));
const coursework = JSON.parse(fs.readFileSync(path.join(root, 'content/courses.json'), 'utf8'));
const out = path.join(root, 'dist');
const e = (value = '') => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t = (value, tag = 'span', className = '') => `<${tag}${className ? ` class="${e(className)}"` : ''} data-en="${e(value.en)}">${e(value.zh)}</${tag}>`;
const url = value => e(value);
const iconPaths = {
  ai: '<circle cx="6" cy="8" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="7" cy="18" r="2"/><path d="m8 8 8-2M8 9l8 8M9 18h7M18 8v8"/>',
  signal: '<path d="M2 12h3l2-7 4 14 3-11 2 4h6"/>',
  math: '<path d="M3 3v18h18M6 17c3-1 4-8 7-8s3 5 8-4"/><circle cx="13" cy="9" r="1.4"/>',
  chip: '<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/>',
  book: '<path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15"/>',
  paper: '<path d="M6 2h9l4 4v16H6zM15 2v5h4M9 11h7m-7 4h7m-7 4h5"/>',
  satellite: '<rect x="9" y="9" width="6" height="6" rx="1"/><path d="m7 7 2 2m6 6 2 2M3 4l4 1-2 4-4-1zm16 11 4 1-2 4-4-1zM12 2v4m0 12v4"/>',
  robot: '<rect x="4" y="7" width="16" height="13" rx="2"/><path d="M12 3v4m-4 7h.01M16 14h.01M8 18h8"/>',
  trophy: '<path d="M7 3h10v8a5 5 0 0 1-10 0zM7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4M12 16v4m-5 1h10"/>'
};
const icon = (name, className = '') => `<svg class="${e(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.paper}</svg>`;
const pages = [
  ['index.html', '首页', 'Home'],
  ['research.html', '研究成果', 'Research'],
  ['projects.html', '项目经历', 'Projects'],
  ['courses.html', '课程修读', 'Courses'],
  ['honors.html', '荣誉奖励', 'Honors']
];

function nav(active) {
  return pages.map(([href, zh, en]) => `<a href="${href}"${href === active ? ' aria-current="page"' : ''} data-en="${e(en)}">${e(zh)}</a>`).join('');
}

function layout(file, titleZh, titleEn, description, body) {
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#221a35"><meta name="description" content="${e(description)}"><title>${e(titleZh)} · 李思成</title><link rel="icon" type="image/svg+xml" href="assets/mark.svg"><link rel="stylesheet" href="assets/site.css"></head>
<body data-page="${e(file)}" data-title-zh="${e(titleZh)} · 李思成" data-title-en="${e(titleEn)} · Sicheng Li">
<a class="skip" href="#main" data-en="Skip to content">跳转至正文</a>
<header class="site-header"><div class="container header-inner"><a class="brand" href="index.html" aria-label="李思成 Sicheng Li 首页"><img class="brand-symbol" src="assets/mark.svg" width="44" height="44" alt=""><span class="brand-name">SICHENG LI<small>李思成</small></span></a><nav aria-label="主导航">${nav(file)}</nav><button id="language-toggle" class="language-toggle" type="button" aria-label="Switch to English">EN</button></div></header>
<main id="main">${body}</main>
<footer class="site-footer"><div class="container footer-grid"><div><strong>李思成 <span>/</span> Sicheng Li</strong><p>${t({zh:'清华大学自动化系 · 研究与工程',en:'Department of Automation, Tsinghua University · Research & Engineering'})}</p></div><div class="footer-links"><a class="footer-mail" href="mailto:${url(content.profile.email)}">${e(content.profile.email)} <span aria-hidden="true">↗</span></a><a href="https://orcid.org/${e(content.profile.orcid)}" target="_blank" rel="noopener noreferrer" aria-label="ORCID ${e(content.profile.orcid)}">ORCID ${e(content.profile.orcid)} <span aria-hidden="true">↗</span></a></div><div class="footer-bottom"><span>© <span id="year">2026</span> Sicheng Li</span><a href="#main" data-en="Back to top ↑">返回顶部 ↑</a></div></div></footer>
<script src="assets/site.js" defer></script></body></html>`;
}

function sectionHead(number, label, title, more, glyphOverride) {
  const glyph = glyphOverride || (number === 'A' ? 'paper' : number === 'B' ? 'trophy' : number === 'C' ? 'book' : ['ai','paper','book'][Number(number)-1] || 'paper');
  return `<div class="section-head"><div class="section-label"><span class="section-icon">${icon(glyph)}</span><span>${number} / ${t(label)}</span></div><div><h2>${t(title)}</h2>${more ? `<p>${t(more)}</p>` : ''}</div></div>`;
}

function home() {
  const p = content.profile;
  const education = content.education.map(item => `<div class="education-row"><div class="education-rail"><span class="education-badge">${icon('book')}</span><span>${e(item.period)}</span></div><div><h3>${t(item.school)}</h3><p>${t(item.degree)}</p><p class="small-note">${t(item.detail)}</p></div></div>`).join('');
  const focus = content.focus.map(item => `<article class="focus-item"><div class="focus-top"><span>${e(item.number)}</span><span class="focus-icon">${icon(['ai','signal','math','chip'][Number(item.number)-1])}</span></div><h3>${t(item.title)}</h3><p>${t(item.description)}</p></article>`).join('');
  const featured = content.publications[0];
  const body = `<section class="home-hero"><div class="container hero-grid"><div class="hero-copy"><p class="eyebrow">AI / SIGNAL PROCESSING / SYSTEMS</p><p class="hero-name-en">Sicheng Li</p><h1>${e(p.nameZh)}</h1><div class="hero-rule"></div><p class="hero-position">${t(p.position)}</p><p class="hero-headline">${t(p.headline)}</p><p class="hero-intro">${t(p.intro)}</p><div class="hero-actions"><a class="button button-light" href="research.html">${t({zh:'浏览研究成果',en:'Explore research'})}<span aria-hidden="true">↗</span></a><a class="text-link light-link" href="mailto:${url(p.email)}">${t({zh:'与我联系',en:'Contact me'})} <span aria-hidden="true">↗</span></a></div><a class="orcid-link" href="https://orcid.org/${e(p.orcid)}" target="_blank" rel="noopener noreferrer"><span class="orcid-dot">iD</span><span>ORCID ${e(p.orcid)}</span><span aria-hidden="true">↗</span></a></div><figure class="hero-portrait"><img src="${url(p.photo)}" alt="${e(p.nameZh)} / ${e(p.nameEn)}" width="1365" height="2048" fetchpriority="high"><figcaption><span>${t(p.photoCaption)}</span><span>01 / PROFILE</span></figcaption></figure></div><div class="container hero-bottom"><span>TSINGHUA UNIVERSITY</span><span>DEPARTMENT OF AUTOMATION</span><span>2024 — 2027</span></div></section>
<section class="section focus-section"><div class="container">${sectionHead('01',{zh:'研究方向',en:'Research focus'},{zh:'从方法研究到系统实现',en:'Methods and systems in practice'})}<div class="focus-grid">${focus}</div></div></section>
<section class="section selected-section"><div class="container">${sectionHead('02',{zh:'精选成果',en:'Featured work'},{zh:'跨越理论、算法与应用',en:'Across theory, algorithms, and applications'})}<div class="selected-grid"><a class="featured-paper" href="research.html"><span class="card-kicker">${icon("math")} PUBLICATION / MATHEMATICS / 2026</span><h3>${e(featured.title)}</h3><p>${t(featured.summary)}</p><span class="card-cta">${t({zh:'查看研究成果',en:'View research'})} ↗</span></a><div class="selected-side"><a href="projects.html" class="project-teaser"><span>${icon("satellite")} PROJECT / GENERATIVE AI</span><strong>${t(content.projects[0].title)}</strong><span class="card-cta">${t({zh:'查看项目经历',en:'View projects'})} ↗</span></a><a href="research.html" class="project-teaser"><span>${icon("chip")} PUBLICATION / EMBEDDED SYSTEMS</span><strong>${e(content.publications[1].title)}</strong><span class="card-cta">${t({zh:'查看论文',en:'View publication'})} ↗</span></a></div></div></div></section>
<section class="section education-section"><div class="container">${sectionHead('03',{zh:'教育经历',en:'Education'},{zh:'自动化 · 从哈工大到清华。',en:'Automation · From HIT to THU.'})}<div class="education-list">${education}</div></div></section>
<section class="contact-banner"><div class="container contact-inner"><p class="eyebrow">CONNECT / COLLABORATE</p><h2>${t({zh:'欢迎交流研究问题与合作机会',en:'Let’s discuss a research question.'})}</h2><a href="mailto:${url(p.email)}">${e(p.email)} <span aria-hidden="true">↗</span></a></div></section>`;
  return layout('index.html','首页','Home','李思成，清华大学自动化系硕士研究生。研究兴趣包括人工智能、信号处理、应用数学与嵌入式系统。',body);
}

function subhero(number, label, title, intro) {
  return `<section class="subhero"><div class="container subhero-inner"><div class="subhero-index">${number} / ${t(label)}</div><h1>${t(title)}</h1><p>${t(intro)}</p></div></section>`;
}

function research() {
  const papers = content.publications.map((paper, i) => `<article class="publication"><div class="publication-rail"><span>0${i+1}</span><span>${e(paper.year)}</span></div><div><p class="item-type">${t(paper.type)}</p><h3>${e(paper.title)}</h3><p class="authors">${e(paper.authors)}</p><p class="venue">${e(paper.venue)}</p><p class="item-summary">${t(paper.summary)}</p><p class="citation">${e(paper.citation)}</p>${paper.url ? `<a class="text-link" href="${url(paper.url)}" target="_blank" rel="noopener noreferrer">${t(paper.linkLabel)} <span aria-hidden="true">↗</span></a>` : ''}</div></article>`).join('');
  const patents = content.patents.map(p => `<article class="patent-card"><div class="patent-num">${e(p.number)}</div><div><h3>${t(p.title)}</h3><p>${t(p.people)}</p><p>${t(p.status)}</p><a class="text-link" href="${url(p.url)}" target="_blank" rel="noopener noreferrer">${t({zh:'查看专利记录',en:'View patent record'})} ↗</a></div></article>`).join('');
  const body = `${subhero('01',{zh:'研究成果',en:'Research output'},{zh:'论文与专利',en:'Publications & patent'},{zh:'人工智能、数学建模、信号处理与嵌入式实现的研究成果',en:'Research in AI, mathematical modeling, signal processing, and embedded implementation'})}<section class="section subpage-section"><div class="container">${sectionHead('A',{zh:'学术论文',en:'Publications'},{zh:'已发表的工作',en:'Published work'})}<div class="publication-list">${papers}</div></div></section><section class="section patent-section"><div class="container">${sectionHead('B',{zh:'发明专利',en:'Patent'},{zh:'面向工程应用的研究',en:'Methods for engineering applications'})}${patents}</div></section>`;
  return layout('research.html','研究成果','Research','李思成的人工智能、数学建模、信号处理与嵌入式系统研究论文和专利。',body);
}

function projects() {
  const items = content.projects.map(p => `<article class="project-entry"><div class="project-marker">${icon(["satellite","math","ai","chip","robot"][Number(p.number)-1])}<span>/ ${e(p.number)}</span></div><div class="project-content"><p class="item-type">${t(p.period)}</p><h2>${t(p.title)}</h2><p>${t(p.description)}</p><div class="tag-row">${p.tags.map(tag=>`<span>${e(tag)}</span>`).join('')}</div>${p.publicationUrl ? `<a class="text-link project-paper-link" href="${url(p.publicationUrl)}" target="_blank" rel="noopener noreferrer">${t({zh:"阅读相关论文",en:"Read related paper"})} ↗</a>` : ""}</div>${p.image ? `<figure class="project-visual"><img src="${url(p.image)}" width="1586" height="992" alt="" loading="lazy"></figure>` : ''}</article>`).join('');
  const body = `${subhero('02',{zh:'项目经历',en:'Projects'},{zh:'研究、实现与系统实践',en:'Research, implementation & systems'},{zh:'在航天实践、工业感知和智能系统中研究智能算法与工程实现。',en:'Research and implementation across space systems, industrial sensing, and intelligent systems.'})}<section class="section subpage-section"><div class="container project-list">${items}</div></section>`;
  return layout('projects.html','项目经历','Projects','李思成的研究项目、实时 C++ 阵列声波算法、卫星故障根因分析实习与机器人实践。',body);
}

function courses() {
  const highlights = (part) => `<div class="course-highlight-panel"><div class="course-highlight-head"><span class="course-highlight-icon">${icon('book')}</span><div><p>${t(part.school)}</p><h3>${t(part.label)}</h3></div></div><ul>${part.highlights.map(item => `<li><span>${t(item.name)}</span><strong>${e(item.score)}</strong></li>`).join('')}</ul></div>`;
  const terms = (part) => `<div class="course-term-grid">${part.terms.map(term => {
    const credits = term.courses.reduce((sum, course) => sum + course.credits, 0);
    return `<section class="course-term"><div class="course-term-head"><h3>${t(term.period)}</h3><span class="term-credits">${credits.toFixed(1)} ${t({zh:'学分',en:'credits'})}</span></div><ul>${term.courses.map(course => `<li>${t(course.name)}</li>`).join('')}</ul></section>`;
  }).join('')}</div>`;
  const body = `${subhero('04',{zh:'课程修读',en:'Coursework'},{zh:'课程与学期',en:'Courses by semester'},{zh:'各个学期的本科与硕士阶段课程',en:'Undergraduate and master’s courses by semester.'})}
<section class="section course-highlight-section"><div class="container">${sectionHead('A',{zh:'重点课程',en:'Selected courses'},{zh:'重点课程与成绩',en:'Selected courses & grades'},{zh:'具有代表性的专业课程',en:'Representative and important courses'},'math')}<div class="course-highlight-grid">${highlights(coursework.master)}${highlights(coursework.undergraduate)}</div></div></section>
<section class="section course-master-section"><div class="container">${sectionHead('B',{zh:'硕士阶段',en:'Master’s study'},{zh:'清华大学',en:'Tsinghua University'},{zh:'自动化系 · 控制科学与工程',en:'Department of Automation · Control Science and Engineering'},'book')}${terms(coursework.master)}</div></section>
<section class="section course-undergrad-section"><div class="container">${sectionHead('C',{zh:'本科阶段',en:'Undergraduate study'},{zh:'哈尔滨工业大学',en:'Harbin Institute of Technology'},{zh:'航天学院 · 自动化',en:'School of Astronautics · Automation'},'book')}${terms(coursework.undergraduate)}</div></section>`;
  return layout('courses.html','课程修读','Coursework','李思成在清华大学与哈尔滨工业大学修读的课程，按学期列出课程名称与每学期总学分。',body);
}

function honors() {
  const categories = [
    {id:'mathematics',title:{zh:'数学类',en:'Mathematics'},icon:'math'},
    {id:'english',title:{zh:'英语类',en:'English'},icon:'book'},
    {id:'innovation',title:{zh:'科创类',en:'Science & innovation'},icon:'chip'}
  ];
  const awards = categories.map(group => {
    const entries = content.awards.filter(a => a.category === group.id);
    const rows = entries.map(a => `<div class="award-row"><span class="award-year">${e(a.year)}</span><strong>${t(a.title)}</strong><span class="award-level">${t(a.level)}</span></div>`).join('');
    return `<section class="award-group"><div class="award-group-head"><span class="award-group-icon">${icon(group.icon)}</span><h3>${t(group.title)}</h3><span class="award-count">${String(entries.length).padStart(2,'0')}</span></div><div class="award-list">${rows}</div></section>`;
  }).join('');
  const honorsList = content.honors.map(a => `<div class="award-row"><span class="award-year">${e(a.year)}</span><strong>${t(a.title)}</strong><span class="award-level">${t(a.level)}</span></div>`).join('');
  const scholarships = content.scholarships.map(a => `<li>${t(a)}</li>`).join('');
  const service = content.service.map(a => `<div class="service-row"><span>${t(a.period)}</span><strong>${t(a.role)}</strong><p>${t(a.school)}</p></div>`).join('');
  const training = content.training.map(a => `<div class="service-row"><span>${e(a.year)}</span><strong>${t(a.name)}</strong><p>${t(a.issuer)}</p></div>`).join('');
  const body = `${subhero('03',{zh:'荣誉奖励',en:'Recognition'},{zh:'竞赛、荣誉与任职',en:'Awards, honors & service'},{zh:'科创竞赛获奖、被授予的荣誉称号与学生工作经历。',en:'Competitions, honors, and student leadership.'})}<section class="section subpage-section"><div class="container">${sectionHead('A',{zh:'竞赛获奖',en:'Competitions'},{zh:'按领域浏览',en:'Browse by field'})}${awards}</div></section><section class="section honors-section"><div class="container">${sectionHead('B',{zh:'荣誉与奖学金',en:'Honors & scholarships'},{zh:'综合荣誉',en:'Honors'})}<div class="award-list">${honorsList}</div><div class="honor-panel scholarship-panel"><h3>${t({zh:'奖学金',en:'Scholarships'})}</h3><ul>${scholarships}</ul></div></div></section><section class="section service-section"><div class="container">${sectionHead('C',{zh:'学生工作',en:'Leadership & service'},{zh:'任职经历',en:'Appointments'})}<div class="service-grid">${service}</div><h3 class="training-title">${t({zh:'培训与结业',en:'Training'})}</h3><div class="service-grid">${training}</div></div></section>`;
  return layout('honors.html','荣誉奖励','Honors','李思成的竞赛获奖、荣誉称号、奖学金和校园服务经历。',body);
}

fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for (const asset of ['site.css','site.js','profile.jpg','mark.svg']) fs.copyFileSync(path.join(root,'assets',asset),path.join(out,'assets',asset));
fs.mkdirSync(path.join(out,'assets/projects'),{recursive:true});
for (const image of new Set(content.projects.map(p => p.image).filter(Boolean))) fs.copyFileSync(path.join(root,image),path.join(out,image));
for (const [file, html] of [['index.html',home()],['research.html',research()],['projects.html',projects()],['courses.html',courses()],['honors.html',honors()]]) fs.writeFileSync(path.join(out,file),html);
console.log('Built 5 pages in dist/.');
