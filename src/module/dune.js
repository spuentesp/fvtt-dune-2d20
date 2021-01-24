// Import Modules
import {
  Dune2d20Actor
} from './actors/actor.js';
import {
  DuneCharacterSheet
} from './actors/sheets/character-sheet.js';
import {
  DuneExtendedTaskSheet
} from './actors/sheets/extended-task-sheet.js';
import {
  DuneItemSheet
} from './items/item-sheet.js';
import {
  DuneCharacterWeaponSheet
} from './items/character-weapon-sheet.js';
import {
  DuneStarshipWeaponSheet
} from './items/starship-weapon-sheet.js';
import {
  DuneArmorSheet
} from './items/armor-sheet.js';
import {
  DuneTalentSheet
} from './items/talent-sheet.js';
import {
  DuneGenericSheet
} from './items/generic-sheet.js';

import { 
  DuneTracker
} from './apps/tracker.js';
import { 
  DuneLogo
} from './apps/logo.js';
import * as macros from './macro.js';
import { 
  DuneItem
} from './items/item.js';

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once('init', function() {
  // Splash Screen
  console.log(`Initializing Dune: Imperium`);


  // Create a namespace within the game global
  game.dune = {
    applications: {
      DuneCharacterSheet: DuneCharacterSheet,
      DuneExtendedTaskSheet: DuneExtendedTaskSheet,
      DuneItemSheet: DuneItemSheet,
      DuneCharacterWeaponSheet: DuneCharacterWeaponSheet,
      DuneArmorSheet: DuneArmorSheet,
      DuneTalentSheet: DuneTalentSheet,
      DuneGenericSheet: DuneGenericSheet,
      DuneItem: DuneItem,
    },
    entities: {
      Dune2d20Actor: Dune2d20Actor,
    },
    macros: macros,
    attributeTest: macros.attributeTest
  };

  // Define initiative for the system.
  CONFIG.Combat.initiative = {
    formula: '@disciplines.security.value',
    decimals: 0
  };

  // Set up custom challenge dice
  // CONFIG.dune.CHALLENGE_RESULTS = {
  //     1: { label: `<img src='systems/dune-imperium/assets/icons/ChallengeDie_Success1.svg'/>`, success: 1, effect: 0 },
  //     2: { label: `<img src='systems/dune-imperium/assets/icons/ChallengeDie_Success2.svg'/>`, success: 2, effect: 0 },
  //     3: { label: `<img src='systems/dune-imperium/assets/icons/ChallengeDie_Success0.svg'/>`, success: 0, effect: 0 },
  //     4: { label: `<img src='systems/dune-imperium/assets/icons/ChallengeDie_Success0.svg'/>`, success: 0, effect: 0 },
  //     5: { label: `<img src='systems/dune-imperium/assets/icons/ChallengeDie_Effect.svg'/>`, success: 1, effect: 1 },
  //     6: { label: `<img src='systems/dune-imperium/assets/icons/ChallengeDie_Effect.svg'/>`, success: 1, effect: 1 },
  //   };

  // Define custom Entity classes
  CONFIG.Actor.entityClass = Dune2d20Actor;
  CONFIG.Item.entityClass = DuneItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('dune', DuneCharacterSheet, {
    types: ['character'],
    makeDefault: true
  });
  Actors.registerSheet('dune', DuneExtendedTaskSheet, {
    types: ['extendedtask']
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('dune', DuneItemSheet, {
    types: ['item'],
    makeDefault: true
  });
  Items.registerSheet('dune', DuneCharacterWeaponSheet, {
    types: ['characterweapon'],
  });
  Items.registerSheet('dune', DuneStarshipWeaponSheet, {
    types: ['starshipweapon'],
  });
  Items.registerSheet('dune', DuneArmorSheet, {
    types: ['armor'],
  });
  Items.registerSheet('dune', DuneTalentSheet, {
    types: ['talent'],
  });
  Items.registerSheet('dune', DuneGenericSheet, {
    types: ['value'],
  });
  Items.registerSheet('dune', DuneGenericSheet, {
    types: ['focus'],
  });
  Items.registerSheet('dune', DuneGenericSheet, {
    types: ['injury'],
  });


  // Register system settings
  game.settings.register('dune', 'multipleComplications', {
    name: 'Multiple Complications:',
    hint: 'The rulebook states "Any die which rolled 20 causes a complication". This is slightly unclear and as of Version 8 of the PDF, this is still not clear - likely due to the incredible rarity. Enabling this will allow roles to display "There were x Complications" if multiple 20s are rolled. Disabling will just state a single complication.',
    scope: 'world',
    type: Boolean,
    default: true,
    config: true
  });

  game.settings.register('dune', 'threatPermissionLevel', {
    name: 'Threat Tracker User Role:',
    hint: 'Who should be allowed to amend the threat tracker? Please note, the permission level MUST have the Modify Configuration Settings permission.',
    scope: 'world',
    type: String,
    default: 'ASSISTANT',
    config: true,
    choices: {
      'PLAYER': 'Players',
      'TRUSTED': 'Trusted Players',
      'ASSISTANT': 'Assistant Gamemaster',
      'GAMEMASTER': 'Gamemasters',
    }
  });

  game.settings.register('dune', 'momentumPermissionLevel', {
    name: 'Momentum Tracker User Role:',
    hint: 'Who should be allowed to amend the momentum tracker? Please note, the permission level MUST have the Modify Configuration Settings permission.',
    scope: 'world',
    type: String,
    default: 'PLAYER',
    config: true,
    choices: {
      'PLAYER': 'Players',
      'TRUSTED': 'Trusted Players',
      'ASSISTANT': 'Assistant Gamemaster',
      'GAMEMASTER': 'Gamemasters',
    }
  });

  game.settings.register('dune', 'maxNumberOfReputation', {
    name: 'Maximum amount of Reputation:',
    hint: 'Max number of reputation that can be given to a character. 10 is default.',
    scope: 'world',
    type: Number,
    default: 20,
    config: true
  });

  game.settings.register('dune', 'trackerRefreshRate', {
    name: 'Refresh Rate of Threat & Momentum:',
    hint: 'In seconds, how often should the tracker refresh. It is inadvisable to set this too low. Up this if it appears to be causing optimisation issues.',
    scope: 'world',
    type: Number,
    default: 5,
    config: true
  });
    
  game.settings.register('dune', 'threat', {
    scope: 'world',
    type: Number,
    default: 0,
    config: false
  });

  game.settings.register('dune', 'momentum', {
    scope: 'world',
    type: Number,
    default: 0,
    config: false
  });

  Hooks.on('renderChatLog', (app, html, data) =>
    DuneItem.chatListeners(html)
  );

  Hooks.on('ready', function() {
    let error = false;
    let i = USER_ROLES[game.settings.get('dune', 'momentumPermissionLevel')];
    for (i; i <= 4; i++) {
      if (!game.permissions.SETTINGS_MODIFY.includes(i)) error = true;
    }
    if (error) {
      console.error('The Momentum Tracker User Role does not have permissions to Modify Configuration Settings. Please change one of these in Permission Configuration or System Settings.');
      ui.notifications.error('The Momentum Tracker User Role does not have permissions to Modify Configuration Settings. Please change one of these in Permission Configuration or System Settings.');
    }
    const t = new DuneTracker();
    renderTemplate('systems/dune-imperium/templates/apps/tracker.html').then((html) => {
      t.render(true);
    });
    const l = new DuneLogo();
    renderTemplate('systems/dune-imperium/templates/apps/logo.html').then((html) => {
      l.render(true);
    });
  });

  // Hooks.once("diceSoNiceReady", (dice3d) => {
  //     dice3d.addSystem({ id: "sta", name: "Star Trek Adventures" }, true);

  //     dice3d.addDicePreset(
  //         {
  //           type: "dc",
  //           labels: ["", "", "s", "s  \n  a", "a  \n  a", "a"],
  //           colorset: "blue",
  //           system: "sta",
  //         },
  //         "d6"
  //     );
  // });
});