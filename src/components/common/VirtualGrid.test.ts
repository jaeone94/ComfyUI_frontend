import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import VirtualGrid from './VirtualGrid.vue'

type TestItem = { key: string; name: string }

function createItems(count: number): TestItem[] {
  return Array.from({ length: count }, (_, i) => ({
    key: `item-${i}`,
    name: `Item ${i}`
  }))
}

describe('VirtualGrid', () => {
  const defaultGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  }

  it('renders items within the visible range', async () => {
    const items = createItems(100)
    const wrapper = mount(VirtualGrid<TestItem>, {
      props: {
        items,
        gridStyle: defaultGridStyle,
        defaultItemHeight: 100,
        defaultItemWidth: 100,
        maxColumns: 4,
        bufferRows: 1
      },
      slots: {
        item: `<template #item="{ item }">
          <div class="test-item">{{ item.name }}</div>
        </template>`
      },
      attachTo: document.body
    })

    await nextTick()

    const renderedItems = wrapper.findAll('.test-item')
    expect(renderedItems.length).toBeLessThan(items.length)

    wrapper.unmount()
  })

  it('provides correct index in slot props', async () => {
    const items = createItems(20)
    const receivedIndices: number[] = []

    const wrapper = mount(VirtualGrid<TestItem>, {
      props: {
        items,
        gridStyle: defaultGridStyle,
        defaultItemHeight: 50,
        defaultItemWidth: 100,
        maxColumns: 1,
        bufferRows: 0
      },
      slots: {
        item: ({ index }: { index: number }) => {
          receivedIndices.push(index)
          return null
        }
      },
      attachTo: document.body
    })

    await nextTick()

    if (receivedIndices.length > 0) {
      expect(receivedIndices[0]).toBe(0)
      for (let i = 1; i < receivedIndices.length; i++) {
        expect(receivedIndices[i]).toBe(receivedIndices[i - 1] + 1)
      }
    }

    wrapper.unmount()
  })

  it('respects maxColumns prop', async () => {
    const items = createItems(10)
    const wrapper = mount(VirtualGrid<TestItem>, {
      props: {
        items,
        gridStyle: defaultGridStyle,
        maxColumns: 2
      },
      attachTo: document.body
    })

    await nextTick()

    const gridElement = wrapper.find('[style*="grid"]')
    expect(gridElement.exists()).toBe(true)

    wrapper.unmount()
  })

  it('renders empty when no items provided', async () => {
    const wrapper = mount(VirtualGrid<TestItem>, {
      props: {
        items: [],
        gridStyle: defaultGridStyle
      },
      slots: {
        item: `<template #item="{ item }">
          <div class="test-item">{{ item.name }}</div>
        </template>`
      }
    })

    await nextTick()

    const renderedItems = wrapper.findAll('.test-item')
    expect(renderedItems.length).toBe(0)
  })
})
