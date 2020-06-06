<template>
  <div class="tabbar">
    <div class="tab-container">
      <div class="title">
        <!-- {{this.okfine}} -->
        <div>
          {{ok}}
        </div>
      </div>
      <div class="button" v-for="tab in tabs" :key='tab.title'>
          <!-- unicode直接在标签中使用，可以识别这是unicode编码
            在对象中使用再引入，因为js只能chuliUCS-2编码，所以在遍历过程中不能识别unicode编码
            索引在使用前，要先转码
          -->
          <div><span class="iconfont">{{tab.icon}}</span></div>
        <!-- 别忘了用字体库时要加class -->
      </div>
    </div>
    <div class="tools-container">
      <div class="button" v-for="tool in tools" :key='tool.title'>
          <!-- unicode直接在标签中使用，可以识别这是unicode编码
            在对象中使用再引入，因为js只能chuliUCS-2编码，所以在遍历过程中不能识别unicode编码
            索引在使用前，要先转码
          -->
          <div><span class="iconfont">{{tool.icon}}</span></div>
        <!-- 别忘了用字体库时要加class -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab',
  props: ['ok'],
  data() {
    return {
      title: 'Kathy is so beautify',
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
      tools: [
      {
        icon: '\ue60a',
        title: '铅笔',
        fun: 'pencil',
        ischoose: false
      },
      {
        icon: '\ue668',
        title: '直线',
        fun: 'line',
        ischoose: false
      },
      {
        icon: '\ue61a',
        title: '圆形',
        fun: 'circle',
        ischoose: false
      },
      {
        icon: '\ue6f0',
        name: '矩形',
        fun: 'square',
        ischoose: false
      },
      {
        icon: '\ue611',
        title: '填充',
        fun: 'handwriting',
        ischoose: false
      },
      {
        icon: '\ue6c2',
        title: '橡皮',
        fun: 'rubber',
        ischoose: false
      }

    ]
    }

  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabbar {
  /* 别忘了设置包围盒类型 */
  box-sizing: border-box;
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  padding: 10px 30px;
  background-color: #546e7a;
}
.tab-container, .tools-container {
  display: flex;
  align-items: center;
}
.title {
  font-size: 20px;
  margin-right: 10px;
  color: #eceff1;
}
button {
  font-size: 16px;
  padding: 5px 10px;
  margin: 0 5px;
}
span {
  margin-right: 10px;
}
</style>
