## 页面布局
页面非常简单，类似于后台管理布局，只是没有侧边栏
### 一、整体布局
整个页面分成菜单栏和画板，要让它们固定在页面中，且能随着页面大小自适应变化。
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
使用flex实现
```html
<div class="tabbar">
    <div class="tab-container">
      <div class="title">
        {{title}}
      </div>
      <div v-for="tab in tabs" :key='tab.title'>
          <!-- 单独给v-for循环的某个元素绑定方法 -->
          <div class='button-item'><span class="iconfont">{{tab.icon}}</span></div>
        <!-- 别忘了用字体库时要加class -->
      </div>
    </div>

    <div class="tools-container">
      <div v-for="tool in tools" :key='tool.title'>
          <!-- 动态绑定样式，注意要加中括号 -->
          <div :class="[{'selected':tool.ischoose},'button-item']"  @click='drawType(tool)'><span class="iconfont">{{tool.icon}}</span></div>
      </div>
    </div>
  </div>
```
```css
.tabbar {
  box-sizing: border-box;
  display: flex;
  position: relative;
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
```html
<div class="drawing-wrapper" :style="{cursor: curcursor}">
    <canvas id="canvas" ref="canvas"></canvas>
    <canvas id="canvas_mask" ref="canvas_mask"></canvas>
  </div>
```
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
    width: 90%;
    height: 90%;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color:yellow;
  }
```
