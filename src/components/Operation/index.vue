<template>
  <div class="operation">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Operation',
  setup() {},
  components: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss">
.operation {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  height: 60px;
  border: 1px solid #f0f0f0;
  background-color: #fafafa;
}
</style>
