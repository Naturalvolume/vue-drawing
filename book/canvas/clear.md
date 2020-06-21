## 清除画布
```javascript
clearContext(type) {
      if (!type) {
        this.context_mask.clearRect(0, 0, this.widthSize, this.heightSize)
      } else {
        this.context_mask.clearRect(0, 0, this.widthSize, this.heightSize)
        this.context.clearRect(0, 0, this.widthSize, this.heightSize)
      }
    },

```
