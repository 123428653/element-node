<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column min-width="300px" label="标题">
        <template slot-scope="{row}">
          <a href="javascript:;" class="link-type" @click="toEdit(row.id)">
            <span>{{ row.title }}</span>
          </a>
        </template>
      </el-table-column>

      <el-table-column width="120px" align="center" label="作者">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>

      <el-table-column width="180px" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | fromatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column width="160px" align="center" label="标签">
        <template slot-scope="scope">
          <el-tag
            v-for="tag in scope.row.tags.split(',')"
            :key="`item_${tag}`"
            style="margin-left:5px"
            :disable-transitions="true"
          >
            {{ tag }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="状态" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="scope">
          <a href="javascript:;" @click="toEdit(scope.row.id)">
            <el-button type="primary" size="small" icon="el-icon-edit">
              编辑
            </el-button>
          </a>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :hide-on-single-page="true"
        :page-count="total"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { articleList } from '@/api/article'
// import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ArticleList',
  // components: { Pagination },
  beforeRouteEnter(to, from, next) {
    // 修改文章刷新数据
    next(vm => {
      const query = vm.$route.query
      if (query && query.reload && from.name && !vm._data.isLoadData) {
        vm.listQuery.page = query.reload
        console.log(vm._data, 1213)
        vm.getList()
      }
    })
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      isLoadData: false,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 2
      }
    }
  },
  created() {
    console.log(this.isLoadData, 656)
    this.isLoadData = true
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      articleList(this.listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.totalPage
        this.listLoading = false
      })
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
      //   this.total = response.data.total
      //   this.listLoading = false
      // })
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    toEdit(id) {
      this.isLoadData = false
      this.$router.push(`/example/edit/${id}?page=${this.listQuery.page}`)
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
