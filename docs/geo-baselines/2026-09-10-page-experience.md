# Onyx 首页移动端页面体验基线：2026-09-10

## 复测环境

- URL：<https://hk.onyxdevslab.com/>
- Lighthouse：13.4.1，移动端默认节流配置
- 浏览器：本机 Google Chrome，无登录状态
- 命令：`npx --yes lighthouse@latest https://hk.onyxdevslab.com/ --only-categories=performance,accessibility,best-practices,seo --output=json`

## 修复前

- Performance：96
- Accessibility：96
- Best Practices：96
- SEO：100
- FCP：2.2 秒
- LCP：2.2 秒
- CLS：0
- TBT：0 毫秒
- 低对比节点：7 个，全部位于深色页脚；普通文本为 `#6b7280`，较小文本为 `#4b5563`。

## 修复后

- Performance：99
- Accessibility：100
- Best Practices：96
- SEO：100
- FCP：1.6 秒
- LCP：1.6 秒
- CLS：0
- TBT：0 毫秒
- 低对比节点：0
- 375 像素视口：`scrollWidth = innerWidth = 375`，没有横向溢出。

两次实验的网络与 CPU 状态可能不同，因此 Performance 的单次分数与 FCP／LCP 变化只作为当时快照，不声明稳定提升。Accessibility 从 96 到 100 由相同工具识别的 7 个低对比节点归零直接支持。

Best Practices 剩余扣分来自测试环境无法连接 Cloudflare Browser Insights beacon 的 `ERR_TUNNEL_CONNECTION_FAILED`；站点自身核心 HTML、CSS、JavaScript 和图片均成功加载。这不是搜索收录、AI 引用或推荐证据。

