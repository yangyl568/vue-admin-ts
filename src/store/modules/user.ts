import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { phoneLogin, getMyInfo } from '@/api/users'
import { getToken, setToken, removeToken, setLocalStorage, removeLocalStorage, getLocalStorage } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'
import { Message } from 'element-ui'

export interface IUserState {
  token: string
  name: string
  avatar: string
  introduction: string
  roles: string[]
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  public avatar = ''
  public introduction = ''
  public roles: string[] = []

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_AVATAR(avatar: string) {
    this.avatar = avatar
  }

  @Mutation
  private SET_INTRODUCTION(introduction: string) {
    this.introduction = introduction
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }
  /* eslint-disable */
  @Action
  public async Login(userInfo: { cellphone: string, code?: number }) {
    setToken('test_token')
    this.SET_TOKEN('test_token')
    return Promise.resolve({})
    return
    await phoneLogin(userInfo).then(({ data }) => {
      setToken(data.token)
      this.SET_TOKEN(data.token)
      return Promise.resolve(data)
    }).catch((error) => {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    })
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    if (this.token === '') {
      throw Error('GetUserInfo: token is undefined!')
    }
    let userInfo = getLocalStorage('userInfo')
    const roles = ['admin']
    if (userInfo) {
      const { nickname, avatar } = userInfo
      this.SET_ROLES(roles)
      this.SET_NAME(nickname)
      this.SET_AVATAR(avatar)
    } else {
      userInfo = (await getMyInfo()).data
      const { nickname, avatar } = userInfo
      setLocalStorage('userInfo', JSON.stringify(userInfo))
      this.SET_ROLES(roles)
      this.SET_NAME(nickname)
      this.SET_AVATAR(avatar)
    }
    // this.SET_INTRODUCTION(introduction)
  }

  @Action
  public async ChangeRoles(role: string) {
    // Dynamically modify permissions
    const token = role + '-token'
    this.SET_TOKEN(token)
    setToken(token)
    await this.GetUserInfo()
    resetRouter()
    // Generate dynamic accessible routes based on roles
    PermissionModule.GenerateRoutes(this.roles)
    // Add generated routes
    router.addRoutes(PermissionModule.dynamicRoutes)
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    removeLocalStorage('userInfo')
    resetRouter()

    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)
