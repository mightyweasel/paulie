// globals for templating/policies
var g_templates = {};
const g_template_prepend = `Hi, I have a detailed set of instructions for a persona I need you to adopt for the rest of this conversation. Please read the entire prompt and confirm the persona before starting any analysis. Here is the prompt:

`;
// end globals

// library functions
async function copyTextToClipboard(textToCopy) {
  if (!navigator.clipboard) {
    console.error("PAULIE - ERROR - Clipboard API not available.");
    return;
  }
  try {
    await navigator.clipboard.writeText(textToCopy);
    console.log('PAULIE - CLICK - Copied to clipboard');
  } catch (err) {
    console.error('PAULIE - ERROR - Failed to copy content: ', err);
  }
}

const formFieldTemplate = ({ uvar_label_text, uvar_id, uvar_placeholder, uvar_inputvalue, uvar_autocomplete }) => 
`<label>${uvar_label_text}
  <input
    name="${uvar_id}"
    placeholder="${uvar_placeholder}"
    value="${uvar_inputvalue}"
    autocomplete="${uvar_autocomplete}"
  />
</label>
`;

// Paulie Definition
const paulie = {
  uvars: {},
  localStorageKey: "uvars-",
  promptpolicy: "paulie-GC-generic",

  init() {
    console.log("PAULIE - INIT - Initiation Started...");
    this.componentInit();
    this.uvars = this.uvarsFromLocalStorage();
    for(field of g_templates[ this.promptpolicy ].controls) {
      document.querySelector('input[name="'+field["uvar_id"]+'"]').value = this.uvars[ field["keytag"] ];
    }
    this.initPrebuilts();
    this.initActions();
  },
  componentInit() {
    console.log("PAULIE - INIT - Building html forms...");
    var html_collector = "";
    for(field of g_templates[  this.promptpolicy  ].controls) { 
      html_collector += formFieldTemplate(field); 
      this.uvars[field["keytag"]] = field["uvar_inputvalue"]; 
    }
    document.querySelector('fieldset[id="form_container"]').innerHTML = html_collector;
    console.log("PAULIE - INIT - HTML Initialized");
  },
  uvarsFromLocalStorage() {
    const parsedData = JSON.parse(window.localStorage?.getItem(this.localStorageKey + this.promptpolicy));
    console.log("PAULIE - INIT - Pulled from localStorage.");
    return parsedData ?? this.uvars;
  },
  uvarsToLocalStorage() {
    window.localStorage?.setItem(this.localStorageKey + this.promptpolicy, JSON.stringify(this.uvars));
    console.log("PAULIE - CLICK - Saved to localStorage.");
  },
  populate_uvars() {
    for(field of g_templates[ this.promptpolicy ].controls) {
      this.uvars[ field["keytag"] ] = document.querySelector('input[name="'+field["uvar_id"]+'"]').value;
    }
  },
  generate_prompt_policy() {
    var gentemp = g_templates[ this.promptpolicy ].prompt;
    for(field of g_templates[ this.promptpolicy ].controls) {
      gentemp = gentemp.replaceAll( field["keytag"] , this.uvars[ field["keytag"] ] );
    }
    return gentemp; 
  },
  focusOnCustomization() {
    document.querySelector('#preview').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  buttonsTarget_pGCG: "button[make-persona-prebuilt-GC-generic]",
  handleButtonClick_pGCG(event) {
    event.preventDefault();
    console.log("PAULIE - LOG - GC Generic Click");
    this.promptpolicy = "paulie-GC-generic";
    this.init();
    this.focusOnCustomization();
  },
  buttonsTarget_pECA: "button[make-persona-prebuilt-EC-Analyst]",
  handleButtonClick_pECA(event) {
    event.preventDefault();
    console.log("PAULIE - LOG - EC Analyst Click");
    this.promptpolicy = "paulie-GC-EC-Analyst";
    this.init();
    this.focusOnCustomization();
  },
  buttonsTarget_pGLS: "button[make-persona-prebuilt-GC-Lunch-Suggestion]",
  handleButtonClick_pGLS(event) {
    event.preventDefault();
    console.log("PAULIE - LOG - GC Lunch Suggest Click");
    this.promptpolicy = "paulie-GC-Lunch-Suggestion";
    this.init();
    this.focusOnCustomization();
  },
  buttonsTarget_pGPS: "button[make-persona-prebuilt-GC-Procurement-Specialist]",
  handleButtonClick_pGPS(event) {
    event.preventDefault();
    console.log("PAULIE - LOG - GC Procurement Specialist Click");
    this.promptpolicy = "paulie-GC-Procurement-Specialist";
    this.init();
    this.focusOnCustomization();
  },
  buttonsTarget_pGSO: "button[make-persona-prebuilt-GC-Security-Officer]",
  handleButtonClick_pGSO(event) {
    event.preventDefault();
    console.log("PAULIE - LOG - GC Security Officer Click");
    this.promptpolicy = "paulie-GC-Security-Officer";
    this.init();
    this.focusOnCustomization();
  },
  buttonsTarget_pGCS: "button[make-persona-prebuilt-GC-Classification-Specialist]",
  handleButtonClick_pGCS(event) {
    event.preventDefault();
    console.log("PAULIE - LOG - GC Classification Specialist Click");
    this.promptpolicy = "paulie-GC-Classification-Specialist";
    this.init();
    this.focusOnCustomization();
  },
  initPrebuilts() {
    console.log("PAULIE - INIT - Init prebuilts.");
    // GC Generic
    const buttons_pGCG = document.querySelectorAll(this.buttonsTarget_pGCG);
    if (!this._boundHandleButtonClick_pGCG) { // Store the bound handler once
      this._boundHandleButtonClick_pGCG = this.handleButtonClick_pGCG.bind(this);
    }
    buttons_pGCG.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_pGCG);
      button.addEventListener("click",  this._boundHandleButtonClick_pGCG);
    });
    // EC
    const buttons_pECA = document.querySelectorAll(this.buttonsTarget_pECA);
    if (!this._boundHandleButtonClick_pECA) { // Store the bound handler once
      this._boundHandleButtonClick_pECA = this.handleButtonClick_pECA.bind(this);
    }
    buttons_pECA.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_pECA);
      button.addEventListener("click", this._boundHandleButtonClick_pECA);
    });
    // Lunch Specialist
    const buttons_pGLS = document.querySelectorAll(this.buttonsTarget_pGLS);
    if (!this._boundHandleButtonClick_pGLS) { // Store the bound handler once
      this._boundHandleButtonClick_pGLS = this.handleButtonClick_pGLS.bind(this);
    }
    buttons_pGLS.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_pGLS);
      button.addEventListener("click", this._boundHandleButtonClick_pGLS);
    });
    // Procurement
    const buttons_pGPS = document.querySelectorAll(this.buttonsTarget_pGPS);
    if (!this._boundHandleButtonClick_pGPS) { // Store the bound handler once
      this._boundHandleButtonClick_pGPS = this.handleButtonClick_pGPS.bind(this);
    }
    buttons_pGPS.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_pGPS);
      button.addEventListener("click", this._boundHandleButtonClick_pGPS);
    });
    // Security Officer
    const buttons_pGSO = document.querySelectorAll(this.buttonsTarget_pGSO);
    if (!this._boundHandleButtonClick_pGSO) { // Store the bound handler once
      this._boundHandleButtonClick_pGSO = this.handleButtonClick_pGSO.bind(this);
    }
    buttons_pGSO.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_pGSO);
      button.addEventListener("click", this._boundHandleButtonClick_pGSO);
    });
    // Classifications
    const buttons_pGCS = document.querySelectorAll(this.buttonsTarget_pGCS);
    if (!this._boundHandleButtonClick_pGCS) { // Store the bound handler once
      this._boundHandleButtonClick_pGCS = this.handleButtonClick_pGCS.bind(this);
    }
    buttons_pGCS.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_pGCS);
      button.addEventListener("click", this._boundHandleButtonClick_pGCS);
    });

    console.log("PAULIE - INIT - Prebuilts Initialization complete.");  
  },
  buttonsTarget: "button[make-persona]",
  handleButtonClick_gen(event) {
    event.preventDefault();
    // logic for mad libs persona
    const textarea = document.querySelector('textarea[name="persona-output"]');
    if (textarea) {
      console.log("PAULIE - CLICK - Setting content...");
      this.populate_uvars(); // setup user input as memory
      textarea.value = g_template_prepend + this.generate_prompt_policy();
      console.log("PAULIE - CLICK - Replacements complete.");
      copyTextToClipboard(textarea.value); // to clipboard
      this.uvarsToLocalStorage(); // to local storage
    } else {
      console.error("PAULIE - ERROR - Textarea with name='persona-output' not found.");
    }
  },
  initActions() {
    console.log("PAULIE - INIT - Init Actions.");
    const buttons = document.querySelectorAll(this.buttonsTarget);
    if (!this._boundHandleButtonClick_gen) { // Store the bound handler once
      this._boundHandleButtonClick_gen = this.handleButtonClick_gen.bind(this);
    }
    buttons.forEach((button) => {
      button.removeEventListener("click", this._boundHandleButtonClick_gen);
      button.addEventListener("click", this._boundHandleButtonClick_gen);
    });

    console.log("PAULIE - INIT - Initialization complete.");
  }, 
};
