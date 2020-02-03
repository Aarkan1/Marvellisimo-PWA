export default {
  template: `
    <div class="card">
      {{ data.title || 'No title' }}
    </div>
  `,
  props: ['data']
}