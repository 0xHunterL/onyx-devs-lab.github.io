import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { caseNarrativesZh } from '../src/data/caseNarratives.js';
import { caseAnalysisZh, methodologyGroups } from '../src/data/caseAnalysis.js';
import { caseOutcomesZh } from '../src/data/caseOutcomes.js';
import { caseMetricsZh } from '../src/data/caseMetrics.js';
const root = path.resolve(import.meta.dirname,'..');
const dest = path.join(root,'relay/assistants/onyx-wecom');
const source = fs.readFileSync(path.join(root,'src/App.jsx'),'utf8');
const translations = vm.runInNewContext(source.slice(source.indexOf('const translations ='),source.indexOf('const teamMeta ='))+'; translations');
const team = vm.runInNewContext(source.slice(source.indexOf('const teamMeta ='),source.indexOf('// Chinese labels'))+'; teamMeta');
const workMeta = vm.runInNewContext(source.slice(source.indexOf('const workMeta ='),source.indexOf('// Portfolio taxonomy'))+'; workMeta');
const portfolioCopy = vm.runInNewContext(source.slice(source.indexOf('const portfolioCopy ='),source.indexOf('const experienceCopy ='))+'; portfolioCopy');
const experienceCopy = vm.runInNewContext(source.slice(source.indexOf('const experienceCopy ='),source.indexOf('const useScrollReveal ='))+'; experienceCopy');
const productSource = fs.readFileSync(path.join(root,'src/components/products/DevelopmentPartner.jsx'),'utf8');
const product = vm.runInNewContext(productSource.slice(productSource.indexOf('const content ='),productSource.indexOf('const icons ='))+'; content');
const json = value => JSON.stringify(value,null,2);
const files = ['src/App.jsx','src/components/products/DevelopmentPartner.jsx','src/data/caseNarratives.js','src/data/caseAnalysis.js','src/data/caseOutcomes.js','src/data/caseMetrics.js','dist/llms-full.txt','public/llms.txt'];
let overview = '# 最新官网主页事实\n来源：https://hk.onyxdevslab.com/ （对应本仓当前官网版本）\n';
for (const key of ['hero','philosophy','painpoints','services','cta','footer']) overview += '\n## '+key+'\n'+json(translations.zh[key])+'\n';
overview += '\n## 团队公开成员\n'+json(team.map((m,i)=>({...m,...translations.zh.team.members[i]})))+'\n';
overview += '\n## 全部项目索引\n'+json(translations.zh.work.items.map((p,i)=>({id:workMeta[i].id,...p})))+'\n';
overview += '\n## 合作分类及经验方法\n'+json({portfolio:portfolioCopy.zh,experience:experienceCopy.zh})+'\n';
overview += '\n## 微信开发搭档\n'+json(product.zh)+'\n';
fs.writeFileSync(path.join(dest,'prompt.md'),fs.readFileSync(path.join(dest,'policy.md'),'utf8')+'\n\n'+overview);
let pages = '';
for(const [language,t] of Object.entries(translations)){
 for(const [key,value] of Object.entries(t)){
  if(key==='work')continue;
  pages += '\n## 官网主页 '+language+' '+key+'\n来源：https://hk.onyxdevslab.com/\n'+json(value)+'\n';
 }
 for(const [i,p] of t.work.items.entries())pages += '\n## 项目 '+language+' '+p.title+' '+workMeta[i].id+'\n'+json({id:workMeta[i].id,...p})+'\n';
}
for(const [id,narrative] of Object.entries(caseNarrativesZh))pages+='\n## 项目案例详解 '+id+'\n'+json({narrative,analysis:caseAnalysisZh[id],outcomes:caseOutcomesZh[id],metrics:caseMetricsZh[id]})+'\n';
pages+='\n## 微信开发搭档各语言公开详情\n'+json(product)+'\n';
pages+='\n## FDE 交付方法及案例分类\n'+json({methodologyGroups,portfolioCopy,experienceCopy})+'\n';
fs.writeFileSync(path.join(dest,'knowledge/homepage-and-cases.md'),pages);
const full = fs.readFileSync(path.join(root,'dist/llms-full.txt'),'utf8');
// Preserve headings for retrieval, and split long sections into bounded passages.
let sections='',heading='公开官网资料',part=1,body='';
const flush=()=>{if(body.trim())sections+='\n## '+heading+' / '+part+++'\n'+body.trim()+'\n';body='';};
for(const line of full.split('\n')){if(/^#{1,4} /.test(line)){flush();heading=line.replace(/^#+ /,'');part=1;}if(body.length+line.length>3500)flush();body+=line+'\n';}flush();
fs.writeFileSync(path.join(dest,'knowledge/public-pages.md'),sections);
fs.copyFileSync(path.join(root,'public/llms.txt'),path.join(dest,'knowledge/site-index.md'));
const manifest={schema:1,generated_at:new Date().toISOString(),source_commit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),public_origin:'https://hk.onyxdevslab.com',project_count:translations.zh.work.items.length,source_files:files.map(file=>({file,sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')})),knowledge_files:['homepage-and-cases.md','public-pages.md','site-index.md']};
fs.writeFileSync(path.join(dest,'knowledge-manifest.json'),json(manifest)+'\n');
console.log(JSON.stringify({projects:manifest.project_count,knowledge_bytes:fs.readdirSync(path.join(dest,'knowledge')).reduce((n,p)=>n+fs.statSync(path.join(dest,'knowledge',p)).size,0)}));
