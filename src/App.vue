<template>
  <div id="app" @click="hideContextMenu" @contextmenu.self="hideContextMenu">
    <div class="search-block">
      <el-row type="flex" align="center">
        <el-col>
          <el-input
            @keyup.enter.native="search"
            v-model="curId"
            style="width: 462px; height: 50px"
          >
            <template #suffix>
              <a @click="search" class="search-btn">
                <i class="el-icon-search"></i>
              </a>
            </template>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="content" id="container"></div>
    <div class="menu" id="contextMenu">
      <ul>
        <li @click.stop="show(rightChoosed)">菜单1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  </div>
</template>
<style>
.line-label {
  position: absolute;
  color: black;
  z-index: 1;
  background: white;
  border-radius: 10px;
  left: 50%;
  top: -10px;
  padding: 0 10px;
}
.arrow-content {
  position: absolute;
  border-radius: 10px;
}
.line .arrow {
  position: absolute;
  color: white;
  top: 3px;
  left: 44%;
}
input {
  height: 100% !important;
  color: white !important;
}
.el-input {
  border: 2px solid black;
}
.el-input__inner {
  background: #32363d;
  padding: 0;
  border: none;
  border-radius: 0;
}
.el-button {
  border: none;
  color: white;
  background: #32363d;
}
html,
body {
  padding: 0;
  margin: 0;
}
</style>
<script>
import vis from "vis";
import Vue from "vue";
export default {
  name: "app",
  data() {
    return {
      curId: "",
      chosenId:"",
      rightChoosed: null,
      default: {
        id: "default",
        image: "imgs/default-icon.png",
      },
      nodeData: [
        {
          id: "李四",
          label:'李四',
          image: "/imgs/default-icon.png",
        },
        {
          id: "赵六",
          label:'赵六',
          image: "/imgs/default-icon.png",
        },
        {
          id: "张三",
          label:'张三',
          image: "/imgs/people/zhangsan.jpg",
        },
        {
          id: "王五",
          label:'王五',
          image: "/imgs/people/wangwu.png",
        },
      ],
      edgeData:[
        {from:'李四',to:'张三',label:'朋友'},
        {from:'李四',to:'赵六',label:'朋友'},
        {from:'李四',to:'王五',label:'朋友啊'},
        {from:'张三',to:'李四',label:'好朋友'},
      ],
      curRelation: {},
      curEdges:[],
      curNodes: [],
      network: null,
    };
  },
  mounted() {
    // this.drawLine()
  },
  watch: {},
  methods: {
    formatNodeByData(d) {
      d.shape = "circularImage";
      return d;
    },
    formatEdgeByData(d) {
      return {
        from: d.from,

        to: d.to,
        label: d.label,
        arrows: "to",
        length: 300,
        arrows: {
            middle: {
              enabled: true,
              imageHeight: 32,
              imageWidth: 32,
              scaleFactor: 1,
              src: "https://visjs.org/images/visjs_logo.png",
              type: "image",
            },
          },
          smooth: {
            enabled: true,
            type: "dynamic",
            roundness: 0.5,
          },
          endPointOffset: {
            from: 10,
            to: 10,
          },
      };
    },
    // vis关系图初始化
    initVis() {
      let vm = this;
      let curNodes = this.curNodes.map((d) => {
        return this.formatNodeByData(d);
      });
      console.log(this.curNodes);
      var nodes = new vis.DataSet(curNodes);

      let curEdges = this.curEdges.map((d) => this.formatEdgeByData(d));

      curEdges = curEdges.filter(d=>!!d.to&&!!d.from);
      console.log(curEdges);
      // create an array with edges
      var edges = new vis.DataSet(curEdges);

      // create a network
      var container = document.getElementById("container");
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {
        locale: "cn",
        physics: {
          stabilization: false,
          barnesHut: {
            gravitationalConstant: -3000, //(默认值 : -2000)引力：值越大节点越集中，反之值越小节点越离散
            springConstant: 0.02, //(default: 0.04)弹簧：值越大弹性越强
            springLength: 50, //(default: 95)弹簧长度
          },
          // minVelocity: 5 //(default: 1)一旦达到所有节点的最小速度，我们假设网络已经稳定，布局停止。
        },
        interaction: {
          navigationButtons: true,
          keyboard: true,
        },
        nodes: {
          borderWidth: 2,
          brokenImage: "/imgs/default-icon.png",
          size: 30,
          color: {
            border: "#fff",
            background: "#666666",
          },
          font: {
            color: "#eeeeee",
          },
          shadow: true,
        },
        layout: {
          randomSeed: 2,
        },
        groups: {
          root: { color: { border: "#666666" }, borderWidth: 12 },
        },
      };
      if (this.network) {
        console.log(this.network);
      } else {
      }
      this.network = new vis.Network(container, data, options);

      this.network.on("select", (data) => {
        console.log(data);
        if (data.nodes.length) {
          let relation = vm.getNodeDataById(data.nodes[0]);
          vm.triggerSelect(relation);
        }
      });

      // 单击鼠标右键触发
      this.network.on("oncontext", function (params) {
        console.log(params);
        let nodeId = this.getNodeAt(params.pointer.DOM);
        vm.showContextmenu(params, nodeId);
      });
    },
    getNodeDataById(id) {
      return this.nodeData.find((r) => r.id == id);
    },
    select(relation) {
      let vm = this;
      this.curNodes.forEach((r) => {
        if (r.id != relation.id) {
          r.group = "0";
        }
        r.chosen = {
          node: function (values, id, selected, hovering) {
            if (selected) {
              values.borderColor = "orange";
              values.borderWidth = 5;
            }
          },
        };
      });
      relation.group = "root";
      // $(`#${relation.id}-inner`).addClass("selected");
    },
    show(relation) {
      console.log(relation);
      this.hideContextMenu();
    },
    async search() {
      this.default.id = this.curId;
      let curRelation = this.nodeData.find((r) => {
        if (r.id == this.curId) {
          return r;
        }
      });
      if (curRelation) {
        this.triggerSelect(curRelation, true);
      } else {
        this.curRelations = [this.default];
        this.curRelation = this.default;
        this.triggerSelect(this.curRelation, true);
      }
      // this.process($(`#${this.curRelation.id}`));
      // console.log(this.name);
      // this.process()
    },
    async triggerSelect(curRelation, toCenter) {
      if (curRelation.id != "default") {
        
          this.getCurRelations(curRelation);
        
      }

      this.select(curRelation);
      this.initVis();
    },
    getCurRelations(curRelation) {
      this.chosenId = curRelation.id;
      let vm = this;
      this.curEdges = this.edgeData.filter(d=>d.from==vm.chosenId||d.to==vm.chosenId)

      let nodeIds = []
      this.curEdges.forEach(d=>{
        if(d.from==vm.chosenId){
          nodeIds.push(d.from)
          nodeIds.push(d.to)
        }
        if(d.to==vm.chosenId){
          nodeIds.push(d.from)
          nodeIds.push(d.to);
        }
      })
      nodeIds = unique(nodeIds)

      this.curNodes = this.nodeData.filter(d=>{
        return nodeIds.includes(d.id)
      })
      // return curRelations;
    },

    hideContextMenu() {
      $(".menu").hide();
    },
    showContextmenu(params, nodeId) {
      if (nodeId) {
        params.event.preventDefault();
        $("#contextMenu").finish().toggle(100);
        $("#contextMenu").css({
          top: params.pointer.DOM.y + "px",
          left: params.pointer.DOM.x + "px",
        });

        this.rightChoosed = this.getNodeDataById(nodeId);
      } else {
        this.rightChoosed = null;
      }
    },
    toCenterPos(o) {
      o.css("position", "absolute");
      o.css({
        left: window.innerWidth / 2 - o.width() / 2,
        top: window.innerHeight / 2 - o.height() / 2,
      });
    },
  },
  components: {},
};
</script>

<style scoped>
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}

.menu {
  background: white;
  position: absolute;
  width: 50px;
  left: 50px;
  top: 50px;
  opacity: 0.9;
  display: none;
}
.menu ul {
  list-style: none;
  margin: 0px;
  padding: 0;
  text-align: left;
}
.menu ul li:hover {
  background: blue;
}
.menu ul li {
  cursor: pointer;
}
#container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 54px);
}

.animated-rotate {
  animation: turn 5s linear infinite;
}
.relation-block .relation-name {
  bottom: -70px;
  position: relative;
  color: white;
}
.relation-block {
  position: absolute;
  width: 105px;
  height: 105px;
  display: flex;
  justify-content: center;
  align-items: center;
}
a {
  cursor: pointer;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
  background: url("/imgs/bg.jpg") no-repeat center;
}
.circle {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-size: contain;
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  box-shadow: 0 0 10px #fff;
}
.circle.outter {
  width: 80px;
  height: 80px;
}
.circle.selected {
  border: 2px solid orange;
}
.orange-circle {
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.search-block {
}
.search-btn {
  line-height: 50px;
  margin-right: 1rem;
  font-size: 1.1rem;
  color: white;
}

.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100% - 54px);
}
</style>
