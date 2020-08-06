<template>
  <div class="app-container userlist">
    <div class="filter-container">
      <el-form label-position="left" :inline="true" :model="queryData" label-width="70px">
        <el-form-item label="昵称" label-width="50px">
          <el-input v-model="queryData.nickname" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="手机号" label-width="60px">
          <el-input v-model="queryData.cellphone" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="小区名称">
          <el-select v-model="queryData.estateId" placeholder="请选择小区">
            <el-option label="全部" value="" />
            <el-option v-for="item in estateList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="房屋认证">
          <el-select v-model="queryData.status" placeholder="请选择房屋认证状态">
            <el-option label="全部" value="" />
            <el-option v-for="(item,index) in estateStatus" :key="index" :label="item.name" :value="item.status" />
          </el-select>
        </el-form-item>
        <el-row>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">
              查询
            </el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <div class="list">
      <el-table v-loading="listLoading" :data="list" border>
        <el-table-column label="用户ID" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.cellphone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小区" align="center">
          <template slot-scope="{row}">
            <span>{{ row&&row.userHouseInfo?row.userHouseInfo.estateName:'' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房屋认证" align="center">
          <template slot-scope="{row}">
            <span>{{ row&&row.userHouseInfo&&row.userHouseInfo.status?row.userHouseInfo.status.name:'未认证' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createdAt.split(" ")[0] }}</span><br>
            <span>{{ row.createdAt.split(" ")[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="userDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="page-info">
      <el-pagination background :current-page="seachData.pageNum" :page-size="seachData.pageSize" :total="tableData.total" :page-sizes="[10, 25, 50, 100]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div> -->

    <div class="page-info">
      <el-pagination background :current-page="queryData.pageNum" :page-sizes="[10, 25, 50, 100]" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { findUserList, getEstateInfoList } from '@/api/users'
// import { Form } from 'element-ui'
// import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'ComplexTable',
  components: {
  },
  filters: {
  }
})

export default class userlist extends Vue {
  // created() {
  // }
  private listLoading= true
  private estateList:any=[
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

  private queryData:any = {
    nickname: '', //  昵称
    cellphone: '', // 联系电话
    estateId: null, // 小区id
    status: null, // 认证状态
    pageSize: 10, // 每页数量
    pageNum: 1 // 页码
  }

  private total= 0

  private list:any= []

  private handleSizeChange(val:number):void{
    this.queryData.pageSize = val
    this.findUserList()
  }

  private handleCurrentChange(val:number):void{
    this.queryData.pageNum = val
    this.findUserList()
  }

  private mounted():void {
    this.findUserList()
    this.getEstateInfoList() // 获取可选折的小区列表
  }

  private findUserList():void{
    findUserList(this.queryData).then(res => {
      this.list = res.data.list
      this.total = res.data.total
      this.listLoading = false
    }).catch()
  }

  private getEstateInfoList() {
    getEstateInfoList().then(res => {
      this.estateList = res.data.list
    }).catch(rej => {
      console.log('获取小区列表失败===>', rej)
    })
  }

  private onSubmit():void{
    this.findUserList()
  }

  private userDetail(row:any):void {
    this.$router.push({
      name: 'UserDetail',
      query: {
        id: row.id
      }
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
