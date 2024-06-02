import { Actor as GameActor, ScreenElement as GameScreenElement, Vector as ExVector, Color as ExColor, Label as ExLabel, Font as ExFont } from "excalibur";

export class ScoreTracker extends GameScreenElement {
    scoreLabel;

    onInitialize(engine) {
        this.scoreLabel = new ExLabel({
            z: 3,
            text: 'Baby Bats: 0/5',
            font: new ExFont({
                size: 6.5,  // Set font size here
                family: 'Arial'
            }),
        });
        this.addChild(this.scoreLabel);
    }

    updateScore(score) {
        this.scoreLabel.text = 'Baby Bats: ' + score;
    }
}
