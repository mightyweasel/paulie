import g_policy_registry from './../prompt-policy-templates/paulie-registry.js';
import clipboardPlugin from './plugins/clipboard.js';
import scrollPlugin from './plugins/scroll.js';
import storagePlugin from './plugins/storage.js';

const dom = {
  prebuiltContainer: document.getElementById('prebuilt_container'),
  formContainer: document.getElementById('form_container'),
  preview: document.getElementById('preview'),
  outputTextarea: document.querySelector('textarea[name="persona-output"]')
};
const paulie = {
  // dom lookups
  dom,
  // plugin functions
  plugins: [], 
  pluginsInitialized: false,
  use(plugin) { this.plugins.push(plugin); }, 
  initPlugins() { if (this.pluginsInitialized) { return; } this.plugins.forEach(p => p.init?.(this)); this.pluginsInitialized = true; }, 
  emit(event, payload) { this.plugins.forEach(p => p.on?.(event, payload)); },
  // paulie variables
  g_policy_registry,
  g_policy_registry_load: false,
  policyById: null, 
  activePolicy: null,
  inputByHandle: null,
  g_template_prepend: `Hi, I have a detailed set of instructions for a persona I need you to adopt for the rest of this conversation. Please read the entire prompt and confirm the persona before starting any analysis. Here is the prompt:\n\n`,
  uvars: {},
  localStorageKey: "uvars-",
  promptpolicy: "paulie-GC-generic",
  
  initAvailablePolicies() {
    if(this.g_policy_registry_load) {
      console.log("PAULIE - INIT - Policy registry available");
      return;
    }
    console.log("PAULIE - INIT - Adding from policy registry");
    
    this.policyById = new Map( this.g_policy_registry.map(p => [p.id, p]) );

    let row = 1, policycount = 0;
    let htmlPolicies = `<section id="prebuilt_r${row}" class="grid">`;
    for(const policy of g_policy_registry) {
      console.log(`Register: ${policy.id}`);
      policycount++;
      htmlPolicies += `<article><p><strong>${policy.persona}</strong></p><button type="submit" data-theme="dark" class="container-fluid pico-background-purple-700" data-tooltip="Customize Persona Below..."
        data-promptpolicy="${policy.id}">Use Persona</button><small>${policy.desc}</small></article>`;
      if(policycount % 3 == 0) {
        row++;
        htmlPolicies += `</section><section id="prebuilt_r${row}" class="grid">`;
      }
    }
    // add empty spaces for grid
    let spacer = 3 - (policycount % 3); if(spacer != 3 && spacer != 0) { 
      for(let i = 0; i < spacer ; i++) { htmlPolicies += `<p>&nbsp;</p>`; } 
    }
    htmlPolicies += `</section>`

    dom.prebuiltContainer.innerHTML = htmlPolicies;
    this.g_policy_registry_load = true;
  },
  normalizeHandle(handle) {
    return handle.replaceAll("-","_");
  },
  normalizeKeytag(handle) {
    return "$" + handle.replaceAll("-","_");
  },
  initUvars() {
    //this.uvars = this.uvarsFromLocalStorage();
    for(const field of this.activePolicy.controls) {
      let uid = this.normalizeHandle(field["uvar_handle"]);
      let ktg = this.normalizeKeytag(field["uvar_handle"]);
      this.inputByHandle.get(uid).value = this.uvars[ ktg ];
    }
  },
  setActivePolicy() {
    const policy = this.policyById.get(this.promptpolicy);
    if (!policy) {
      console.error(`PAULIE - ERROR - Unknown policy: ${this.promptpolicy}`);
      return;
    }
    this.activePolicy = policy;
  },
  init() {
    console.log("PAULIE - INIT - Initiation Started...");
    this.initPlugins();
    this.initAvailablePolicies();
    this.setActivePolicy();
    this.initHtml();
    this.initUvars();
    this.initPrebuilts();
    this.initActions();
  },
  htmlFormFieldTemplate({ uvar_handle, uvar_ilabel, uvar_ivalue }) {
    return `<label>${uvar_ilabel}<input name="${this.normalizeHandle(uvar_handle)}" placeholder="${uvar_ivalue}" value="${uvar_ivalue}" autocomplete="${uvar_handle}"/></label>\n`;
  },
  htmlPolicyDesc(){
    return `<kbd>${this.activePolicy.persona}</kbd><blockquote>${this.activePolicy.desc}</blockquote>`;
  },
  initHtml() {
    console.log("PAULIE - INIT - Building html forms...");
    let html_collector = "";
    if(this.activePolicy.controls) {
      for(const field of this.activePolicy.controls) { 
        html_collector += this.htmlFormFieldTemplate(field); 
        let ktg = this.normalizeKeytag(field["uvar_handle"]);
        this.uvars[ ktg ] = field["uvar_ivalue"]; 
      }
    }
    // policy active (NOTE: May need to check ordering here of emit)
    this.emit('policy:activated', { paulie: this });

    dom.formContainer.innerHTML = this.htmlPolicyDesc() + html_collector;
    console.log("PAULIE - INIT - HTML Initialized");
    this.inputByHandle = new Map();
    dom.formContainer.querySelectorAll('input').forEach(input => {
      this.inputByHandle.set(input.name, input);
    });
    console.log("PAULIE - INIT - Inputs mapped");
  },
  populateUvars() {
    for(const field of this.activePolicy.controls) {
      let uid = this.normalizeHandle(field["uvar_handle"]);
      let ktg = this.normalizeKeytag(field["uvar_handle"]);
      this.uvars[ ktg ] = this.inputByHandle.get(uid).value;
    }
  },
  generatePromptPolicy() {
    let gentemp = this.activePolicy.prompt;
    for(const field of this.activePolicy.controls) {
      let ktg = this.normalizeKeytag(field["uvar_handle"]);
      gentemp = gentemp.replaceAll( ktg , this.uvars[ ktg ] );
    }
    return gentemp; 
  },
  handlePrebuiltDelegate(event) {
    const button = event.target.closest('[data-promptpolicy]');
    if (!button) return;

    event.preventDefault();
    const src = button.dataset.promptpolicy;
    console.log(`PAULIE - USER - ${src}`);
    this.promptpolicy = src;
    this.init();
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
    const textarea = dom.outputTextarea;
    if (textarea) {
      console.log("PAULIE - CLICK - Setting content...");
      this.populateUvars(); // setup user input as memory
      textarea.value = this.g_template_prepend + this.generatePromptPolicy();
      console.log("PAULIE - CLICK - Replacements complete.");
      //this.copyTextToClipboard(textarea.value); // to clipboard
      // to local storage
      this.emit('clipboard:copy', { text: textarea.value });
      this.emit('uvars:updated', { paulie: this });
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
paulie.use(clipboardPlugin);
paulie.use(scrollPlugin);
paulie.use(storagePlugin);
paulie.init();
