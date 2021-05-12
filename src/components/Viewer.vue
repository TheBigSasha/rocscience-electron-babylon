<template>
  <div style="width: 100%; height: 100vh" >

    <Scene
      id="canvas"
      style="height: calc(100vh - 130px); width: 100%; background-color: #000000"
      @scene="sceneReady"
      :content="`<strong>Current <span>mesh</span> (${curMesh.name})    <div>
    <p>
    <pre>X    |  Y  |    Z </pre>
      ${(curPoint.x != null ? curPoint.x : '').toString().substring(0, 5)} |

      ${(curPoint.y != null ? curPoint.y : '').toString().substring(0, 5)} |

      ${(curPoint.z != null ? curPoint.z : '').toString().substring(0, 5)}
    </p>
  </div> </strong>`"
      v-tippy="{ followCursor: true }"
    >
      <!-- When scene finishes loading call sceneReady method-->

      <HemisphericLight></HemisphericLight>
      <!-- Sets lighting -->

      <PointLight v-if="this.extraLights" :position="[0, 0.5, 0]" specular="#FF0000"></PointLight>

    </Scene>

    <div class="controls">
      <textarea class="textarea"
        v-model="modelPath"
        placeholder="Model File Path"
        style="width: 80%"
      ></textarea>
      <div style="display: block">
        <button class="up" @click="loadObj">Load</button>
        <button class="pulse" @click="onClear">Clear</button>
        <button class="fill" @click="reCenter">Re-Center</button>
        <button class="raise" @click="toggleInfo">Info</button>
        <button class="slide" @click="toggleLights">Lights</button>
      </div>
      <MouseInfo
          v-if="this.infoModal"
          :curMesh="this.curMesh"
          :curPoint="this.curPoint"
          @delete-mesh="onDelete($event)"
          @modal-close="toggleInfo"
      ></MouseInfo>
    </div>
  </div>
</template>


<script>
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import MouseInfo from "@/components/MouseInfo";

export default {
  name: "Viewer",
  components: { MouseInfo },
  data: () => {
    // initializing variables
    return {
      infoModal: false,
      extraLights: true,
      myScene: Object,
      curMesh: Object,
      curPoint: Object,
      meshes: [],
      modelPath: "public/static/models/violinNbow.obj",
    };
  },
  methods: {
    toggleInfo() {
      this.infoModal = !this.infoModal
    },
    toggleLights() {
      this.extraLights = !this.extraLights;
    },
    pointer() {
      var pickingInfo = this.myScene.pick(
        this.myScene.pointerX,
        this.myScene.pointerY
      );

      this.curPoint = pickingInfo.pickedPoint;
      this.curMesh = pickingInfo.pickedMesh;
      this.myScene.cameras[this.myScene.cameras.length - 1].target =
        pickingInfo.pickedPoint;
    },
    sceneReady(scene) {
      this.myScene = scene;
      this.myScene.clearColor = new BABYLON.Color3(0, 0, 0);
      var camera = new BABYLON.ArcRotateCamera(
        "camera",
        Math.PI / 2,
        Math.PI / 2,
        500,
        new BABYLON.Vector3(0, 0, 0),
        this.myScene
      );
      var canvas = document.getElementById("canvas");
      camera.attachControl(canvas, false);

      console.log(scene);
      this.loadObj();
      // camera.setTarget(this.myScene.meshes[0]);
    },
    onDelete(item) {
      item.dispose();
    },
    reCenter() {
      const meshData = this.myScene.meshes[this.myScene.meshes.length - 1].getVerticesData(
          BABYLON.VertexBuffer.PositionKind
      );
      const target = new BABYLON.Vector3(meshData[0],meshData[1],meshData[2]);
      this.myScene.cameras[this.myScene.cameras.length - 1].target = target;
      this.myScene.cameras[this.myScene.cameras.length - 1].position = target.add(
        new BABYLON.Vector3(0, 0, 5)
      );
    },

    onClear() {
      while (this.myScene.meshes.length > 0) {
        this.myScene.meshes[0].dispose();
      }
    },

    async loadObj() {
      var filePath = this.modelPath;
      console.log("Loading OBJ");
      await BABYLON.SceneLoader.AppendAsync(
        "./static/models/",
        filePath.split("/")[3],
        this.myScene,
      ).then(() => {
        this.reCenter();
      });
    },
  },
  mounted() {
    // call pointer method on click
    this.myScene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === 1) {
        this.pointer();
      }
    });
  },
};
</script>

<style>
.controls {
  align-content: center;
  align-items: center;
  overflow-scrolling: auto;
  overflow-x: scroll;
  overflow-y: hidden;
}

.textarea{
  color: white;
  font-family: "JetBrains Mono", monospace;
  background: black;
}
</style>
