import { defineStore } from 'pinia'

export const useChartStore = defineStore('chart', {
  state: () => {
    return {
      svgData: '',
      isEditMode: true,
      activeX: '',
      activeY: '',
      activeS: ''
    }
  }
})
