class AbilityForecast {
    constructor(user, abilityIndex, targetType, target) {
        this.user = user;
        this.abilityIndex = abilityIndex;
        this.targetType = targetType;
        this.target = target;
    }

    serialize() {
        let target = this.target;
        if (this.targetType === AbilityForecast.TARGET_TYPES.POSITION) {
            target = { x: this.target.x, y: this.target.y };
        }

        return {
            abilityIndex: this.abilityIndex,
            targetType: this.targetType,
            target
        }
    }

    static deserialize(user, data) {
        let target = data.target;
        if (data.targetType === AbilityForecast.TARGET_TYPES.POSITION) {
            target = { x: data.target.x, y: data.target.y };
        }
        
        return new AbilityForecast(user, data.abilityIndex, data.targetType, target);
    }

    removeFromStage(stage) {
        if (this.forecastSprite) {
            this.forecastSprite.parent.removeChild(this.forecastSprite);
        }
    }

    addToStage(boardState, forecastStage) {
        if (this.forecastSprite) {
            this.removeFromStage();
        }

        const color = 0x660000;

        const targetPos = this.getTargetPos(boardState);
        
        const ability = this.user.abilities[this.abilityIndex].value;

        // createTargettingGraphic
        this.forecastSprite = ability.createForecastGraphic(
            this.user,
            targetPos,
            color
        );
        
        if (this.forecastSprite) {
            forecastStage.addChild(this.forecastSprite);
        }
    
        return this.forecastSprite;
    }

    useAbility(boardState) {
        const abilToUse = this.user.abilities[this.abilityIndex].value;
        abilToUse.doEffects(boardState, this);
    }

    getTargetPos(boardState) {
        let targetPos = { x: 0, y: 0 };
        switch (this.targetType) {
            case AbilityForecast.TARGET_TYPES.PLAYER_ID:
                const target = boardState.playerCastPoints[this.target];
                targetPos = {x: target.x, y: target.y };
                break;
            case AbilityForecast.TARGET_TYPES.POSITION:
                targetPos = { x: this.target.x, y: this.target.y };;
                break;
        }
        return targetPos;
    }
}

AbilityForecast.TARGET_TYPES = {
    'PLAYER_ID': 'PLAYER_ID',
    'POSITION': 'POSITION',
};