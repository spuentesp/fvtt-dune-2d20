export class ChallengeDie extends DiceTerm {
  constructor(termData) {
    super(termData);
    this.faces = 6;
  }
  /* -------------------------------------------- */
  /** @override */
  // static DENOMINATION = "c";

  /* -------------------------------------------- */
  /** @override */
  get formula() {
    return `${this.number}${this.constructor.DENOMINATION}${this.modifiers.join('')}`;
  }

  /* -------------------------------------------- */
  /** @override */
  evaluate({minimize = false, maximize = false} = {}) {
    if (this._evaluated) {
      throw new Error(`This ${this.constructor.name} has already been evaluated and is immutable`);
    }

    // Roll the initial number of dice
    for (let n = 1; n <= this.number; n++) {
      this.roll({minimize, maximize});
    }

    // Apply modifiers
    this._evaluateModifiers();

    // Combine all STA results.
    this.sta = {success: 0, effect: 0};
    this.results.forEach((result) => {
      this.dune.success += parseInt(result.dune.success);
      this.dune.effect += parseInt(result.dune.effect);
    });

    // Return the evaluated term
    this._evaluated = true;
    this._issta = true;
    return this;
  }

  /* -------------------------------------------- */
  /** @override */
  roll(options) {
    const roll = super.roll(options);
    roll.sta = CONFIG.dune.CHALLENGE_RESULTS[roll.result];
    return roll;
  }

  /* -------------------------------------------- */
  /** @override */
  static getResultLabel(result) {
    return CONFIG.dune.CHALLENGE_RESULTS[result].label;
  }
}
