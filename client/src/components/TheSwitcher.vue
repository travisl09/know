<script setup>
</script>

<template>
<label id="switch" class="switch">
    <input type="checkbox" @change="(event) => $emit('toggled', event.target.checked)" id="slider">
    <span class="slider round"></span>
</label>
</template>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-text);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 25px;
  width: 25px;
  left: 0px;
  bottom: 4px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  box-shadow: 0 0px 15px #2020203d;
  background: var(--color-background-mute)
}

input:checked + .slider {
  background: var(--color-text);
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(19px);
  -ms-transform: translateX(19px);
  transform: translateX(19px);
  background: var(--color-background-mute)
}

/* Rounded sliders */
.slider.round {
  border-radius: 30px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>