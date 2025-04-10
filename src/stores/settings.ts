import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { Religion } from '../types/emotion'

export const useSettingsStore = defineStore('settings', () => {
  const selectedReligions = ref<Religion[]>(
    JSON.parse(localStorage.getItem('selectedReligions') || `["${Religion.Christianity}"]`)
  )

  watch(selectedReligions, (newValue) => {
    localStorage.setItem('selectedReligions', JSON.stringify(newValue))
  })

  function toggleReligion(religion: Religion) {
    const index = selectedReligions.value.indexOf(religion)
    if (index === -1) {
      selectedReligions.value.push(religion)
    } else if (selectedReligions.value.length > 1) {
      // Ensure at least one religion is always selected
      selectedReligions.value.splice(index, 1)
    }
  }

  function setSelectedReligions(religions: Religion[]) {
    if (religions.length > 0) {
      selectedReligions.value = religions
    }
  }

  return {
    selectedReligions,
    toggleReligion,
    setSelectedReligions
  }
}) 