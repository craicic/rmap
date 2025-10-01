<script setup lang="ts">
import {ref} from 'vue';

const selected = ref('webp')
const options = ref([
  {text: 'WEBP', value: 'webp'},
  {text: 'PNG', value: 'png'},
  {text: 'JPG', value: 'jpg'}
])
const min = ref(0)
const max = ref(4)
const range: Ref<number[], number[]> = ref([0, 1, 2, 3, 4, 5, 6, 7, 8])
const minSaved = ref(false)
const maxSaved = ref(false)
const title = ref('')
const setMin = (e: Event) => {
  min.value = Number((e.target as HTMLInputElement).value)
}

const saveMin = () => {
  minSaved.value = true;
  range.value.splice(0, min.value + 1)
}

const setMax = (e: Event) => {
  max.value = Number((e.target as HTMLInputElement).value)
}

const saveMax = () => {
  maxSaved.value = true;
}

const resetForm = () => {
  min.value = 0;
  max.value = 4;
  range.value = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  minSaved.value = false;
  maxSaved.value = false;
}

const setTitle = (e: Event) => {
  title.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <form>
    <div>
      <label for="title">Choose map title: </label>
      <input id="title" type="text" @change="setTitle">
    </div>
    <div>

      <div>Selected: {{ selected }}</div>
      <label for="uname">Choose map title: </label>
      <select v-model="selected">
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div>
      <label for="min">Minimal zoom level : {{ min }}</label><br>
    </div>
    <div v-if="!minSaved">
      <input id="min" type="range" min="0" max="4" step="1" list="markers1" :value="min.toString()" @change="setMin">

      <datalist id="markers1">
        <option value="0" label="Far zoom"></option>
        <option value="1" label=""></option>
        <option value="2" label=""></option>
        <option value="3" label=""></option>
        <option value="4" label="Close zoom"></option>
      </datalist>

      <button id="saveMin" type="button" @click.prevent="saveMin">Save Minimal Zoom Level</button>
    </div>

    <div v-else>
      <div>
        <label for="min">Maximal zoom level : {{ max }}</label><br>
      </div>
      <div v-if="!maxSaved">
        <input id="max" type="range" :min="range[0]" max="8" step="1" list="markers2" :value="max" @change="setMax">

        <datalist id="markers2">
          <option v-for="number in range" :key="number" :value="number" :label="number.toString()"></option>
        </datalist>
        <button id="saveMin" type="button" @click.prevent="saveMax">Save Maximal Zoom Level</button>
      </div>
    </div>
    <hr>
    <div>
      <button id="reset" type="button" @click.prevent="resetForm">Reset form</button>

      <button
          v-if="minSaved && maxSaved && title" id="transform" type="button"
          @click.prevent="$emit('isSet', title, min, max, selected)">
        Transform map to tiles
      </button>
    </div>
  </form>
</template>

<style scoped>
datalist {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 200px;
}

option {
  padding: 0;
}

input[type="range"] {
  width: 200px;
  margin: 0;
}
</style>