## 页面布局
画板页面非常简单，类似于后台管理布局，只是没有侧边栏
### 一、整体布局
整个页面分成菜单栏和画板，让它们固定在页面中间，不会有滚动轴，且能随着页面大小自适应变化，在App.vue中定义整体布局
```html
<div id="app">
  <!-- 菜单栏 -->
  <div class="tab-container"></div>
  <!-- 画板 -->
  <div class="drawing-container"></div>
</div>
```
这里有两种方式实现页面固定的自适应布局
### 1.fixed ＋ absolute
```css
#app {
  /* 固定布局实现固定在视口 */
  position: fixed;
  background-color: blue;
  /* 这里实现占满整个视口，注意要设置width、height，只设置top left不能实现这样的效果 */
  width: 100%;
  height: 100%;
  /* top: 0;
  left: 0; */
}
.tab-container {
  height: 60px;
  width: 100%;
  background-color:red;
}
.drawing-container {
  width: 100%;
  /* 相对于父元素 */
  position: absolute;
  /* 设置top bottom实现占满页面 */
  top: 60px;
  bottom: 0;
  background-color: aqua;
}
```
### 2. flex
flex是非常好用的一种布局，可以代替float、absolute等布局，在本项目中用到的`flex:1`，代表有元素随着剩余空间的大小变化，吸收掉所有的剩余空间（不论是否超过元素本身的代表）。
```css
#app {
  /* 在根元素中使用flex，才能在子元素中用flex:1吸收剩余元素 */
  display: flex; */
  /* 这个方向决定了 flex:1 吸收的方向 */
  flex-direction: column;
  /* 这里实现占满整个视口，注意要设置width、height*/
  width: 100%;
  height: 100%;
}
.tab-container {
  height: 60px;
  width: 100%;
  background-color:red;
}
.drawing-container {
  width: 100%;
  /* flex: 1 吸收剩余空间 */
  display: flex;
  flex: 1;
  background-color: aqua;
}
```
### 二、菜单栏布局
菜单栏左边为按钮栏，包括清除画板、下载画布、选择颜色三个按钮；菜单栏右边为选择画板样式按钮，包括线宽、线型、铅笔、直线、曲线、矩形、圆形、填充、橡皮。

菜单栏使用flex实现：
```html
<div class="tabbar">
    <div class="tab-container">
      <div class="title">
        {{title}}
      </div>
      <div v-for="tab in tabs" :key='tab.title'>
          <!-- 别忘了用字体库时要加 class="iconfont" -->
        <div class='button-item'><span class="iconfont">{{tab.icon}}</span></div>
      </div>
    </div>

    <div class="tools-container">
      <div v-for="tool in tools" :key='tool.title'>
          <!-- 动态绑定样式，注意要加中括号 -->
          <div :class="[{'selected':tool.ischoose},'button-item']"><span class="iconfont">{{tool.icon}}</span></div>
      </div>
    </div>
  </div>
```
工具栏的按钮数据如下
```javascript
export default {
  data() {
    return {
      title: 'Drawing',
      // 按钮
      tabs: [
        {
          icon: '\ue67b',
          title: '清除',
          fun: 'clear'
        },
        {
          icon: '\ue6df',
          title: '保存',
          fun: 'download'
        },
        {
          icon: '\ue60a',
          title: '选择颜色',
          fun: 'select'
        }
      ],
      // 工具
      tools: [
      {
        icon: '\ue60a',
        title: '铅笔',
        fun: 'pencil',
        // 默认铅笔被选择
        isChoose: true
      },
      {
        icon: '\ue668',
        title: '直线',
        fun: 'line',
        isChoose: false
      },
      {
        icon: '\ue668',
        title: '曲线',
        fun: 'quadratic',
        isChoose: false
      },
      {
        icon: '\ue61a',
        title: '圆形',
        fun: 'circle',
        isChoose: false
      },
      {
        icon: '\ue6f0',
        name: '矩形',
        fun: 'square',
        isChoose: false
      },
      {
        icon: '\ue611',
        title: '填充',
        fun: 'handwriting',
        isChoose: false
      },
      {
        icon: '\ue6c2',
        title: '橡皮',
        fun: 'rubber',
        isChoose: false
      }

    ]
  }
}
```
要注意给按钮添加点击效果：
1. 利用伪类`:active`给菜单栏`tab-container`中的按钮添加点击改变颜色效果（只在点击时改变颜色）
```css
.tab-container :active {
  background-color: #b0bec5;
}
```
2. 给工具栏绑定动态样式，当`tool.ischoose`属性为`true`时，显示被选择样式，同时`button-item`的样式也是在的，这是vue专门用来动态绑定多个样式的格式
```html
<div :class="[{'selected':tool.ischoose},'button-item']"></div>
```
总体的css布局如下
```css
.tabbar {
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;

  width: 100%;
  height: 100%;
  padding: 10px 30px;
  background-color: #546e7a;
}
.tab-container, .tools-container {
  /* 尤其是高度，好像不设置高度占100%，它就会自由发挥，超出限制 */
  height: 100%;
  display: flex;
  align-items: center;
}
/* 设置菜单按钮的点击效果，只在点击时改变按钮颜色 */
.tab-container :active {
  background-color: #b0bec5;
}
.title {
  font-size: 20px;
  margin-right: 10px;
  /* color就是设置成了内容物的颜色，包括字体 */
  color: #eceff1;
}
.button-item {
  border: 1px solid #afd;
  text-align: center;
  margin-right: 2px;
}
span {
  font-size: 16px;
  /* margin: 20px;   仅仅设置margin，不设置block块盒，会导致只吸收左右margin，上下的margin不会改变，因为这是inline元素 */
  display: block;
  margin: 5px;
}

.selected {
  /* 设置被选择样式，最后加 important表明优先级最高 */
  background: rgba(196, 56, 56, 0.35) !important;
}
```
### 三、画板布局
在画板区域需要用到两个完全一样的`canvas`，一个作为最终呈现的画板容器，一个作为画单个图形的画板，这里可能还不理解为什么要这样，在讲到画图时会说。
```html
<div class="drawing-wrapper">
    <canvas id="canvas"></canvas>
    <canvas id="canvas_mask"></canvas>
  </div>
```
注意啦！不要在这里定义`canvas`的宽高，因为这里设置的不是真正想设置到的画板宽高，查了一些资料，但是讲的都不是很明确，我个人是这样理解的，`canvas`默认宽高为`300*150`（相当于定义在行内），在css中定义的宽高，是设置到了`canvas`的上一层上，如果设置的宽高比例不是默认的比例，就会造成扭曲，最后画出来的图形坐标也是不对的。
```css
.drawing-wrapper {
    /* 用绝对定位的优势出来了，完全不用设置margin padding */
    position: relative;
    width: 100%;
    height: 100%;
    background-color: gray;
  }
  canvas {
    /* 绝对定位元素居中，定宽、margin:auto，left right 0缺一不可 */
    position: absolute;
    /* 绝对不要在这里定义宽高，要设置行内宽高 */
    /* width: 90%;
    height: 90%; */
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color:yellow;
  }
```
对于如何设置`canvas`宽高，在接下来的章节中会涉及到。
