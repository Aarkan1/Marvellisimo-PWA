import searchListItem from './searchListItem.js'

export default {
  components: { searchListItem },
  template: `
    <div>
      <searchListItem />
    </div>
  `,
  props: ['list']
}