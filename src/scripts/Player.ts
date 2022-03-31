/// <reference path="../declarations/upgrades/Upgrade.d.ts" />

/**
 * Required modules before porting:
 * Save.ts
 * upgrades/Upgrade.ts
 * towns/Town.ts - Town, TownList
 * worldmap/MapHelper.ts
 * items/Item.ts - ItemList
 */

/**
 * Information about the player.
 * All player variables need to be saved.
 */

class Player {

    public achievementsCompleted: { [name: string]: boolean };

    private _route: KnockoutObservable<number>;
    private _region: KnockoutObservable<GameConstants.Region>;
    private _subregion: KnockoutObservable<number>;
    private _townName: string;
    private _town: KnockoutObservable<Town>;
    private starter: KnockoutObservable<GameConstants.Starter>;
    private _timeTraveller = false;
    private _origins: Array<any>;

    constructor(savedPlayer?) {
        const saved: boolean = (savedPlayer != null);
        savedPlayer = savedPlayer || {
            _region: GameConstants.Region.kanto,
            _route: 1,
        };
        this._lastSeen = savedPlayer._lastSeen || 0;
        this._timeTraveller = savedPlayer._timeTraveller || false;
        if (this._lastSeen > Date.now()) {
            Notifier.notify({
                title: 'Welcome Time Traveller!',
                message: 'Please ensure you keep a backup of your old save as travelling through time can cause some serious problems.\n\nAny Pokemon you may have obtained in the future could cease to exist which could corrupt your save file!',
                type: NotificationConstants.NotificationOption.danger,
                timeout: GameConstants.HOUR,
            });
            this._timeTraveller = true;
        }
        this._region = ko.observable(savedPlayer._region);
        this._subregion = ko.observable(savedPlayer._subregion || 0);
        this._route = ko.observable(savedPlayer._route);
        // Check that the route is valid, otherwise set it to the regions starting route (route 0 means they are in a town)
        if (this._route() > 0 && !MapHelper.validRoute(this._route(), this._region())) {
            this._route(GameConstants.StartingRoutes[this._region()]);
        }
        // Return player to last town or starter town if their town no longer exist for whatever reason
        this._townName = TownList[savedPlayer._townName] ? savedPlayer._townName : GameConstants.StartingTowns[this._region()];
        this._town = ko.observable(TownList[this._townName]);
        this._town.subscribe(value => this._townName = value.name);
        this.starter = ko.observable(savedPlayer.starter != undefined ? savedPlayer.starter : GameConstants.Starter.None);

        this._itemList = Save.initializeItemlist();
        if (savedPlayer._itemList) {
            for (const key in savedPlayer._itemList) {
                if (this._itemList[key]) {
                    this._itemList[key](savedPlayer._itemList[key]);
                }
            }
        }

        this._itemMultipliers = savedPlayer._itemMultipliers || Save.initializeMultipliers();

        // TODO(@Isha) move to underground classes.
        const mineInventory = (savedPlayer.mineInventory || [])
            // TODO: Convert this to object spread after we're on TS modules
            .map((v) => Object.assign({}, v, { amount: ko.observable(v.amount) }));
        this.mineInventory = ko.observableArray(mineInventory);

        this.achievementsCompleted = savedPlayer.achievementsCompleted || {};

        this.effectList = Save.initializeEffects(savedPlayer.effectList || {});
        this.effectTimer = Save.initializeEffectTimer(savedPlayer.effectTimer || {});
        this.highestRegion = ko.observable(savedPlayer.highestRegion || 0);

        // Save game origins, useful for tracking down any errors that may not be related to the main game
        this._origins = [...new Set((savedPlayer.origin || [])).add(window.location?.origin)];
    }

    private _itemList: { [name: string]: KnockoutObservable<number> };

    // TODO(@Isha) move to underground classes.
    public mineInventory: KnockoutObservableArray<any>;

    public _lastSeen: number;

    public effectList: { [name: string]: KnockoutObservable<number> } = {};
    public effectTimer: { [name: string]: KnockoutObservable<string> } = {};

    private highestRegion: KnockoutObservable<GameConstants.Region>;

    set itemList(value: { [p: string]: KnockoutObservable<number> }) {
        this._itemList = value;
    }

    get itemList(): { [p: string]: KnockoutObservable<number> } {
        return this._itemList;
    }

    public amountOfItem(itemName: string) {
        return this._itemList[itemName]();
    }

    private _itemMultipliers: { [name: string]: number };

    get itemMultipliers(): { [p: string]: number } {
        return this._itemMultipliers;
    }

    get route(): KnockoutObservable<number> {
        return this._route;
    }

    set route(value: KnockoutObservable<number>) {
        this._route = value;
    }

    get region(): GameConstants.Region {
        return this._region();
    }

    set region(value: GameConstants.Region) {
        this._region(value);
    }

    get subregion(): number {
        return this._subregion();
    }

    set subregion(value: number) {
        this._subregion(value);
        const subregion = SubRegions.getSubRegionById(this.region, value);

        if (subregion.startRoute) {
            MapHelper.moveToRoute(subregion.startRoute, player.region);
        } else if (subregion.startTown) {
            MapHelper.moveToTown(subregion.startTown);
        }
    }

    get town(): KnockoutObservable<Town> {
        return this._town;
    }

    set town(value: KnockoutObservable<Town>) {
        this._town = value;
    }

    public gainItem(itemName: string, amount: number) {
        this._itemList[itemName](this._itemList[itemName]() + amount);
    }

    public loseItem(itemName: string, amount: number) {
        this._itemList[itemName](this._itemList[itemName]() - amount);
    }

    public lowerItemMultipliers(multiplierDecreaser: MultiplierDecreaser, amount = 1) {
        for (const obj in ItemList) {
            const item = ItemList[obj];
            item.decreasePriceMultiplier(amount, multiplierDecreaser);
        }
    }

    // TODO(@Isha) move to underground classes.
    public hasMineItems() {
        for (let i = 0; i < this.mineInventory().length; i++) {
            if (this.mineInventory()[i].amount() > 0) {
                return true;
            }
        }
        return false;
    }

    // TODO(@Isha) move to underground classes.
    public mineInventoryIndex(id: number): number {
        return player.mineInventory().findIndex(i => i.id == id);
    }

    // TODO(@Isha) move to underground classes.
    public getUndergroundItemAmount(id: number) {
        const mineItem = player.mineInventory().find(i => i.id == id);
        if (mineItem) {
            return mineItem.amount();
        }
        const itemAmount = player.itemList[Underground.getMineItemById(id)?.valueType];
        return itemAmount?.() || 0;
    }

    public toJSON() {
        const keep = [
            '_route',
            '_region',
            '_subregion',
            '_townName',
            '_itemList',
            '_itemMultipliers',
            'starter',
            // TODO(@Isha) remove.
            'mineInventory',
            // TODO(@Isha) remove.
            '_mineLayersCleared',
            'achievementsCompleted',
            '_lastSeen',
            '_timeTraveller',
            '_origins',
            'gymDefeats',
            'achievementsCompleted',
            'effectList',
            'effectTimer',
            'highestRegion',
        ];
        const plainJS = ko.toJS(this);
        return Save.filter(plainJS, keep);
    }
}
