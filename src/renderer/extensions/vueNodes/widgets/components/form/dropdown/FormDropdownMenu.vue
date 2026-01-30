<script setup lang="ts">
import type { CSSProperties, MaybeRefOrGetter } from 'vue'
import { computed } from 'vue'

import VirtualGrid from '@/components/common/VirtualGrid.vue'

import FormDropdownMenuActions from './FormDropdownMenuActions.vue'
import FormDropdownMenuFilter from './FormDropdownMenuFilter.vue'
import FormDropdownMenuItem from './FormDropdownMenuItem.vue'
import type {
  DropdownItem,
  FilterOption,
  LayoutMode,
  OptionId,
  SortOption
} from './types'

interface Props {
  items: DropdownItem[]
  isSelected: (item: DropdownItem, index: number) => boolean
  filterOptions: FilterOption[]
  sortOptions: SortOption[]
  searcher?: (
    query: string,
    onCleanup: (cleanupFn: () => void) => void
  ) => Promise<void>
  updateKey?: MaybeRefOrGetter<unknown>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'item-click', item: DropdownItem, index: number): void
}>()

// Define models for two-way binding
const filterSelected = defineModel<OptionId>('filterSelected')
const layoutMode = defineModel<LayoutMode>('layoutMode')
const sortSelected = defineModel<OptionId>('sortSelected')
const searchQuery = defineModel<string>('searchQuery')

// VirtualGrid configuration based on layout mode
const maxColumns = computed(() => {
  switch (layoutMode.value) {
    case 'grid':
      return 4
    case 'list':
    case 'list-small':
      return 1
    default:
      return 4
  }
})

const defaultItemHeight = computed(() => {
  switch (layoutMode.value) {
    case 'grid':
      return 120
    case 'list':
      return 64
    case 'list-small':
      return 40
    default:
      return 120
  }
})

const defaultItemWidth = computed(() => {
  switch (layoutMode.value) {
    case 'grid':
      return 89
    case 'list':
    case 'list-small':
      return 380
    default:
      return 89
  }
})

const gridStyle = computed<CSSProperties>(() => ({
  display: 'grid',
  gridTemplateColumns:
    layoutMode.value === 'grid' ? 'repeat(4, 1fr)' : 'repeat(1, 1fr)',
  gap:
    layoutMode.value === 'grid'
      ? '1rem 0.5rem'
      : layoutMode.value === 'list'
        ? '0.5rem'
        : '0.25rem',
  padding: '1rem',
  width: '100%'
}))

type VirtualDropdownItem = DropdownItem & { key: string }
const virtualItems = computed<VirtualDropdownItem[]>(() =>
  props.items.map((item) => ({
    ...item,
    key: String(item.id)
  }))
)
</script>

<template>
  <div
    class="flex h-[640px] w-103 flex-col rounded-lg bg-component-node-background pt-4 outline outline-offset-[-1px] outline-node-component-border"
  >
    <!-- Filter -->
    <FormDropdownMenuFilter
      v-if="filterOptions.length > 0"
      v-model:filter-selected="filterSelected"
      :filter-options="filterOptions"
    />
    <!-- Actions -->
    <FormDropdownMenuActions
      v-model:layout-mode="layoutMode"
      v-model:sort-selected="sortSelected"
      v-model:search-query="searchQuery"
      :sort-options="sortOptions"
      :searcher
      :update-key="updateKey"
    />
    <!-- List Container -->
    <div class="relative mt-2 min-h-0 flex-1">
      <!-- Empty State -->
      <div
        v-if="items.length === 0"
        class="flex h-50 items-center justify-center"
      >
        <i
          :title="$t('g.noItems')"
          :aria-label="$t('g.noItems')"
          class="icon-[lucide--circle-off] size-30 text-zinc-500/20"
        />
      </div>
      <!-- Virtualized Grid -->
      <VirtualGrid
        v-else
        :key="layoutMode"
        :items="virtualItems"
        :grid-style="gridStyle"
        :max-columns="maxColumns"
        :default-item-height="defaultItemHeight"
        :default-item-width="defaultItemWidth"
        :buffer-rows="2"
        class="h-full"
      >
        <template #item="{ item, index }">
          <FormDropdownMenuItem
            :index="index"
            :selected="isSelected(item, index)"
            :media-src="item.mediaSrc"
            :name="item.name"
            :label="item.label"
            :metadata="item.metadata"
            :layout="layoutMode"
            @click="emit('item-click', item, index)"
          />
        </template>
      </VirtualGrid>
    </div>
  </div>
</template>
