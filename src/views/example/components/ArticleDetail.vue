<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <CommentDropdown v-model="postForm.comment_disabled" />
        <PlatformDropdown v-model="postForm.platforms" />
        <SourceUrlDropdown v-model="postForm.source_uri" />
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          发布
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">
          存稿
        </el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>
          <Warning />

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label-width="60px" label="作者:" prop="author" class="postInfo-container-item">
                    <el-input v-model="postForm.author" :disabled="true" />
                    <!-- <el-select v-model="postForm.author" :remote-method="getRemoteUserList" filterable default-first-option remote placeholder="Search user">
                      <el-option v-for="(item,index) in userListOptions" :key="item+index" :label="item" :value="item" />
                    </el-select> -->
                  </el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item label-width="120px" label="创建时间:" prop="createTime" class="postInfo-container-item">
                    <el-date-picker v-model="displayTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="Select date and time" @change="changeTime" />
                  </el-form-item>
                </el-col>

                <el-col :span="9">
                  <el-form-item label-width="90px" label="标签:" prop="tags" class="postInfo-container-item">
                    <el-tag
                      v-for="tag in tagArr"
                      :key="`item_${tag}`"
                      closable
                      :disable-transitions="false"
                      @close="handleClose(tag)"
                    >
                      {{ tag }}
                    </el-tag>
                    <el-input
                      v-if="inputVisible"
                      ref="saveTagInput"
                      v-model="inputValue"
                      class="input-new-tag"
                      size="small"
                      @keyup.enter.native="handleInputConfirm"
                      @blur="handleInputConfirm"
                    />
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                    <!-- <el-rate
                      v-model="postForm.importance"
                      :max="3"
                      :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                      :low-threshold="1"
                      :high-threshold="3"
                      style="display:inline-block"
                    /> -->
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item style="margin-bottom: 40px;" label-width="60px" prop="subtitle" label="摘要:">
          <el-input v-model="postForm.subtitle" :rows="1" type="textarea" class="article-textarea" autosize placeholder="Please enter the content" />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}words</span>
        </el-form-item>

        <el-form-item prop="content" style="margin-bottom: 30px;">
          <!-- <Tinymce ref="editor" v-model="postForm.content" :height="400" /> -->
          <mavon-editor
            ref="md"
            v-model="postForm.content"
            class="mavonBox"
            code-style="atom-one-dark"
            @imgAdd="imgAddHandle"
            @imgDel="imgDelHandle"
          />

        </el-form-item>

        <el-form-item style="margin-bottom: 30px;">
          <Upload v-model="postForm.thumbnail" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/SingleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validURL } from '@/utils/validate'
import {
  getArticle,
  crtArticle,
  updateArticle,
  uploadImg
} from '@/api/article'
import { searchUser } from '@/api/remote-search'
import Warning from './Warning'
import {
  CommentDropdown,
  PlatformDropdown,
  SourceUrlDropdown
} from './Dropdown'
import 'mavon-editor/dist/css/index.css'
// import { fromatDate } from '../../../utils'

const defaultForm = {
  status: 'draft',
  title: '', // 文章题目
  author: 'Qin', // 文章作者
  createTime: null, // 前台展示时间
  tags: '',
  content: '', // 文章内容
  subtitle: '', // 文章摘要
  source_uri: '', // 文章外链
  thumbnail: '', // 文章图片
  id: undefined
  // platforms: ['a-platform'],
  // comment_disabled: false,
  // importance: 0
}

export default {
  name: 'ArticleDetail',
  components: { MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('标题不能为空'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    const validateTags = (rule, value, callback) => {
      if (!value) {
        // this.$message({
        //   message: '为必传项',
        //   type: 'error'
        // })
        callback(new Error('至少添加一个标签'))
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      inputVisible: false,
      inputValue: '',
      tagArr: [], // 用于显示
      userListOptions: [],
      img_file: {},
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ required: true, message: '请输入作者名字', trigger: 'blur' }],
        createTime: [{ type: 'date', required: true, message: '请选择创建日期', trigger: 'change' }],
        tags: [{ validator: validateTags }],
        subtitle: [{ required: true, message: '请输入摘要', trigger: 'blur' }],
        // thumbnail: [{ validator: validateRequire }],
        content: [{ validator: validateRequire, trigger: 'blur' }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.subtitle.length
    },
    displayTime: {
      // set and get is useful when the data
      // returned by the back end api is different from the front end
      // back end return => "2013-06-25 06:59:25"
      // front end need timestamp => 1372114765000
      get() {
        return (+new Date(this.postForm.createTime))
      },
      set(val) {
        this.postForm.createTime = new Date(val)
      }
    }
  },
  watch: {
    tagArr(newVal) {
      const arr = newVal
      this.postForm.tags = arr.toString()
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      // console.log(id, 5e3)
      this.fetchData(id)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    handleClose(tag) {
      this.tagArr.splice(this.tagArr.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.tagArr.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    fetchData(id) {
      getArticle(id).then(response => {
        this.tagArr = response.data.tags.split(',')
        response.data.createTime = new Date(response.data.createTime)
        this.postForm = response.data

        // just for test
        // this.postForm.title += `   Article Id:${this.postForm.id}`
        // this.postForm.subtitle += `   Article Id:${this.postForm.id}`

        // // set tagsview title
        // this.setTagsViewTitle()

        // // set page title
        // this.setPageTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    setPageTitle() {
      const title = 'Edit Article'
      document.title = `${title} - ${this.postForm.id}`
    },
    imgAddHandle(fileName, file) {
      console.log(fileName, file)
      this.img_file[fileName] = file
      var formData = new FormData()
      formData.append('file', file)
      console.log(formData, '上车前')
      uploadImg(formData).then(res => {
        console.log(res, 'imgAddHandle')
        this.$refs.md.$img2Url(fileName, res.data.url)
      })
    },
    imgDelHandle(pos) {
      delete this.img_file[pos]
    },
    submitForm() {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.postForm.status = 'published'
          this.isEdit ? this.update() : this.sendAdd()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    sendAdd() {
      crtArticle(this.postForm).then(res => {
        console.log(res, 666)
        this.notify()
      })
    },
    update() {
      updateArticle(this.postForm).then(res => {
        console.log(res, 987)
        this.notify()
      })
    },
    changeTime(val) {
      console.log(this.postForm.createTime)
      console.log(111, val)
    },
    notify(msg) {
      this.$notify({
        title: '成功',
        message: '发布文章成功',
        type: 'success',
        duration: 2000
      })
      this.loading = false
      this.$router.push({ path: '/example/list', query: { reload: this.$route.query.page }})
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
    },
    getRemoteUserList(query) {
      searchUser(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.createPost-container {
  position: relative;

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea /deep/ {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
