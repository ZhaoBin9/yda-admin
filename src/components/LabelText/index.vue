<script>
export default {
  name: 'label-text',
  props: ['text', 'title', 'classes', 'noBottom'],
  render() {
    return (
      <div class="jsx-label-content" style={this.noBottom ? { marginBottom: 0 } : {}}>
        <section class={['label-text', this.classes].join(' ')}>
          <p class="label-title">{this.title}：</p>
          {this.text ? <p class="label-name">{this.text}</p> : this.$slots.text()}
        </section>
        {this.$slots.default && this.$slots.default()}
      </div>
    )
  }
}
</script>
