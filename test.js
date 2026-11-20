// Run: node test.js  — checks the scoring core embedded in index.html
const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const core=html.match(/<script id="core">([\s\S]*?)<\/script>/)[1];
const api=new Function(core+';return {SEGS,weight,visibleSegs,newLesion,lesionScore,totalScore,tier};')();
const {weight,visibleSegs,newLesion,lesionScore,totalScore,tier}=api;
const mk=o=>Object.assign(newLesion(),o);
let n=0;const t=(name,fn)=>{fn();n++;console.log('ok  '+name);};

t('proximal LAD, right dominant = 3.5*2',()=>assert.strictEqual(lesionScore(mk({segs:['6']}),'right').total,7));
t('left main weight differs by dominance',()=>{assert.strictEqual(weight('5','right'),5);assert.strictEqual(weight('5','left'),6);});
t('left main right-dom = 10',()=>assert.strictEqual(lesionScore(mk({segs:['5']}),'right').total,10));
t('LM + prox LAD left-dom, bifurcation D + angle = 19+2+1',()=>assert.strictEqual(lesionScore(mk({segs:['5','6'],bif:'D',angle:true}),'left').total,22));
t('Medina A/B/C = 1, D-G = 2',()=>{['A','B','C'].forEach(k=>assert.strictEqual(lesionScore(mk({segs:['8'],bif:k}),'right').total,2+1));['D','E','F','G'].forEach(k=>assert.strictEqual(lesionScore(mk({segs:['8'],bif:k}),'right').total,2+2));});
t('trifurcation with n segments = n+2 (and suppresses bifurcation)',()=>assert.strictEqual(lesionScore(mk({segs:['8'],tri:3,bif:'D'}),'right').total,2+5));
t('total occlusion: first x5, others x2, plus extras',()=>{
  const r=lesionScore(mk({segs:['2','3'],to:true,toFirst:'2',toAge:'yes',blunt:true,nonVisible:2,side:2}),'right');
  assert.strictEqual(r.total,5+2+1+1+2+1);});
t('TO ignores length >20mm',()=>assert.strictEqual(lesionScore(mk({segs:['2'],to:true,len:true}),'right').total,5));
t('non-TO length adds 1',()=>assert.strictEqual(lesionScore(mk({segs:['8'],len:true}),'right').total,3));
t('aorto-ostial only counts for segments 1,5,6,11',()=>{
  assert.strictEqual(lesionScore(mk({segs:['8'],ostial:true}),'right').total,2);
  assert.strictEqual(lesionScore(mk({segs:['6'],ostial:true}),'right').total,8);});
t('tortuosity 2, calcification 2, thrombus 1',()=>assert.strictEqual(lesionScore(mk({segs:['8'],tort:true,calc:true,thromb:true}),'right').total,2+2+2+1));
t('left dominance: RCA weighs 0, RCA PDA hidden',()=>{assert.strictEqual(lesionScore(mk({segs:['1']}),'left').total,0);assert.ok(!visibleSegs('left').includes('4'));assert.ok(visibleSegs('left').includes('15'));assert.ok(!visibleSegs('right').includes('15'));});
t('segments invalid for dominance are ignored',()=>assert.strictEqual(lesionScore(mk({segs:['15']}),'right').total,0));
t('totals + diffuse disease (+1 per valid segment)',()=>{
  const r=totalScore([mk({segs:['6']}),mk({segs:['8']})],['7','8','15'],'right');
  assert.strictEqual(r.total,7+2+2);});
t('tier boundaries',()=>{assert.strictEqual(tier(22),'Low');assert.strictEqual(tier(23),'Intermediate');assert.strictEqual(tier(32),'Intermediate');assert.strictEqual(tier(33),'High');});
console.log(`\n${n} tests passed`);
