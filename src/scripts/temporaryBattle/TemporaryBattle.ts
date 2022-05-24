class TemporaryBattle extends TownContent {
    completeRequirements: (Requirement | OneFromManyRequirement)[];

    public cssClass(): string {
        return 'btn btn-secondary';
    }
    public text(): string {
        return `Fight ${this.name}`;
    }
    public isVisible(): boolean {
        return this.isUnlocked() && !this.completeRequirements.every(r => r.isCompleted());
    }
    public onclick(): void {
        TemporaryBattleRunner.startBattle(this);
    }
    public areaStatus() {
        if (App.game.statistics.temporaryBattleDefeated[GameConstants.getTemporaryBattlesIndex(this.name)]() == 0) {
            return areaStatus.unlockedUnfinished;
        } else {
            return areaStatus.completed;
        }
    }

    constructor(
        public name: string,
        public pokemons: GymPokemon[],
        public defeatMessage: string,
        requirements: (Requirement | OneFromManyRequirement)[] = [],
        completeRequirements: (Requirement | OneFromManyRequirement)[] = [],
        public rewardFunction: () => void = () => {},
        public isTrainerBattle = true
    ) {
        super(requirements);
        if (completeRequirements.length == 0) {
            completeRequirements = [new TemporaryBattleRequirement(name)];
        }
        this.completeRequirements = completeRequirements;
    }
}
