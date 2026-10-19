# 沈阳鑫龙成门业 · Apple Glass 网站

静态门业网站，覆盖产品、案例、新闻、解决方案、关于与联系页面。页面无需构建即可部署；`tools/` 仅用于内容迁移与质量检查。

## 页面与设计系统

- 首页：`index.html`
- 产品中心：`a/chanpin/`
- 产品详情：`a/chanpin/{分类}/2018/0913/{id}.html`
- 成功案例：`a/chenggonganli/`
- 新闻动态：`a/xinwendongtai/`
- 解决方案：`a/jiejuefangan/`
- 关于我们：`a/guanyuwomen/`
- 联系我们：`a/lianxiwomen/`
- 设计规范：`DESIGN-SYSTEM.md`
- 组件预览：`design-system.html`
- 视觉截图：`docs/screenshots/`

## 技术要点

- 全站仅加载：
  - `skin/css/site.css`
  - `skin/js/site.js`
- 无 jQuery、无 UI 框架、无外部字体、无 Flutter Web 运行时。
- Apple Glass 设计令牌、玻璃材质、卡片、导航、响应式与明暗主题集中在 `skin/css/site.css`。
- 导航、产品大菜单、筛选/搜索、移动抽屉、指针镜面高光集中在 `skin/js/site.js`。
- 旧模板 CSS/JS 已移除；原始文件位于项目外的备份目录 `E:\hermes\门业网站-backup-20261019`。

## 本地预览

```powershell
# 在项目根目录
python -m http.server 8088 --bind 0.0.0.0
```

本机访问 `http://127.0.0.1:8088/`；同一 Wi-Fi 下可用本机局域网 IP 加 `:8088` 访问。

## 重新生成页面

```powershell
python tools/build_site.py
python tools/build_sitemap.py
```

生成器从旧站备份读取内容，保留 URL 与原始文案，并渲染统一页头、页脚、主视觉、玻璃卡片和文章布局。依赖：Python 3、`lxml`、`Pillow`。

## 质量检查

```powershell
python tools/check_site.py
```

检查项：标题、description、canonical、viewport、H1 数量、页头页脚、缺失链接、缺失图片、旧模板 CSS/JS 引用。

## 关于 liquid_glass_widgets

参考：[sdegenaar/liquid_glass_widgets](https://github.com/sdegenaar/liquid_glass_widgets)

该库是 Flutter 组件库，不能直接嵌入当前静态 HTML 站点。本项目按它的视觉语言做了 Web 原生适配：

- 半透明玻璃层 + `backdrop-filter`
- 边缘高光与多层阴影
- 页面环境光与折射感
- 指针位置驱动的镜面高光
- 浮动玻璃页头、抽屉、卡片与快捷栏

未引入 Flutter Web 运行时，避免破坏现有 SEO 与加载性能。

## 部署前需要确认

1. `sitemap.xml` 与 `robots.txt` 中的站点域名已指向 `https://firstlook0112.github.io`。如未来绑定自定义域名，请同步替换。
2. 页面 canonical 使用相对路径，在 GitHub Pages 用户站点根目录下可正确解析；绑定自定义域名后可改为绝对 URL。
3. 如启用 gzip/brotli，`site.css` 传输体积会显著降低。
4. 生产服务器需为静态文件配置合理的 `Cache-Control`；修改 `CSS_VERSION` / `JS_VERSION` 后再发布。
5. 咨询表单尚未接入后端，联系页使用电话、微信、到厂等真实路径。
6. 玻璃模糊效果建议在低端设备实测帧率；`prefers-reduced-transparency` 下已自动回退为实色面板。
