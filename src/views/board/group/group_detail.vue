<template>
  <div class="app-container">
    <el-form ref="boardForm" :rules="rules" :model="board" label-width="120px">
      <el-form-item label="模板编码" prop="boardCode">
        <el-input
          v-model="board.boardCode"
          placeholder="模板编码，必须保持唯一性"
          :disabled="modify==true"
          :clearable="modify==false"
        />
      </el-form-item>
      <el-form-item label="模板名称" prop="boardName">
        <el-input v-model="board.boardName" placeholder="模板名称" :clearable="modify==false" />
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-radio-group v-model="board.messageType">
          <el-radio label="TEXT">Text</el-radio>
          <el-radio label="MARKDOWN">Markdown</el-radio>
          <el-radio label="LINK">Link</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="消息标题"
        v-show="board.messageType=='LINK' || board.messageType=='MARKDOWN'"
      >
        <el-input v-model="board.title" placeholder="消息标题" />
      </el-form-item>
      <el-form-item label="消息正文" v-if="board.messageType=='LINK' || board.messageType=='TEXT'">
        <el-alert
          :closable="false"
          :title="board.messageType=='LINK' ? '消息正文，支持velocity语法，不支持艾特人员' : '消息正文，支持velocity语法，并且可以通过@手机号，来艾特具体的人员'"
          type="success"
          style="height:30px"
        />
        <el-input
          v-model="board.content"
          type="textarea"
          rows="5"
          placeholder="消息正文"
          :clearable="modify==false"
        />
      </el-form-item>
      <el-form-item label="消息正文" v-if="board.messageType=='MARKDOWN'">
        <el-alert
          :closable="false"
          title="消息正文，支持velocity语法，并且可以通过@手机号，来艾特具体的人员"
          type="success"
          style="height:30px"
        />
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
        <el-radio-group v-model="board.atAll">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="跳转链接" v-show="board.messageType=='LINK'">
        <el-input v-model="board.linkMessageUrl" placeholder="消息跳转链接" :clearable="modify==false" />
      </el-form-item>
      <el-form-item label="配图链接" v-show="board.messageType=='LINK'">
        <el-input v-model="board.linkPicUrl" placeholder="消息配图链接" :clearable="modify==false" />
      </el-form-item>

      <el-form-item
        :label="'接收目标'+(index+1)"
        v-for="(address,index) in board.addresses"
        :key="index"
      >
        <el-row :gutter="10">
          <el-col :span="5">
            <el-input v-model="address.name" placeholder="机器人名称" :clearable="modify==false" />
          </el-col>
          <el-col :span="5">
            <el-input
              v-model="address.groupAccessToken"
              placeholder="accessToken"
              :clearable="modify==false"
            />
          </el-col>
          <el-col :span="5">
            <el-input v-model="address.condition" placeholder="规则条件" :clearable="modify==false" />
          </el-col>
          <el-col :span="5">
            <el-input v-model="address.secret" placeholder="Secret" :clearable="modify==false" />
          </el-col>
          <el-col :span="1">
            <el-button icon="el-icon-plus" type="primary" size="small" circle @click="addAddress"></el-button>
          </el-col>
          <el-col :span="1">
            <el-button
              v-if="board.addresses.length > 1"
              icon="el-icon-minus"
              type="danger"
              size="small"
              circle
              @click="removeAddress(address)"
            ></el-button>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          v-if="showSubmitBtn"
          @click="doSubmit"
          :disabled="submiting"
          :loading="submiting"
        >{{ submiting ? '提交中...' : '提 交' }}</el-button>
        <router-link to="/board/group">
          <el-button>取 消</el-button>
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { findBoard, createBoard, modifyBoard } from "@/api/boardService";
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
        atAll: "0",
        linkMessageUrl: "",
        linkPicUrl: "",
        addresses: [
          {
            name: "",
            groupAccessToken: "",
            condition: "",
            secret: ""
          }
        ]
      },
      rules: {
        boardCode: [
          { required: true, message: "请输入模板编码", trigger: "blur" },
          {
            min: 5,
            max: 100,
            message: "长度在 5 到 100 个字符之间",
            trigger: "blur"
          }
        ],
        boardName: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符之间",
            trigger: "blur"
          }
        ],
        messageType: [
          { required: true, message: "请选择消息类型", trigger: "change" }
        ],
        name: [
          { required: true, message: "请输入机器人名称", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符之间",
            trigger: "blur"
          }
        ],
        accessToken: [
          {
            required: true,
            message: "请输入机器人accessToken",
            trigger: "blur"
          },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符之间",
            trigger: "blur"
          }
        ]
      },
      modify: false,
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
    addAddress() {
      this.board.addresses.push({
        name: "",
        groupAccessToken: "",
        condition: "",
        secret: ""
      });
    },
    removeAddress(item) {
      var index = this.board.addresses.indexOf(item);
      if (index !== -1) {
        this.board.addresses.splice(index, 1);
      }
    },
    doSubmit() {
      if (this.submiting) {
        return;
      }
      this.$refs["boardForm"].validate(valid => {
        if (valid) {
          if (this.modify) {
            this.doModify();
          } else {
            this.doCreate();
          }
        } else {
          return false;
        }
      });
    },
    doCreate() {
      this.submiting = true;
      createBoard(this.board)
        .then(content => {
          this.$notify({
            title: "操作成功",
            type: "success",
            message: "模板创建成功!"
          });
          setTimeout(() => {
            this.$router.push("/board/group");
          }, 2000);
        })
        .catch(error => {
          this.submiting = false;
          this.$notify({
            title: "操作失败(" + error.errorCode + ")",
            type: "error",
            message: error.errorMsg
          });
        });
    },
    doModify() {
      this.submiting = true;
      modifyBoard(this.board)
        .then(content => {
          this.$notify({
            title: "操作成功",
            type: "success",
            message: "模板修改成功!"
          });
          setTimeout(() => {
            this.$router.push("/board/group");
          }, 2000);
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

