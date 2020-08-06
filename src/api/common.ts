import request from '@/utils/request'

/**
 * 添加或更新 document
 * @param {object} data 查询对象
 * @param {number} type 0缴费1公告2省钱教程
 * @param {string} subject 标题
 * @param {string} content 富文本内容
 * @param {boolean} isShow true 展示、false不展示
 */
export const addOrUpdateDoc = (data: { type: number, subject: string, content: string, isShow: boolean, id?: number }) =>
  request({
    url: '/api/admin/document/addOrUpdateDocument',
    method: 'post',
    data
  })

/**
 * 获取省钱攻略文章
 */
export const findSaveMoneyInfo = () =>
  request({
    url: '/api/admin/document/findSaveMoneyInfo',
    method: 'get'
  })

/**
* 获取详情
*/
export const documentDetail = (params: any) =>
  request({
    url: '/api/admin/document/documentDetail',
    method: 'get',
    params
  })
