import { EntitySheetHelper } from "./helper.js";
import {ATTRIBUTE_TYPES} from "./constants.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SimpleActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["pds", "sheet", "actor"],
      template: "systems/pds/templates/actor-sheet.hbs",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      scrollY: [".biography", ".items", ".attributes"],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  async getData(options) {
    const context = await super.getData(options);
    context.shorthand = !!game.settings.get("pds", "macroShorthand");
    context.systemData = context.data.system;
    context.dtypes = ATTRIBUTE_TYPES;
    context.biographyHTML = await TextEditor.enrichHTML(context.systemData.biography, {
      secrets: this.document.isOwner,
      async: true
    });
    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    
    super.activateListeners(html);

    if(this.actor.owner){
      html.find(".item-roll").click(this._onItemRoll.bind(this));
    }

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    // Attribute Management
    html.find(".skills").on("click", "a.skills-roll", EntitySheetHelper.onSkillRoll.bind(this));

    // Item Controls
    html.find(".item-control").click(this._onItemControl.bind(this));
    html.find(".items .rollable").on("click", this._onItemRoll.bind(this));

    //Rollable abilities
    html.on('click', '.rollable', this._onRoll.bind(this));
    html.on('click', '.dmg-roll', this._onRollDmg.bind(this));
    html.on('click', '.armor-roll', this._onRollArmor.bind(this));

    //Actor Controls
    if(this.actor.owner){
      html.find(".item-roll").click(this._onItemRoll.bind(this));
      html.find(".task-check").click(this._onTaskCheck.bind(this));
      html.find(".skill-roll").click(EntitySheetHelper.onSkillRollNew.bind(this));
    }

    // Add draggable for Macro creation
    html.find(".attributes a.attribute-roll").each((i, a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", ev => {
        let dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData('text/plain', JSON.stringify(dragData));
      }, false);
    });
  }

  async _onRollArmor(event){
    let roll = await new Roll('1d6').evaluate({async : true})
    await roll.toMessage()
    return
  }
  
  async _onRollDmg(event) {
    let i = 0;
    let dice = 2;
    let total_rolls = 0;
    let total_damage = 0;
    let rolls = []

    while(i < dice){
      let result = await new Roll('1d6').evaluate();

      if(result._total == 6){
        i--;
      }
      i++;
      total_damage += result._total;
      total_rolls += 1;
      rolls.push(result._total)
    }
    
    let message = 'Gesamtschaden:' + total_damage.toString() + '\r\n' + 'Würfelanzahl:' + total_rolls.toString();
  ChatMessage.create({
  content: message
})
    
    return
  }

  async _onSkillRoll(event){
    event.preventDefault();
    const skill = event.currentTarget.dataset.skill;
    await "1d6".roll()
  }

  _onTaskCheck(event){
    const itemID = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.getOwnedItem(itemID);
    let rollFormula = "1d100";
    let rollData;

    let messageData ={
      speaker: ChatMessage.getSpeaker()
    }
    new Roll(rollFormula, rollData).toMessage(messageData);
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for Item control buttons within the Actor Sheet
   * @param event
   * @private
   */
  _onItemControl(event) {
    event.preventDefault();

    // Obtain event data
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.actor.items.get(li?.dataset.itemId);

    // Handle different actions
    switch ( button.dataset.action ) {
      case "create":
        const cls = getDocumentClass("Item");
        return cls.create({name: game.i18n.localize("SIMPLE.ItemNew"), type: "item"}, {parent: this.actor});
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }

  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event    The originating left click event
   */
 _onItemRoll(event) {
   let button = $(event.currentTarget);
   const li = button.parents(".item");
   const item = this.actor.items.get(li.data("itemId"));
   let r = new Roll(button.data('roll'), this.actor.getRollData());
   return r.toMessage({
     user: game.user.id,
     speaker: ChatMessage.getSpeaker({ actor: this.actor }),
     flavor: `<h2>${item.name}</h2><h3>${button.text()}</h3>`
   });
 }

_onRoll(event) {
  event.preventDefault();
  const element = event.currentTarget;
  const dataset = element.dataset;

  // Handle item rolls.
  if (dataset.rollType) {
    if (dataset.rollType == 'item') {
      const itemId = element.closest('.item').dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) return item.roll();
    }
  }

  // Handle rolls that supply the formula directly.
  if (dataset.roll) {
    let label = dataset.label ? `[ability] ${dataset.label}` : '';
    let roll = new Roll(dataset.roll, this.actor.getRollData());
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: label,
      rollMode: game.settings.get('core', 'rollMode'),
    });
    return roll;
  }
}

  /* -------------------------------------------- */

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    formData = EntitySheetHelper.updateAttributes(formData, this.object);
    return formData;
  }
}
