///<reference path="pokemons/PokemonFactory.ts"/>
/// <reference path="../declarations/GameHelper.d.ts" />

/**
 * Handles all logic related to battling
 */
class Battle {
    static enemyPokemon: KnockoutObservable<BattlePokemon> = ko.observable(null);

    static counter = 0;
    static catching: KnockoutObservable<boolean> = ko.observable(false);
    static catchRateActual: KnockoutObservable<number> = ko.observable(null);
    static pokeball: KnockoutObservable<GameConstants.Pokeball> = ko.observable(GameConstants.Pokeball.Pokeball);
    static lastPokemonAttack = Date.now();
    static lastClickAttack = Date.now();
    static route;

    /**
     * Probably not needed right now, but might be if we add more logic to a gameTick.
     */
    public static tick() {
        this.counter = 0;
        this.pokemonAttack();
        if (Settings.getSetting('enableAutoClicker').value && App.game.keyItems.hasKeyItem(KeyItemType.Auto_clicker)) {
            for (let i = 0; i < App.game.badgeCase.badgeCount() / 4; i++) {
                this.clickAttack();
            }
        }
    }

    /**
     * Attacks with Pokémon and checks if the enemy is defeated.
     */
    public static pokemonAttack() {
        //Pkmn attack disabled and we are not in the battle frontier
        if (App.game.challenges.list.disablePokemonAttack.active() && App.game.gameState != GameConstants.GameState.battleFrontier) {
            return;
        }
        // TODO: figure out a better way of handling this
        // Limit pokemon attack speed, Only allow 1 attack per 900ms
        const now = Date.now();
        if (this.lastPokemonAttack > now - 900) {
            return;
        }
        this.lastPokemonAttack = now;
        if (!this.enemyPokemon()?.isAlive()) {
            return;
        }
        this.enemyPokemon().damage(App.game.party.calculatePokemonAttack(this.enemyPokemon().type1, this.enemyPokemon().type2));
        if (!this.enemyPokemon().isAlive()) {
            this.defeatPokemon();
        }
    }

    /**
     * Attacks with clicks and checks if the enemy is defeated.
     */
    public static clickAttack() {
        // click attacks disabled and we already beat the starter
        if (App.game.challenges.list.disableClickAttack.active() && player.regionStarters[GameConstants.Region.kanto]() != GameConstants.Starter.None) {
            return;
        }
        if (!this.enemyPokemon()?.isAlive()) {
            return;
        }
        GameHelper.incrementObservable(App.game.statistics.clickAttacks);
        this.enemyPokemon().damage(App.game.party.calculateClickAttack(true));
        if (!this.enemyPokemon().isAlive()) {
            this.defeatPokemon();
        }
    }

    /**
     * Award the player with money and exp, and throw a Pokéball if applicable
     */
    public static defeatPokemon() {
        const enemyPokemon = this.enemyPokemon();
        Battle.route = player.route();
        const region = player.region;
        const catchRoute = player.route(); // Has to be set, the Battle.route is "zeroed" on region change
        enemyPokemon.defeat();

        GameHelper.incrementObservable(App.game.statistics.routeKills[player.region][Battle.route]);

        App.game.breeding.progressEggsBattle(Battle.route, player.region);
        const isShiny: boolean = enemyPokemon.shiny;
        const pokeBall: GameConstants.Pokeball = App.game.pokeballs.calculatePokeballToUse(enemyPokemon.id, isShiny);

        if (pokeBall !== GameConstants.Pokeball.None) {
            this.prepareCatch(enemyPokemon, pokeBall);
            setTimeout(
                () => {
                    this.attemptCatch(enemyPokemon, catchRoute, region);
                    if (Battle.route != 0) {
                        this.generateNewEnemy();
                    }
                },
                App.game.pokeballs.calculateCatchTime(pokeBall)
            )
            ;

        } else {
            this.generateNewEnemy();
        }
        this.gainItem();
        player.lowerItemMultipliers(MultiplierDecreaser.Battle);
    }

    /**
     * Generate a new enemy based on the current route and region.
     * Reset the counter.
     */
    public static generateNewEnemy() {
        this.counter = 0;
        this.enemyPokemon(PokemonFactory.generateWildPokemon(player.route(), player.region, player.subregionObject()));
        const enemyPokemon = this.enemyPokemon();
        PokemonHelper.incrementPokemonStatistics(enemyPokemon.id, GameConstants.PokemonStatisticsType.Encountered, enemyPokemon.shiny, enemyPokemon.gender);
        // Shiny
        if (enemyPokemon.shiny) {
            App.game.logbook.newLog(
                LogBookTypes.SHINY,
                App.game.party.alreadyCaughtPokemon(enemyPokemon.id, true)
                    ? createLogContent.encounterShinyDupe({
                        location: Routes.getRoute(player.region, player.route()).routeName,
                        pokemon: enemyPokemon.name,
                    })
                    : createLogContent.encounterShiny({
                        location: Routes.getRoute(player.region, player.route()).routeName,
                        pokemon: enemyPokemon.name,
                    })
            );
        } else if (!App.game.party.alreadyCaughtPokemon(enemyPokemon.id) && enemyPokemon.health()) {
            App.game.logbook.newLog(
                LogBookTypes.NEW,
                createLogContent.encounterWild({
                    location: Routes.getRoute(player.region, player.route()).routeName,
                    pokemon: enemyPokemon.name,
                })
            );
        }
    }

    protected static calculateActualCatchRate(enemyPokemon: BattlePokemon, pokeBall: GameConstants.Pokeball) {
        const pokeballBonus = App.game.pokeballs.getCatchBonus(pokeBall);
        const oakBonus = App.game.oakItems.calculateBonus(OakItemType.Magic_Ball);
        const totalChance = GameConstants.clipNumber(enemyPokemon.catchRate + pokeballBonus + oakBonus, 0, 100);
        return totalChance;
    }

    protected static prepareCatch(enemyPokemon: BattlePokemon, pokeBall: GameConstants.Pokeball) {
        this.pokeball(pokeBall);
        this.catching(true);
        this.catchRateActual(this.calculateActualCatchRate(enemyPokemon, pokeBall));
        App.game.pokeballs.usePokeball(pokeBall);
    }

    protected static attemptCatch(enemyPokemon: BattlePokemon, route: number, region: GameConstants.Region) {
        if (enemyPokemon == null) {
            this.catching(false);
            return;
        }
        if (Rand.chance(this.catchRateActual() / 100)) { // Caught
            this.catchPokemon(enemyPokemon, route, region);
        } else if (enemyPokemon.shiny) { // Failed to catch, Shiny
            App.game.logbook.newLog(
                LogBookTypes.ESCAPED,
                App.game.party.alreadyCaughtPokemon(enemyPokemon.id, true)
                    ? createLogContent.escapedShinyDupe({ pokemon: enemyPokemon.name })
                    : createLogContent.escapedShiny({ pokemon: enemyPokemon.name })
            );
        } else if (!App.game.party.alreadyCaughtPokemon(enemyPokemon.id)) { // Failed to catch, Uncaught
            App.game.logbook.newLog(
                LogBookTypes.ESCAPED,
                createLogContent.escapedWild({ pokemon: enemyPokemon.name})
            );
        }
        this.catching(false);
        this.catchRateActual(null);
    }

    public static catchPokemon(enemyPokemon: BattlePokemon, route: number, region: GameConstants.Region) {
        App.game.wallet.gainDungeonTokens(PokemonFactory.routeDungeonTokens(route, region));
        App.game.oakItems.use(OakItemType.Magic_Ball);
        App.game.party.gainPokemonById(enemyPokemon.id, enemyPokemon.shiny, undefined, enemyPokemon.gender);
        const partyPokemon = App.game.party.getPokemon(enemyPokemon.id);
        const epBonus = App.game.pokeballs.getEPBonus(this.pokeball());
        partyPokemon.effortPoints += App.game.party.calculateEffortPoints(partyPokemon, enemyPokemon.shiny, enemyPokemon.ep * epBonus);
    }

    static gainItem() {
        const p = MapHelper.normalizeRoute(Battle.route, player.region) / 1600 + 0.009375;

        if (Rand.chance(p)) {
            App.game.farming.gainRandomBerry();
        }

        if (App.game.statistics.routeKills[player.region][Battle.route]() > 10000) {
            if (Rand.chance(p / 10)) {
                const randomReward = [
                    'Leaf_stone', 'Fire_stone', 'Water_stone', 'Thunder_stone', 'Moon_stone', 'Trade_stone', 'Sun_stone', 'Soothe_bell',
                    'Metal_coat', 'Kings_rock', 'Upgrade', 'Dragon_scale', 'Prism_scale', 'Deepsea_tooth', 'Deepsea_scale', 'Shiny_stone',
                    'Dusk_stone', 'Dawn_stone', 'Razor_claw', 'Razor_fang', 'Electirizer', 'Magmarizer', 'Protector', 'Dubious_disc',
                    'Reaper_cloth', 'Black_DNA', 'White_DNA', 'Sachet', 'Whipped_dream', 'Ice_stone', 'Fire_egg', 'Water_egg', 'Grass_egg',
                    'Fighting_egg', 'Electric_egg', 'Dragon_egg',
                ];
                const item = randomReward[Math.floor(Math.random() * randomReward.length)];
                player.gainItem(ItemList[item].name, 1);
            }
            App.game.wallet.gainDungeonTokens(1000, false);
            App.game.wallet.gainQuestPoints(100, false);
            if (Rand.chance(p)) {
                App.game.wallet.gainFarmPoints(10, false);
                App.game.wallet.gainBattlePoints(10, false);
                App.game.wallet.gainDiamonds(1, false);
            }
        }
    }

    public static pokemonAttackTooltip: KnockoutComputed<string> = ko.pureComputed(() => {
        if (Battle.enemyPokemon()) {
            const pokemonAttack = App.game.party.calculatePokemonAttack(Battle.enemyPokemon().type1, Battle.enemyPokemon().type2);
            return `${pokemonAttack.toLocaleString('en-US')} against ${Battle.enemyPokemon().displayName}`;
        } else {
            return '';
        }
    }).extend({rateLimit: 1000});

}
