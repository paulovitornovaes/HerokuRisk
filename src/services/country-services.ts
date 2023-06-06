export function createContadorImagem(scene: Phaser.Scene,x: number, y: number) : Phaser.GameObjects.Image {
    let country = scene.add.image(x, y, 'circle');
    country.setScale(0.05, 0.05);
    country.setInteractive();

    let count = 0;
    let countText = scene.add.text(x, y, count.toString(), { font: '24px Arial'});
    countText.setOrigin(0.5);

    country.on('pointerdown', () => {
        count++;
        countText.setText(count.toString());
    });

    return country;
}