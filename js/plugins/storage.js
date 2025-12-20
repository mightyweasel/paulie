export default {
  name: 'storage',
  init(paulie) {
    this.keyFor = id => paulie.localStorageKey + id;
    // load on policy activation
    this.load = policyId => {
      const raw = localStorage.getItem(this.keyFor(policyId));
      console.log("PAULIE - INIT - Pulled from localStorage.");
      return raw ? JSON.parse(raw) : {};
    };
    // save on update
    this.save = (policyId, uvars) => {
      localStorage.setItem(this.keyFor(policyId), JSON.stringify(uvars));
      console.log("PAULIE - CLICK - Saved to localStorage.");
    };
  },
  on(event, { paulie }) {
    if (event === 'policy:activated') {
      paulie.uvars = {
        ...paulie.uvars,
        ...this.load(paulie.promptpolicy)
      };
    }
    if (event === 'uvars:updated') {
      this.save(paulie.promptpolicy, paulie.uvars);
    }
  }
};
