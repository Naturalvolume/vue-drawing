## 项目架构
本项目非常简单，就是一个简单的在线画板，整个网页只分为两个组件，头部菜单栏和画板，项目结构为（根目录为src）：
- main.js：新建vue实例，整个项目的根文件
- App.vue：挂载在vue实例上的，根元素
- components
  - tab.vue：顶部菜单栏组件
  - drawing.vue：画板组件
- assets
  - global-style.css：全局样式
### 全局样式
在正式布局之前，先设置好页面的全局样式，在`global-style.css`中写入
```css
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
body,
form,
fieldset,
input,
textarea,
blockquote,
p {
  padding: 0;
  margin: 0;
}
textarea {
  padding: 5px 11px;
  border: 1px solid #ccc;
}
textarea::placeholder {
  color: #ccc;
}
a {
  color: #000;
  text-decoration: none;
}
li {
  list-style-type: none;
}
img {
  vertical-align: top;
  border: 0;
}
ol,
ul {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

th,
td {
  padding: 0px;
}
/* 定义字体，在阿里图标库中生成，使用unicode类型 */
@font-face {
  font-family: 'iconfont';
  src: url('./icon-font/iconfont.eot');
  src: url('./icon-font/iconfont.eot?#iefix') format('embedded-opentype'),
      url('./icon-font/iconfont.woff2') format('woff2'),
      url('./icon-font/iconfont.woff') format('woff'),
      url('./icon-font/iconfont.ttf') format('truetype'),
      url('./icon-font/iconfont.svg#iconfont') format('svg');
}
/* 设置字体格式 */
.iconfont {
  /* 字体类别为上面定义的iconfont */
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
