import { EntitySheetHelper } from "../helper.js";
import {ATTRIBUTE_TYPES} from "../constants.js";

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

    //Rollable abilities
    html.on('click', '.dmg-roll', this._onRollDmg.bind(this));
    html.on('click', '.armor-roll', this._onRollArmor.bind(this));

    //Actor Controls
    if(this.actor.owner){
      html.find(".item-roll").click(this._onItemRoll.bind(this));
      html.find(".task-check").click(this._onTaskCheck.bind(this));
      html.find(".skill-roll").click(EntitySheetHelper.onSkillRollNew.bind(this));
    }

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

  /** @inheritdoc */
  _getSubmitData(updateData) {
    let formData = super._getSubmitData(updateData);
    return formData;
  }
}
