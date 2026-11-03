'use strict';
const projectsRoot=document.getElementById('projects');
const dialog=document.getElementById('project-dialog');
const dialogContent=document.getElementById('dialog-content');
let projects=[];
let lastTrigger=null;
function element(tag,text,className){const item=document.createElement(tag);if(text!==undefined)item.textContent=text;if(className)item.className=className;return item;}
function externalLink(text,url){const link=element('a',text);link.href=url;link.target='_blank';link.rel='noopener noreferrer';return link;}
function demoLink(project){const link=externalLink(project.demo_label||'Abrir aplicativo ↗',project.demo_url);link.className='button primary demo-button';link.setAttribute('aria-label',`Abrir ${project.title} (nova aba)`);return link;}
function renderVisual(project){
  const art=element('div',undefined,`project-visual visual-${project.visual}`);
  art.append(element('span',project.visual==='edital'?'CAPTURA DA APLICAÇÃO':'ESTRUTURA DO PROJETO','visual-label'));
  if(project.visual==='edital'){
    const browser=element('div',undefined,'browser-mock');const bar=element('div',undefined,'mock-bar');
    for(let i=0;i<3;i++)bar.append(element('i'));bar.setAttribute('aria-hidden','true');
    const image=element('img');image.src=project.image;image.alt=project.image_alt;image.loading='lazy';image.width=1265;image.height=712;browser.append(bar,image);art.append(browser);
  }else if(project.visual==='rastreador'){
    const view=element('div',undefined,'tracker-view');const header=element('div',undefined,'tracker-header');header.append(element('span','rastreador / pipeline'),element('span','PYTHON'));view.append(header);
    for(const [name,label] of [['Coletar páginas','01'],['Filtrar publicações','02'],['Registrar novidades','03']]){const row=element('div',undefined,'tracker-row');row.append(element('span',name),element('b',label));view.append(row);}view.append(element('p','Coleta → processamento → histórico','tracker-caption'));art.append(view);
  }else if(project.visual==='ford'){
    const view=element('div',undefined,'angular-view');view.append(element('div','A','angular-logo'),element('p','Uma aplicação. Três rotas.'));
    const routes=element('div',undefined,'route-row');['/','/home','/dashboard'].forEach((route,i)=>{if(i)routes.append(element('i','→'));routes.append(element('span',route));});view.append(routes,element('p','ANGULAR / TYPESCRIPT / COMPONENTES','angular-caption'));art.append(view);
  }else{
    const view=element('div',undefined,'tracker-view');view.append(element('p',project.title),element('p',project.tags.join(' / '),'tracker-caption'));art.append(view);
  }
  return art;
}
function renderProjects(filter='all'){
  const visible=projects.filter(project=>filter==='all'||project.filters.includes(filter));
  projectsRoot.replaceChildren();document.getElementById('project-count').textContent=`${visible.length} ${visible.length===1?'projeto':'projetos'}`;
  for(const project of visible){
    const card=element('article',undefined,'project');card.id=`projeto-${project.id}`;card.append(renderVisual(project));
    const info=element('div',undefined,'project-info');const meta=element('div',undefined,'project-meta');meta.append(element('span',project.category),element('span',`${project.number} / ${project.year}`));
    info.append(meta,element('h3',project.title),element('p',project.description,'project-description'));
    const tags=element('div',undefined,'project-tags');project.tags.forEach(tag=>tags.append(element('span',tag)));info.append(tags);
    const links=element('div',undefined,'project-links');const button=element('button','Por dentro do projeto ↗','case-button');button.type='button';button.setAttribute('aria-label',`Ver detalhes de ${project.title}`);button.addEventListener('click',()=>openProject(project,button));if(project.demo_url)links.append(demoLink(project));links.append(button);links.append(externalLink('Código no GitHub ↗',project.repository));info.append(links);card.append(info);projectsRoot.append(card);
  }
}
function openProject(project,trigger){
  lastTrigger=trigger;dialogContent.replaceChildren();const title=element('h2',project.title);title.id='dialog-title';dialogContent.append(title);
  if(project.image){const image=element('img');image.src=project.image;image.alt=project.image_alt;dialogContent.append(image);}
  for(const [heading,key] of [['O problema','problem'],['Como foi construído','approach'],['Evidências','evidence'],['Limites da versão','limits'],['O que aprendi','learning']]){dialogContent.append(element('h3',heading),element('p',project[key]));}
  if(project.video){const video=element('video');video.controls=true;video.preload='none';video.src=project.video;video.setAttribute('aria-label','Demonstração do Edital Inteligente');video.textContent='Seu navegador não suporta vídeo.';dialogContent.append(video,element('p',project.video_caption,'video-caption'));}
  const actions=element('div',undefined,'dialog-actions');if(project.demo_url)actions.append(demoLink(project));actions.append(externalLink('Ver o código ↗',project.repository));if(project.article)actions.append(externalLink('Ler o artigo técnico ↗',project.article));dialogContent.append(actions);
  dialog.showModal();document.body.classList.add('dialog-open');
}
document.getElementById('dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{const video=dialog.querySelector('video');if(video)video.pause();document.body.classList.remove('dialog-open');if(lastTrigger&&lastTrigger.isConnected)lastTrigger.focus();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(other=>{const selected=other===button;other.classList.toggle('active',selected);other.setAttribute('aria-pressed',String(selected));});renderProjects(button.dataset.filter);}));
async function loadProjects(){try{const response=await fetch('projects.json',{cache:'no-store'});if(!response.ok)throw new Error('Não foi possível carregar os projetos.');projects=(await response.json()).map((project,index)=>({number:String(index+1).padStart(2,'0'),year:'',visual:'generic',problem:'Contexto em documentação no repositório.',approach:'Confira a implementação e as instruções no GitHub.',evidence:'Código disponível para consulta.',limits:'Consulte o estado atual e as limitações no repositório.',learning:'Decisões documentadas no projeto.',...project}));renderProjects();document.querySelector('[data-filter=all] span').textContent=String(projects.length).padStart(2,'0');}catch(error){document.querySelector('.filter-row').hidden=true;}}
loadProjects();
