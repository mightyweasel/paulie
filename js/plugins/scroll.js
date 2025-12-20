export default {
  name: 'scroll',
  firstload:true,
  on(event, { paulie }) {
    if (event !== 'policy:activated') return;
    if(this.firstload) { this.firstload = false; return; } paulie.dom?.preview?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};