<template>
  <div class="app-container">
    <el-form ref="board" :model="board" label-width="120px">
      <el-form-item label="模板编码">
        <el-input v-model="board.boardCode" :disabled="true" />
      </el-form-item>
      <el-form-item label="模板名称">
        <el-input v-model="board.boardName" :disabled="true" />
      </el-form-item>
      <el-form-item label="消息类型">
        <el-radio-group v-model="board.messageType" :disabled="true">
          <el-radio label="TEXT">Text</el-radio>
          <el-radio label="MARKDOWN">Markdown</el-radio>
          <el-radio label="LINK">Link</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="消息标题"
        v-show="board.messageType=='LINK' || board.messageType=='MARKDOWN'"
      >
        <el-input v-model="board.title" :disabled="true" />
      </el-form-item>
      <el-form-item label="消息正文" v-if="board.messageType=='LINK' || board.messageType=='TEXT'">
        <el-input v-model="board.content" type="textarea" rows="3" :disabled="true" />
      </el-form-item>
      <el-form-item label="消息正文" v-if="board.messageType=='MARKDOWN'">
        <markdown-editor
          v-model="board.content"
          ref="markdownEditor"
          :options="{ hideModeSwitch : true, previewStyle : 'tab'}"
          style="line-height:1px;"
        />
      </el-form-item>
      <el-form-item
        label="@所有人"
        v-show="board.messageType=='TEXT' || board.messageType=='MARKDOWN'"
      >
        <el-radio-group v-model="board.atAll" :disabled="true">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="跳转链接" v-show="board.messageType=='LINK'">
        <el-input v-model="board.linkMessageUrl" :disabled="true" />
      </el-form-item>
      <el-form-item label="配图链接" v-show="board.messageType=='LINK'">
        <el-input v-model="board.linkPicUrl" :disabled="true" />
      </el-form-item>

      <el-form-item
        :label="'接收目标'+(index+1)"
        v-for="(address,index) in board.addresses"
        :key="index"
      >
        <el-row :gutter="10">
          <el-col :span="5">
            <el-input v-model="address.name" :disabled="true" placeholder="机器人名称" />
          </el-col>
          <el-col :span="5">
            <el-input
              v-model="address.groupAccessToken"
              :disabled="true"
              placeholder="accessToken"
            />
          </el-col>
          <el-col :span="5">
            <el-input v-model="address.condition" :disabled="true" placeholder="规则条件" />
          </el-col>
          <el-col :span="5">
            <el-input v-model="address.secret" :disabled="true" placeholder="Secret" />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="携带数据">
        <el-input v-model="data" type="textarea" rows="3" placeholder="发送消息时携带的数据，目前仅支持json格式" />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          v-if="showSubmitBtn"
          @click="doSubmit"
          :disabled="submiting"
          :loading="submiting"
        >{{ submiting ? '发送中...' : '发 送' }}</el-button>
        <router-link to="/board/list">
          <el-button>取 消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { findBoard } from "@/api/boardService";
import { sendMessage } from "@/api/messageService";
import MarkdownEditor from "@/components/MarkdownEditor";

export default {
  data() {
    return {
      board: {
        boardCode: "",
        boardName: "",
        messageType: "",
        title: "",
        content: "",
        atAll: "",
        linkMessageUrl: "",
        linkPicUrl: "",
        addresses: [
          {
            name: "",
            groupAccessToken: "",
            condition: ""
          }
        ]
      },
      data: "",
      showSubmitBtn: true,
      submiting: false
    };
  },
  components: {
    MarkdownEditor
  },
  created() {
    var params = this.$route.params;
    // 如果是编辑模板，则将传入的modifyBoard对象，赋值给board对象
    if (params.boardCode) {
      // 查询模板详情
      this.findData(params.boardCode);
    }
  },
  methods: {
    findData(boardCode) {
      findBoard(boardCode)
        .then(content => {
          this.board = content;
          if (content.atAll != undefined) {
            // 值类型需要和el-radio-group中定义的label类型一致，最好全部转为字符串来操作
            this.board.atAll = content.atAll.toString();
          }
          this.modify = true;
        })
        .catch(error => {
          this.$notify({
            title: "提示",
            type: "info",
            message: error.errorMsg
          });
          // 如果模板数据不存在，则不显示提交按钮
          this.showSubmitBtn = false;
        });
    },
    doSubmit() {
      if (this.submiting) {
        return;
      }
      this.submiting = true;
      sendMessage(this.board.boardCode, this.data)
        .then(content => {
          this.$notify({
            title: "操作成功",
            type: "success",
            message: "消息发送成功!"
          });
          this.submiting = false;
        })
        .catch(error => {
          this.submiting = false;
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

<style scoped>
</style>

