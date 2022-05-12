class AbilityForecast {
    constructor(user, abilityIndex, targetType, targets) {
        this.user = user;
        this.abilityIndex = abilityIndex;
        this.targetType = targetType;
        this.targets = targets;
        this.forecastSprites = [];
    }

    serialize() {
        let targets = this.targets;
        if (this.targetType === AbilityForecast.TARGET_TYPES.POSITION) {
            targets = this.targets.map((target) => { return { x: target.x, y: target.y } });
        }

        return {
            abilityIndex: this.abilityIndex,
            targetType: this.targetType,
            targets
        }
    }

    static deserialize(user, data) {
        let targets = data.targets;
        if (data.targetType === AbilityForecast.TARGET_TYPES.POSITION) {
            targets = data.targets.map((target) => { return { x: target.x, y: target.y } });
        }
        
        return new AbilityForecast(user, data.abilityIndex, data.targetType, targets);
    }

    removeFromStage(stage) {
        this.forecastSprites.forEach((forecastSprite) => {
            forecastSprite.parent.removeChild(forecastSprite);
        })
        this.forecastSprites = [];
    }

    addToStage(boardState, forecastStage, forecastIndex, totalForecasts) {
        if (this.forecastSprites) {
            this.removeFromStage();
        }

        const color = 0x660000;

        const targetPositions = this.getTargetPos(boardState);
        
        const ability = this.user.abilities[this.abilityIndex].value;
        
        targetPositions.forEach((targetPos) => {
            // createTargettingGraphic
            const forecastSprite = ability.createForecastGraphic(
                boardState,
                this.user,
                targetPos,
                color,
                forecastIndex,
                totalForecasts,
            );
            
            if (this.forecastSprites) {
                this.forecastSprites.push(forecastSprite);
                forecastStage.addChild(forecastSprite);
            }
        });
    
        return this.forecastSprites;
    }

    useAbility(boardState) {
        const abilToUse = this.user.abilities[this.abilityIndex].value;
        abilToUse.doEffects(boardState, this);
    }

    getTargetPos(boardState) {
        let targetPos = { x: 0, y: 0 };
        switch (this.targetType) {
            case AbilityForecast.TARGET_TYPES.PLAYER_ID:
                return this.targets.map((target) => {
                    const castPoint = boardState.playerCastPoints[target];
                    return { x: castPoint.x, y: castPoint.y };
                })
            case AbilityForecast.TARGET_TYPES.POSITION:
                return this.targets.map((target) => {
                    return { x: target.x, y: target.y };
                });
            case AbilityForecast.TARGET_TYPES.AREA:
                return this.targets.map((target) => {
                    return { x: target.x, x2: target.x2, y: target.y, y2: target.y2 };
                })
            case AbilityForecast.TARGET_TYPES.SELF:
                return [0];
        }
        return targetPos;
    }
}

AbilityForecast.TARGET_TYPES = {
    'PLAYER_ID': 'PLAYER_ID',
    'POSITION': 'POSITION',
    'AREA': 'AREA',
    'SELF': 'SELF',
};