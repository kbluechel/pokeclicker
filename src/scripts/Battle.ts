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
    static timerID = null;

    /**
     * Probably not needed right now, but might be if we add more logic to a gameTick.
     */
    public static tick() {
        this.counter = 0;
        this.pokemonAttack();
        if (Settings.getSetting('enableAutoClicker').value) {
            this.clickAttack();
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
        //#region Attack timer fix
        /**
         * possible change to the current attack restrictor
         * works on routes but not when
        if (this.timerID == null) {
            this.timerID = setInterval(() => {
                if (!this.enemyPokemon()?.isAlive()) {
                    return;
                }
                this.enemyPokemon().damage(App.game.party.calculatePokemonAttack(this.enemyPokemon().type1, this.enemyPokemon().type2));
                if (!this.enemyPokemon().isAlive()) {
                    this.defeatPokemon();
                }
            }, 900);
        }
        */
        //#endregion

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
        if (App.game.challenges.list.disableClickAttack.active() && player.starter() != GameConstants.Starter.None) {
            return;
        }
        // TODO: figure out a better way of handling this
        // Limit click attack speed, Only allow 1 attack per 10ms (100 per second)
        const now = Date.now();
        if (this.lastClickAttack > now - 10) {
            return;
        }
        this.lastClickAttack = now;
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
        enemyPokemon.defeat();

        GameHelper.incrementObservable(App.game.statistics.routeKills[player.region][Battle.route]);

        App.game.breeding.progressEggsBattle(Battle.route, player.region);
        const isShiny: boolean = enemyPokemon.shiny;
        const pokeBall: GameConstants.Pokeball = App.game.pokeballs.calculatePokeballToUse(enemyPokemon.id, isShiny);

        if (pokeBall !== GameConstants.Pokeball.None) {
            this.prepareCatch(enemyPokemon, pokeBall);
            setTimeout(
                () => {
                    this.attemptCatch(enemyPokemon);
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
        this.enemyPokemon(PokemonFactory.generateWildPokemon(player.route(), player.region));
        const enemyPokemon = this.enemyPokemon();
        GameHelper.incrementObservable(App.game.statistics.pokemonEncountered[enemyPokemon.id]);
        GameHelper.incrementObservable(App.game.statistics.totalPokemonEncountered);
        if (enemyPokemon.shiny) {
            GameHelper.incrementObservable(App.game.statistics.shinyPokemonEncountered[enemyPokemon.id]);
            GameHelper.incrementObservable(App.game.statistics.totalShinyPokemonEncountered);
            App.game.logbook.newLog(LogBookTypes.SHINY, `[${Routes.getRoute(player.region, player.route()).routeName}] You encountered a wild shiny ${enemyPokemon.name}.`);
        } else if (!App.game.party.alreadyCaughtPokemon(enemyPokemon.id) && enemyPokemon.health()) {
            App.game.logbook.newLog(LogBookTypes.NEW, `[${Routes.getRoute(player.region, player.route()).routeName}] You encountered a wild ${enemyPokemon.name}.`);
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

    protected static attemptCatch(enemyPokemon: BattlePokemon) {
        if (enemyPokemon == null) {
            this.catching(false);
            return;
        }
        if (Rand.chance(this.catchRateActual() / 100)) { // Caught
            this.catchPokemon(enemyPokemon);
        } else if (enemyPokemon.shiny) { // Failed to catch, Shiny
            App.game.logbook.newLog(LogBookTypes.ESCAPED, `The Shiny ${enemyPokemon.name} escaped!`);
        } else if (!App.game.party.alreadyCaughtPokemon(enemyPokemon.id)) { // Failed to catch, Uncaught
            App.game.logbook.newLog(LogBookTypes.ESCAPED, `The wild ${enemyPokemon.name} escaped!`);
        }
        this.catching(false);
        this.catchRateActual(null);
    }

    public static catchPokemon(enemyPokemon: BattlePokemon) {
        const catchRoute = Battle.route || player.town()?.dungeon?.difficultyRoute || 1;
        App.game.wallet.gainDungeonTokens(PokemonFactory.routeDungeonTokens(catchRoute, player.region));
        App.game.oakItems.use(OakItemType.Magic_Ball);
        App.game.party.gainPokemonById(enemyPokemon.id, enemyPokemon.shiny);
    }

    static gainItem() {
        const p = MapHelper.normalizeRoute(Battle.route, player.region) / 1600 + 0.009375;

        if (Rand.chance(p)) {
            App.game.farming.gainRandomBerry();
        }
        if (App.game.statistics.routeKills[player.region][Battle.route]() > 10000) {
            if (Rand.chance(p)) {
                const r = Rand.intBetween(0, 5);
                let egg = '';
                switch (r) {
                    case 0:
                        egg = 'Fire_egg';
                        break;
                    case 1:
                        egg = 'Water_egg';
                        break;
                    case 2:
                        egg = 'Grass_egg';
                        break;
                    case 3:
                        egg = 'Fighting_egg';
                        break;
                    case 4:
                        egg = 'Electric_egg';
                        break;
                    case 5:
                        egg = 'Dragon_egg';
                        break;
                    default:
                        break;
                }
                player.gainItem(ItemList[egg].name, 1);
            }
        }
    }

}
