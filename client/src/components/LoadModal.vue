<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  to: {
    type: String,
    required: false,
    default: 'body'
  },
  teleport: {
    type: Boolean,
    required: false,
    default: true
  }
})
</script>
<template>
    <Teleport v-if="teleport" :to="to">
        <div v-if="props.open" class="modal">
            <div class="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    </Teleport>
    <div v-else>
      <div v-if="props.open" class="modal-unfixed">
          <div class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
          </div>
      </div>
    </div>
</template>

<style scoped>
.modal,
.modal-unfixed {
  display: flex;
  place-items: center;
  place-content: center;
  height: 100%;
  width: 100%;
  opacity: .85;
  background: var(--color-background);
}
.modal {
  position:fixed;
  top: 0;
}
.lds-ring,
.lds-ring div {
  box-sizing: border-box;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid currentColor;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>