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

const { items, isSelected, filterOptions, sortOptions, searcher, updateKey } =
  defineProps<Props>()
const emit = defineEmits<{
  (e: 'item-click', item: DropdownItem, index: number): void
}>()

// Define models for two-way binding
const filterSelected = defineModel<OptionId>('filterSelected')
const layoutMode = defineModel<LayoutMode>('layoutMode')
const sortSelected = defineModel<OptionId>('sortSelected')
const searchQuery = defineModel<string>('searchQuery')

// VirtualGrid layout configuration
type LayoutConfig = {
  maxColumns: number
  itemHeight: number
  itemWidth: number
  gap: string
}

const LAYOUT_CONFIGS: Record<LayoutMode, LayoutConfig> = {
  grid: { maxColumns: 4, itemHeight: 120, itemWidth: 89, gap: '1rem 0.5rem' },
  list: { maxColumns: 1, itemHeight: 64, itemWidth: 380, gap: '0.5rem' },
  'list-small': {
    maxColumns: 1,
    itemHeight: 40,
    itemWidth: 380,
    gap: '0.25rem'
  }
}

const layoutConfig = computed<LayoutConfig>(
  () => LAYOUT_CONFIGS[layoutMode.value ?? 'grid']
)

const gridStyle = computed<CSSProperties>(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${layoutConfig.value.maxColumns}, 1fr)`,
  gap: layoutConfig.value.gap,
  padding: '1rem',
  width: '100%'
}))

type VirtualDropdownItem = DropdownItem & { key: string }
const virtualItems = computed<VirtualDropdownItem[]>(() =>
  items.map((item) => ({
    ...item,
    key: String(item.id)
  }))
)
</script>

<template>
  <div
    class="flex max-h-[640px] w-103 flex-col rounded-lg bg-component-node-background pt-4 outline outline-offset-[-1px] outline-node-component-border"
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
    <!-- Empty State -->
    <div
      v-if="items.length === 0"
      class="flex h-50 items-center justify-center"
    >
      <i
        :title="$t('g.noItems')"
        :aria-label="$t('g.noItems')"
        class="icon-[lucide--circle-off] size-30 text-muted-foreground/20"
      />
    </div>
    <!-- Virtualized Grid -->
    <VirtualGrid
      v-else
      :key="layoutMode"
      :items="virtualItems"
      :grid-style="gridStyle"
      :max-columns="layoutConfig.maxColumns"
      :default-item-height="layoutConfig.itemHeight"
      :default-item-width="layoutConfig.itemWidth"
      :buffer-rows="2"
      class="mt-2 min-h-0 flex-1"
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
</template>
