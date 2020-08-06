import request from '@/utils/request'

/**
 * 获取后台个人中心用户信息
 */
export const getMyInfo = () =>
  request({
    url: '/api/user/getMyInfo',
    method: 'get'
  })

/**
 * 获取用户列表
 * @param params 查询对象
 */
export const getUsers = (params: { pageSize: 10, pageNum: 1, cellphone: number, status: 3, estateId: 1, nickname: string }) =>
  request({
    url: '/api/admin/user/findUserList',
    method: 'get',
    params
  })

/**
   * 获取用户详情
   * @param params 用户id
   */
export const getUserInfo = (params: { id: number }) =>
  request({
    url: '/api/admin/user/getUserDetailInfo',
    method: 'get',
    params
  })

export const getUserByName = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'get'
  })

export const updateUser = (username: string, data: any) =>
  request({
    url: `/users/${username}`,
    method: 'put',
    data
  })

export const deleteUser = (username: string) =>
  request({
    url: `/users/${username}`,
    method: 'delete'
  })

/**
 * 发送验证码
 * @param params cellphone:手机号
 */
export const sendCode = (params: { cellphone: string }) =>
  request({
    url: '/api/auth/send_code',
    method: 'get',
    params
  })

/**
 * 手机号登录
 * @param params
 */
export const phoneLogin = (params: { cellphone: string, code?: number }) =>
  request({
    url: '/api/auth/phone_code',
    method: 'get',
    params: {
      ...params,
      areaCode: 86,
      channel: 2
    }
  })

/**
 * 获取用户列表
 * @param params
 */
export const findUserList = (params: any) =>
  request({
    url: '/api/admin/user/findUserList',
    method: 'get',
    params
  })

/**
 * 获取小区列表
 */
export const getEstateInfoList = (data?: any) =>
  request({
    url: '/api/pub/estateInfo/getEstateInfoList',
    method: 'GET',
    data
  })

/**
 *  修改用户详情
 */
export const modifyUserInfo = (data: any) =>
  request({
    url: '/api/admin/user/modifyUserInfo',
    method: 'POST',
    data
  })
