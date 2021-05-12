<template>
  <v-overlay>
    <div class="card">
      <h1>Selection Info</h1>
      <h1 v-if="curMesh == null">No mesh</h1>
      <div v-else>
        <p>{{ curMesh.name.toString().substring(0,27)}}</p>
        <br/>
        <p>Vertices: {{ curMesh.getTotalVertices() }}</p>
      </div>
      <div class="coords" v-if="curPoint != null">
        <p>
          {{ curPoint.x.toString().substring(0, 5) }}
        </p>
        <p>
          {{ curPoint.y.toString().substring(0, 5) }}
        </p>
        <p>
          {{ curPoint.z.toString().substring(0, 5) }}
        </p>
      </div>
      <button class="offset" v-if="curMesh != null" @click="onDelete(curMesh)">Delete</button>
      <button class="close" @click="onClose">Close</button>
    </div>
  </v-overlay>
</template>

<script>
export default {
  name: "MouseInfo",
  props: ["curMesh", "curPoint"],
  methods: {
    onDelete(mesh) {
      this.$emit("delete-mesh", mesh);
      this.onClose();
    },
    onClose(){
      this.$emit("modal-close");
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap");
.card {
  background: rgba(0, 0, 0, 0.52);
  border-radius: 25px;
  text-align: center;
  max-width: 400px;
  padding: 20px;
  margin: 10px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}
template {
  max-height: 300px;
}
p{
  font-family: "JetBrains Mono", monospace;

}
.coords p{
  display: inline-block;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 25px;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);

}
</style>
