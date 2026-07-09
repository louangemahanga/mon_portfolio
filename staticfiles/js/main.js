// ══ CURSEUR ══
const cur  = document.getElementById('cur');
const curl = document.getElementById('curl');
const spot = document.getElementById('spot');
let mx=0,my=0,rx=0,ry=0;

document.addEventListener('mousemove',e=>{
    mx=e.clientX; my=e.clientY;
    cur.style.cssText += `left:${mx-5}px;top:${my-5}px;`;
    spot.style.cssText += `left:${mx}px;top:${my}px;`;
});
(function animCurl(){
    rx+=(mx-rx)*0.14; ry+=(my-ry)*0.14;
    curl.style.left=(rx-18)+'px'; curl.style.top=(ry-18)+'px';
    requestAnimationFrame(animCurl);
})();
document.querySelectorAll('a,button,.service-card,.project-card,.skill-tag,.photo-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cur.classList.add('hov'); curl.classList.add('hov'); });
    el.addEventListener('mouseleave',()=>{ cur.classList.remove('hov'); curl.classList.remove('hov'); });
});

// ══ PHOTO TILT 3D ══
const photoCard  = document.getElementById('photoCard');
const photoGlare = document.getElementById('photoGlare');
photoCard.addEventListener('mousemove',e=>{
    const r = photoCard.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width -0.5;
    const y = (e.clientY-r.top) /r.height-0.5;
    photoCard.style.transform = `rotateY(${x*22}deg) rotateX(${-y*18}deg) scale(1.04)`;
    photoGlare.style.background = `radial-gradient(circle at ${(x+.5)*100}% ${(y+.5)*100}%, rgba(255,255,255,.12), transparent 60%)`;
});
photoCard.addEventListener('mouseleave',()=>{
    photoCard.style.transform='rotateY(0) rotateX(0) scale(1)';
    photoGlare.style.background='radial-gradient(circle at 30% 30%,rgba(255,255,255,.08),transparent 60%)';
});

// ══ CANVAS AURORA ══
const cv = document.getElementById('bgc');
const cx = cv.getContext('2d');
let W,H;
const resize=()=>{ W=cv.width=window.innerWidth; H=cv.height=window.innerHeight; };
resize(); window.addEventListener('resize',resize);

const COLS=['#00ffe7','#0084ff','#7c3aff','#ff2d78','#ff8c00'];
const orbs = COLS.map((c,i)=>({
    x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
    vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.25,
    r:220+Math.random()*280, col:c, a:.055+Math.random()*.04, ph:Math.random()*Math.PI*2
}));
const dots=Array.from({length:55},()=>({
    x:Math.random()*window.innerWidth, y:Math.random()*window.innerHeight,
    r:Math.random()*1.4+.3, vx:(Math.random()-.5)*.25, vy:-Math.random()*.35-.08,
    a:Math.random()*.55+.15, c:COLS[Math.floor(Math.random()*COLS.length)]
}));

(function draw(){
    cx.clearRect(0,0,W,H);
    orbs.forEach(o=>{
        o.x+=o.vx; o.y+=o.vy; o.ph+=.007;
        const p=1+Math.sin(o.ph)*.12;
        if(o.x<-o.r)o.x=W+o.r; if(o.x>W+o.r)o.x=-o.r;
        if(o.y<-o.r)o.y=H+o.r; if(o.y>H+o.r)o.y=-o.r;
        const g=cx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r*p);
        g.addColorStop(0,o.col+Math.round(o.a*255).toString(16).padStart(2,'0'));
        g.addColorStop(1,o.col+'00');
        cx.beginPath(); cx.arc(o.x,o.y,o.r*p,0,Math.PI*2); cx.fillStyle=g; cx.fill();
    });
    dots.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy;
        if(d.y<-5){d.y=H+5;d.x=Math.random()*W;}
        if(d.x<0)d.x=W; if(d.x>W)d.x=0;
        cx.save(); cx.globalAlpha=d.a; cx.beginPath(); cx.arc(d.x,d.y,d.r,0,Math.PI*2);
        cx.fillStyle=d.c; cx.shadowColor=d.c; cx.shadowBlur=6; cx.fill(); cx.restore();
    });
    requestAnimationFrame(draw);
})();

// ══ PROGRESS BAR ══
const prog=document.getElementById('progress');
window.addEventListener('scroll',()=>{
    const pct=window.scrollY/(document.body.scrollHeight-window.innerHeight);
    prog.style.transform=`scaleX(${pct})`;
    // back to top
    document.getElementById('totop').classList.toggle('show',window.scrollY>400);
});

// ══ NAV ACTIVE ══
const navAs=document.querySelectorAll('.nav-links a');
const secs=document.querySelectorAll('section');
window.addEventListener('scroll',()=>{
    let cur2='';
    secs.forEach(s=>{ if(pageYOffset>=s.offsetTop-120) cur2=s.id; });
    navAs.forEach(a=>{ a.classList.toggle('active',a.getAttribute('href')==='#'+cur2); });
});

// ══ HAMBURGER ══
const ham=document.getElementById('hamburger');
const mob=document.getElementById('mobileNav');
ham.addEventListener('click',()=>{ ham.classList.toggle('open'); mob.classList.toggle('open'); });
function closeMobile(){ ham.classList.remove('open'); mob.classList.remove('open'); }

// ══ PROJET TABS ══
document.querySelectorAll('.proj-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
        document.querySelectorAll('.proj-tab').forEach(t=>t.classList.remove('active'));
        document.querySelectorAll('.proj-panel').forEach(p=>p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-'+tab.dataset.tab).classList.add('active');
    });
});

// ══ COMPTEURS ANIMÉS ══
const counters=document.querySelectorAll('.stat-num');
const countObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
        if(e.isIntersecting){
            const target=+e.target.dataset.target;
            let n=0; const step=target/40;
            const t=setInterval(()=>{
                n+=step; e.target.textContent=Math.min(Math.ceil(n),target)+(target>5?'+':'');
                if(n>=target) clearInterval(t);
            },35);
            countObs.unobserve(e.target);
        }
    });
},{threshold:.5});
counters.forEach(c=>countObs.observe(c));

// ══ SCROLL REVEAL ══
const revObs=new IntersectionObserver(entries=>{
    entries.forEach((e,i)=>{
        if(e.isIntersecting){
            e.target.style.opacity='1';
            e.target.style.transform='translateY(0)';
        }
    });
},{threshold:.1});
document.querySelectorAll('.service-card,.project-card,.skill-tag,.about-card,.tl-item').forEach((el,i)=>{
    el.style.opacity='0'; el.style.transform='translateY(28px)';
    el.style.transition=`all 0.55s ease-out ${i*.07}s`;
    revObs.observe(el);
});