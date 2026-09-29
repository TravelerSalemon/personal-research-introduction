# 使用完整源码维护 GitHub Pages 网站

本包包含可编辑内容、页面生成程序、图片和当前生成结果。网站为纯静态页面，不需要安装依赖。不要仅编辑 `dist/*.html`：下次构建会覆盖它们。

## 首次上传

1. 在 GitHub 创建公开仓库 `personal-research-introduction`（若已创建则使用已有仓库）。
2. 将本压缩包**解压后的全部内容**上传到仓库根目录，保留 `.github/workflows/deploy-pages.yml` 和 `assets/`、`content/`、`dist/` 的目录结构。不要把 ZIP 本身或外层文件夹上传为仓库根目录下的一个文件/文件夹。如果之前上传过仅供发布的页面文件，可删除仓库根目录旧的 `index.html` 等页面；这份源码的生成页面在 `dist/` 中。
3. 到仓库的 Settings → Pages，将 Build and deployment → Source 设为 **GitHub Actions**。如果原来设成 Deploy from a branch，必须改成 GitHub Actions。
4. 打开 Actions 查看 `Build and deploy website` 工作流。成功后在 Settings → Pages 点击 Visit site。预期地址：`https://你的用户名.github.io/personal-research-introduction/`。

## 修改内容

- `content/site.json`：简介、研究方向、教育、论文、项目、荣誉和任职等。可在 GitHub 网页中点击文件，再点击铅笔图标编辑。中文和英文分别在 `zh`、`en` 字段。
- `content/courses.json`：本科与硕士课程、学期、重点课程与成绩。每门课的 `credits` 用于自动计算学期总学分，普通课程列表不会显示单门成绩或学分。
- `assets/site.css`：外观与响应式布局；`assets/site.js`：中英文切换；`assets/profile.jpg`：头像；`assets/projects/`：项目配图。
- `build.mjs`：页面结构、导航及内容生成。只有需要调整页面布局或栏目时才改它。

修改后提交到 `main`，GitHub Actions 会运行 `node build.mjs` 并发布新的 `dist/`。你也可以在本地安装 Node.js 18+，运行 `node build.mjs`，再打开 `dist/index.html` 检查生成结果。这里使用相对链接，适用于仓库子路径 `/personal-research-introduction/`。

`dist/` 是当前可直接打开的生成结果，也一并提供供检查；以后以 `content/`、`assets/`、`build.mjs` 为编辑源。`.openai/hosting.json` 用于原网站托管，对 GitHub Pages 构建无影响。
