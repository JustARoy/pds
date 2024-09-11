import { EntitySheetHelper } from "./helper.js";

/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class SimpleActor extends Actor {

  /** @inheritdoc */
  prepareDerivedData() {
    super.prepareDerivedData();

    const system = this.system

    //Calculate Level
    system.level = Math.floor((system.xp - 180) / 30)

    //Calculate Charakterprogression Total Values
    system.health.max = system.health.startValue + system.health.bought
    system.healthThresholds.firstThreshold.value = system.healthThresholds.firstThreshold.startValue + system.healthThresholds.firstThreshold.bought
    system.healthThresholds.secondThreshold.value = system.healthThresholds.secondThreshold.startValue + system.healthThresholds.secondThreshold.bought
    system.healthThresholds.thirdThreshold.value = system.healthThresholds.thirdThreshold.startValue + system.healthThresholds.thirdThreshold.bought
    system.healthThresholds.fourthThreshold.value = system.healthThresholds.fourthThreshold.startValue + system.healthThresholds.fourthThreshold.bought
    system.stress.max = system.stress.startValue + system.stress.bought
    system.armor.max = system.armor.startValue + system.armor.bought
    system.skillsShop.total = system.skillsShop.startValue + system.skillsShop.bought
    system.damage.total = system.damage.startValue + system.damage.bought
    system.attributesShop.total = system.attributesShop.startValue + system.attributesShop.bought
    system.luck.max = system.luck.startValue + system.luck.bought * 2

    //calculate Charakterprogression Total Prices
    system.health.priceTotal = system.health.bought * system.health.price
    system.healthThresholds.firstThreshold.priceTotal = system.healthThresholds.firstThreshold.bought * system.healthThresholds.firstThreshold.price
    system.healthThresholds.secondThreshold.priceTotal = system.healthThresholds.secondThreshold.bought * system.healthThresholds.secondThreshold.price
    system.healthThresholds.thirdThreshold.priceTotal = system.healthThresholds.thirdThreshold.bought * system.healthThresholds.thirdThreshold.price
    system.healthThresholds.fourthThreshold.priceTotal = system.healthThresholds.fourthThreshold.bought * system.healthThresholds.fourthThreshold.price
    system.stress.priceTotal = system.stress.bought * system.stress.price
    system.armor.priceTotal = system.armor.bought * system.armor.price
    system.skillsShop.priceTotal = system.skillsShop.bought * system.skillsShop.price
    system.damage.priceTotal = system.damage.bought * system.damage.price
    system.attributesShop.priceTotal = system.attributesShop.bought * system.attributesShop.price
    system.luck.priceTotal = system.luck.bought * system.luck.price

    //calculate Skills Base
    //Body
    system.skills.stamina.base = 20 + system.attributes.body.bought + system.skills.stamina.boni
    system.skills.atletik.base = 20 + system.attributes.body.bought + system.skills.atletik.boni
    system.skills.intimidateB.base = 20 + system.attributes.body.bought + system.skills.intimidateB.boni
    system.skills.strength.base = 20 + system.attributes.body.bought + system.skills.strength.boni
    system.skills.toughness.base = 20 + system.attributes.body.bought + system.skills.toughness.boni
    //Dexterity
    system.skills.acrobatic.base = 20 + system.attributes.dexterity.bought + system.skills.acrobatic.boni
    system.skills.sleightOfHand.base = 20 + system.attributes.dexterity.bought + system.skills.sleightOfHand.boni
    system.skills.infiltration.base = 20 + system.attributes.dexterity.bought + system.skills.infiltration.boni
    system.skills.stealth.base = 20 + system.attributes.dexterity.bought + system.skills.stealth.boni
    //Awareness
    system.skills.intuition.base = 20 + system.attributes.awareness.bought + system.skills.intuition.boni
    system.skills.investigation.base = 20 + system.attributes.awareness.bought + system.skills.investigation.boni
    system.skills.perception.base = 20 + system.attributes.awareness.bought + system.skills.perception.boni
    system.skills.willpower.base = 20 + system.attributes.awareness.bought + system.skills.willpower.boni
    //Intelligenze
    system.skills.generalEducation.base = 20 + system.attributes.intelligenze.bought + system.skills.generalEducation.boni
    system.skills.culturalEducation.base = 20 + system.attributes.intelligenze.bought + system.skills.culturalEducation.boni
    system.skills.technikEducation.base = 20 + system.attributes.intelligenze.bought + system.skills.technikEducation.boni
    system.skills.medizinEducation.base = 20 + system.attributes.intelligenze.bought + system.skills.medizinEducation.boni
    system.skills.pokemonEducation.base = 20 + system.attributes.intelligenze.bought + system.skills.pokemonEducation.boni
    system.skills.nature.base = 20 + system.attributes.intelligenze.bought + system.skills.nature.boni
    system.skills.occultEductaion.base = 20 + system.attributes.intelligenze.bought + system.skills.occultEductaion.boni
    //Charisma
    system.skills.leadership.base = 20 + system.attributes.charisma.bought + system.skills.leadership.boni
    system.skills.performance.base = 20 + system.attributes.charisma.bought + system.skills.performance.boni
    system.skills.intimadateC.base = 20 + system.attributes.charisma.bought + system.skills.intimadateC.boni
    system.skills.deception.base = 20 + system.attributes.charisma.bought + system.skills.deception.boni
    system.skills.persuation.base = 20 + system.attributes.charisma.bought + system.skills.persuation.boni

    //calculate Skill Finalvalue
    //Body
    system.skills.stamina.finalvalue = system.skills.stamina.value + system.skills.stamina.base
    system.skills.atletik.finalvalue = system.skills.atletik.value + system.skills.atletik.base
    system.skills.intimidateB.finalvalue = system.skills.intimidateB.value + system.skills.intimidateB.base
    system.skills.strength.finalvalue = system.skills.strength.value + system.skills.strength.base
    system.skills.toughness.finalvalue = system.skills.toughness.value + system.skills.toughness.base
    //Dexterity
    system.skills.acrobatic.finalvalue = system.skills.acrobatic.value + system.skills.acrobatic.base
    system.skills.sleightOfHand.finalvalue = system.skills.sleightOfHand.value + system.skills.sleightOfHand.base
    system.skills.infiltration.finalvalue = system.skills.infiltration.value + system.skills.infiltration.base
    system.skills.stealth.finalvalue = system.skills.stealth.value + system.skills.stealth.base
    //Awareness
    system.skills.intuition.finalvalue = system.skills.intuition.value + system.skills.intuition.base
    system.skills.investigation.finalvalue = system.skills.investigation.value + system.skills.investigation.base
    system.skills.perception.finalvalue = system.skills.perception.value + system.skills.perception.base
    system.skills.willpower.finalvalue = system.skills.willpower.value + system.skills.willpower.base
    //Intelligenze
    system.skills.generalEducation.finalvalue = system.skills.generalEducation.value + system.skills.generalEducation.base
    system.skills.culturalEducation.finalvalue = system.skills.culturalEducation.value + system.skills.culturalEducation.base
    system.skills.technikEducation.finalvalue = system.skills.technikEducation.value + system.skills.technikEducation.base
    system.skills.medizinEducation.finalvalue = system.skills.medizinEducation.value + system.skills.medizinEducation.base
    system.skills.pokemonEducation.finalvalue = system.skills.pokemonEducation.value + system.skills.pokemonEducation.base
    system.skills.nature.finalvalue = system.skills.nature.value + system.skills.nature.base
    system.skills.occultEductaion.finalvalue = system.skills.occultEductaion.value + system.skills.occultEductaion.base
    //Charisma
    system.skills.leadership.finalvalue = system.skills.leadership.value + system.skills.leadership.base
    system.skills.performance.finalvalue = system.skills.performance.value + system.skills.performance.base
    system.skills.intimadateC.finalvalue = system.skills.intimadateC.value + system.skills.intimadateC.base
    system.skills.deception.finalvalue = system.skills.deception.value + system.skills.deception.base
    system.skills.persuation.finalvalue = system.skills.persuation.value + system.skills.persuation.base


    //Attributes charges
    system.attributes.body.charges.max = Math.floor((system.attributes.body.bought + system.attributes.body.base) / 3.0)
    system.attributes.dexterity.charges.max = Math.floor((system.attributes.dexterity.bought + system.attributes.dexterity.base) / 3.0)
    system.attributes.awareness.charges.max = Math.floor((system.attributes.awareness.bought + system.attributes.awareness.base) / 3.0)
    system.attributes.intelligenze.charges.max = Math.floor((system.attributes.intelligenze.bought + system.attributes.intelligenze.base) / 3.0)
    system.attributes.charisma.charges.max = Math.floor((system.attributes.charisma.bought + system.attributes.charisma.base) / 3.0)

    //Skill Points used
    system.skillsShop.used = system.skills.stamina.value + system.skills.atletik.value + system.skills.intimidateB.value + system.skills.strength.value + system.skills.toughness.value + system.skills.acrobatic.value + system.skills.sleightOfHand.value + system.skills.infiltration.value + system.skills.intuition.value + system.skills.investigation.value + system.skills.perception.value + system.skills.willpower.value + system.skills.generalEducation.value + system.skills.culturalEducation.value + system.skills.technikEducation.value + system.skills.medizinEducation.value + system.skills.pokemonEducation.value + system.skills.nature.value + system.skills.occultEductaion.value + system.skills.leadership.value + system.skills.performance.value + system.skills.intimadateC.value + system.skills.deception.value +system.skills.persuation.value

    //Attribute Points used
    system.attributesShop.used = system.attributes.body.value + system.attributes.dexterity.value + system.attributes.awareness.value + system.attributes.intelligenze.value + system.attributes.charisma.value

  }

  /* -------------------------------------------- */

  /** @override */
  static async createDialog(data={}, options={}) {
    return EntitySheetHelper.createDialog.call(this, data, options);
  }

  /* -------------------------------------------- */

  /**
   * Is this Actor used as a template for other Actors?
   * @type {boolean}
   */
  get isTemplate() {
    return !!this.getFlag("pds", "isTemplate");
  }

  /* -------------------------------------------- */
  /*  Roll Data Preparation                       */
  /* -------------------------------------------- */

  /** @inheritdoc */
  getRollData() {

    // Copy the actor's system data
    const data = this.toObject(false).system;
    return data;
  }
}
