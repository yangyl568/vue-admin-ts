<template>
  <!-- 封装富文本组件 -->
  <div class="my-quilleditor">
    <quill-editor
      ref="myTextEditor"
      class="editor"
      :value="editorCxt"
      :options="editorOption"
      @change="onEditorChange($event)"
      @ready="onEditorReady($event)"
    />
  </div>
</template>

<script lang="ts">
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { Component, Vue, Emit, Prop } from 'vue-property-decorator'
import { quillEditor, Quill } from 'vue-quill-editor'
import { ImageExtend, QuillWatch } from 'quill-image-extend-module'

Quill.register('modules/ImageExtend', ImageExtend)
@Component({
  name: 'MyQuillEditor',
  components: {
    quillEditor
  }
})
export default class extends Vue {
  @Prop() private editorCxt!: string

  private editorOption = {
    modules: {
      // 文字 大小、颜色、居中、图片的要求。。
      toolbar: {
        container: [
          ['bold'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image'],
          [{ size: [false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, false] }],
          [{ color: [] }],
          [{ align: [] }]
        ],
        handlers: {
          image: () => { // 触发图片上传的时候返回的信息
            const tempRef: any = this.$refs.myTextEditor
            QuillWatch.emit(tempRef.quill.id) // 使用图片上传插件的统一写法
          }
        }
      },
      ImageExtend: {
        loading: true,
        name: 'file', // 图片参数名
        size: 0.4, // 可选参数 图片大小，单位为M，1M = 1024kb
        action: '/api/pub/file/upload', // 服务器地址, 如果action为空，则采用base64插入图片
        response: (res: any) => {
          const imgUrl = res.data
          console.log('imgUrl', imgUrl)
          return imgUrl
        },
        sizeError: () => {
          this.$message.error('图片过大，请压缩或切割到400k以内重试！')
        } // 图片超过大小的回调
      }
    }
  }

  /**
   * 传递富文本内容
   */
  @Emit('sendeditorcxt')
  private onEditorChange(event: any) {
    // 禁止复制粘贴图片进来，数据太大接口那边会报错
    if (event.html.indexOf(';base64,') > 0 && event.html.indexOf('data:image/') > 0) {
      this.$message.error({
        message: '上传错误，请使用正确方式上传图片，并手动删除此图片！',
        duration: 2000
      })
    }
    return event.html
  }

  private onEditorReady(event: any) {
    console.log('editor ready!', event)
  }
}
</script>

<style lang="scss">
.my-quilleditor {
  .editor {
    .ql-container {
      height: 450px;
    }
    .ql-snow .ql-picker .ql-picker-label::before,
    .ql-snow .ql-color-picker .ql-picker-label svg,
    .ql-snow .ql-icon-picker .ql-picker-label svg {
      vertical-align: top;
    }
    .ql-snow .ql-icon-picker .ql-picker-label svg {
      padding-bottom: 0;
    }
  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: "14px";
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
      content: "18px";
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
      content: "32px";
    }

    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: "文本";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: "标题1";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: "标题2";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: "标题3";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: "标题4";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: "标题5";
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: "标题6";
    }
  }
}

</style>
