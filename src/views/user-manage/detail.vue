<template>
  <div class="app-container userDetail">
    <el-form ref="userDetailForm" :inline="true" :model="userDetail" :rules="rules" label-width="100px">
      <h4>用户信息</h4>
      <el-form-item label="用户ID">
        <el-input v-model="userDetail.id" disabled />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="userDetail.nickname" />
      </el-form-item>
      <el-form-item label="性别">
        <el-select v-model="userDetail.gender" placeholder="请选择性别">
          <el-option label="保密" :value="0" />
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间">
        <el-input v-model="userDetail.createdAt" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userDetail.userHouseInfo.realName" />
      </el-form-item>
      <el-form-item label="手机号" prop="cellphone">
        <el-input v-model="userDetail.cellphone" />
      </el-form-item>
      <h4>房屋信息</h4>
      <el-form-item label="小区">
        <el-select v-model="userDetail.userHouseInfo.estateId" placeholder="请选择小区">
          <el-option label="未选择" :value="0" />
          <el-option v-for="item in estateList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="详细信息">
        <el-input v-model="userDetail.userHouseInfo.detailAddr" />
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="userDetail.userHouseInfo.idCard" />
      </el-form-item>
      <el-form-item label="身份">
        <el-select v-model="userDetail.userHouseInfo.identityType.index" placeholder="请选择身份">
          <el-option v-for="item in identityTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="认证时间">
        <el-input v-model="userDetail.userHouseInfo.authenticationTime" disabled />
      </el-form-item>
      <el-form-item label="认证状态" required>
        <el-radio-group v-model="userDetail.userHouseInfo.status.index">
          <el-radio :label="0">
            未认证
          </el-radio>
          <el-radio :label="1">
            待审核
          </el-radio>
          <el-radio :label="2">
            审核通过
          </el-radio>
          <el-radio :label="3">
            审核不通过
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="upload">
      修改并保存
    </el-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getUserInfo, modifyUserInfo, getEstateInfoList } from '@/api/users'

interface modifyUserInfoParams {
    id:number
    nickname?:string
    gender?:number
    cellphone?:number
    estateId?:number
    status?:number
    identityType?:number
    idCard?:string
    detailAddr?:string
    realName?:string
}
// interface YourComponentType extends Vue {
//   validate(options?: { silent?: boolean }): Promise<boolean>
// }

@Component({
  name: 'userDetail'
})

export default class userlist extends Vue {
  // $refs!: {
  //     userDetailForm: YourComponentType
  // }

    private identityTypeList:any = [
      {
        label: '未选择',
        value: 0
      },
      {
        label: '业主',
        value: 1
      },
      {
        label: '租客',
        value: 2
      },
      {
        label: '其他',
        value: 3
      }
    ]

    private estateStatus:any = [
      {
        status: 0,
        name: '未认证'
      },
      {
        status: 1,
        name: '待审核'
      },
      {
        status: 2,
        name: '审核通过'
      },
      {
        status: 3,
        name: '审核不通过'
      }
    ]

    private estateList:any=[]

    private rules:any = {
      cellphone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^[1][0-9]{10}$/, message: '手机号不符合规则', trigger: 'blur' }
      ]
    }

    private userDetail:any = {
      id: 0,
      cellphone: '',
      username: '',
      nickname: '',
      avatar: '',
      gender: 0,
      userHouseInfo: {
        status: {
          index: 0,
          name: ''
        },
        detailAddr: '',
        estateId: 0,
        estateName: '',
        idCard: '',
        identityType: {
          index: 0,
          name: ''
        },
        realName: ''
      }
    }

    private mounted():void {
      this.getUserInfo(Number(this.$route.query.id))
      this.getEstateInfoList()
    }

    private getUserInfo(id:number):void {
      getUserInfo({ id }).then(res => {
        for (const key in res.data) {
          if (res.data[key] === 0 || res.data[key]) {
            console.log(key, res.data[key])
            this.userDetail[key] = res.data[key]
          }
        }
      })
    }

    private getEstateInfoList():void {
      getEstateInfoList().then(res => {
        this.estateList = res.data.list
      }).catch(rej => {
        console.log('获取小区列表失败===>', rej)
      })
    }

    private async upload():Promise<any> {
      try {
        const verify = await (this.$refs.userDetailForm as Vue & { validate: () => boolean }).validate()
        if (!verify) return verify
        const params: modifyUserInfoParams = {
          id: this.userDetail.id,
          nickname: this.userDetail.nickname,
          gender: this.userDetail.gender,
          cellphone: this.userDetail.cellphone,
          estateId: this.userDetail.userHouseInfo.estateId,
          status: this.userDetail.userHouseInfo.status.index,
          identityType: this.userDetail.userHouseInfo.identityType.index,
          idCard: this.userDetail.userHouseInfo.idCard,
          detailAddr: this.userDetail.userHouseInfo.detailAddr,
          realName: this.userDetail.userHouseInfo.realName
        }
        modifyUserInfo(params).then(res => {
          console.log('res======>', res)
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.back()
        }).catch(rej => {
          console.log('error======>', rej)
        })
      } catch (error) {

      }
    }
}
</script>

<style lang="scss" scoped>
</style>
