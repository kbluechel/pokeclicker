/* eslint-disable array-bracket-newline */
///<reference path="../achievements/GymBadgeRequirement.ts"/>
///<reference path="../achievements/OneFromManyRequirement.ts"/>
///<reference path="../../declarations/enums/Badges.d.ts"/>
///<reference path="NPC.ts"/>
///<reference path="KantoBerryMasterNPC.ts"/>
///<reference path="ProfOakNPC.ts"/>
///<reference path="RoamerNPC.ts"/>

type TownOptionalArgument = {
    requirements?: (Requirement | OneFromManyRequirement)[],
    shops?: Shop[],
    dungeon?: Dungeon,
    npcs?: NPC[],
};

class Town {
    public name: string;
    public region: GameConstants.Region;
    public gym?: Gym;
    public requirements: (Requirement | OneFromManyRequirement)[];
    public shops: Shop[];
    public dungeon?: Dungeon;
    public npcs?: NPC[];
    public startingTown: boolean;

    constructor(
        name: string,
        region: GameConstants.Region,
        // Optional arguments are in a named object, so that we don't need
        // to pass undefined to get to the one we want
        optional: TownOptionalArgument = {}
    ) {
        this.name = name;
        this.region = region;
        this.gym = gymList[name];
        this.requirements = optional.requirements || [];
        this.shops = optional.shops || [];
        this.dungeon = optional.dungeon;
        this.npcs = optional.npcs;
        this.startingTown = GameConstants.StartingTowns.includes(this.name);
    }

    public isUnlocked() {
        return this.requirements.every(requirement => requirement.isCompleted());
    }
}

class DungeonTown extends Town {
    constructor(name: string, region: GameConstants.Region, requirements: (Requirement | OneFromManyRequirement)[] = []) {
        super(name, region, { requirements, dungeon: dungeonList[name] });
    }
}

const TownList: { [name: string]: Town | PokemonLeague } = {};

const pokeMartShop = new Shop([
    ItemList['Pokeball'],
    ItemList['Greatball'],
    ItemList['Ultraball'],
    ItemList['xAttack'],
    ItemList['xClick'],
    ItemList['Lucky_egg'],
    ItemList['Token_collector'],
    ItemList['Item_magnet'],
    ItemList['Lucky_incense'],
    ItemList['SmallRestore'],
    ItemList['MediumRestore'],
    ItemList['LargeRestore'],
], 'Explorers Poké Mart');

const DepartmentStoreShop = new Shop([
    ItemList['Pokeball'],
    ItemList['Greatball'],
    ItemList['Ultraball'],
    ItemList['xAttack'],
    ItemList['xClick'],
    ItemList['Lucky_egg'],
    ItemList['Item_magnet'],
    ItemList['Token_collector'],
    ItemList['Lucky_incense'],
    ItemList['SmallRestore'],
    ItemList['MediumRestore'],
    ItemList['LargeRestore'],
], 'Department Store');

//Kanto Shops
const PewterCityShop = new TownShop([
    ItemList['Pokeball'],
    ItemList['Token_collector'],
    ItemList['Lucky_egg'],
    ItemList['Mystery_egg'],
]);
const CeruleanCityShop = new TownShop([
    ItemList['Water_stone'],
    ItemList['xAttack'],
    ItemList['Water_egg'],
]);
const VermilionCityShop = new TownShop([
    ItemList['Thunder_stone'],
    ItemList['Lucky_egg'],
    ItemList['Electric_egg'],
]);
const CeladonCityShop = new TownShop([
    ItemList['Eevee'],
    ItemList['Porygon'],
    ItemList['Jynx'],
    ItemList['Mr. Mime'],
    ItemList['Lickitung'],
],   'Game Corner Shop');
const CeladonDepartmentStoreShop = new Shop([
    ItemList['Pokeball'],
    ItemList['Greatball'],
    ItemList['xAttack'],
    ItemList['xClick'],
    ItemList['Lucky_egg'],
    ItemList['Item_magnet'],
    ItemList['Token_collector'],
    ItemList['Lucky_incense'],
], 'Department Store');
const SaffronCityShop = new TownShop([
    ItemList['Moon_stone'],
    ItemList['xClick'],
    ItemList['Leaf_stone'],
    ItemList['Fighting_egg'],
]);
const FuchsiaCityShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Trade_stone'],
    ItemList['Lucky_egg'],
    ItemList['Dragon_egg'],
]);
const CinnabarIslandShop = new TownShop([
    ItemList['Fire_stone'],
    ItemList['Fire_egg'],
    ItemList['SmallRestore'],
    ItemList['Explorer_kit'],
    ItemList['Explosive_Charge'],
    ItemList['Treasure_Scanner'],
]);
const ViridianCityShop = new TownShop([
    ItemList['Pokeball'],
    ItemList['xAttack'],
    ItemList['xClick'],
    ItemList['Dungeon_ticket'],
    ItemList['Auto_clicker'],
]);
const LavenderTownShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Item_magnet'],
    ItemList['Lucky_incense'],
    ItemList['Grass_egg'],
]);

// Kanto NPCs

const PalletProfOak = new ProfOakNPC('Prof. Oak', [
    'Good luck on your journey!',
    'Come visit me when you complete your Pokédex!',
]);

const ViridianCityOldMan = new NPC('Old Man', [
    'Ahh, I\'ve had my coffee now and I feel great!',
    'You can use the Pokéball Selector to select which type of Pokéball to use on specific Pokémon based on caught status.',
]);

const PewterBattleItemRival = new NPC('Battle Item Master', [
    'Hey kid, you look new! Let me offer some advice, Battle Items like xAttack can be acquired along Routes, inside Dungeons and in Shops!',
    'Use them to help you out whenever you feel like time is against you!',
]);

const CeruleanKantoBerryMaster = new KantoBerryMasterNPC('Berry Master', [
    'Bah! You younglings have no appreciation of the art of Berry farming!',
    'Come back when you are ready to learn!',
]);

const VermilionFanClubChairman = new NPC('Fan Club Chairman', [
    'You won’t find a Pokémon as wonderful as my favorite Rapidash in those Typed Eggs in the shops, but they might hatch rare Pokémon you can’t find anywhere else!',
]);

const LavenderMrFuji = new NPC('Mr. Fuji', [
    'Welcome. In our Volunteer House here we take in all kinds of Pokémon to care for them.',
    'Did you know that sparkling Pokémon are more often found in Dungeons, on Farms, from Eggs, and even from Shops, the Safari Zone, and Evolutions from Items?',
]);

const BigSpender = new NPC('Big Spender', [
    'I love shopping! When I come in, the cashiers know I want tons of items.',
    'You can use the Shop Amount Button settings to make it easy for big purchases, too!',
]);

const SaffronBattleItemRival = new NPC('Battle Item Master', [
    'Do I know you? Wait... Have you met my worthless rival? Ha! Let me guess, he gave you some unwanted advice?',
    'I bet he forget to tell you that although all Battle Items only last for 30 seconds they can stack and last for days! Now scram!',
]);

const FuchsiaKantoRoamerNPC = new RoamerNPC('Youngster Wendy', [
    'There\'s been some recent sightings of roaming Pokémon on {ROUTE_NAME}!',
], GameConstants.Region.kanto);

const CinnabarIslandResearcher = new NPC('Researcher', [
    'They were trying to clone an ancient Pokémon in the mansion, I wonder if they succeeded.',
    'Apparently the ancient Pokémon escaped, And can be found roaming around Kanto!',
]);

//Kanto Towns
TownList['Pallet Town'] = new Town(
    'Pallet Town',
    GameConstants.Region.kanto,
    {
        npcs: [PalletProfOak],
    }
);
TownList['Pewter City'] = new Town(
    'Pewter City',
    GameConstants.Region.kanto,
    {
        requirements: [
            new RouteKillRequirement(10, GameConstants.Region.kanto, 2),
            new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Viridian Forest')),
        ],
        shops: [PewterCityShop],
        npcs: [PewterBattleItemRival],
    }
);
TownList['Cerulean City'] = new Town(
    'Cerulean City',
    GameConstants.Region.kanto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 4)],
        shops: [CeruleanCityShop],
        dungeon: dungeonList['Cerulean Cave'],
        npcs: [CeruleanKantoBerryMaster],
    }
);
TownList['Vermilion City'] = new Town(
    'Vermilion City',
    GameConstants.Region.kanto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 6)],
        shops: [VermilionCityShop],
        npcs: [VermilionFanClubChairman],
    }
);
TownList['Lavender Town'] = new Town(
    'Lavender Town',
    GameConstants.Region.kanto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 10)],
        shops: [LavenderTownShop],
        dungeon: dungeonList['Pokemon Tower'],
        npcs: [LavenderMrFuji],
    }
);
TownList['Celadon City'] = new Town(
    'Celadon City',
    GameConstants.Region.kanto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 7)],
        shops: [CeladonDepartmentStoreShop, CeladonCityShop],
        npcs: [BigSpender],
    }
);
TownList['Saffron City'] = new Town(
    'Saffron City',
    GameConstants.Region.kanto,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Rainbow)],
        shops: [SaffronCityShop],
        npcs: [SaffronBattleItemRival],
    }
);
TownList['Fuchsia City'] = new Town(
    'Fuchsia City',
    GameConstants.Region.kanto,
    {
        requirements: [new OneFromManyRequirement([
            new RouteKillRequirement(10, GameConstants.Region.kanto, 18),
            new RouteKillRequirement(10, GameConstants.Region.kanto, 15),
        ])],
        shops: [FuchsiaCityShop],
        npcs: [FuchsiaKantoRoamerNPC],
    }
);
TownList['Cinnabar Island'] = new Town(
    'Cinnabar Island',
    GameConstants.Region.kanto,
    {
        requirements: [new OneFromManyRequirement([
            new RouteKillRequirement(10, GameConstants.Region.kanto, 20),
            new RouteKillRequirement(10, GameConstants.Region.kanto, 21),
        ])],
        shops: [CinnabarIslandShop],
        dungeon: dungeonList['Pokemon Mansion'],
        npcs: [CinnabarIslandResearcher],
    }
);
TownList['Viridian City'] = new Town(
    'Viridian City',
    GameConstants.Region.kanto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kanto, 1)],
        shops: [ViridianCityShop],
        npcs: [ViridianCityOldMan],
    }
);

//Kanto Dungeons
TownList['Viridian Forest'] = new DungeonTown(
    'Viridian Forest',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 2)]
);
TownList['Mt. Moon'] = new DungeonTown(
    'Mt. Moon',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto,3)]
);
TownList['Digletts Cave'] = new DungeonTown(
    'Digletts Cave',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 6)]
);
TownList['Rock Tunnel'] = new DungeonTown(
    'Rock Tunnel',
    GameConstants.Region.kanto,
    [
        new RouteKillRequirement(10, GameConstants.Region.kanto, 9),
        new GymBadgeRequirement(BadgeEnums.Cascade),
    ]
);
TownList['Power Plant'] = new DungeonTown(
    'Power Plant',
    GameConstants.Region.kanto,
    [
        new RouteKillRequirement(10, GameConstants.Region.kanto, 9),
        new GymBadgeRequirement(BadgeEnums.Soul),
    ]
);
TownList['Pokemon Tower'] = new DungeonTown(
    'Pokemon Tower',
    GameConstants.Region.kanto,
    [
        new RouteKillRequirement(10, GameConstants.Region.kanto, 10),
        new GymBadgeRequirement(BadgeEnums.Rainbow),
    ]
);
TownList['Seafoam Islands'] = new DungeonTown(
    'Seafoam Islands',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 19)]
);
TownList['Pokemon Mansion'] = new DungeonTown(
    'Pokemon Mansion',
    GameConstants.Region.kanto,
    [new OneFromManyRequirement([
        new RouteKillRequirement(10, GameConstants.Region.kanto, 20),
        new RouteKillRequirement(10, GameConstants.Region.kanto, 21),
    ])]
);
TownList['Victory Road'] = new DungeonTown(
    'Victory Road',
    GameConstants.Region.kanto,
    [new RouteKillRequirement(10, GameConstants.Region.kanto, 23)]
);
TownList['Cerulean Cave'] = new DungeonTown(
    'Cerulean Cave',
    GameConstants.Region.kanto,
    [new GymBadgeRequirement(BadgeEnums.Elite_KantoChampion)]
);

//Johto Shops
const NewBarkTownShop = new TownShop([
    ItemList['Pokeball'],
]);
const VioletCityShop = new TownShop([
    ItemList['MediumRestore'],
    ItemList['Togepi'],
    ItemList['Mystery_egg'],
]);
const AzaleaTownShop = new TownShop([
    ItemList['Kings_rock'],
    ItemList['Grass_egg'],
    ItemList['Leaf_stone'],
]);
const GoldenrodDepartmentStoreShop = new Shop([
    ItemList['Pokeball'],
    ItemList['Greatball'],
    ItemList['Ultraball'],
    ItemList['xAttack'],
    ItemList['xClick'],
    ItemList['Lucky_egg'],
    ItemList['Item_magnet'],
    ItemList['Token_collector'],
    ItemList['Lucky_incense'],
    ItemList['SmallRestore'],
    ItemList['MediumRestore'],
], 'Department Store');
const EcruteakCityShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Fire_egg'],
    ItemList['Soothe_bell'],
    ItemList['Fire_stone'],
]);
const OlivineCityShop = new TownShop([
    ItemList['Metal_coat'],
    ItemList['Water_egg'],
    ItemList['Electric_egg'],
    ItemList['Water_stone'],
    ItemList['Thunder_stone'],
]);
const CianwoodCityShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Fighting_egg'],
    ItemList['Sun_stone'],
]);
const MahoganyTownShop = new TownShop([
    ItemList['Upgrade'],
    ItemList['Trade_stone'],
]);
const BlackthornCityShop = new TownShop([
    ItemList['LargeRestore'],
    ItemList['Dragon_scale'],
    ItemList['Dragon_egg'],
]);

// Johto NPCs

const JohtoBerryMaster = new BerryMasterShop([
    ItemList['Boost_Mulch'],
    ItemList['Rich_Mulch'],
    ItemList['Surprise_Mulch'],
    ItemList['Amaze_Mulch'],
    ItemList['Berry_Shovel'],
    ItemList['Mulch_Shovel'],
    ItemList['Squirtbottle'],
    ItemList['FarmHandBailey'],
    ItemList['ChopleBerry'],
    ItemList['KebiaBerry'],
    ItemList['ShucaBerry'],
    ItemList['ChartiBerry'],
]);

const NewBarkTechnologyEnthusiast = new NPC('Tech Enthusiast', [
    'Technology is amazing! I have heard that picking up items in chests in Dungeons can make it easier to see! But the Dungeons seem to get harder with each chest you pick up...',
]);

const CherrygroveMrPokemon = new NPC('Mr. Pokémon', [
    'Welcome to Johto! This is where the first ever Pokémon egg was found long ago.',
    'Astounding breakthroughs have been made since then. We can now store Pokémon eggs for longer and queue them up for breeding.',
    'This new technology only allows up to four stored eggs, for now.',
]);

const VioletEarlDervish = new NPC('Earl Dervish', [
    'Earl I am! Teach you I will to be a better trainer!',
    'Some Pokémon babies, only from Day Care they come! Hatch! Hatch! Hatch!',
]);

const AzaleaOldMan = new NPC('Wise Old Man', [
    'There is an old tale about the Guardian of Ilex Forest.',
    'It says that the mythical Pokémon Celebi will appear before anyone who has proven they are a Champion Pokémon Trainer.',
]);

const EcruteakKimonoGirl = new NPC('Kimono Girl', [
    'Legends say that Ho-Oh is searching for a trainer of pure heart.',
    'To prove yourself, you must tame the three legendary beasts of Johto, and bring them to the nearby Tin Tower.',
]);

const OlivineSSAquaCaptain = new NPC('SS Aqua Captain', [
    'Aye! At this here dock you can travel to far away regions! But only ones you’ve travelled to before, I’ve heard the Professor has his own vessel to take ye’ to new lands!',
]);

const CianwoodPhotographyAide = new NPC('Photography Aide', [
    'Cameron the Photographer isn’t here right now, he’s off taking photos of Pokémon on Berry Farms. Did you know that some Berries can even attract rare Pokémon?',
]);

const MahoganySouvenirShopAttendant = new NPC('Souvenir Shop Attendant', [
    'We’ve got stuff here nobody else has got! But keep any Item Magnets you have away from the merchandise… especially the RageCandyBars. Keep ‘em outside where they belong, I’ve heard magnets can attract Pokémon with held items more often, and even more so in Dungeons!',
]);

const BlackthornJohtoRoamerNPC = new RoamerNPC('Pokéfan Trevor', [
    'On the news they are getting more reports of roaming Pokémon appearing on {ROUTE_NAME}!',
], GameConstants.Region.johto);


//Johto Towns
TownList['New Bark Town'] = new Town(
    'New Bark Town',
    GameConstants.Region.johto,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_KantoChampion)],
        shops: [NewBarkTownShop],
        npcs: [NewBarkTechnologyEnthusiast],
    }
);
TownList['Cherrygrove City'] = new Town(
    'Cherrygrove City',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 29)],
        npcs: [CherrygroveMrPokemon],
    }
);
TownList['Violet City'] = new Town(
    'Violet City',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 31)],
        shops: [VioletCityShop],
        dungeon: dungeonList['Sprout Tower'],
        npcs: [VioletEarlDervish],
    }
);
TownList['Azalea Town'] = new Town(
    'Azalea Town',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 33)],
        shops: [AzaleaTownShop],
        dungeon: dungeonList['Slowpoke Well'],
        npcs: [AzaleaOldMan],
    }
);
TownList['Goldenrod City'] = new Town(
    'Goldenrod City',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 34)],
        shops: [GoldenrodDepartmentStoreShop, JohtoBerryMaster],
        dungeon: dungeonList['Radio Tower'],
        npcs: [BigSpender],
    }
);
TownList['Ecruteak City'] = new Town(
    'Ecruteak City',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 37)],
        shops: [EcruteakCityShop],
        npcs: [EcruteakKimonoGirl],
    }
);
TownList['Olivine City'] = new Town(
    'Olivine City',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 39)],
        shops: [OlivineCityShop],
        npcs: [OlivineSSAquaCaptain],
    }
);
TownList['Cianwood City'] = new Town(
    'Cianwood City',
    GameConstants.Region.johto,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.johto, 41)],
        shops: [CianwoodCityShop],
        npcs: [CianwoodPhotographyAide],
    }
);
TownList['Mahogany Town'] = new Town(
    'Mahogany Town',
    GameConstants.Region.johto,
    {
        requirements: [new OneFromManyRequirement([
            new RouteKillRequirement(10, GameConstants.Region.johto, 42),
            new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Mt Mortar')),
        ])],
        shops: [MahoganyTownShop],
        dungeon: dungeonList['Team Rockets Hideout'],
        npcs: [MahoganySouvenirShopAttendant],
    }
);
TownList['Blackthorn City'] = new Town(
    'Blackthorn City',
    GameConstants.Region.johto,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Ice Path'))],
        shops: [BlackthornCityShop],
        npcs: [BlackthornJohtoRoamerNPC],
    }
);

//Johto Dungeons
TownList['Sprout Tower'] = new DungeonTown(
    'Sprout Tower',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 31)]
);
TownList['Ruins of Alph'] = new DungeonTown(
    'Ruins of Alph',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 32)]
);
TownList['Union Cave'] = new DungeonTown(
    'Union Cave',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 32)]
);
TownList['Slowpoke Well'] = new DungeonTown(
    'Slowpoke Well',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 33)]
);
TownList['Ilex Forest'] = new DungeonTown(
    'Ilex Forest',
    GameConstants.Region.johto,
    [new GymBadgeRequirement(BadgeEnums.Hive)]
);
TownList['Burned Tower'] = new DungeonTown(
    'Burned Tower',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 37)]
);
TownList['Tin Tower'] = new DungeonTown(
    'Tin Tower',
    GameConstants.Region.johto,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Radio Tower'))]
);
TownList['Whirl Islands'] = new DungeonTown(
    'Whirl Islands',
    GameConstants.Region.johto,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Radio Tower'))]
);
TownList['Mt Mortar'] = new DungeonTown(
    'Mt Mortar',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 37)]
);
TownList['Team Rockets Hideout'] = new DungeonTown(
    'Team Rockets Hideout',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 43)]
);
TownList['Radio Tower'] = new DungeonTown(
    'Radio Tower',
    GameConstants.Region.johto,
    [
        new GymBadgeRequirement(BadgeEnums.Mineral),
        new GymBadgeRequirement(BadgeEnums.Glacier),
    ]
);
TownList['Ice Path'] = new DungeonTown(
    'Ice Path',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 44)]
);
TownList['Dark Cave'] = new DungeonTown(
    'Dark Cave',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 45)]
);
TownList['Victory Road Johto'] = new DungeonTown(
    'Victory Road Johto',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 26)]
);
TownList['Mt Silver'] = new DungeonTown(
    'Mt Silver',
    GameConstants.Region.johto,
    [new RouteKillRequirement(10, GameConstants.Region.johto, 28)]
);

//Hoenn Shops
const LittleRootTownShop = new TownShop([
    ItemList['Pokeball'],
]);
const PetalburgCityShop = new TownShop([
    ItemList['Kings_rock'],
]);
const RustboroCityShop = new TownShop([
    ItemList['Mystery_egg'],
]);
const DewfordTownShop = new TownShop([
    ItemList['Fighting_egg'],
]);
const SlateportCityShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Water_egg'],
    ItemList['Trade_stone'],
]);
const MauvilleCityShop = new TownShop([
    ItemList['Electric_egg'],
    ItemList['Thunder_stone'],
    ItemList['Metal_coat'],
]);
const VerdanturfTownShop = new TownShop([
    ItemList['Grass_egg'],
    ItemList['Soothe_bell'],
]);
const LavaridgeTownShop = new TownShop([
    ItemList['Fire_egg'],
    ItemList['Fire_stone'],
]);
const FallarborTownShop = new TownShop([
    ItemList['Moon_stone'],
    ItemList['Sun_stone'],
]);
const FortreeCityShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Leaf_stone'],
]);
const MossdeepCityShop = new TownShop([
    ItemList['Beldum'],
    ItemList['Prism_scale'],
    ItemList['Upgrade'],
]);
const SootopolisCityShop = new TownShop([
    ItemList['Water_stone'],
]);
const PacifidlogTownShop = new TownShop([
    ItemList['Deepsea_tooth'],
    ItemList['Deepsea_scale'],
]);
const EverGrandeCityShop = new TownShop([
    ItemList['Dragon_egg'],
    ItemList['Dragon_scale'],
]);
// TODO: finalize items and prices
const BattleFrontierShop = new TownShop([
    new PokeballItem(GameConstants.Pokeball.Ultraball, 1, GameConstants.Currency.battlePoint),
    new PokeballItem(GameConstants.Pokeball.Masterball, 500, GameConstants.Currency.battlePoint , { multiplier: 1.35, multiplierDecrease: false, saveName: `${GameConstants.Pokeball[GameConstants.Pokeball.Masterball]}|${GameConstants.Currency[GameConstants.Currency.battlePoint]}` }),
    new EnergyRestore(GameConstants.EnergyRestoreSize.SmallRestore, 10, GameConstants.Currency.battlePoint),
    new EnergyRestore(GameConstants.EnergyRestoreSize.MediumRestore, 20, GameConstants.Currency.battlePoint),
    new EnergyRestore(GameConstants.EnergyRestoreSize.LargeRestore, 40, GameConstants.Currency.battlePoint),
    ItemList['FarmHandJamie'],
]);

//Hoenn Berry Master
const HoennBerryMaster = new BerryMasterShop([
    ItemList['Boost_Mulch'],
    ItemList['Rich_Mulch'],
    ItemList['Surprise_Mulch'],
    ItemList['Amaze_Mulch'],
    ItemList['Berry_Shovel'],
    ItemList['Mulch_Shovel'],
    ItemList['Sprinklotad'],
    ItemList['FarmHandKerry'],
]);

//Hoenn NPCs

const LittlerootAide = new NPC('Professor Birch\'s Aide', [
    'We have received word from Mr. Pokémon in Johto! He has made another breakthrough.',
    'You can now store an additional four eggs in the queue! His research has really gained speed.',
    'He wants you to know that he will have an additional eight slots ready by the time you reach Sinnoh.',
]);

const OldaleTrackingScientist = new NPC('Tracking Scientist', [
    'Hey trainer, look at these footprints! Huh, I’ve never seen footprints like these before… They look like they came from two different Pokémon, and I saw two blurs, one red and one blue, quickly fly away just as I exited the Pokémon Center.',
    'They were flying really fast, I bet Pokémon that fast will only challenge trainers who have proven they are as strong as Champion Wallace...',
]);

const SlateportHoennRoamerNPC = new RoamerNPC('Reporter Gabby', [
    'Our sources indicate that roaming Pokémon are gathering on {ROUTE_NAME}!',
], GameConstants.Region.hoenn);

const FallarborProfessorCozmo = new NPC('Prof. Cozmo', [
    'Oh! Welcome, welcome. Do you by any chance have any Meteorites? No? Ah well, I’m studying the Pokémon Deoxys and I’ve heard that a Meteorite can cause it to change forms!',
    'I’ve also heard that the Battle Frontier may have some secrets relevant to Deoxys and its forms… but I’m not strong enough to find out...',
]);

const FortreeWeatherman = new NPC('Weatherman', [
    'Castform is a very finnicky pokemon.',
    'It changes forms when the weather is drastically different.',
    'If you want to collect them all, wait for the weather to change.',
]);

const MossdeepAstronomer = new NPC('Astronomer', [
    'Hey did you know about the Millennium Comet? We can see it in the sky right now, and it only comes around once every thousand years!',
    'There’s a legend that a mythical Wish Pokémon awakens when it passes over us. If you’re as strong as the Champion, maybe you’ll find it roaming around Hoenn granting wishes!',
]);

const PacifidlogDiver = new NPC('Diver', [
    'Yo! Find any cool stuff in chests lately?',
    ' I\'ve heard that if you beat a Dungeon a lot then the stuff you find in chests gets even more awesome.',
]);

const SootopolisWallace = new NPC('Gym Leader Wallace', [
    'The creators of the lands and ocean slumber within the Cave of Origin.',
    'However, they will only awaken when in the presence of a truly great trainer.',
    'You will have to overcome the Pokémon League before you have any chance to encounter them.',
]);

//Hoenn Towns
TownList['Littleroot Town'] = new Town(
    'Littleroot Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_JohtoChampion)],
        shops: [LittleRootTownShop],
        npcs: [LittlerootAide],
    }
);
TownList['Oldale Town'] = new Town(
    'Oldale Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 101)],
        npcs: [OldaleTrackingScientist],
    }
);
TownList['Petalburg City'] = new Town(
    'Petalburg City',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 102)],
        shops: [PetalburgCityShop],
    }
);
TownList['Rustboro City'] = new Town(
    'Rustboro City',
    GameConstants.Region.hoenn,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Petalburg Woods'))],
        shops: [RustboroCityShop],
    }
);
TownList['Dewford Town'] = new Town(
    'Dewford Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Rusturf Tunnel'))],
        shops: [DewfordTownShop],
    }
);
TownList['Slateport City'] = new Town(
    'Slateport City',
    GameConstants.Region.hoenn,
    {
        requirements: [
            new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Granite Cave')),
            new GymBadgeRequirement(BadgeEnums.Knuckle),
        ],
        shops: [SlateportCityShop],
        npcs: [SlateportHoennRoamerNPC],
    }
);
TownList['Mauville City'] = new Town(
    'Mauville City',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 110)],
        shops: [MauvilleCityShop, HoennBerryMaster],
    }
);
TownList['Verdanturf Town'] = new Town(
    'Verdanturf Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 117)],
        shops: [VerdanturfTownShop],
    }
);
TownList['Lavaridge Town'] = new Town(
    'Lavaridge Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Jagged Pass'))],
        shops: [LavaridgeTownShop],
    }
);
TownList['Fallarbor Town'] = new Town(
    'Fallarbor Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 113)],
        shops: [FallarborTownShop],
        npcs: [FallarborProfessorCozmo],
    }
);
TownList['Fortree City'] = new Town(
    'Fortree City',
    GameConstants.Region.hoenn,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Weather Institute'))],
        shops: [FortreeCityShop],
        npcs: [FortreeWeatherman],
    }
);
TownList['LilyCove City'] = new Town(
    'LilyCove City',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 121)],
        shops: [DepartmentStoreShop],
        npcs: [BigSpender],
    }
);
TownList['Mossdeep City'] = new Town(
    'Mossdeep City',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 125)],
        shops: [MossdeepCityShop],
        npcs: [MossdeepAstronomer],
    }
);
TownList['Pacifidlog Town'] = new Town(
    'Pacifidlog Town',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 131)],
        shops: [PacifidlogTownShop],
        npcs: [PacifidlogDiver],
    }
);
TownList['Sootopolis City'] = new Town(
    'Sootopolis City',
    GameConstants.Region.hoenn,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.hoenn, 126), new GymBadgeRequirement(BadgeEnums.Mind)],
        shops: [SootopolisCityShop],
        npcs: [SootopolisWallace],
    }
);
TownList['Ever Grande City'] = new Town(
    'Ever Grande City',
    GameConstants.Region.hoenn,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Rain)],
        shops: [EverGrandeCityShop],
    }
);
TownList['Pokémon League Hoenn'] = new Town(
    'Pokémon League',
    GameConstants.Region.hoenn,
    {
        requirements: [
            new RouteKillRequirement(10, GameConstants.Region.hoenn, 128),
            new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Victory Road Hoenn')),
        ],
    }
);
TownList['Battle Frontier'] = new Town(
    'Battle Frontier',
    GameConstants.Region.hoenn,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion)],
        shops: [BattleFrontierShop],
    }
);

//Hoenn Dungeons
TownList['Petalburg Woods'] = new DungeonTown(
    'Petalburg Woods',
    GameConstants.Region.hoenn,
    [new RouteKillRequirement(10, GameConstants.Region.hoenn, 104)]
);
TownList['Rusturf Tunnel'] = new DungeonTown(
    'Rusturf Tunnel',
    GameConstants.Region.hoenn,
    [
        new RouteKillRequirement(10, GameConstants.Region.hoenn, 116),
        new GymBadgeRequirement(BadgeEnums.Stone),
    ]
);
TownList['Granite Cave'] = new DungeonTown(
    'Granite Cave',
    GameConstants.Region.hoenn,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Rusturf Tunnel'))]
);
TownList['Fiery Path'] = new DungeonTown(
    'Fiery Path',
    GameConstants.Region.hoenn,
    [new RouteKillRequirement(10, GameConstants.Region.hoenn, 112)]
);
TownList['Meteor Falls'] = new DungeonTown(
    'Meteor Falls',
    GameConstants.Region.hoenn,
    [new RouteKillRequirement(10, GameConstants.Region.hoenn, 114)]
);
TownList['Mt. Chimney'] = new DungeonTown(
    'Mt. Chimney',
    GameConstants.Region.hoenn,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Meteor Falls'))]
);
TownList['Jagged Pass'] = new DungeonTown(
    'Jagged Pass',
    GameConstants.Region.hoenn,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Mt. Chimney'))]
);
TownList['New Mauville'] = new DungeonTown(
    'New Mauville',
    GameConstants.Region.hoenn,
    [new GymBadgeRequirement(BadgeEnums.Balance)]
);
TownList['Weather Institute'] = new DungeonTown(
    'Weather Institute',
    GameConstants.Region.hoenn,
    [new RouteKillRequirement(10, GameConstants.Region.hoenn, 119)]
);
TownList['Mt. Pyre'] = new DungeonTown(
    'Mt. Pyre',
    GameConstants.Region.hoenn,
    [new RouteKillRequirement(10, GameConstants.Region.hoenn, 122)]
);
TownList['Magma Hideout'] = new DungeonTown(
    'Magma Hideout',
    GameConstants.Region.hoenn,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Mt. Pyre'))]
);
TownList['Aqua Hideout'] = new DungeonTown(
    'Aqua Hideout',
    GameConstants.Region.hoenn,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Magma Hideout'))]
);
TownList['Shoal Cave'] = new DungeonTown(
    'Shoal Cave',
    GameConstants.Region.hoenn,
    [new RouteKillRequirement(10, GameConstants.Region.hoenn, 125)]
);
TownList['Cave of Origin'] = new DungeonTown(
    'Cave of Origin',
    GameConstants.Region.hoenn,
    [
        new RouteKillRequirement(10, GameConstants.Region.hoenn, 126),
        new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Seafloor Cavern')),
    ]
);
TownList['Seafloor Cavern'] = new DungeonTown(
    'Seafloor Cavern',
    GameConstants.Region.hoenn,
    [
        new RouteKillRequirement(10, GameConstants.Region.hoenn, 128),
        new GymBadgeRequirement(BadgeEnums.Mind),
    ]
);
TownList['Sky Pillar'] = new DungeonTown(
    'Sky Pillar',
    GameConstants.Region.hoenn,
    [
        new RouteKillRequirement(10, GameConstants.Region.hoenn, 131),
        new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Cave of Origin')),
    ]
);
TownList['Victory Road Hoenn'] = new DungeonTown(
    'Victory Road Hoenn',
    GameConstants.Region.hoenn,
    [new GymBadgeRequirement(BadgeEnums.Rain)]
);
TownList['Sealed Chamber'] = new DungeonTown(
    'Sealed Chamber',
    GameConstants.Region.hoenn,
    [
        new RouteKillRequirement(10, GameConstants.Region.hoenn, 134),
        new GymBadgeRequirement(BadgeEnums.Mind),
    ]
);

//Sinnoh Shops
const TwinleafTownShop = new TownShop([
    ItemList['Pokeball'],
]);
const JubilifeCityShop = new TownShop([
    ItemList['Moon_stone'],
    ItemList['Sun_stone'],
]);
const OreburghCityShop = new TownShop([
    ItemList['Mystery_egg'],
]);
const FloaromaTownShop = new TownShop([
    ItemList['Kings_rock'],
    ItemList['Trade_stone'],
]);
const EternaCityShop = new TownShop([
    ItemList['Grass_egg'],
    ItemList['Leaf_stone'],
]);
const HearthomeCityShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Soothe_bell'],
    ItemList['Fire_egg'],
    ItemList['Fire_stone'],
]);
const SolaceonTownShop = new TownShop([
    ItemList['Dawn_stone'],
    ItemList['Dusk_stone'],
    ItemList['Shiny_stone'],
    ItemList['Spiritomb'],
]);
const CelesticTownShop = new TownShop([
    ItemList['Dragon_egg'],
    ItemList['Dragon_scale'],
]);
const CanalaveCityShop = new TownShop ([
    ItemList['Fighting_egg'],
    ItemList['Metal_coat'],
]);
const PalParkShop = new TownShop([
    ItemList['Razor_claw'],
    ItemList['Razor_fang'],
    ItemList['Combee'],
    ItemList['Burmy (plant)'],
    ItemList['Cherubi'],
]);
const SnowpointCityShop = new TownShop([
    ItemList['Upgrade'],
]);
const SunyshoreCityShop = new TownShop([
    ItemList['Electric_egg'],
    ItemList['Thunder_stone'],
    ItemList['Deepsea_scale'],
    ItemList['Deepsea_tooth'],
]);
const SurvivalAreaShop = new TownShop([
    ItemList['Electirizer'],
    ItemList['Magmarizer'],
]);
const ResortAreaShop = new TownShop([
    ItemList['Reaper_cloth'],
    ItemList['Dubious_disc'],
    ItemList['Protector'],
]);
const PastoriaShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Skorupi'],
    ItemList['Water_egg'],
    ItemList['Water_stone'],
    ItemList['Prism_scale'],
]);

//Sinnoh Berry Master
const SinnohBerryMaster = new BerryMasterShop([
    ItemList['Boost_Mulch'],
    ItemList['Rich_Mulch'],
    ItemList['Surprise_Mulch'],
    ItemList['Amaze_Mulch'],
    ItemList['Berry_Shovel'],
    ItemList['Mulch_Shovel'],
    ItemList['FarmHandRiley'],
]);

//Sinnoh NPCs

const TwinleafContestChampion = new NPC('Contest Champion', [
    'Welcome to Sinnoh! There are many legends and myths here. For example, it is said that trainers that conquer the Lake nearby, Lake Verity, will meet a mythical Pokémon known for Emotion roaming around the region. It sure would have been awesome to partner with that Pokémon in one of my routines!',
]);

const SandgemBeachcomber = new NPC('Beachcomber', [
    'Hmmm… Oh! Sorry, I Didn’t see you there! Sometimes the strangest things wash up on this beach, I just got caught up in the search.',
    'Just last week a weird blue egg with a red center showed up. I went to go pick it up, but then it hatched! I was so surprised that the little blue Pokémon just hopped right back into the ocean. Who knows, maybe you’ll find it roaming around the region!',
]);

const FloaromaFlowerGirl = new NPC('Flower Girl', [
    'Something amazing just happened!',
    'My friend was taking their Eevee on a walk through Eterna Forest, and it suddenly evolved!',
    'Can you believe that?',
]);

const EternaLassCaroline = new NPC('Lass Caroline', [
    'Oh you came from the Forest! That Old Chateau is so creepy isn’t it? I’ve heard that trainers that catch the weird ghost in the TV have found ghosts in other appliances. Even lawnmowers!',
]);

const OreburghConstructionWorker = new NPC('Construction Worker', [
    'I was doing some exploring in Mt. Coronet last week, and my Nosepass gained a lot of levels.',
    'I had a big suprise when he reached level 20 though!',
]);

const HearthomeContestFan = new NPC('Contest Fan', [
    'My favourite contestant had a big reveal for us this week!',
    'Their prized Magneton had evolved into a Magnezone!',
    'I\'m so happy for them, all of that training in Mt. Coronet must have paid off!',
]);

const PalParkWarden = new NPC('Pal Park Warden', [
    'Hey! Welcome to the Pal Park, have you been to my Dad’s Safari Zone in Kanto? We don’t have as many Pokémon here, but I’ve heard that a flower Pokémon found here can bloom when it’s sunny outside!',
]);

const CanalaveYoungBoy = new NPC('Young Boy', [
    'Oh hello! Say, have you ever heard of Cresselia? Once when I was really little I had a really bad dream I couldn’t wake up from, but then a kind trainer went to an island near here and got help from Cresselia to cure me!',
    'Maybe if you can prove yourself by conquering that island you could find Cresselia roaming around the region...',
]);

const SnowpointYoungGirl = new NPC('Young Girl', [
    'Someone told me that training an Eevee in Lake Acuity will make it evolve.',
    'They must be lying, how can that be true?!',
]);

const SunyshoreRibbonerJulia = new NPC('Ribboner Julia', [
    'Oh! I don’t get visitors often. My husband is a sailor who visits far away lands… he always tells me these fantastic things.',
    'Did you know that in Johto they don’t see Pokémon like Mamoswine? It’s strange too, because you don’t even need a stone to evolve Piloswine… maybe they should try the Day Care?',
]);

const SurvivalAreaSinnohRoamerNPC = new RoamerNPC('Hiker Kevin', [
    'I spotted a bunch of roaming Pokémon on {ROUTE_NAME}!',
], GameConstants.Region.sinnoh);

//Sinnoh Towns
TownList['Twinleaf Town'] = new Town(
    'Twinleaf Town',
    GameConstants.Region.sinnoh,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_HoennChampion)],
        shops: [TwinleafTownShop],
        npcs: [TwinleafContestChampion],
    }
);
TownList['Sandgem Town'] = new Town(
    'Sandgem Town',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 201)],
        npcs: [SandgemBeachcomber],
    }
);
TownList['Jubilife City'] = new Town(
    'Jubilife City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 202)],
        shops: [JubilifeCityShop],
    }
);
TownList['Oreburgh City'] = new Town(
    'Oreburgh City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Oreburgh Gate'))],
        shops: [OreburghCityShop],
        npcs: [OreburghConstructionWorker],
    }
);
TownList['Floaroma Town'] = new Town(
    'Floaroma Town',
    GameConstants.Region.sinnoh,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Ravaged Path'))],
        shops: [FloaromaTownShop],
        npcs: [FloaromaFlowerGirl],
    }
);
TownList['Eterna City'] = new Town(
    'Eterna City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Eterna Forest'))],
        shops: [EternaCityShop],
        npcs: [EternaLassCaroline],
    }
);
TownList['Hearthome City'] = new Town(
    'Hearthome City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 208)],
        shops: [HearthomeCityShop, SinnohBerryMaster],
        npcs: [HearthomeContestFan],
    }
);
TownList['Solaceon Town'] = new Town(
    'Solaceon Town',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 209)],
        shops: [SolaceonTownShop],
    }
);
TownList['Veilstone City'] = new Town(
    'Veilstone City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 215)],
        shops: [DepartmentStoreShop],
        npcs: [BigSpender],
    }
);
TownList['Pastoria City'] = new Town(
    'Pastoria City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 213)],
        shops: [PastoriaShop],
    }
);
TownList['Celestic Town'] = new Town(
    'Celestic Town',
    GameConstants.Region.sinnoh,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Fen)],
        shops: [CelesticTownShop],
    }
);
TownList['Pal Park'] = new Town(
    'Pal Park',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 221)],
        shops: [PalParkShop],
        npcs: [PalParkWarden],
    }
);
TownList['Canalave City'] = new Town(
    'Canalave City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 218)],
        shops: [CanalaveCityShop],
        npcs: [CanalaveYoungBoy],
    }
);
TownList['Snowpoint City'] = new Town(
    'Snowpoint City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 217)],
        shops: [SnowpointCityShop],
        npcs: [SnowpointYoungGirl],
    }
);
TownList['Sunyshore City'] = new Town(
    'Sunyshore City',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 222)],
        shops: [SunyshoreCityShop],
        npcs: [SunyshoreRibbonerJulia],
    }
);
TownList['Pokémon League Sinnoh'] = new Town(
    'Pokémon League Sinnoh',
    GameConstants.Region.sinnoh,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Victory Road Sinnoh'))],
    }
);
TownList['Fight Area'] = new Town(
    'Fight Area',
    GameConstants.Region.sinnoh,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)],
    }
);
TownList['Survival Area'] = new Town(
    'Survival Area',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 225)],
        shops: [SurvivalAreaShop],
        npcs: [SurvivalAreaSinnohRoamerNPC],
    }
);
TownList['Resort Area'] = new Town(
    'Resort Area',
    GameConstants.Region.sinnoh,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 229)],
        shops: [ResortAreaShop],
    }
);

//Sinnoh Dungeons
TownList['Oreburgh Gate'] = new DungeonTown(
    'Oreburgh Gate',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 203)]
);
TownList['Ravaged Path'] = new DungeonTown(
    'Ravaged Path',
    GameConstants.Region.sinnoh,
    [
        new RouteKillRequirement(10, GameConstants.Region.sinnoh, 204),
        new GymBadgeRequirement(BadgeEnums.Coal),
    ]
);
TownList['Eterna Forest'] = new DungeonTown(
    'Eterna Forest',
    GameConstants.Region.sinnoh,
    [
        new RouteKillRequirement(10, GameConstants.Region.sinnoh, 205),
        new GymBadgeRequirement(BadgeEnums.Coal),
    ]
);
TownList['Old Chateau'] = new DungeonTown(
    'Old Chateau',
    GameConstants.Region.sinnoh,
    [
        new RouteKillRequirement(10, GameConstants.Region.sinnoh, 205),
        new GymBadgeRequirement(BadgeEnums.Forest),
    ]
);
TownList['Wayward Cave'] = new DungeonTown(
    'Wayward Cave',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 206)]
);
TownList['Mt. Coronet South'] = new DungeonTown(
    'Mt. Coronet South',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 207)]
);
TownList['Solaceon Ruins'] = new DungeonTown(
    'Solaceon Ruins',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 209)]
);
TownList['Iron Island'] = new DungeonTown(
    'Iron Island',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 218)]
);
TownList['Mt. Coronet North'] = new DungeonTown(
    'Mt. Coronet North',
    GameConstants.Region.sinnoh,
    [
        new RouteKillRequirement(10, GameConstants.Region.sinnoh, 211),
        new GymBadgeRequirement(BadgeEnums.Mine),
    ]
);
TownList['Distortion World'] = new DungeonTown(
    'Distortion World',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Icicle)]
);
TownList['Lake Valor'] = new DungeonTown(
    'Lake Valor',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Icicle)]
);
TownList['Lake Verity'] = new DungeonTown(
    'Lake Verity',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Icicle)]
);
TownList['Lake Acuity'] = new DungeonTown(
    'Lake Acuity',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Icicle)]
);
TownList['Victory Road Sinnoh'] = new DungeonTown(
    'Victory Road Sinnoh',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 223)]
);
TownList['Spear Pillar'] = new DungeonTown(
    'Spear Pillar',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)]
);
TownList['Hall of Origin'] = new DungeonTown(
    'Hall of Origin',
    GameConstants.Region.sinnoh,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Spear Pillar'))]
);
TownList['Fullmoon Island'] = new DungeonTown(
    'Fullmoon Island',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)]
);
TownList['Newmoon Island'] = new DungeonTown(
    'Newmoon Island',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)]
);
TownList['Flower Paradise'] = new DungeonTown(
    'Flower Paradise',
    GameConstants.Region.sinnoh,
    [
        new RouteKillRequirement(10, GameConstants.Region.sinnoh, 224),
        new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion),
    ]
);
TownList['Stark Mountain'] = new DungeonTown(
    'Stark Mountain',
    GameConstants.Region.sinnoh,
    [new RouteKillRequirement(10, GameConstants.Region.sinnoh, 227)]
);
TownList['Snowpoint Temple'] = new DungeonTown(
    'Snowpoint Temple',
    GameConstants.Region.sinnoh,
    [new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)]
);

//Unova Shops
const AspertiaCityShop = new TownShop([
    ItemList['Pokeball'],
]);
const FloccesyTownShop = new TownShop([
    ItemList['Mystery_egg'],
]);
const VirbankCityShop = new TownShop([
    ItemList['Greatball'],
]);
const CasteliaCityShop = new TownShop([
    ItemList['Trade_stone'],
    ItemList['Water_egg'],
    ItemList['Kings_rock'],
]);
const NimbasaCityShop = new TownShop([
    ItemList['Grass_egg'],
    ItemList['Electric_egg'],
    ItemList['Metal_coat'],
]);
const DriftveilCityShop = new TownShop([
    ItemList['Zorua'],
    ItemList['Razor_claw'],
    ItemList['Razor_fang'],
]);
const MistraltonCityShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Thunder_stone'],
    ItemList['Upgrade'],
]);
const LentimasTownShop = new TownShop([
    ItemList['Fire_egg'],
]);
const UndellaTownShop = new TownShop([
    ItemList['Deepsea_scale'],
    ItemList['Deepsea_tooth'],
]);
const LacunosaTownShop = new TownShop([
    ItemList['Fighting_egg'],
]);
const OpelucidCityShop = new TownShop([
    ItemList['Dragon_egg'],
    ItemList['Dragon_scale'],
]);
const HumilauCityShop = new TownShop([
    ItemList['Prism_scale'],
]);
const IcirrusCityShop = new TownShop([
    ItemList['Dubious_disc'],
    ItemList['Reaper_cloth'],
    ItemList['Protector'],
]);
const BlackAndWhiteParkShop = new TownShop([
    ItemList['Moon_stone'],
    ItemList['Sun_stone'],
]);
const NacreneCityShop = new TownShop([
    ItemList['Soothe_bell'],
]);
const StriatonCityShop = new TownShop([
    ItemList['Leaf_stone'],
    ItemList['Water_stone'],
    ItemList['Fire_stone'],
]);
const AccumulaTownShop = new TownShop([
    ItemList['Dusk_stone'],
    ItemList['Shiny_stone'],
    ItemList['Dawn_stone'],
]);
const NuvemaTownShop = new TownShop([
    ItemList['Electirizer'],
    ItemList['Magmarizer'],
]);
const AnvilleTownShop = new TownShop([
    ItemList['Meloetta (pirouette)'],
]);

//Unova NPCs
const ExcitedChild = new NPC('Excited Child', [
    'Did you hear? Did you see? It was on TV!',
    'I was just watching my favorite show, The National Gymquirer. It was a live segment! Some hot shot trainer from Kanto defeated Drayden! It was amazing! That trainer is so cool! Drayden is like unbeatable.',
    'Then my programme got interrupted by an emergency broadcast. A report on the first confirmed sightings of Tornadus and Thundurus in over twenty-five years! I\'ve read so much about them, they are my favorites.',
    'Last time they were spotted they just roamed around, causing all kinds of mischief. According to my books anyway. I\'m sure that amazing trainer from the TV will want to catch these mighty forces of nature.',
]);

const CasteliaMusician = new NPC('Musician', [
    'Sup. Ya like jazz? No? Well then you should check out me and my band at the Sonata Cafe where we never play Jazz.',
    'Sometimes a cool singing Pokémon shows up and joins in on our set. I’ve heard that trainers as strong as the Champion have found it roaming around the region looking for Pokémon battles… but even I wouldn’t challenge it to a Music battle.',
]);

const NimbasaExplorer = new NPC('Explorer', [
    'Whew! The desert is rough out there, glad you\'ve made it all the way to Nimbasa.',
    'Sometimes I find some weird stuff out in the sand, sometimes even Pokémon hiding in Chests. Like this one time in Relic Castle, I found a Pokémon that looks like a statue that I\'ve never seen before!',
]);

const IcirrusFanClubChairman = new NPC('Fan Club Chairman', [
    'Legends say Kyurem is missing a part of itself. It is waiting for a hero to fill in the missing parts of its body with Truth or Ideals.',
    'The legendary dragons of Dragonspiral Tower are said to embody these very concepts. They sometimes leave a piece of their DNA behind after a battle.',
    'If you have DNA splicers, perhaps you can make Kyurem whole again.',
    'I\'ve never seen it, but supposedly it works just like any evolution stone.',
]);

const UnovaRoamerNPC = new RoamerNPC('Professor Juniper\'s Aide', [
    'Our research indicates a higher concentration of roaming Pokémon on {ROUTE_NAME}!',
], GameConstants.Region.unova);

//Unova Towns
TownList['Aspertia City'] = new Town(
    'Aspertia City',
    GameConstants.Region.unova,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_SinnohChampion)],
        shops: [AspertiaCityShop],
    }
);
TownList['Floccesy Town'] = new Town(
    'Floccesy Town',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 19)],
        shops: [FloccesyTownShop],
    }
);
TownList['Virbank City'] = new Town(
    'Virbank City',
    GameConstants.Region.unova,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Basic)],
        shops: [VirbankCityShop],
    }
);
TownList['Castelia City'] = new Town(
    'Castelia City',
    GameConstants.Region.unova,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Toxic)],
        shops: [CasteliaCityShop],
        dungeon: dungeonList['Castelia Sewers'],
        npcs: [CasteliaMusician],
    }
);
TownList['Nimbasa City'] = new Town(
    'Nimbasa City',
    GameConstants.Region.unova,
    {
        requirements: [
            new RouteKillRequirement(10, GameConstants.Region.unova, 4),
            new GymBadgeRequirement(BadgeEnums.Insect),
        ],
        shops: [NimbasaCityShop],
        npcs: [NimbasaExplorer],
    }
);
TownList['Driftveil City'] = new Town(
    'Driftveil City',
    GameConstants.Region.unova,
    {
        requirements: [
            new RouteKillRequirement(10, GameConstants.Region.unova,5),
            new GymBadgeRequirement(BadgeEnums.Bolt),
        ],
        shops: [DriftveilCityShop],
    }
);
TownList['Mistralton City'] = new Town(
    'Mistralton City',
    GameConstants.Region.unova,
    {
        requirements: [
            new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Chargestone Cave')),
            new GymBadgeRequirement(BadgeEnums.Quake),
        ],
        shops: [MistraltonCityShop],
    }
);
TownList['Lentimas Town'] = new Town(
    'Lentimas Town',
    GameConstants.Region.unova,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Jet)],
        shops: [LentimasTownShop],
    }
);
TownList['Undella Town'] = new Town(
    'Undella Town',
    GameConstants.Region.unova,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Reversal Mountain'))],
        shops: [UndellaTownShop],
    }
);
TownList['Lacunosa Town'] = new Town(
    'Lacunosa Town',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 13)],
        shops: [LacunosaTownShop],
    }
);
TownList['Opelucid City'] = new Town(
    'Opelucid City',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 11)],
        shops: [OpelucidCityShop],
        dungeon: dungeonList['Team Plasma Assault'],
    }
);
TownList['Shopping Mall Nine'] = new Town(
    'Shopping Mall Nine',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 9)],
        shops: [DepartmentStoreShop],
    }
);
TownList['Humilau City'] = new Town(
    'Humilau City',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 21)],
        shops: [HumilauCityShop],
        npcs: [ExcitedChild],
    }
);
TownList['Pokémon League Unova'] = new Town(
    'Pokémon League Unova',
    GameConstants.Region.unova,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Victory Road Unova'))],
    }
);
TownList['Icirrus City'] = new Town(
    'Icirrus City',
    GameConstants.Region.unova,
    {
        requirements: [new OneFromManyRequirement([
            new RouteKillRequirement(10, GameConstants.Region.unova, 8),
            new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Twist Mountain')),
        ])],
        shops: [IcirrusCityShop],
        npcs: [IcirrusFanClubChairman],
    }
);
TownList['Black and White Park'] = new Town(
    'Black and White Park',
    GameConstants.Region.unova,
    {
        requirements: [new OneFromManyRequirement([
            new MultiRequirement([
                new GymBadgeRequirement(BadgeEnums.Elite_UnovaChampion),
                new RouteKillRequirement(10, GameConstants.Region.unova, 14),
            ]),
            new RouteKillRequirement(10, GameConstants.Region.unova, 15),
        ])],
        shops: [BlackAndWhiteParkShop],
    }
);
TownList['Nacrene City'] = new Town(
    'Nacrene City',
    GameConstants.Region.unova,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Pinwheel Forest'))],
        shops: [NacreneCityShop],
    }
);
TownList['Striaton City'] = new Town(
    'Striaton City',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 3)],
        shops: [StriatonCityShop],
    }
);
TownList['Accumula Town'] = new Town(
    'Accumula Town',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 2)],
        shops: [AccumulaTownShop],
    }
);
TownList['Nuvema Town'] = new Town(
    'Nuvema Town',
    GameConstants.Region.unova,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.unova, 1)],
        shops: [NuvemaTownShop],
        npcs: [UnovaRoamerNPC],
    }
);
TownList['Anville Town'] = new Town(
    'Anville Town',
    GameConstants.Region.unova,
    {
        requirements: [new ObtainedPokemonRequirement(pokemonMap['Meloetta (aria)'])],
        shops: [AnvilleTownShop],
    }
);

//Unova Dungeons
TownList['Pledge Grove'] = new DungeonTown(
    'Pledge Grove',
    GameConstants.Region.unova,
    [new ObtainedPokemonRequirement(pokemonMap.Keldeo)]
);
TownList['Floccesy Ranch'] = new DungeonTown(
    'Floccesy Ranch',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 20)]
);
TownList['Liberty Garden'] = new DungeonTown(
    'Liberty Garden',
    GameConstants.Region.unova,
    //Victini dungeon, maybe unlock later
    [new GymBadgeRequirement(BadgeEnums.Toxic)]
);
TownList['Castelia Sewers'] = new DungeonTown(
    'Castelia Sewers',
    GameConstants.Region.unova,
    [new GymBadgeRequirement(BadgeEnums.Toxic)]
);
TownList['Relic Passage'] = new DungeonTown(
    'Relic Passage',
    GameConstants.Region.unova,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Castelia Sewers'))]
);
TownList['Relic Castle'] = new DungeonTown(
    'Relic Castle',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 25)]
);
TownList['Lostlorn Forest'] = new DungeonTown(
    'Lostlorn Forest',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 16)]
);
TownList['Chargestone Cave'] = new DungeonTown(
    'Chargestone Cave',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 6)]
);
TownList['Mistralton Cave'] = new DungeonTown(
    'Mistralton Cave',
    GameConstants.Region.unova,
    [
        new GymBadgeRequirement(BadgeEnums.Quake),
        new RouteKillRequirement(10, GameConstants.Region.unova, 6),
    ]
);
TownList['Celestial Tower'] = new DungeonTown(
    'Celestial Tower',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 7)]
);
TownList['Reversal Mountain'] = new DungeonTown(
    'Reversal Mountain',
    GameConstants.Region.unova,
    [new GymBadgeRequirement(BadgeEnums.Jet)]
);
TownList['Team Plasma Assault'] = new DungeonTown(
    'Team Plasma Assault',
    GameConstants.Region.unova,
    [
        new GymBadgeRequirement(BadgeEnums.Legend),
    ]
);
TownList['Seaside Cave'] = new DungeonTown(
    'Seaside Cave',
    GameConstants.Region.unova,
    [
        new RouteKillRequirement(10, GameConstants.Region.unova, 24),
        new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Team Plasma Assault')),
    ]
);
TownList['Plasma Frigate'] = new DungeonTown(
    'Plasma Frigate',
    GameConstants.Region.unova,
    [
        new RouteKillRequirement(10, GameConstants.Region.unova, 22),
        new GymBadgeRequirement(BadgeEnums.Wave),
    ]
);
TownList['Giant Chasm'] = new DungeonTown(
    'Giant Chasm',
    GameConstants.Region.unova,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Plasma Frigate'))]
);
TownList['Cave of Being'] = new DungeonTown(
    'Cave of Being',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 23)]
);
TownList['Abundant Shrine'] = new DungeonTown(
    'Abundant Shrine',
    GameConstants.Region.unova,
    [
        new RouteKillRequirement(10, GameConstants.Region.unova, 23),
        new RouteKillRequirement(10, GameConstants.Region.unova, 14),
        new ObtainedPokemonRequirement(pokemonMap.Tornadus),
        new ObtainedPokemonRequirement(pokemonMap.Thundurus),
    ]
);
TownList['Victory Road Unova'] = new DungeonTown(
    'Victory Road Unova',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 23)]
);
TownList['Twist Mountain'] = new DungeonTown(
    'Twist Mountain',
    GameConstants.Region.unova,
    [new OneFromManyRequirement([
        new MultiRequirement([
            new GymBadgeRequirement(BadgeEnums.Elite_UnovaChampion),
            new RouteKillRequirement(10, GameConstants.Region.unova, 7),
        ]),
        new RouteKillRequirement(10, GameConstants.Region.unova, 8),
    ])]
);
TownList['Dragonspiral Tower'] = new DungeonTown(
    'Dragonspiral Tower',
    GameConstants.Region.unova,
    [new OneFromManyRequirement([
        new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Twist Mountain')),
        new RouteKillRequirement(10, GameConstants.Region.unova, 8),
    ])]
);
TownList['Moor of Icirrus'] = new DungeonTown(
    'Moor of Icirrus',
    GameConstants.Region.unova,
    [
        new RouteKillRequirement(10, GameConstants.Region.unova, 8),
        new ObtainedPokemonRequirement(pokemonMap.Cobalion),
        new ObtainedPokemonRequirement(pokemonMap.Terrakion),
        new ObtainedPokemonRequirement(pokemonMap.Virizion),
    ]
);
TownList['Pinwheel Forest'] = new DungeonTown(
    'Pinwheel Forest',
    GameConstants.Region.unova,
    [new GymBadgeRequirement(BadgeEnums.Elite_UnovaChampion)]
);
TownList['Dreamyard'] = new DungeonTown(
    'Dreamyard',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 3)]
);
TownList['P2 Laboratory'] = new DungeonTown(
    'P2 Laboratory',
    GameConstants.Region.unova,
    [new RouteKillRequirement(10, GameConstants.Region.unova, 17)]
);

//Kalos Shops
const VanivilleTownShop = new TownShop([
    ItemList['Pokeball'],
]);
const SantaluneCityShop = new TownShop([
    ItemList['Mystery_egg'],
]);
const FriseurFurfrouShop = new Shop([
    ItemList['Furfrou (Debutante)'],
    ItemList['Furfrou (Diamond)'],
    ItemList['Furfrou (Matron)'],
    ItemList['Furfrou (Dandy)'],
    ItemList['Furfrou (Kabuki)'],
    ItemList['Furfrou (Pharaoh)'],
], 'Friseur Furfrou');
const CamphrierTownShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Thunder_stone'],
    ItemList['Electric_egg'],
]);
const AmbretteTownShop = new TownShop([
    ItemList['Water_egg'],
    ItemList['Water_stone'],
]);
const GeosengeTownShop = new TownShop([
    ItemList['Fire_egg'],
    ItemList['Fire_stone'],
    ItemList['Kings_rock'],
]);
const ShalourCityShop = new TownShop([
    ItemList['Fighting_egg'],
    ItemList['Metal_coat'],
    ItemList['Trade_stone'],
]);
const CoumarineCityShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Grass_egg'],
    ItemList['Leaf_stone'],
    ItemList['Electirizer'],
    ItemList['Magmarizer'],
]);
const LaverreCityShop = new TownShop([
    ItemList['Sachet'],
    ItemList['Whipped_dream'],
    ItemList['Deepsea_scale'],
    ItemList['Deepsea_tooth'],
]);
const DendemilleTownShop = new TownShop([
    ItemList['Dusk_stone'],
    ItemList['Shiny_stone'],
    ItemList['Dawn_stone'],
    ItemList['Upgrade'],
]);
const AnistarCityShop = new TownShop([
    ItemList['Sun_stone'],
    ItemList['Moon_stone'],
    ItemList['Razor_claw'],
    ItemList['Razor_fang'],
]);
const CouriwayTownShop = new TownShop([
    ItemList['Dragon_egg'],
    ItemList['Dragon_scale'],
    ItemList['Prism_scale'],
]);
const SnowbelleCityShop = new TownShop([
    ItemList['Protector'],
    ItemList['Reaper_cloth'],
    ItemList['Dubious_disc'],
]);

//Kalos NPCs

const LumioseEngineer = new NPC('Engineer', [
    'I\'m glad to be back in the city after so long at the Power Plant, it\'s so dusty out there!.',
    'Rumor has it that if you conquer the Kalos Power Plant enough times that a strong Pokémon will challenge you made of Fire and Water. But I bet you’d have to be the Champion before it finds you worthy… I certainly have never seen it!',
]);

const CamphrierFlabébéEnthusiast = new NPC('Flabébé Enthusiast', [
    'Ah, isn\'t Flabébé such an eye-catching Pokémon? All these different lovely colors…',
    'If you\'re searching for the yellow and blue kinds, look no further than the Farm!',
    'They simply can\'t resist berries that match their colors - just plant a few and they\'ll soon come wandering in.',
]);

const CoumarineBirdwatcher = new NPC('Birdwatcher', [
    'I\'ve heard there is a cave you can find if you go out on the ocean a little ways.',
    'Apparently defeating a strong creature there unleashes some energy.',
    'There are rumors that the energy calls some legendary birds to roam Kalos!',
]);

const LaverreFurisodeGirlKatherine = new NPC('Furisode Girl Katherine', [
    'Don\'t you find Goomy to be an interesting Pokémon? I certainly think so, even though it isn\'t a problem for my Pokémon~',
    'I\'ve heard its evolutionary line loves damp conditions, and apparently if you train a Sliggoo during rainy or foggy weather something marvelous happens!',
]);

const AnistarKalosRoamerNPC = new RoamerNPC('Hex Maniac Melanie', [
    'The spirits tell me roaming Pokémon have been spotted on {ROUTE_NAME}!',
], GameConstants.Region.kalos);

const KiloudeConfusedHiker = new NPC('Confused Hiker', [
    'Whoa! What the- Where am I? How did I get here? Last thing I can remember I was in Reflection Cave when this little Pokémon with hoops threw something at me… Oh you’ve beaten the Pokémon League? Maybe you can find it roaming around the region so you can tame that little prankster. Now how am I gonna get home…',
]);

//Kalos Towns

TownList['Vaniville Town'] = new Town(
    'Vaniville Town',
    GameConstants.Region.kalos,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_UnovaChampion)],
        shops: [VanivilleTownShop],
    }
);
TownList['Aquacorde Town'] = new Town(
    'Aquacorde Town',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 1)],
    }
);
TownList['Santalune City'] = new Town(
    'Santalune City',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 3)],
        shops: [SantaluneCityShop],
    }
);
TownList['Lumiose City'] = new Town(
    'Lumiose City',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 4)],
        shops: [DepartmentStoreShop,FriseurFurfrouShop],
        npcs: [LumioseEngineer],
    }
);
TownList['Camphrier Town'] = new Town(
    'Camphrier Town',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 5)],
        shops: [CamphrierTownShop],
        npcs: [CamphrierFlabébéEnthusiast],
    }
);
TownList['Ambrette Town'] = new Town(
    'Ambrette Town',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 8)],
        shops: [AmbretteTownShop],
    }
);
TownList['Cyllage City'] = new Town(
    'Cyllage City',
    GameConstants.Region.kalos,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Glittering Cave'))],
    }
);
TownList['Geosenge Town'] = new Town(
    'Geosenge Town',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 10)],
        shops: [GeosengeTownShop],
        dungeon: dungeonList['Team Flare Secret HQ'],
    }
);
TownList['Shalour City'] = new Town(
    'Shalour City',
    GameConstants.Region.kalos,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Reflection Cave'))],
        shops: [ShalourCityShop],
    }
);
TownList['Coumarine City'] = new Town(
    'Coumarine City',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 12)],
        shops: [CoumarineCityShop],
        npcs: [CoumarineBirdwatcher],
    }
);
TownList['Laverre City'] = new Town(
    'Laverre City',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 14)],
        shops: [LaverreCityShop],
        npcs: [LaverreFurisodeGirlKatherine],
    }
);
TownList['Dendemille Town'] = new Town(
    'Dendemille Town',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 15)],
        shops: [DendemilleTownShop],
    }
);
TownList['Anistar City'] = new Town(
    'Anistar City',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 17)],
        shops: [AnistarCityShop],
        npcs: [AnistarKalosRoamerNPC],
    }
);
TownList['Couriway Town'] = new Town(
    'Couriway Town',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 18)],
        shops: [CouriwayTownShop],
    }
);
TownList['Snowbelle City'] = new Town(
    'Snowbelle City',
    GameConstants.Region.kalos,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.kalos, 19)],
        shops: [SnowbelleCityShop],
    }
);
TownList['Pokémon League Kalos'] = new Town(
    'Pokémon League Kalos',
    GameConstants.Region.kalos,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Victory Road Kalos'))],
    }
);
TownList['Kiloude City'] = new Town(
    'Kiloude City',
    GameConstants.Region.kalos,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_KalosChampion)],
        npcs: [KiloudeConfusedHiker],
    }
);

//Kalos Dungeons
TownList['Santalune Forest'] = new DungeonTown(
    'Santalune Forest',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 2)]
);
TownList['Parfum Palace'] = new DungeonTown(
    'Parfum Palace',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 6)]
);
TownList['Connecting Cave'] = new DungeonTown(
    'Connecting Cave',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 7)]
);
TownList['Glittering Cave'] = new DungeonTown(
    'Glittering Cave',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 9)]
);
TownList['Reflection Cave'] = new DungeonTown(
    'Reflection Cave',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 11)]
);
//Tower of Mastery?
TownList['Sea Spirit\'s Den'] = new DungeonTown(
    'Sea Spirit\'s Den',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 23)]
);
TownList['Pokéball Factory'] = new DungeonTown(
    'Pokéball Factory',
    GameConstants.Region.kalos,
    [new GymBadgeRequirement(BadgeEnums.Fairy)]
);
TownList['Kalos Power Plant'] = new DungeonTown(
    'Kalos Power Plant',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 13), new GymBadgeRequirement(BadgeEnums.Plant)]
);
TownList['Lost Hotel'] = new DungeonTown(
    'Lost Hotel',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 15)]
);
TownList['Frost Cavern'] = new DungeonTown(
    'Frost Cavern',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 15)]
);
TownList['Team Flare Secret HQ'] = new DungeonTown(
    'Team Flare Secret HQ',
    GameConstants.Region.kalos,
    [new GymBadgeRequirement(BadgeEnums.Psychic)]
);
TownList['Terminus Cave'] = new DungeonTown(
    'Terminus Cave',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 18)]
);
TownList['Pokémon Village'] = new DungeonTown(
    'Pokémon Village',
    GameConstants.Region.kalos,
    [new RouteKillRequirement(10, GameConstants.Region.kalos, 20)]
);
TownList['Victory Road Kalos'] = new DungeonTown(
    'Victory Road Kalos',
    GameConstants.Region.kalos,
    [
        new GymBadgeRequirement(BadgeEnums.Iceberg),
        new OneFromManyRequirement([
            new RouteKillRequirement(10, GameConstants.Region.kalos, 21),
            new RouteKillRequirement(10, GameConstants.Region.kalos, 22),
        ]),
    ]
);
//Unknown Cave?

//Alola Shops

const IkiTownOutskirtsShop = new TownShop([
    ItemList['Pokeball'],
]);
const HauoliCityShop = new TownShop([
    ItemList['Mystery_egg'],
    ItemList['Shiny_stone'],
    ItemList['Dusk_stone'],
    ItemList['Dawn_stone'],
]);
const HeaheaCityShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Water_stone'],
    ItemList['Metal_coat'],
    ItemList['Kings_rock'],
]);
const PaniolaTownShop = new TownShop([
    ItemList['Grass_egg'],
    ItemList['Fire_egg'],
    ItemList['Water_egg'],
]);
const KonikoniCityShop = new TownShop([
    ItemList['Fire_stone'],
    ItemList['Soothe_bell'],
    ItemList['Trade_stone'],
]);
const AetherParadiseShop = new TownShop([
    ItemList['Type: Null'],
    ItemList['Upgrade'],
]);
const MalieCityShop = new TownShop([
    ItemList['Ultraball'],
    ItemList['Thunder_stone'],
    ItemList['Electric_egg'],
    ItemList['Magmarizer'],
    ItemList['Electirizer'],
]);
const TapuVillageShop = new TownShop([
    ItemList['Ice_stone'],
    ItemList['Razor_claw'],
    ItemList['Razor_fang'],
]);
const SeafolkVillageShop = new TownShop([
    ItemList['Fighting_egg'],
    ItemList['Deepsea_scale'],
    ItemList['Deepsea_tooth'],
    ItemList['Prism_scale'],
    ItemList['Sachet'],
    ItemList['Whipped_dream'],
]);
const ExeggutorIslandShop = new TownShop([
    ItemList['Dragon_egg'],
    ItemList['Leaf_stone'],
    ItemList['Dragon_scale'],
    ItemList['Protector'],
    ItemList['Dubious_disc'],
    ItemList['Reaper_cloth'],
]);
const AltaroftheSunneandMooneShop = new TownShop([
    ItemList['Poipole'],
    ItemList['Sun_stone'],
    ItemList['Moon_stone'],
]);

//Alola NPCs

const IkiKahuna = new NPC('Kahuna Hala', [
    'Welcome to Alola!',
    'Here we don\'t have gyms. We have the Island Challenge. On each of our four islands you will complete one or more trials.',
    'After completing all of an island\'s trials you will battle that island\'s Kahuna in a Grand trial.',
    'This island only has one trial: Captain Ilima\'s trial in Verdant Cavern. Come back here after clearing that challenge for your Grand trial battle.',
]);
const HeaheaCafeOwner = new NPC('Café Owner', [
    'Akala Island has three trials.',
    'Captain Lana\'s trial in Brooklet Hill, Captain Kiawe\'s trial in Wela Volcano Park and Captain Mallow\'s trial in Lush Jungle.',
    'For what it\'s worth, I say don\'t go to any of those places. Too wet, too hot and too... jungly. Why not stay here? Have a coffee! Enjoy the city!',
    'Or go to Konikoni City down south. You might even meet our Kahuna there!',
]);
const RoyalAvenueSpectator = new NPC('Spectator', [
    'I think batles in the Battle Royal Dome are more like games of chance. But Battle Royals are nothing compared to trying to evolve an Alolan Raichu with a Thunderstone.',
    'Evolving Pikachu or Exeggcute in Alola can result in a new form! Sometimes.',
]);
const KonikoniKahuna = new NPC('Kahuna Olivia', [
    'What do you mean Grand trials are just like gym battles? It\'s a totally different thing!',
    'Come fight me in our very special and unique brand new Pokémon League and see if you still think our Island Challenge is nothing special!',
]);
const MalieKahuna = new NPC('Kahuna Nanu', [
    'A trial-goer, huh? Figures.',
    'Just go clear Captain Sophocles\' trial at the Hokulani Observatory and Captain Acerola\'s Trial at the Thrifty Megamart. And take care of those Team Skull punks in Po Town while you\'re at it.',
    'Then come back here so we can get this Grand trial over with.',
]);
const SeafolkCaptain = new NPC('Captain Mina', [
    'My trial is in this town. Yes, it\'s just a gym battle. However, I want you to clear the trial in Vast Poni Canyon first. It has no Captain, so you\'ll be all on your own. Be careful.',
    'If you can defeat me you\'ll find our Kahuna on Exeggutor Island.',
]);
const AetherParadiseAlolaRoamerNPC = new RoamerNPC('Assistant Branch Chief Wicke', [
    'Some very rare Pokémon have been sighted on {ROUTE_NAME}. I hope we can learn more about them.',
], GameConstants.Region.alola);

//Alola Towns

TownList['Iki Town Outskirts'] = new Town(
    'Iki Town Outskirts',
    GameConstants.Region.alola,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_KalosChampion)],
        shops: [IkiTownOutskirtsShop],
    }
);
TownList['Iki Town'] = new Town(
    'Iki Town',
    GameConstants.Region.alola,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 1)],
        npcs: [IkiKahuna],
    }
);
TownList['Professor Kukui\'s Lab'] = new Town(
    'Professor Kukui\'s Lab',
    GameConstants.Region.alola,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 18)],
    }
);
TownList['Hau\'oli City'] = new Town(
    'Hau\'oli City',
    GameConstants.Region.alola,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Trainers\' School'))],
        shops: [HauoliCityShop],
    }
);
TownList['Roadside Motel'] = new Town(
    'Roadside Motel',
    GameConstants.Region.alola,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion)],
    }
);
TownList['Heahea City'] = new Town(
    'Heahea City',
    GameConstants.Region.alola,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.FightiniumZ)],
        shops: [HeaheaCityShop],
        npcs: [HeaheaCafeOwner],
    }
);
TownList['Paniola Town'] = new Town(
    'Paniola Town',
    GameConstants.Region.alola,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 4)],
        shops: [PaniolaTownShop],
    }
);
TownList['Royal Avenue'] = new Town(
    'Royal Avenue',
    GameConstants.Region.alola,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 6)],
        shops: [DepartmentStoreShop],
        npcs: [RoyalAvenueSpectator],
    }
);
TownList['Konikoni City'] = new Town(
    'Konikoni City',
    GameConstants.Region.alola,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 9)],
        shops: [KonikoniCityShop],
        npcs: [KonikoniKahuna],
    }
);
TownList['Aether Paradise'] = new Town(
    'Aether Paradise',
    GameConstants.Region.alola,
    {
        dungeon: dungeonList['Aether Foundation'],
        requirements: [new GymBadgeRequirement(BadgeEnums.RockiumZ)],
        shops: [AetherParadiseShop],
        npcs: [AetherParadiseAlolaRoamerNPC],
    }
);
TownList['Malie City'] = new Town(
    'Malie City',
    GameConstants.Region.alola,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_Nihilego)],
        shops: [MalieCityShop],
        npcs: [MalieKahuna],
    }
);
TownList['Tapu Village'] = new Town(
    'Tapu Village',
    GameConstants.Region.alola,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 13)],
        shops: [TapuVillageShop],
    }
);
TownList['Seafolk Village'] = new Town(
    'Seafolk Village',
    GameConstants.Region.alola,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Aether Foundation'))],
        shops: [SeafolkVillageShop],
        npcs: [SeafolkCaptain],
    }
);
TownList['Exeggutor Island'] = new Town(
    'Exeggutor Island',
    GameConstants.Region.alola,
    {
        dungeon: dungeonList['Exeggutor Island Hill'],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.alola, 25)],
        shops: [ExeggutorIslandShop],
    }
);
TownList['Altar of the Sunne and Moone'] = new Town(
    'Altar of the Sunne and Moone',
    GameConstants.Region.alola,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Vast Poni Canyon'))],
        shops: [AltaroftheSunneandMooneShop],
    }
);

//Alola Dungeons
TownList['Trainers\' School'] = new DungeonTown(
    'Trainers\' School',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 18)]
);
TownList['Hau\'oli Cemetery'] = new DungeonTown(
    'Hau\'oli Cemetery',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 2)]
);
TownList['Verdant Cavern'] = new DungeonTown(
    'Verdant Cavern',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 2)]
);
TownList['Melemele Meadow'] = new DungeonTown(
    'Melemele Meadow',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 3)]
);
TownList['Seaward Cave'] = new DungeonTown(
    'Seaward Cave',
    GameConstants.Region.alola,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Melemele Meadow'))]
);
TownList['Ten Carat Hill'] = new DungeonTown(
    'Ten Carat Hill',
    GameConstants.Region.alola,
    [new GymBadgeRequirement(BadgeEnums.FightiniumZ)]
);
TownList['Pikachu Valley'] = new DungeonTown(
    'Pikachu Valley',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 4)]
);
TownList['Paniola Ranch'] = new DungeonTown(
    'Paniola Ranch',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 4)]
);
TownList['Brooklet Hill'] = new DungeonTown(
    'Brooklet Hill',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 5)]
);
TownList['Wela Volcano Park'] = new DungeonTown(
    'Wela Volcano Park',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 7)]
);
TownList['Lush Jungle'] = new DungeonTown(
    'Lush Jungle',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 8)]
);
TownList['Diglett\'s Tunnel'] = new DungeonTown(
    'Diglett\'s Tunnel',
    GameConstants.Region.alola,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Lush Jungle'))]
);
TownList['Memorial Hill'] = new DungeonTown(
    'Memorial Hill',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 9)]
);
TownList['Malie Garden'] = new DungeonTown(
    'Malie Garden',
    GameConstants.Region.alola,
    [new GymBadgeRequirement(BadgeEnums.Elite_Nihilego)] //Replace with Ather Paradise 1 if implemented
);
TownList['Hokulani Observatory'] = new DungeonTown(
    'Hokulani Observatory',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 22)]
);
TownList['Thrifty Megamart'] = new DungeonTown(
    'Thrifty Megamart',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 14)]
);
TownList['Ula\'ula Meadow'] = new DungeonTown(
    'Ula\'ula Meadow',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 16)]
);
TownList['Po Town'] = new DungeonTown(
    'Po Town',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 17)]
);
TownList['Aether Foundation'] = new DungeonTown(
    'Aether Foundation',
    GameConstants.Region.alola,
    [new GymBadgeRequirement(BadgeEnums.DarkiniumZ)]
);
TownList['Exeggutor Island Hill'] = new DungeonTown(
    'Exeggutor Island Hill',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 25)]
);
TownList['Vast Poni Canyon'] = new DungeonTown(
    'Vast Poni Canyon',
    GameConstants.Region.alola,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Exeggutor Island Hill'))]
);
TownList['Mount Lanakila'] = new DungeonTown(
    'Mount Lanakila',
    GameConstants.Region.alola,
    [new GymBadgeRequirement(BadgeEnums.GroundiumZ)]
);
TownList['Lake of the Sunne and Moone'] = new DungeonTown(
    'Lake of the Sunne and Moone',
    GameConstants.Region.alola,
    [new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion)]
);
TownList['Ruins of Conflict'] = new DungeonTown(
    'Ruins of Conflict',
    GameConstants.Region.alola,
    [new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion)]
);
TownList['Ruins of Life'] = new DungeonTown(
    'Ruins of Life',
    GameConstants.Region.alola,
    [
        new RouteKillRequirement(10, GameConstants.Region.alola, 21),
        new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion),
    ]
);
TownList['Ruins of Abundance'] = new DungeonTown(
    'Ruins of Abundance',
    GameConstants.Region.alola,
    [
        new RouteKillRequirement(10, GameConstants.Region.alola, 23),
        new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion),
    ]
);
TownList['Ruins of Hope'] = new DungeonTown(
    'Ruins of Hope',
    GameConstants.Region.alola,
    [
        new RouteKillRequirement(10, GameConstants.Region.alola, 26),
        new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion),
    ]
);
TownList['Poni Meadow'] = new DungeonTown(
    'Poni Meadow',
    GameConstants.Region.alola,
    [new RouteKillRequirement(10, GameConstants.Region.alola, 28)]
);
TownList['Resolution Cave'] = new DungeonTown(
    'Resolution Cave',
    GameConstants.Region.alola,
    [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Poni Meadow'))]
);
//Galar Shops


const PostwickShop = new TownShop([
    ItemList['Pokeball'],
]);
const WedgehurstShop = new TownShop([
    ItemList['Greatball'],
    ItemList['Mystery_egg'],
]);
const CirchesterShop = new TownShop([
    ItemList['Ice_stone'],
]);
const TurffieldShop = new TownShop([
    ItemList['Grass_egg'],
]);
const HulburyShop = new TownShop([
    ItemList['Water_egg'],
    ItemList['Toxel'],
]);
const MotostokeShop = new TownShop([
    ItemList['Fire_egg'],
]);
const HammerlockeShop = new TownShop([
    ItemList['Dragon_egg'],
    ItemList['Eternatus'],
]);
const StowonSideShop: Shop = new TownShop([
    ItemList['Fighting_egg'],
]);
const SpikemuthShop = new TownShop([
    ItemList['Electric_egg'],
]);
const WyndonShop = new TownShop([
    ItemList['Pokeball'],
    ItemList['Greatball'],
    ItemList['Ultraball'],
    ItemList['SmallRestore'],
    ItemList['MediumRestore'],
    ItemList['LargeRestore'],
    ItemList['xAttack'],
    ItemList['xClick'],
    ItemList['Lucky_egg'],
    ItemList['Token_collector'],
    ItemList['Item_magnet'],
    ItemList['Lucky_incense'],
]);


//Galar NPC


const Mom = new NPC('Mom', [
    'Don\'t go too far into the Slumbering Weald.',
    'I\'ve heard there are some very strong Pokemon in there.',
    'Only those who beat the champion are strong enough to face them!',
]);
const TrainStationGuy = new NPC('Train Station Guy', [
    'There are some areas around Galar that you can only reach after beating the Champion.',
    'One is sparsely populated, but the other is teeming with Pokemon.',
    'There are plenty of unique, powerful ones there, too!',
]);


//Galar towns

TownList['Postwick'] = new Town(
    'Postwick',
    GameConstants.Region.galar,
    {
        requirements: [new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion)],
        shops: [PostwickShop],
        npcs: [Mom],
    }
);
TownList['Wedgehurst'] = new Town(
    'Wedgehurst',
    GameConstants.Region.galar,
    {
        shops: [WedgehurstShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 1)],
        npcs: [TrainStationGuy],
    }
);
TownList['Motostoke'] = new Town(
    'Motostoke',
    GameConstants.Region.galar,
    {
        shops: [MotostokeShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 6)],
    }
);
TownList['Turffield'] = new Town(
    'Turffield',
    GameConstants.Region.galar,
    {
        shops: [TurffieldShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 11)],
    }
);
TownList['Hulbury'] = new Town(
    'Hulbury',
    GameConstants.Region.galar,
    {
        shops: [HulburyShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 12)],
    }
);
TownList['Stow-on-Side'] = new Town(
    'Stow-on-Side',
    GameConstants.Region.galar,
    {
        shops: [StowonSideShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 15)],
    }
);
TownList['Ballonlea'] = new Town(
    'Ballonlea',
    GameConstants.Region.galar,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Glimwood Tangle'))],
    }
);
TownList['Hammerlocke'] = new Town(
    'Hammerlocke',
    GameConstants.Region.galar,
    {
        shops: [HammerlockeShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 14)],
    }
);
TownList['Circhester'] = new Town(
    'Circhester',
    GameConstants.Region.galar,
    {
        shops: [CirchesterShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 18)],
    }
);
TownList['Spikemuth'] = new Town(
    'Spikemuth',
    GameConstants.Region.galar,
    {
        shops: [SpikemuthShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 22)],
    }
);
TownList['Wyndon'] = new Town(
    'Wyndon',
    GameConstants.Region.galar,
    {
        shops: [WyndonShop],
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 24)],
        dungeon: dungeonList['Rose Tower'],
    }
);
TownList['Wyndon Stadium'] = new Town(
    'Wyndon Stadium',
    GameConstants.Region.galar,
    {
        requirements: [new ClearDungeonRequirement(1, GameConstants.getDungeonIndex('Rose Tower'))],
    }
);
//Isle of Armor towns

TownList['Master Dojo'] = new Town(
    'Master Dojo',
    GameConstants.Region.galar,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 1)],
        dungeon: dungeonList['Master Dojo Trial'],
    }
);

//Crown Tundra Towns
TownList['Freezington'] = new Town(
    'Freezington',
    GameConstants.Region.galar,
    {
        requirements: [new RouteKillRequirement(10, GameConstants.Region.galar, 1)],
    }
);


//Galar Dungeons


TownList['Slumbering Weald'] = new DungeonTown(
    'Slumbering Weald',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_AlolaChampion)]
);
TownList['Inner Slumbering Weald'] = new DungeonTown(
    'Inner Slumbering Weald',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion)]
);
TownList['Galar Mine'] = new DungeonTown(
    'Galar Mine',
    GameConstants.Region.galar,
    [new RouteKillRequirement(10, GameConstants.Region.galar, 10)]
);
TownList['Galar Mine No. 2'] = new DungeonTown(
    'Galar Mine No. 2',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Galar_Water)]
);
TownList['Glimwood Tangle'] = new DungeonTown(
    'Glimwood Tangle',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Galar_Fighting)]
);
TownList['Rose Tower'] = new DungeonTown(
    'Rose Tower',
    GameConstants.Region.galar,
    [new RouteKillRequirement(10, GameConstants.Region.galar, 24)]
);
TownList['Watchtower Ruins'] = new DungeonTown(
    'Watchtower Ruins',
    GameConstants.Region.galar,
    [new RouteKillRequirement(10, GameConstants.Region.galar, 4)]
);
TownList['Dusty Bowl'] = new DungeonTown(
    'Dusty Bowl',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Galar_Fire)]
);
TownList['Lake of Outrage'] = new DungeonTown(
    'Lake of Outrage',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion)]
);
TownList['Towers of Two Fists'] = new DungeonTown(
    'Towers of Two Fists',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion)]
);
TownList['Split-Decision Ruins'] = new DungeonTown(
    'Split-Decision Ruins',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion)]
);
TownList['The Crown Tundra'] = new DungeonTown(
    'The Crown Tundra',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion)]
);
TownList['Freezington Ruins'] = new DungeonTown(
    'Freezington Ruins',
    GameConstants.Region.galar,
    [new GymBadgeRequirement(BadgeEnums.Elite_GalarChampion)]
);
