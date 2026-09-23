(() => {
  const image = document.querySelector('img[src="assets/cataf-dashboard.png"]');
  if (!image || image.dataset.catafEnhanced === '1') return;
  image.dataset.catafEnhanced = '1';

  const style = document.createElement('style');
  style.textContent = '.cataf-scroll-frame{width:100%;border:1px solid rgba(32,38,53,.13);border-radius:12px;overflow:hidden;background:#ebe9e3}.cataf-viewport{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;background:#fff}.cataf-scroll-image{position:absolute!important;top:0;left:0;width:100%!important;height:auto!important;max-width:none!important;display:block;border:0!important;border-radius:0!important;will-change:transform;transform:translate3d(0,0,0);animation:none!important;transition:none!important}';
  document.head.appendChild(style);

  const frame = document.createElement('div');
  frame.className = 'cataf-scroll-frame';
  const viewport = document.createElement('div');
  viewport.className = 'cataf-viewport';
  viewport.id = 'catafViewport';
  image.id = 'catafScrollImage';
  image.classList.add('cataf-scroll-image');
  image.parentNode.insertBefore(frame, image);
  frame.appendChild(viewport);
  viewport.appendChild(image);

  let started = false;
  function ease(t){return t < .5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2}
  function start(){
    if(started) return;
    started = true;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const duration = 110000, topPause = .075, bottomPause = .075;
    let startTime = null;
    function frameStep(now){
      if(startTime === null) startTime = now;
      const cycle = ((now-startTime)%duration)/duration;
      const travel = Math.max(0,image.getBoundingClientRect().height-viewport.getBoundingClientRect().height);
      let progress;
      if(cycle < topPause) progress = 0;
      else if(cycle < .5-bottomPause) progress = ease((cycle-topPause)/(.5-bottomPause-topPause));
      else if(cycle < .5+bottomPause) progress = 1;
      else if(cycle < 1-topPause) progress = 1-ease((cycle-(.5+bottomPause))/((1-topPause)-(.5+bottomPause)));
      else progress = 0;
      image.style.transform = `translate3d(0,${-(travel*progress)}px,0)`;
      requestAnimationFrame(frameStep);
    }
    requestAnimationFrame(frameStep);
  }
  function check(){
    if(started) return;
    const r = viewport.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if(r.top >= 0 && r.bottom <= vh) start();
  }
  if(image.complete) check(); else image.addEventListener('load',check,{once:true});
  window.addEventListener('scroll',check,{passive:true});
  window.addEventListener('resize',check);
  check();
})();