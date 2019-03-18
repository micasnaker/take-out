<!-- 登录组件 -->
<template>
  <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">米卡外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=true">短信登录</a>
            <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=false">密码登录</a>
          </div>
        </div>
        <!-- 短信登录 -->
        <div class="login_content">
          <form @submit.prevent="login">  <!-- 暂时取消form表单下button的默认提交事件-->
            <div :class="{on:loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!rightPhone" class="get_verification" 
                :class="{right_phone:rightPhone}" @click.prevent="getCode">
                {{computeTime>0?`已发送(${computeTime}s)`:'获取验证码'}}</button> <!-- .prevent 禁止默认行为 -->
                <!-- 三元表达式 如果computeTime大于0 有值 就显示 已发送 多少s 没有值就显示 获取验证码 -->
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码" v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册米卡外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <!-- 密码登录 -->
            <div :class="{on:!loginWay}">
              <section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="text" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">  <!-- 显示密码-->
                  <input type="password" maxlength="8" placeholder="密码" v-else v-model="pwd">    <!-- 不显示密码-->
                  <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">  <!-- 点击显示或者不显示-->
                    <div class="switch_circle" :class="{right:showPwd}"></div>  <!-- 根据showPwd的状态 来 控制-->
                    <span class="switch_text">{{showPwd?'abc':'...'}}</span><!-- 是否显示密码，显示的话 展示 abc 不显示就展示...-->
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha" ref="captcha">
                </section>
              </section>
            </div>
            <button class="login_submit" @click="login">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-jiantou3"></i>
        </a>
      </div>
      <AlertTip :alertText="alertText" v-show="alertShow" @closeTip="closeTip"></AlertTip>
    </section>
</template>

<script>
import AlertTip from '../../components/AlertTip/AlertTip'
import {reqSendCode, reqSmsLogin, reqPwdLogin} from '../../api'
export default {
  data () {
    return {
      loginWay:true,  // true 代表 短信登录 , false 代表 密码登录
      computeTime:0,  // 计时的时间
      phone:'', // 手机号
      showPwd:false, // 是否显示密码 默认不显示
      pwd:'',  // 密码
      code:'',  // 短信验证码
      name:'',  // 手机/邮箱/用户名
      captcha:'',  //  图形字母验证码
      alertText:'',  // 提示文本
      alertShow:false,  // 是否显示提示框
    };
  },

  components: {},

  computed: {
    rightPhone(){
      return /^1\d{10}$/.test(this.phone)  // 正则根据 上面的 phone 手机号进行匹配
                                           // 以1开头 后面 10 位数字 一共11 位数字的手机号
                                           // .test() 方法用于检测一个字符串是否匹配某个模式.
    }
  },

  mounted(){},

  methods: {
    async getCode(){  // 异步获取 短信验证码
      // 如果当前没有计时
      if(!this.computeTime){  // 如果 computeTime = 0 
      // 启动倒计时
      this.computeTime = 60
      this.intervalId = setInterval(()=>{  // 循环计时器
      this.computeTime-- // 自减减 循环60自减 但不能一直减少 当小于等于0的时候 应该停止
      if(this.computeTime<=0){
        //  停止计时
        clearInterval(intervalId)
      }
      },1000)  // 每隔一秒 自减 1

      // 发送ajax请求(向指定手机号，发送验证码短信)
      const result = await reqSendCode(this.phone)
      if(result.code===1){
        // 显示提示
        this.showAlert(result.msg)
        // 停止倒计时
        if(this.computeTime){
          this.computeTime = 0
          clearInterval(this.intervalId)
          this.intervalId = undefined
        }
      }
      } 
    },

    showAlert(alertText){  // 将验证提示框封装成一个方法 下面直接调用就行了
      this.alertShow = true
      this.alertText = alertText
    },

    async login(){  // 实现异步登录
    let result
      // 前台表单验证
      if(this.loginWay){  // 短信登录
        const {rightPhone,phone,code} = this
        if(!this.rightPhone){
          // 手机号不正确
          this.showAlert('手机号不正确')
          return
        }else if(!/^\d{6}$/.test(code)){  // 验证码六位数字开头六位数字结尾  六位数字验证码
          // 提示 验证码 必须是六位数字 或者 验证码不对
          this.showAlert('验证码必须是六位数')
          return          
        }
        // 发送ajax请求短信登录
        result = await reqSmsLogin(phone, code)
      }else{  // 密码登录
        const {name,pwd,captcha} = this
        if(!this.name){
          // 用户名必须指定
          this.showAlert('用户名必须指定')
          return
        }else if(!this.pwd){
          // 密码必须指定
          this.showAlert('密码必须指定')
          return
        }else if(!this.captcha){
          // 验证码必须指定
          this.showAlert('验证码必须指定')
          return
        }
        // 发送ajax请求密码登录
        result = await reqPwdLogin({name,pwd,captcha})
      }



      // 根据结果数据处理
      if(result.code===0){
          // 成功的结果
          const user = result.data
          // 将user保存到vuex的state中
          this.$store.dispatch('recordUser', user)
          // 去个人中心界面
          this.$router.replace('/profile')
        }else{
          // 失败的结果
          this.getCaptcha()  // 失败之后 再次调用获取图片验证码 效果是 失败后刷新
          // 显示警告提示
          const msg = result.msg
          this.showAlert(msg)
        }
    },

    closeTip(){  // 弹框里面的确认，点击关闭弹窗
      this.alertShow = false
      this.alertText = ''
    },

    getCaptcha(){  // 获取一个新的一次性图片验证码
    // 要每点一次 都会重新请求一次 但是需要路径不一样 +Date.now() 之后 每次点击的路径时间都不一样了  所以可以刷新
      this.$refs.captcha.src = 'http://localhost:4000/captcha?time='+Date.now();
    },
  },
  components:{
    AlertTip
  }
}

</script>

<style lang="stylus">
 @import "~@/common/stylus/mixins.styl";
.loginContainer
      width 100%
      height 100%
      background #fff
      .loginInner
        padding-top 60px
        width 80%
        margin 0 auto
        .login_header
          .login_logo
            font-size 40px
            font-weight bold
            color #02a774
            text-align center
          .login_header_title
            padding-top 40px
            text-align center
            >a
              color #333
              font-size 14px
              padding-bottom 4px
              &:first-child
                margin-right 40px
              &.on
                color #02a774
                font-weight 700
                border-bottom 2px solid #02a774
        .login_content
          >form
            >div
              display none
              &.on
                display block
              input
                width 100%
                height 100%
                padding-left 10px
                box-sizing border-box
                border 1px solid #ddd
                border-radius 4px
                outline 0
                font 400 14px Arial
                &:focus
                  border 1px solid #02a774
              .login_message
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .get_verification
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  border 0
                  color #ccc
                  font-size 14px
                  background transparent
                  &.right_phone
                    color black
              .login_verification
                position relative
                margin-top 16px
                height 48px
                font-size 14px
                background #fff
                .switch_button
                  font-size 12px
                  border 1px solid #ddd
                  border-radius 8px
                  transition background-color .3s,border-color .3s
                  padding 0 6px
                  width 30px
                  height 16px
                  line-height 16px
                  color #fff
                  position absolute
                  top 50%
                  right 10px
                  transform translateY(-50%)
                  &.off
                    background #fff
                    .switch_text
                      float right
                      color #ddd
                  &.on
                    background #02a774
                  >.switch_circle
                    //transform translateX(27px)
                    position absolute
                    top -1px
                    left -1px
                    width 16px
                    height 16px
                    border 1px solid #ddd
                    border-radius 50%
                    background #fff
                    box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                    transition transform .3s
                    &.right  // 当为 rgiht的时候 小球向右滑动 30px
                      transform translateX(30px)
              .login_hint
                margin-top 12px
                color #999
                font-size 14px
                line-height 20px
                >a
                  color #02a774
            .login_submit
              display block
              width 100%
              height 42px
              margin-top 30px
              border-radius 4px
              background #4cd96f
              color #fff
              text-align center
              font-size 16px
              line-height 42px
              border 0
          .about_us
            display block
            font-size 12px
            margin-top 20px
            text-align center
            color #999
        .go_back
          position absolute
          top 5px
          left 5px
          width 30px
          height 30px
          >.iconfont
            font-size 20px
            color #999
</style>
