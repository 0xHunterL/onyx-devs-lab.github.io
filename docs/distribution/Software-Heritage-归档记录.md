# Software Heritage 代码归档记录

2026-09-13，Software Heritage Save Code Now 请求 `2473685` 以 `succeeded`／`full` 完成。访问历史返回内容寻址快照 `swh:1:snp:beec7f09ab04a666d11d120abddf542620d09e97`，独立解析快照确认其 `refs/heads/main` 精确保存采集时 GitHub `main` 的 revision `d7d6ee308e5f543e3136d3da68c2fd16f0361500`。

- 原始仓库：<https://github.com/0xHunterL/onyx-devs-lab.github.io>
- 当前快照 SWHID：[`swh:1:snp:beec7f09ab04a666d11d120abddf542620d09e97`](https://archive.softwareheritage.org/swh:1:snp:beec7f09ab04a666d11d120abddf542620d09e97/)
- 快照中的 `main`：[`swh:1:rev:d7d6ee308e5f543e3136d3da68c2fd16f0361500`](https://archive.softwareheritage.org/swh:1:rev:d7d6ee308e5f543e3136d3da68c2fd16f0361500/)
- 完整访问时间：`2026-09-13T06:09:12.547000+00:00`
- 官方访问历史：<https://archive.softwareheritage.org/api/1/origin/https://github.com/0xHunterL/onyx-devs-lab.github.io/visit/latest/?require_snapshot=true>
- 官方快照 API：<https://archive.softwareheritage.org/api/1/snapshot/beec7f09ab04a666d11d120abddf542620d09e97/>
- Save Code Now 请求：<https://archive.softwareheritage.org/api/1/origin/save/2473685/>

请求 `2473685` 的状态接口、访问历史和快照 API 三者一致：保存任务成功、访问完整，且快照的 `main` 精确指向 `d7d6ee3`。该快照证明公开源代码与 revision 69 证据资产在独立公共代码语料库中可恢复；它不代表 Software Heritage 背书，也不证明官网搜索收录、AI 检索、引用、排名或推荐。

## 历史快照

较早的请求 `2473234` 最初因 GitHub HTTP 429 失败，但提供方重试访问随后以 `full` 完成，生成快照 [`swh:1:snp:f3820205ce07ab9df33d2f0db735bc4b25ca0347`](https://archive.softwareheritage.org/swh:1:snp:f3820205ce07ab9df33d2f0db735bc4b25ca0347/)，其中 `main` 指向 revision [`40d2c1d`](https://archive.softwareheritage.org/swh:1:rev:40d2c1d369ec835c5012256a6f2f84964e01305b/)。访问于 `2026-09-13T03:50:50.672000+00:00` 完成；请求对象当时仍保留首次失败状态，因此成功判断来自完整访问记录和独立快照解析。

2026-09-12，请求 `2472540` 以 `succeeded`／`full` 完成，保存了此前的功能性检查点。

- 原始仓库：<https://github.com/0xHunterL/onyx-devs-lab.github.io>
- 快照 SWHID：[`swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578`](https://archive.softwareheritage.org/swh:1:snp:a6d10e9586fcc1860acf66f32651994693d87578/)
- 快照中的 `main`：[`swh:1:rev:a2d9281d23f406cd7ab1b19ed62d0e4c2e6fadfc`](https://archive.softwareheritage.org/swh:1:rev:a2d9281d23f406cd7ab1b19ed62d0e4c2e6fadfc/)
- revision 49 标签：`refs/tags/geo-monitor-evidence-2026-09-12-49` → `93ad58598177fe15210d00b3e2802fbc99566720`
- 官方请求状态：<https://archive.softwareheritage.org/api/1/origin/save/2472540/>
- 官方快照 API：<https://archive.softwareheritage.org/api/1/snapshot/a6d10e9586fcc1860acf66f32651994693d87578/>

该快照独立保存截至 `a2d9281` 的功能性公开源代码、revision 49 证据资产、Git 历史、`CITATION.cff`、CodeMeta、主题站关系、Internet Archive 证据、扫描器分类和 Common Crawl 重试逻辑，并提供内容寻址的永久标识。其后的提交可以只更新快照关系本身，不把内容寻址快照误称为仓库当前 HEAD。它证明这些材料在该快照中可恢复，不代表 Software Heritage 认可 Onyx 的服务、案例主张或搜索表现，也不证明 `hk.onyxdevslab.com` 已被任何搜索引擎或 AI 产品收录、引用或推荐。

自动门禁 `npm run geo:check-offsite` 会同时核验当前与历史快照存在，并确认各快照中的 `refs/heads/main` 指向对应的不可变 Git revision。

上一功能性归档请求 `2470710` 仍可通过[历史快照](https://archive.softwareheritage.org/swh:1:snp:df2409f12f9b01e665ae896d0492aa09148b9c1b/)复核，当时 `main` 指向 revision `f17606cf302d4e1368eae3f2a76c295af61384ad`。首个完整归档请求 `2469052` 的[历史快照](https://archive.softwareheritage.org/swh:1:snp:6eeeed9ca3ffbfeaa487a39205076233f4836f3b/)则指向 `dcd56f7f38f39cd68b3e36571c8a5c6f1940184e`。旧 SWHID 保留为历史证据，不再作为网站当前状态的规范归档关系。
