<template>
  <div class="app-container">
    <el-row type="flex" justify="center">
      <el-col :span="4">
        <el-input placeholder="输入查询内容" v-model="query" clearable style="width:260px;">
          <el-button slot="append" icon="el-icon-search" @click="fetchData(1)"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2" :offset="18">
        <router-link to="/board/create">
          <el-button icon="el-icon-circle-plus" type="primary" style="margin-bottom:8px;">新增</el-button>
        </router-link>
      </el-col>
    </el-row>
    <el-table
      v-loading="loading"
      :data="boardList"
      element-loading-text="查询中"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="模板编码" width="95" align="center">
        <template slot-scope="scope">{{ scope.row.boardCode }}</template>
      </el-table-column>
      <el-table-column label="模板名称" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.boardName }}</template>
      </el-table-column>
      <el-table-column label="消息类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.messageType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消息标题" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column label="消息正文" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="目标个数" width="100" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.addresses.length | lengthFilter">{{ scope.row.addresses.length }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <!-- 如果要通过params传参数，router-link 的to中，必须要指定name属性，不能使用path属性 -->
          <router-link :to="{ name: 'modifyBoard', params : {boardCode : scope.row.boardCode} }">
            <el-button icon="el-icon-edit" type="primary" size="small" circle></el-button>
          </router-link>
          <el-popover placement="top" width="160">
            <p>确定要删除该条记录吗？</p>
            <div style="text-align: right; margin: 0">
              <!-- <el-button type="text" size="mini" @click="visible = false">取消</el-button> -->
              <el-button type="primary" size="mini" @click="deleteData(scope.row.boardCode)">确定</el-button>
            </div>
            <el-button icon="el-icon-delete" type="danger" size="small" circle slot="reference"></el-button>
          </el-popover>
          <router-link :to="{ name: 'sendMsg', params : {boardCode : scope.row.boardCode} }">
            <el-button icon="el-icon-s-promotion" type="info" size="small" circle></el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top:10px;">
      <el-col :span="8" :offset="16">
        <el-pagination
          background
          :total="totalCount"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          style="float:right; padding:0px;"
          @current-change="fetchData"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getBoardPage, removeBoard } from "@/api/boardService";

export default {
  filters: {
    lengthFilter(length) {
      const map = {
        success: "success",
        gray: "gray",
        danger: "danger"
      };
      let key = length > 20 ? "danger" : length > 10 ? "gray" : "success";
      return map[key];
    }
  },
  data() {
    return {
      query: "",
      boardList: null,
      totalCount: 0,
      currentPage: 0,
      pageSize: 0,
      loading: true,
      visible: false
    };
  },
  created() {
    this.fetchData(1);
  },
  methods: {
    fetchData(pageNo) {
      this.loading = true;
      getBoardPage(pageNo, this.pageSize, this.query)
        .then(content => {
          this.boardList = content.items;
          this.totalCount = content.totalCount;
          this.currentPage = content.currentPage;
          this.pageSize = content.pageSize;
          this.loading = false;
        })
        .catch(error => {
          this.$notify({
            title: "查询出错(" + error.errorCode + ")",
            type: "error",
            message: error.errorMsg
          });
          this.loading = false;
        });
    },
    deleteData(boardCode) {
      removeBoard(boardCode)
        .then(content => {
          this.$notify({
            title: "提示",
            type: "info",
            message: "删除模板成功"
          });
          setTimeout(() => {
            this.fetchData(1);
          }, 1000);
        })
        .catch(error => {
          this.$notify({
            title: "操作失败(" + error.errorCode + ")",
            type: "error",
            message: error.errorMsg
          });
        });
    }
  }
};
</script>
