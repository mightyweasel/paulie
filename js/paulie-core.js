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
  handlePrebuiltDelegate(event) {
    const button = event.target.closest('[data-promptpolicy]');
    if (!button) return;

    event.preventDefault();

    console.log(`PAULIE - LOG - ${button.dataset.promptpolicy}`);
    this.promptpolicy = button.dataset.promptpolicy;
    this.init();
    this.focusOnCustomization();
  },
  initPrebuilts() {
    console.log("PAULIE - INIT - Init prebuilts.");

    if (!this._boundPrebuiltDelegate) {
      this._boundPrebuiltDelegate = this.handlePrebuiltDelegate.bind(this);
      document.addEventListener("click", this._boundPrebuiltDelegate);
    }
    
    console.log("PAULIE - INIT - Prebuilts Initialization complete.");  
  },
  buttonsTarget: "button[make-persona]",
  handleMakePersonaClick(event) {
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
    if (!this._boundHandleMakePersonaClick) { // Store the bound handler once
      this._boundHandleMakePersonaClick = this.handleMakePersonaClick.bind(this);
    }
    buttons.forEach((button) => {
      button.removeEventListener("click", this._boundHandleMakePersonaClick);
      button.addEventListener("click", this._boundHandleMakePersonaClick);
    });

    console.log("PAULIE - INIT - Initialization complete.");
  }, 
};
