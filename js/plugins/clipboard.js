export default {
  name: 'clipboard',
  on(event, payload) {
    if (event !== 'clipboard:copy') return;
    const { text } = payload;
    if (!navigator.clipboard) {
      console.error("PAULIE - ERROR - Clipboard API not available.");
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("PAULIE - CLICK - Copied to clipboard");
      })
      .catch(err => {
        console.error("PAULIE - ERROR - Failed to copy content: ", err);
    });
  }
};
