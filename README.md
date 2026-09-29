# 李思成个人网站

一个无需数据库、账号或第三方依赖的双语静态网站。首页、研究成果、项目经历、课程修读、荣誉奖励共五页。个人与成果内容位于 `content/site.json`，课程位于 `content/courses.json`，修改后重新构建即可。

## 文件说明

| 路径 | 用途 |
| --- | --- |
| `content/site.json` | 姓名、ORCID、简介、研究方向、教育、论文、专利、项目、竞赛、荣誉、奖学金、任职和培训的中英文内容 |
| `content/courses.json` | 本科和硕士各学期课程、内部学分数据及重点课程成绩 |
| `assets/profile.jpg` | 首页个人照片，直接替换同名文件即可 |
| `assets/mark.svg` | 页眉与浏览器标签使用的抽象节点标识，可直接替换为自己的 SVG |
| `assets/projects/*.webp` | 五项项目的主题概念插图，展示在项目经历页面 |
| `assets/site.css` | 字体、颜色、排版和移动端布局 |
| `assets/site.js` | 中英文切换与页脚年份 |
| `build.mjs` | 从内容文件生成五个 HTML 页面并复制资源 |
| `dist/` | 可直接托管的完整网站；每次构建会覆盖其中的五个页面与所需资源 |
| `.openai/hosting.json` | 当前 Sites 项目的托管配置；不要更改已有 `project_id` |

## 修改内容

用文本编辑器打开 `content/site.json` 或 `content/courses.json`。多数可见文字以 `zh` 和 `en` 两个字段保存，请同时修改两种语言。JSON 的逗号和双引号必须保留，不能加入注释。

例如，修改首页简介：

```json
"intro": {
  "zh": "新的中文简介。",
  "en": "A new English introduction."
}
```

- 研究方向：修改 `focus` 数组的 `title`、`description`；首页会按数组顺序自动排列。
- 论文：修改 `publications` 数组。每篇有年份、类型、英文题目、作者、刊物、摘要、推荐引用 `citation` 和可选链接。`url` 为空字符串时不会显示“查看论文”按钮。出版状态请在 `type` 中同步更新。
- 专利：修改 `patents` 数组。授权状态、公开号和链接可以独立更新。
- 项目：修改 `projects` 数组；`number` 用于左侧编号和项目图标的顺序，`tags` 是标签列表。`image` 指向项目插图，可选的 `publicationUrl` 会生成“阅读相关论文”链接。新增图片时，将文件放入 `assets/projects/` 并在 `image` 写入相对路径。
- 竞赛与荣誉：分别修改 `awards`、`honors`。竞赛条目的 `category` 使用 `mathematics`、`english` 或 `innovation`，分别对应数学、英语、科创三个分组；`year` 使用 `YYYY.MM` 格式。奖学金、学生工作任职和培训分别在 `scholarships`、`service`、`training`。继续添加同格式对象即可，页面会自动延长。
- 教育与个人信息：修改 `education` 和 `profile`。邮箱会同时出现在首页与页脚，ORCID 位于首页与页脚。
- 课程：在 `content/courses.json` 中按 `master`、`undergraduate` 和 `terms` 维护。每门课程的 `name.zh`、`name.en` 是页面展示的名称；`credits` 只用于自动计算学期总学分，不会逐门显示。`highlights` 单独维护重点课程名称与 `score`。新增课程时同步填写中英文名称和学分。
- 导航、栏目标题和布局文字写在 `build.mjs` 中；如需新增整个栏目或页面，再修改模板。

## 替换照片

把你选定的照片保存为 `assets/profile.jpg`，保留这个文件名，然后重新构建。首页以纵向画框展示，使用 CSS `object-fit: cover` 居中裁切；推荐提供清晰的竖向人像。如果脸部位置偏上或偏下，可在 `assets/site.css` 搜索 `.hero-portrait img`，调整 `object-position`。当前使用的是你上传的正装照片 `李思成.jpg`。

## 本地构建与预览

需要 Node.js 18 或更新版本，无需安装 npm 包。

```bash
node build.mjs
python3 -m http.server 8000 --directory dist
```

然后在浏览器访问 `http://localhost:8000`。也可以直接打开 `dist/index.html`，但通过本地服务器更接近正式托管环境。每次修改内容 JSON、CSS、JS 或图片后，重新运行 `node build.mjs` 并刷新页面。

项目插图按卫星故障分析、结构稳定性、知识引导识别、嵌入式处理和移动机器人五个主题生成，属于概念画面，不是实验图表或实物照片。生成提示统一指定宽版科学编辑插画风格、紫金与蓝灰配色，并要求画面不含文字、标志和具体数据。替换时推荐继续使用接近 16:10 的横向图片。

## 发布与迁移

此项目已连接现有的公开 Sites 网站。修改源码后需要重新构建和发布；在本对话中提供改动或让我继续修改时，我可以发布到同一个网址。你也可以将整个 `dist/` 目录部署到支持静态网站的托管服务。五个页面分别是 `index.html`、`research.html`、`projects.html`、`courses.html` 和 `honors.html`，页面之间使用相对链接，无服务端依赖。

发布前请复核论文的最新发表状态、奖项名称以及你希望公开的个人信息。网站的联系入口为邮箱与 ORCID；课程页仅在重点课程区显示所选课程成绩，不展示电话、生日或成绩排名。
