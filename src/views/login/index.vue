<template>
  <div class="login-container">
    <img
      class="logo"
      src="@/assets/logo.png"
      alt="logo"
    >
    <img
      class="pic-login-bg"
      src="@/assets/login-bg.png"
      alt="bg"
    >
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title">
        用户登录
      </div>

      <el-form-item prop="cellphone">
        <span class="svg-container">
          <i class="el-icon-mobile-phone" />
        </span>
        <el-input
          ref="cellphone"
          v-model.number="loginForm.cellphone"
          placeholder="手机号"
          name="cellphone"
          maxlength="11"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item
        prop="code"
        style="position: relative;"
      >
        <span class="svg-container">
          <i class="el-icon-message" />
        </span>
        <el-input
          ref="code"
          v-model="loginForm.code"
          class="form-code"
          maxlength="4"
          placeholder="短信验证码"
          type="number"
          @keyup.enter.native="handleLogin"
        />
        <el-button
          class="form-sendcode"
          type="primary"
          @click="getCode"
        >
          {{ codeText }}
        </el-button>
      </el-form-item>

      <el-button
        class="login-btn"
        :loading="loading"
        type="primary"
        @click.native.prevent="handleLogin"
      >
        立即登录
      </el-button>
    </el-form>

    <div class="copyright">
      hangzhoushuochuangjiuchuang Technology Co., Ltd.    2020
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { sendCode } from '@/api/users'

@Component({
  name: 'Login'
})
export default class extends Vue {
  private loginForm = {
    cellphone: '', // 18657154060,
    code: undefined
  }

  private loginRules = {
    cellphone: [{ required: true, message: '手机号不能为空' }],
    code: [{ required: true, message: '验证码不能为空' },
      { message: '验证码输入有误', min: 4, max: 4 }]
  }

  private timeOutNow = false // 正在倒计时
  private codeText = '获取验证码'
  private loading = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (!this.loginForm.cellphone) {
      (this.$refs.cellphone as Input).focus()
    } else if (!this.loginForm.code) {
      (this.$refs.code as Input).focus()
    }
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 0.5 * 1000)

        await UserModule.Login(this.loginForm).then(() => {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
        }).catch(error => {
          console.log('Login:::error', error.errmsg)
        })
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }

  /**
   * 获取验证码
  */
  private getCode() {
    if (/^\d{11}$/.test(this.loginForm.cellphone.toString())) {
      if (this.timeOutNow) return false
      // 倒计时
      this.timeOutNow = true
      sendCode({ cellphone: this.loginForm.cellphone }).then(() => {
        this.$message({ message: '发送验证码成功' })
        this.countDownBySecond(60, 1000, (t: number) => {
          this.codeText = `${t}秒后获取`
        }, () => {
          this.timeOutNow = false
          this.codeText = '获取验证码'
        })
      }).catch(() => {
        this.timeOutNow = false
      })
    } else {
      this.$message({
        message: '手机号格式不对',
        type: 'warning'
      })
    }
  }

  /**
   * 倒计时
   */
  private countDownBySecond(restSeconds: number, timeInterval = 1000, func: Function, endCallback: Function) {
    let timer: any = null
    let total = restSeconds
    timer = setInterval(() => {
      --total
      if (total <= 0) {
        clearInterval(timer)
        endCallback && endCallback()
      } else {
        func && func(total)
      }
    }, timeInterval)
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
// @supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
//   .login-container .el-input {
//     input { color: $loginCursorColor; }
//     input::first-line { color: $lightGray; }
//   }
// }

.login-container {
  .el-form-item__content {
    height: 100%;
  }
  .svg-container {
    padding: 0 0 0 15px !important;
    .el-icon-mobile-phone,
    .el-icon-message {
      font-size: 16px;
    }
  }
  .el-input {
    display: inline-block;
    height: 100%;
    width: 80%;

    input {
      border: 0px;
      border-radius: 0px;
      color: #000;
      caret-color: #000;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        // -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form {
      padding: 60px 0;
      .el-form-item {
        width: 420px;
        height: 47px;
        border: 1px solid #AAAFBA;
        background: #fff;
        border-radius: 5px;
        color: #454545;
        .el-form-item__error {
          padding-top: 5px;
        }
      }
      .el-button--primary {
          background-color: #FC6C00;
          border-color: #FC6C00;
      }
      .login-btn {
          margin-top: 30px;
          width: 420px;
          height: 47px;
          font-size: 20px;
          letter-spacing:6px;
      }
  }

}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .logo {
    position: absolute;
    z-index: 99;
    top: 38px;
    left: 62px;
    width: 200px;
    height: 68px;
  }
  .copyright {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: #fff;
    z-index: 0;
  }
  .pic-login-bg {
    position: fixed;
    object-fit: cover;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
  }
  .login-form {
    position: absolute;
    top: 150px;
    z-index: 9;
    right: 140px;
    width: 552px;
    // height: 552px;
    background:#fff;
    border-radius:8px;

    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-content: center;
    align-items: center;

    .form-sendcode {
      height: 39px;
      position: absolute;
      right: 6px;
      top: 3px;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title {
      font-size: 40px;
      color: #373C49;
      margin: 0 auto 50px;
      text-align: center;
      font-weight: bold;
    }
}
</style>
