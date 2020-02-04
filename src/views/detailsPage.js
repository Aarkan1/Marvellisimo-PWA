import { getMarvels } from '../services/marvelProvider.js'

export default {
  template: `
    <div id="details-page">
      <div>
        <img :src="item.thumbnail.path + '.' + item.thumbnail.extension" />
      </div>
      <h3>{{ item.name || item.title }}</h3>
      <p>{{ item.description }}</p>
    </div>
  `,
  data() {
    return {
      item: {
        name: '',
        thumbnail: {
          path: '',
          extension: ''
        },
        description: ''
      }
    }
  },
  async created() {
    this.result = await getMarvels(this.$route.query.char ? 'characters' : 'series', '', this.$route.params.id)
    this.item = this.result[0]
    console.log(this.item);
  }
}