import {
  DuneSharedActorFunctions
} from '../actors/actor.js';

export class DuneItem extends Item {
  // Augment basic Item data model with additional dynamic data.
  prepareData() {
    const itemData = this.data;
    const actorData = this.actor ? this.actor.data : {};
    const data = itemData.data;
    
    if (!this.data.img) this.data.img = '/systems/dune-imperium/assets/icons/voyagercombadgeicon.svg';

    super.prepareData();
  }
  
  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async roll() {}

  static chatListeners(html) {
    html.on('click', '.reroll-result.attribute', this._onChatAttributeRerollResult.bind(this));
    html.on('click', '.reroll-result.challenge', this._onChatChallengeRerollResult.bind(this));
  }

  static async _onChatAttributeRerollResult(event) {
    event.preventDefault();
    const staActor = new DuneSharedActorFunctions();

    const children = event.currentTarget.children;
    const speaker = game.actors.find((target) => 
      target._id === children.speakerId.value);

    staActor.rollAttributeTest(event, children.selectedAttribute.value,
      children.selectedAttributeValue.value, children.selectedDiscipline.value,
      children.selectedDisciplineValue.value, null, speaker);
  }

  static async _onChatChallengeRerollResult(event) {
    event.preventDefault();
    const staActor = new DuneSharedActorFunctions();

    const currentChildren = event.currentTarget.children;
    const speaker = game.actors.find((target) => 
      target._id === currentChildren.speakerId.value);

    staActor.rollChallengeRoll(event, null, null, speaker);
  }
}
