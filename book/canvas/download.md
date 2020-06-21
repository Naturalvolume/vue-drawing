## 下载图片
下载图片采用超链接的方式，在html中增加一个超链接`<a>`，用`href='javascript:void(0);'`阻止默认的跳转动作，`download`指定图片名称，设置`v-show`不显示，这个只做为辅助，并不显示在页面上。
```html
<a ref='download' href='javascript:void(0);' download='image.png' v-show='false'></a>
```
点击按钮调用下载图片函数，把超链接地址设为画布的url地址，再发起点击事件下载图片。
```javascript
  // 自定义下载画板图片
    downloadImage() {
      // 将连接的地址改成图片的地址
      this.$refs.download.href = this.canvas.toDataURL()
      // 再触发点击事件，连接发现不能是可以跳转的格式，就会自动下载
      this.$refs.download.click()
    }
```
