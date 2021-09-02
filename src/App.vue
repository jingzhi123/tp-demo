<template>
  <div id="app" @click="hideContextMenu" @contextmenu.self="hideContextMenu">
    <div class="search-block">
      <el-row type="flex" align="center">
        <el-col>
          <el-input
            @keyup.enter.native="search"
            v-model="name"
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
    <div class="content">
      <div
        class="relation-block"
        @click="triggerSelect(relation)"
        :key="i"
        v-for="(relation, i) in curRelations"
        :style="positionStyle(relation)"
        :id="relation.id"
        :data-id="relation.id"
        :data-to="relation.to"
        :data-label="relation.label"
        :data-from="relation.from"
      >
        <div
          v-if="relation.selected"
          :id="'orange-' + relation.id"
          class="circle orange-circle outter flex-center animated-rotate"
          style="background-image: url(/imgs/orange-circle.png)"
        ></div>
        <div
          :id="relation.id + '-inner'"
          @contextmenu="showContextmenu($event, relation)"
          :class="
            curRelation.id == relation.id
              ? 'centerEle'
              : relation.selected
              ? ' selected'
              : ''
          "
          class="circle"
          :style="circleStyle(relation)"
        ></div>
        <div class="relation-name">{{ relation.name }}</div>
        <div class="menu" v-if="relation.showMenu">
          <ul>
            <li @click.stop="show(relation)">菜单1</li>
            <li>2</li>
            <li>3</li>
          </ul>
        </div>
      </div>
      <!-- <div class="svg-container">
    <svg class="line" id="svg-object">
        <line x1="0" y1="0" x2="10px" y2="200" />
        <path d="M102,250 Q242,114 394,244" />
    </svg>
</div> -->
    </div>
    <!-- <div id="container"></div> -->
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
import Vue from 'vue'
export default {
  name: "app",
  data() {
    return {
      name: "",
      curName:'',
      default: {
        id: "default",
        name: "",
        imgUrl: "imgs/default-icon.png",
      },
      relations: [
        {
          id: "李四",
          name: "李四",
          to: "张三",
          label: "朋友",
          imgUrl: "/imgs/default-icon.png",
          showMenu: false,
          selected: false,
          position: { left: 200, top: 300 },
        },
        {
          id: "张三",
          name: "张三",
          to: "李四",
          label: "朋友",
          imgUrl: "/imgs/people/zhangsan.jpg",
          selected: false,
          showMenu: false,
          position: { left: 500, top: 500 },
        },
        {
          id: "王五",
          name: "王五",
          to: "李四",
          label: "朋友啊",
          imgUrl: "/imgs/people/wangwu.png",
          selected: false,
          showMenu: false,
          position: { left: 1000, top: 100 },
        },
      ],
      curRelation: {},
      curRelations: [],
    };
  },
  mounted() {
    // this.initVis(this.relations)
    // this.drawLine()
  },
  watch:{
    'curRelations'(nv,ov){
      // console.log(nv,ov);
      if(nv.length<ov.length){
        let rv = ov.filter(items => nv.indexOf(items) == -1);
        if(rv.length){
          this.removeLine(rv[0].id)
        }
      }
    }
  },
  computed: {
    circleStyle(relation) {
      // let relation = vm.curRelation;
      return function (relation) {
        let circleStyle = {
          backgroundImage: `url(${relation.imgUrl})`,
        };

        return circleStyle;
      };
    },
    positionStyle(relation) {
      return function (relation) {
        let style = {};
        if (relation.position && this.curRelation.id != relation.id) {
          style = {
            left: relation.position.left + "px",
            top: relation.position.top + "px",
          };
        }
        return style;
      };
    },
    stringify(obj) {
      return function (obj) {
        return JSON.stringify(obj);
      };
    },
  },
  methods: {
    removeLine(id){
      let line = $(`#${id}-line`);
      // let lineTo = $(`#${to}-line`);
      let lineLabel = $(`#${id}-line-label`);
      // let arrowTo = $(`#${to}-line-label`);
      line.remove();
      // lineTo.remove();
      lineLabel.remove();
    },
    drawLine(relation) {
      let startObj = $(`#${relation.id}`);
      // let endObj = $(`#${relation.to}`);

      // $(`.line`).remove();
      this.updateElement(startObj);
      // let div = this.getLineDiv(startObj, endObj);
      // $(".content").append(div);

      // let line = $(`#${relation.id}-line`);
      // let lineLabel = $(`#${relation.id}-line-label`)
      // let lineArrow = lineLabel.find('.arrow')
      // let lineLabelLeft = line.width()/2 - (lineLabel.width()+20)/2 + "px";
      // lineLabel.css("left",lineLabelLeft)
      // lineArrow.css("left",-(lineLabel.width()+20)/5)
    },
    // vis关系图初始化
    initVis(body) {
      var nodes = new vis.DataSet([
        { id: 1, label: "Node 1" },
        { id: 2, label: "Node 2" },
        { id: 3, label: "Node 3" },
        { id: 4, label: "Node 4" },
        { id: 5, label: "Node 5" },
      ]);

      // create an array with edges
      var edges = new vis.DataSet([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 },
      ]);

      // create a network
      var container = document.getElementById("container");
      var data = {
        nodes: nodes,
        edges: edges,
      };
      var options = {};
      var network = new vis.Network(container, data, options);
    },
    select(relation) {
      this.curRelations.forEach((r) => {
        if (r.id != relation.id) {
          r.selected = false;
        }
      });
      relation.selected = true;
      // $(`#${relation.id}-inner`).addClass("selected");
    },
    show(relation) {
      console.log(relation);
      relation.showMenu = false;
    },
    updateElements(event, ui) {
      if ($(".relation-block").length > 0) {
        $(".relation-block").each((i, o) => {
          this.updateElement($(o));
        });
      }
    },
    updateElement(obj) {
      if (!obj) return;
      let id = obj.attr("id");
      let to = obj.attr("data-to");
      this.removeLine(id)
      let startObj = $(`#${id}`);
      let endObj = $(`#${to}`);

      let div = this.getLineDiv(startObj, endObj);
      $(".content").append(div);

      let line = $(`#${id}-line`);
      let lineLabel = $(`#${id}-line-label`);
      let lineArrow = lineLabel.find(".arrow");
      let lineLabelLeft =
        line.width() / 2 - (lineLabel.width() + 20) / 2 + "px";
      lineLabel.css("left", lineLabelLeft);
      lineArrow.css("left", -(lineLabel.width() + 20) / 4);
    },
    getLineDiv(startObj, endObj) {
      let id = $(startObj).attr("id");
      let toId = $(endObj).attr("id");
      let label = $(startObj).attr("data-label");
      if(!toId){return ``}

      const startY = startObj.offset().top + startObj.height() / 2;
      const startX = startObj.offset().left + startObj.width() / 2;

      // 终点元素中心坐标
      const endY = endObj.offset().top + endObj.height() / 2;
      const endX = endObj.offset().left + endObj.width() / 2;

      // 用勾股定律计算出斜边长度及其夹角（即连线的旋转角度）
      const lx = endX - startX;
      const ly = endY - startY;
      // 计算连线长度
      const length = Math.sqrt(lx * lx + ly * ly) - startObj.width();
      if(length<0){debugger}
      // 弧度值转换为角度值
      const c = (360 * Math.atan2(ly, lx)) / (2 * Math.PI);

      // 连线中心坐标
      const midX = (endX + startX) / 2;
      const midY = (endY + startY) / 2;
      const deg = c <= -90 ? 360 + c : c; // 负角转换为正角
      const left = midX - length / 2;
      let div = `
      
      <div
          id="${id}-line"
          data-to="${toId}"
          class="line"
          style="
            position:absolute;
            top: ${midY}px;
            left: ${left}px;
            width: ${length}px;
            transform: rotate(${deg}deg);
            border: 1px solid white;">
          <div 
            style="transform: rotate(-180deg);"
            id="${id}-line-label"
            class="line-label">
            <span>${label}</span>
            <div class="arrow">
            <i class="el-icon-caret-left"></i>
          </div>
      </div>
        
        `;

      return div;
    },
    async search() {
      $(".line,.line-label").remove();
      this.default.name = this.name;
      this.curRelations.forEach((r) => {
        r.selected = false;
        r.showMenu = false;
      });

      let curRelation = this.relations.find((r) => {
        if (r.name == this.name) {
          return r;
        }
      });
      if (curRelation) {
        this.triggerSelect(curRelation,true)
      } else {
        this.curRelations = [this.default];
        this.curRelation = this.default;
      }
      this.process($(`#${this.curRelation.id}`));
      console.log(this.name);
      // this.process()
    },
    async triggerSelect(curRelation,toCenter){
      this.curName = curRelation.name;
      if(curRelation.id=='default'){
        this.curRelations = [this.default]
        return;
      }
      if(this.curName==this.name){
        this.curRelations = this.getCurRelations();

      } else {
        this.curRelations = this.curRelations.concat(this.getCurRelations());
        this.curRelations = unique(this.curRelations)

      }
      if(toCenter){
        this.curRelation = curRelation;
        await this.$nextTick();
        this.toCenterPos($(`#${curRelation.id}`));
      }
      this.select(curRelation);

      if (this.curRelations.length > 0 && this.curRelation.id!='default') {
        await Vue.nextTick();
        this.updateElements()
        $(".relation-block").draggable({
          cursor: "move",
          //start: justLog,
          drag:this.updateElements,
          // stop: this.updateElements,
          //stop: justLog
        });
      }
    },
    getCurRelations(){
      let vm = this;
      let c1 = this.relations.filter(r=>{
        return (r.name==vm.curName||r.to==vm.curName);
      });
      let c2 = [];
      if(c1.length == 1){
        let c1r = c1[0];
        this.relations.forEach(r=>{
          if(c1r.to==r.name){
            c2.push(r)
          }
        })

      }
      let curRelations = c1.concat(c2);
      curRelations = unique(curRelations)
      return curRelations;
    },
    process(ele) {
      $(ele).draggable({ cursor: "crosshair" });
      // this.curRelations.forEach((relation) => {
      //   this.drawLine(relation);
      // });
    },
    hideContextMenu() {
      for (let index = 0; index < this.curRelations.length; index++) {
        const relation = this.curRelations[index];
        relation.showMenu = false;
      }
    },
    showContextmenu(e, relation) {
      e.preventDefault();

      relation.showMenu = true;
      console.log("show");
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
