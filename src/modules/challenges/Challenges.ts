import { Saveable } from '../DataStore/common/Saveable';
import Challenge from './Challenge';

export default class Challenges implements Saveable {
    saveKey = 'challenges';

    defaults: Record<string, any> = {};

    // TODO: figure out a way to make the no click dmg and no pkmn dmg challenges exclusive to another
    list: Record<string, Challenge> = {
        regionalAttackDebuff: new Challenge('Regional Attack Debuff (recommended)', 'Lowers Pokémon attack based on native region and highest reached region', true),
        requireCompletePokedex: new Challenge('Require Complete Pokédex (recommended)', 'Requires a complete regional pokédex before moving on to the next region', true),
        disableClickAttack: new Challenge('No Click Attack', 'Disables the ability to use Click Attacks'),
        disablePokemonAttack: new Challenge('No Pokemon Attack', 'Caught Pokemon won\'t attack, but you get a bonus to your click attack'),
        disableBattleItems: new Challenge('No Battle Item', 'Disables the usage of Battle Items'),
        disableMasterballs: new Challenge('No Masterball', 'Disables the usage of Masterballs'),
        disableOakItems: new Challenge('No Oak Item', 'Disables the usage of all Oak Items'),
        disableShards: new Challenge('No Shard', 'Disables the usage of Shards for increasing damage multipliers'),
        disableProteins: new Challenge('No Protein', 'Disables the usage of Proteins'),
    };

    fromJSON(json): void {
        if (!json || !json.list) {
            return;
        }

        Object.entries(json.list).forEach(([challenge, value]) => {
            this.list[challenge]?.active(!!value);
        });
    }

    toJSON(): Record<string, any> {
        const list = {};
        Object.entries(this.list).forEach(([c, v]) => {
            list[c] = v.active();
        });
        return {
            list,
        };
    }
}
