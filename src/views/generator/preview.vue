<template>
  <el-tabs v-model="activeName" type="card">
    <el-tab-pane v-for="item in list" :key="item.name" :lazy="true" :label="item.name" :name="item.name">
      <Java :value="item.content" :height="height" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Java from '@/components/JavaEdit/index'
import { generator } from '@/api/autoCode'
export default {
  name: 'Preview',
  components: { Java },
  data() {
    return {
      list: null,
      height: '',
      activeName: 'Entity',
      tableCode: {
        projectConfigId: 1,
        dataBaseId: 1,
        tableName: ''
      }
    }
  },
  created() {
    const tableName = this.$route.params.tableName
    this.tableCode.tableName = tableName
    this.height = document.documentElement.clientHeight - 180 + 'px'
    generator(this.tableCode).then(data => {
      this.list = data.data
      console.log('list===' + this.list)
    }).catch(() => {
      // this.$router.go(-1)
      console.log('获取失败')
    })
  }
}
</script>
