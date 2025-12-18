// Paulie Definition
const paulie = {
  g_templates: {},
  g_template_prepend: `Hi, I have a detailed set of instructions for a persona I need you to adopt for the rest of this conversation. Please read the entire prompt and confirm the persona before starting any analysis. Here is the prompt:\n\n`,
  uvars: {},
  localStorageKey: "uvars-",
  promptpolicy: "paulie-GC-generic",
  
  async copyTextToClipboard(textToCopy) {
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
  },
  async loadPromptPolicy(src) {
    console.log(`PAULIE - ASYNC - Load Prompt Policy -> ${src}`);
    if (!this._loadedPolicies) { this._loadedPolicies = {}; }
    if (this._loadedPolicies[src]) {
      return this._loadedPolicies[src];
    }

    const module = await import(`./../prompt-policy-templates/${src}.js`);
    this._loadedPolicies[src] = module.default;
    console.log(`PAULIE - ASYNC - Policy Loaded -> ${src}`);
    return module.default;
  },
  async init() {
    console.log("PAULIE - INIT - Initiation Started...");
    // check for policy availability, load otherwise
    if(!this.g_templates[ this.promptpolicy ]) {
      console.log(`PAULIE - ASYNC - Template Needed ${this.promptpolicy}`);
      const policy = await this.loadPromptPolicy(this.promptpolicy);
      this.g_templates[policy.id] = policy;
      this.promptpolicy = policy.id;
    } else {
      console.log(`PAULIE - ASYNC - Template Available ${this.promptpolicy}`);
    }

    this.componentInit();
    this.uvars = this.uvarsFromLocalStorage();
    for(const field of this.g_templates[ this.promptpolicy ].controls) {
      document.querySelector('input[name="'+field["uvar_id"]+'"]').value = this.uvars[ field["keytag"] ];
    }
    this.initPrebuilts();
    this.initActions();
  },
  formFieldTemplate({ uvar_label_text, uvar_id, uvar_placeholder, uvar_inputvalue, uvar_autocomplete }) {
    return `<label>${uvar_label_text}<input name="${uvar_id}" placeholder="${uvar_placeholder}" value="${uvar_inputvalue}" autocomplete="${uvar_autocomplete}"/></label>\n`;
  },
  componentInit() {
    console.log("PAULIE - INIT - Building html forms...");
    let html_collector = "";
    if(this.g_templates[  this.promptpolicy  ].controls) {
      for(const field of this.g_templates[  this.promptpolicy  ].controls) { 
        html_collector += this.formFieldTemplate(field); 
        this.uvars[field["keytag"]] = field["uvar_inputvalue"]; 
      }
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
  populateUvars() {
    for(const field of this.g_templates[ this.promptpolicy ].controls) {
      this.uvars[ field["keytag"] ] = document.querySelector('input[name="'+field["uvar_id"]+'"]').value;
    }
  },
  generatePromptPolicy() {
    let gentemp = this.g_templates[ this.promptpolicy ].prompt;
    for(const field of this.g_templates[ this.promptpolicy ].controls) {
      gentemp = gentemp.replaceAll( field["keytag"] , this.uvars[ field["keytag"] ] );
    }
    return gentemp; 
  },
  focusOnCustomization() {
    document.querySelector('#preview').scrollIntoView({ behavior: 'smooth', block: 'start' });
  },
  async handlePrebuiltDelegate(event) {
    const button = event.target.closest('[data-promptpolicy]');
    if (!button) return;

    event.preventDefault();
    const src = button.dataset.promptpolicy;
    console.log(`PAULIE - USER - ${src}`);
    const policy = await this.loadPromptPolicy(src);
    this.g_templates[policy.id] = policy;
    this.promptpolicy = policy.id;

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
      this.populateUvars(); // setup user input as memory
      textarea.value = this.g_template_prepend + this.generatePromptPolicy();
      console.log("PAULIE - CLICK - Replacements complete.");
      this.copyTextToClipboard(textarea.value); // to clipboard
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

paulie.init();
