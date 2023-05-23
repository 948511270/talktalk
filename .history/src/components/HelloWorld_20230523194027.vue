<template>
  <div class="hello">
    <div class="container">
      
      <div id="friend-list">
        <div class="aFriend" v-for="(item,i,index) in allChatRecordsRelatedToThisUser" :key="index" style="display: flex; border-bottom: 0.8px solid gainsboro;width: 100%;"
        v-bind:class="{'activeFriend':activeVar == index}" @click="activeFun(index)">
          <img  :src=item[0].avatar alt="好友头像" style="margin-top: 6.4px;margin-bottom: 2px; margin-left: 4px; 
          width: 20%;" >
          <div class="friend-infomation-top" style="margin-top: 4px;height: 50%;" >
            <div style="width: 200px;display: flex;flex-direction: row;justify-content:space-between ;">
              <span style="font: 1em Arial, Tahoma, Verdana;padding-left: 15px;">{{ item[0].nickName }}</span>
              <span style="font: 0.8em sans-serif;margin-top: 0.3999%;bottom: 0;"  >{{ item[0].deadline.split(' ')[0] }}</span>
            </div>
          </div>
        </div>
        
      </div>

      <div class="box-right">
        <div id="top-infomation-box">
        <span style="display: block;margin-left: 8px;padding:1.6%;font: 1.6em Arial, Tahoma, Verdana;" >{{ nowFriend }}</span>
        </div>
        <div id="chat-box">
          <div class="main" style="overflow: scroll;" ref="chatboxRef">
            <ul id="message">
            
            
              <li v-for="(item,i,index) in allChatRecordsRelatedToThisUser" :key="index">
              
                <template v-if="item[0].friendId == nowTalkingFriendId">
                  
                  <span v-for="(item,i,index) in item" :key="index"> 
                    <template v-if="item.senderId == nowTalkingFriendId || item.receiverId == UserId ">
                     <!-- <template v-if="item.senderId == '1' "> -->
                      <li class="text-left" >
                        <div style="display: inline-block;border-radius: 7px;background-color:  #59c1e4;padding: 6px 10px 8px 10px;position: relative;">
                          {{item.content}}
                        </div>
                      </li>
                     </template>
                     <template v-if="item.senderId == UserId || item.receiverId == nowTalkingFriendId ">
                     <!-- <template v-if="item.senderId == '2' "> -->
                      <li class="text-right"  >
                        <div class="item.content" style="display: inline-block;border-radius: 7px;background-color: #a6e860;padding: 6px 10px 8px 10px;position: relative;">
                          {{item.content}}
                        </div>
                      </li>
                     </template>
                  </span>

                </template>
                
              </li>
              <p class="time" v-if="nowFriend">最后聊天时间：{{  lastTime }}</p>
                 
              
          </ul>
          <ul v-html="chatCache"></ul>
          </div>
          
        </div>
        <div id="input-box" style="display:inline-block;position:relative;">
        <textarea style="width: 99.8%;height:75.6%;border: 0px;" v-model="text"></textarea>
        <img src="@/assets/emoji.png" style="display: inline-block;height: 18%;width: 4%;padding-left: 5px;" 
        v-on:click="clickEmoji()" >
        <el-row style="position: absolute;display: inline-block; right: 1lvw;">
          <el-button round size="small" type="success"  style="" @click="clickSubmit()">发送</el-button>
        </el-row>
        
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>


let that = this
let socket;
export default {
  name: 'HelloWorld',
  props: {
    
  },
  data() {
    return {
      // 标识了选中了左边选中了和哪个人聊天，之后给他加灰色选中效果
        lastTime:null,
        nowFriend:null,
        activeVar:null,
        token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjg1MTEwNTgwfQ.DP5t-a8SH-5Mc5nxXjmnvIJA7AJ78EkCg9oOTyugkuI',
        text:'',
        UserId:'1',
        nowTalkingFriendId:'',
        nowTalkFriendAvatar:'',
        allChatRecordsCopy:'',
        allChatRecordsRelatedToThisUser:'',
        chatCache:''

    
    }
  },
  created() {
    
      this.init()
    },
  methods:{
    init(){
     
      //此处请求该用户的所有聊天记录
     this.$axios.get('/record/getChatRecord',{
              headers: {
                // 此处将该用户的token加入到axios请求头中
                'Authorization': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNjg1MTEwNTgwfQ.DP5t-a8SH-5Mc5nxXjmnvIJA7AJ78EkCg9oOTyugkuI'
              }

              }).then(res=>{
                  console.log("该用户的全部聊天记录：",res);
                  // 获取到的是{[],[]}格式
                  this.allChatRecordsRelatedToThisUser = res.data.data
                  
                  // 处理成数组形式 [[],[]]  (关于为什么要处理：为了用索引值拿id，只有转换成数组形式，才能有索引值。对象形式vue会把id当作索引值)
                  this.allChatRecordsCopy = Object.entries(this.allChatRecordsRelatedToThisUser)
                  
                 
                },err=>{
                  console.log("获取该用户的全部聊天记录失败，",err);
              })
              
      
      // 此处测试WebSocket连接
      if (typeof (WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        let socketUrl = "ws://192.168.75.99:9000/chat/" + this.UserId 
        // 判断此处是否已经开启了WebSocket服务，如果开启了，则把它关了。
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        // socket = new WebSocket(socketUrl,[this.token]);
        socket = new WebSocket(socketUrl)
        console.log("开启了websocket服务");
        //打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        };
        socket.onmessage = function (msg) {
          
          let data = JSON.parse(msg.data)
          console.log("onmessage方法调用,WebSocket接收到消息:",data);

          if(!data.system){
            // this.createContent(data.fromId,null,data.message)
            that.clog()
          }
          
        }
        socket.onclose = function () {
          console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
        }
      }
      
    },
    
    clickEmoji(){
      console.log("clickEmoji()");
      
    },
    clickSubmit(){
      console.log("点击了发送按钮");
      if (!this.nowTalkingFriendId) {
        this.$message({type: 'warning', message: "请选择聊天对象"})
        return;
      }
      if (!this.text) {
        this.$message({type: 'warning', message: "请输入内容"})
      } else {
        if (typeof (WebSocket) == "undefined") {
          console.log("您的浏览器不支持WebSocket");
        } else {
          console.log("您的浏览器支持WebSocket");

          try {
              // 发送消息
              let message = {fromId: this.UserId, toId: this.nowTalkingFriendId, content: this.text,messageType:'文字'}
              // 将组装好的json发送给服务端，由服务端进行转发
              socket.send(JSON.stringify(message));  
              

          } catch (error) {
            // send失败后调用error
            alert("网络错误")
          }
        }

      this.createContent(null,this.UserId,this.text)
      //将textarea里的文字清空，因为双向绑定了 data里的text，所以只需要将text清空
      this.text = ''
      
  } 
          
    },
    
    createContent(nowTalkingFriendId,UserId,text){
      console.log("createContent()调用");
      let html
      
      // 当前用户消息
      if (UserId) { // UserId 表示是否显示当前用户发送的聊天消息，绿色气泡
          console.log("进入了if");
        html = "<li class=\"text-right\" style=\"text-align: right;\" >\n"+
          "<span style=\"display: inline-block;border-radius: 7px;background-color:  #a6e860;padding: 6px 10px 8px 10px;position: relative;\">\n"+
          text +
          "</span>\n"+
          "</li>";
      } else if (nowTalkingFriendId) {   // nowTalkingFriendId表示远程用户聊天消息，蓝色的气泡
        console.log("进入了else if");
        html = "<li class=\"text-left\" >\n"+
          "<div style=\"display: inline-block;border-radius: 7px;background-color: #59c1e4;padding: 6px 10px 8px 10px;position: relative;\">\n"+
            + text +
          "</div>\n"+
          "</li>";
      }
      
      this.chatCache += html;
      

    },

    activeFun(index){
        // item 为被选中的元素体
        this.activeVar=index
        
        // 这里将当前选中的人赋值给nowFriend，以供给聊天界面显示当前聊天对象昵称
        this.nowFriend = this.allChatRecordsCopy[this.activeVar][1][0].nickName
        this.nowTalkingFriendId = this.allChatRecordsCopy[this.activeVar][0]
         
        // 这里将时间切割为 19:23:38 格式
        this.lastTime = this.allChatRecordsCopy[this.activeVar][1][0].deadline.split(' ')[1]
    },

    clog(){
      console.log("进入了clog()");
    }

  
  
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.hello {
  
  position: absolute;
  height: 100%;
  width: 100%;
  /* 下面这种方法也可以，vw和vh是以浏览器为参考的调整大小参数，1vw=浏览器宽度*1%  */
  /* width: 100vw;
  height: 100vh; */
  background-image: linear-gradient(to bottom right, #e6f2f9, #a1c8f8);
}
.container{
  
  position: fixed;
  width: 65%;
  height: 70%;
  top: 14%;
  right: 17.5%;
  border-radius: 3%;
  background-color: #ffffff;
}
#friend-list{
  
 display:inline-block;
 background: #ffffff;
 border-radius: 3% 0 0 3%;
 width:23%;
 height: 100%;
 overflow-x:hidden;
 overflow-y:auto;
}
#friend-list::-webkit-scrollbar{
  display: none;
}
.main::-webkit-scrollbar{
  display: none;
}
.box-right{
  display:inline-block;
  width: 77%;
  height: 100%;
  vertical-align: top;
  border-radius: 0 3% 3% 0;
  background-color: #ffffff;
}
#top-infomation-box{
  width: 100%;
  height: 10%;
  border-bottom: 0.8px solid;
  border-image: radial-gradient(rgb(13, 4, 3) 10%, rgb(137, 176, 184) 100%) 0.8;
}

#chat-box{
  width: 100%;
  height: 55%;
  border-bottom: 0.6px solid;
  border-image: radial-gradient(rgb(13, 4, 3) 10%, rgb(137, 176, 184) 100%) 0.8;
}
.main{
  width: 100%;
  height: 95%;
  position: relative;
  background-color: #ffffff;
  /* box-shadow: 0 0 10px 3px cornflowerblue; */
  margin: 20px auto;
}
.main ul{
  padding:20px 30px;
  list-style:none;
}
.main li{
  padding: 5px;
  margin-bottom: 10px;
  position: relative;
}
.main .time{
  font-size: 12px;
  text-align: center;
  line-height: 20px;
  color: #999;
}

.main li.text-left span{
  background-color: white;
}

.main li.text-left:after{
  content: '';
  display: block;
  width: 0;
  height: 0;
  border:4px solid transparent;
  border-right:4px solid white;
  position: absolute;
  top: 6px;
  left: -8px;
}
.main li.text-right:after{
  content: '';
  display: block;
  width: 0;
  height: 0;
  border:4px solid transparent;
  border-right:4px solid white;
  
  position: absolute;
  top: 6px;
  left: -8px;
}
.text-right{
  text-align: right;
}
.main li.text-right:after{
  content: '';
  width: 22px;
  height: 22px;
  border-radius: 3px;
  display: block;
  background-size: 100%;
  position: absolute;
  right: -23px;
  top: 5px;
  
}

#input-box{
  left: 16px;
  width: 95%;
  height: 30%;
}
/* 禁止textarea随鼠标缩放 */
textarea {
    resize: none;
}
/* 禁止textarea点击边框加粗 */
textarea:focus {
    outline: none;
}

.activeFriend{
  background-color: gainsboro;

}
</style>
