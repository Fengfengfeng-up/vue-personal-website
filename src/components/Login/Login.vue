<template>
  <div class="back" @click.stop="remove">
    <div class="registration-form" @click.stop>
      <header>
        <h1>{{ hasAcount ? '登陆' : '注册' }}</h1>
        <a v-show="status === ''" @click="reset(hasAcount)">
          {{ hasAcount ? '还没有' : '已有' }}账号?
        </a>
        <p>请填写完整信息</p>
      </header>
      <form>
        <div
          class="input-section email-section"
          :class="{ 'fold-up': emailBtn }"
        >
          <input
            class="email"
            type="email"
            maxlength="25"
            placeholder="邮箱地址"
            :value="form.email"
            @input="(e) => (form.email = e.target.value)"
          >
          <div class="animated-button">
            <span class="icon-email" :class="{ next: form.email }">
              <svg-icon icon="email" />
            </span>
            <span class="next-button email" @click="emailBtn = true">
              <svg-icon icon="next" />
            </span>
          </div>
        </div>
        <div
          class="input-section name-section"
          :class="{ folded: !emailBtn, 'fold-up': nameBtn }"
        >
          <input
            class="name"
            type="text"
            maxlength="15"
            placeholder="用户名"
            :value="form.name"
            @input="(e) => (form.name = e.target.value)"
          >
          <div class="animated-button">
            <span class="icon-user" :class="{ next: form.name }">
              <svg-icon icon="user" />
            </span>
            <span
              class="next-button name"
              @click="hasAcount ? signIn() : signUp()"
            >
              <svg-icon icon="send" />
            </span>
          </div>
        </div>
        <div
          class="success"
          :class="{ login: status === 'logined' }"
          :style="status !== '' ? 'margin-top: 0' : ''"
        >
          <p>
            {{ hasAcount ? 'LOGIN SUCCESSFUL' : 'ACOUNT CREATED' }}
            <svg-icon icon="loading" />
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: ''
      },
      status: '',
      hasAcount: true,
      emailBtn: false,
      nameBtn: false
    }
  },
  methods: {
    reset(signUp = true) {
      this.hasAcount = !signUp
      this.emailBtn = false
      this.nameBtn = false
      this.form.name = ''
      this.form.email = ''
    },
    async signIn() {
      try {
        const res = await this.$http('/visitor/login', {
          method: 'post',
          data: { ...this.form }
        })
        this.handleSuccess(res.data, () => {
          this.status = 'logined'
        })
      } catch {
        this.reset(false)
      }
    },
    async signUp() {
      try {
        const res = await this.$http('/visitor/register', {
          method: 'post',
          data: { ...this.form }
        })

        this.handleSuccess(res.data, () => {
          this.status = 'acount created'

          setTimeout(() => {
            this.hasAcount = true
            this.status = 'logined'
          }, 1000)
        })
      } catch {
        this.reset()
      }
    },
    handleSuccess(data, callback) {
      this.$bus.$emit('setResource', { name: 'token', data: data.token })
      this.$bus.$emit('setResource', {
        name: 'profile',
        data: data.visitor
      })
      callback()

      setTimeout(() => {
        this.remove()
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
$input-height: 4.6875rem;

.back {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  touch-action: none;
}
.registration-form {
  width: 25rem;
  max-width: 90vw;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  header {
    position: relative;
    z-index: 4;
    background: var(--white);
    padding: 1.25rem 2.5rem;
    border-radius: 0.9375rem 0.9375rem 0 0;
    // color: #333;

    h1 {
      font-weight: 900;
      letter-spacing: 1.5px;
      font-size: 1.4375rem;
      text-transform: uppercase;
      margin: 0;
    }

    a {
      font-size: var(--font-smaller);
      color: var(--blue-dark);
      cursor: pointer;
    }

    p {
      word-spacing: 0px;
      color: var(--gray);
      font-size: 1.0625rem;
      margin: 0;
      margin-top: 0.3125rem;
    }
  }

  form {
    position: relative;
  }

  .input-section {
    width: 100%;
    position: absolute;
    display: flex;
    left: 50%;
    transform: translate(-50%, 0);
    height: $input-height;
    border-radius: 0 0 0.9375rem 0.9375rem;
    overflow: hidden;
    z-index: 2;
    box-shadow: 0px 0px 6.25rem rgba(0, 0, 0, 0.2);
    transition: all 0.2s ease-in;

    &.folded {
      width: 95%;
      margin-top: 0.625rem;
      left: 50%;
      transform: translate(-50%, 0);
      z-index: 1;

      input {
        background-color: rgb(233, 226, 192);
      }

      span {
        background-color: rgb(233, 226, 192);
      }
    }

    // &.folded + .folded {
    //   width: 90%;
    //   margin-top: 1.25rem;
    //   left: 50%;
    //   transform: translate(-50%, 0);
    //   z-index: 0;

    //   input {
    //     background-color: rgb(225, 188, 239);
    //   }

    //   span {
    //     background-color: rgb(225, 188, 239);
    //   }
    // }

    &.fold-up {
      margin-top: -$input-height;
    }
  }

  form input {
    background: lighten(rgb(243, 243, 251), 5%);
    color: rgb(143, 143, 214);
    width: 80%;
    border: 0;
    padding: 1.25rem 2.5rem;
    margin: 0;
    font-size: var(--font-default);

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: rgb(143, 143, 214);
      font-weight: 100;
    }
  }
}

.animated-button {
  width: 20%;
  background-color: rgb(212, 212, 255);

  span {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    line-height: $input-height;
    text-align: center;
    height: $input-height;
    transition: all 0.2s ease-in;

    // svg {
    //   fill: rgb(153, 153, 248);
    // }
  }

  .next-button {
    background: transparent;
    font-weight: 100;
    width: 100%;
    border: 0;
    &:hover {
      cursor: pointer;
    }
  }
}

.next {
  margin-top: -$input-height;
}

.success {
  width: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  left: 50%;
  transform: translate(-50%, 0);
  height: $input-height;
  border-radius: 0 0 0.9375rem 0.9375rem;
  overflow: hidden;
  z-index: 2;
  box-shadow: 0px 0px 6.25rem rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease-in;
  background-color: var(--blue-darker);
  // background: limegreen;
  margin-top: -$input-height;
  transition: all 0.3;
  &.login {
    background-color: rgb(31, 133, 31);
  }

  p {
    color: var(--white);
    font-weight: 900;
    letter-spacing: 2px;
    font-size: 1.125rem;
    width: 100%;
    text-align: center;
    position: relative;
    svg {
      width: 1.5rem;
      height: 1.5rem;
      fill: #fff;
      position: absolute;
      top: 50%;
      right: 10%;
      animation: loading 2s linear infinite;
      @keyframes loading {
        0% {
          transform: translateY(-50%) rotate(0);
        }
        100% {
          transform: translateY(-50%) rotate(360deg);
        }
      }
    }
  }
}

.icon-email,
.icon-user,
.next-button {
  color: rgb(153, 153, 248);
  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
}

body.dark-mode {
  .registration-form {
    header {
      background: var(--blue-darker);
      a {
        background-image: linear-gradient(var(--gray-light), var(--gray-light)),
          linear-gradient(var(--gray-light), var(--gray-light)),
          linear-gradient(var(--yellow), var(--yellow));
      }
    }
  }
}
</style>
