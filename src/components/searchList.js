export default {
  template: `
  <div v-if="$store.state.isMobile">  
    <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="140"
    :key-field="keyField"
    page-mode
    v-slot="{ item }"
    >
    <slot :item="item"></slot>
  </RecycleScroller>
  </div>
  <div v-else class="desktop-list">  
    <RecycleScroller
    class="scroller"
    :items="getList(1)"
    :item-size="140"
    :key-field="keyField"
    page-mode
    v-slot="{ item }"
    >
    <slot :item="item"></slot>
  </RecycleScroller>
  <RecycleScroller
    class="scroller"
    :items="getList()"
    :item-size="140"
    :key-field="keyField"
    page-mode
    v-slot="{ item }"
    >
      <slot :item="item"></slot>
    </RecycleScroller>
  </div>
  `,
  props: ['items', 'keyField'],
  // computed: {
  //   keyField() {
  //     return this.items[0]._id ? '_id' : 'id'
  //   }
  // },
  methods: {
    getList(even) {
      if(even) {
        return this.items.filter((item, i) => i % 2 === 0)
      } else {
        return this.items.filter((item, i) => i % 2 !== 0)
      }
    }
  }
}