
class PlacementTile {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position;
        this.size = 64;
        this.width = 64;
        this.height = 64;
        this.color = 'rgba(255, 255, 255, .1)';
        this.occupied = false;
    };

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.size, this.size);
    };

    update(mouse) {
        this.draw()

        if (
            mouse.x > this.position.x && 
            mouse.x < this.position.x + this.size &&
            mouse.y > this.position.y && 
            mouse.y < this.position.y + this.size
        ) {
            // console.log('collision detected')
            this.color = 'white';
        } else {
            this.color = 'rgba(25, 29, 255, .1)';
        }
    };
};

class UI {
    constructor(width, height, buttonName, buttonPositionX, buttonPositionY) {
        this.x = buttonPositionX;
        this.y = buttonPositionY;
        this.width = width;
        this.height = height;
        this.size = (this.width * 2) + (this.height * 2);
        this.color = 'rgba(0,0,0,0.4)';
        this.selectedStroke = 'red';
        this.isSelected = false;
        this.buttonName = buttonName;
    };

    //it is more effecient to render objects using a method
    //and passing in the object as a parameter
    //as opposed to having to write each c.xxxxx for every object
    //you want to render
    //will need to refactor quite a bit of code to implement this
    //but it *should* be more effecient in the long run

    //~~THIS IS DONE CORRECTLY~~//
    drawBtn() {
       
        c.lineWidth = 3;
        c.fillStyle = 'green';
        c.fillRect(this.x, this.y, this.width, this.height);
        c.strokeStyle = 'orange';
        c.strokeRect(this.x, this.y, this.width, this.height);

        c.font = '12px Arial';
        c.fillStyle = 'white';
        c.fillText(this.buttonName.toUpperCase(), this.x + (this.width / 8), this.y + (this.height / 2) + 4);
    };

    //~~THIS IS DONE POORLY~~//
    drawContextMenu() {
        c.lineWidth = 1;
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
        c.strokeStyle = this.selectedStroke;
        c.strokeRect(this.x, this.y, this.width, this.height);

        c.font = '12px Arial';
        c.fillStyle = 'white';
        c.fillText('First', this.x + 5, this.y + 15);
        c.fillText('Last', this.x + 5, this.y + 30);
        c.fillText('Most Health', this.x + 5, this.y + 45);
        c.fillText('Least Health', this.x + 5, this.y + 60);
    };
}

class BuildingIcons{
    constructor(x, y, building){
        this.x = x;
        this.y = y;
        this.width = 70;
        this.height = 85;
        this.size = (this.width * 2) + (this.height * 2);
        this.towerType = building;
        this.iconName = iconName;
        this.iconTowerType = iconTowerType;
        this.color = 'rgba(25, 255, 255, .2)';
        this.selectedStroke = 'orange';
        this.isSelected = false; 
    };

    draw() {
        c.lineWidth = 3;
        c.fillStyle = this.color;
        c.fillRect(this.x, this.y, this.width, this.height);
        c.strokeStyle = this.selectedStroke;
        c.strokeRect(this.x, this.y, this.width, this.height);
        
        c.font = '16px Arial';
        c.fillStyle = 'black';
        c.fillText(this.iconName, this.x + 10, this.y + 45)//TEMP TEMP TEMP//
    };

    update(mouse) {
        this.draw()
        const mouseDetection = (
            mouse.x > this.x && 
            mouse.x < this.x + this.width &&
            mouse.y > this.y && 
            mouse.y < this.y + this.height)

        if  (mouseDetection){
            this.color = 'rgba(25, 255, 255, .4)';
        } else {
            this.color = 'rgba(25, 255, 255, .2)';
        }
        
    };

};

class Cell {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    };

    draw(){
        c.strokeStyle = 'black';
        c.lineWidth = .5;
        c.strokeRect(this.x, this.y, this.width, this.height);
    };
};

class Enemy {
    constructor({ position = {x: 0, y: 0}}) {
        this.position = position;
        this.height = 100;
        this.width = 100;
        this.waypointIndex = 0;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height /2
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.targetedBy= [];
        this.effectTimer = 0;


    };

    draw() {
        c.beginPath();
        c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();

        // health
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y - 15, this.width, 10);

        c.fillStyle = 'green';
        c.fillRect(this.position.x, this.position.y - 15, this.width * this.health / this.n, 10);
    };

    update() {
        this.draw();

        const waypoint = waypoints[this.waypointIndex];
        const yDistance = waypoint.y - this.center.y;
        const xDistance = waypoint.x - this.center.x;
        const angle = Math.atan2(yDistance, xDistance);

        

        this.velocity.x = Math.cos(angle);
        this.velocity.y = Math.sin(angle);
        
        this.position.x += this.velocity.x * this.speed;
        this.position.y += this.velocity.y * this.speed;
        this.center = {
            x: this.position.x + this.width / 2,
            y: this.position.y + this.height /2
        };

        if (
            Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) < 
                Math.abs(this.velocity.x * 3) && 
            Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
                Math.abs(this.velocity.y * 3) &&
            this.waypointIndex < waypoints.length - 1
            ) {
            this.waypointIndex++
        };
    };
};

class Broker extends Enemy {
    constructor({ position = {x: 0, y: 0}}) {
        super(Enemy);
        this.position = position;
        this.radius = 30;
        this.health = 50;
        this.n = 50;
        this.color = 'black';
        this.money = 50;
        this.speed = 1;
    };
};

class HFManager extends Enemy {
    constructor({ position = {x: 0, y: 0}}) {
        super(Enemy);
        this.position = position;
        this.radius = 40;
        this.health = 100;
        this.n = 100;
        this.color = 'rgb(69, 26, 16)';
        this.money = 100;
        this.speed = .8;
    };
};

class Building {
    constructor({position = {x: 0, y: 0}}) {
        this.position = position;
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height / 2
        };
        this.projectiles = [];
        this.target;
        this.frames = 0;
        this.specialTimer = 0;
        this.chosenBuilding = chosenBuilding;
        this.radiusColor = 'rgba(255, 255, 255, .3)';
    };


    draw() {
            c.fillStyle = this.color;
            c.fillRect(this.position.x, this.position.y, this.width, 64);
            
            c.beginPath();
            c.arc(this.center.x, this.center.y, this.fireRadius, 0, Math.PI * 2);
            c.fillStyle = this.radiusColor;
            c.fill();
            
            c.font = '12px Arial';
            c.fillStyle = 'black';
            c.fillText(this.towerType, this.position.x + 40, this.position.y + 15);
            
            c.font = '12px Arial';
            c.fillStyle = 'black';
            c.fillText(('level: ' + this.towerLevel), this.position.x + 40, this.position.y + 30);

            c.font = '12px Arial';
            c.fillStyle = 'black';
            c.fillText(('damage: ' + this.damage), this.position.x + 40, this.position.y + 45);
    };

    update() {
        this.draw();
        if(this.frames % this.fireRate === 0 && this.target) {
            this.projectiles.push(
                new Projectile({
                    position: {
                        x: this.center.x,
                        y: this.center.y
                    },
                    enemy: this.target
                })
            );
        }
        this.frames++
    };

};

class WaterTower extends Building {
    constructor({position = {x: 0, y: 0}}) {
        super(Building);
        this.position = position;
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height / 2
        };
        this.target;
        this.frames = 0;
        this.towerType = 'watertower';
        this.special = 'slow enemy';
        this.towerLevel = 1;
        this.color = 'blue';
        this.fireRadius = 175;
        this.damage = .5;
        this.cost = 1500;
        this.fireRate = 30; 
        this.specialInterval = 3000;
    };

};

class FireTower extends Building {
    constructor({position = {x: 0, y: 0}}) {
        super(Building);
        this.position = position;
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height / 2
        };
        this.target;
        this.frames = 0;
        this.towerType = 'firetower';
        this.towerLevel = 1;
        this.color = 'red';
        this.fireRadius = 250;
        this.damage = 10;
        this.cost = 1000;
        this.fireRate = 30;
    };
};

class IceTower extends Building {
    constructor({position = {x: 0, y: 0}}) {
        super(Building);
        this.position = position;
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height / 2
        };
        this.target;
        this.frames = 0;
        this.towerType = 'icetower';
        this.towerLevel = 1;
        this.color = 'purple';
        this.fireRadius = 225;
        this.damage = 10;
        this.cost = 1000;
        this.fireRate = 30;
    };
};

class WindTower extends Building {
    constructor({position = {x: 0, y: 0}}) {
        super(Building);
        this.position = position;
        this.width = 64 * 2;
        this.height = 64;
        this.center = {
            x: this.position.x + this.width /2,
            y: this.position.y + this.height / 2
        };
        this.target;
        this.frames = 0;
        this.towerType = 'windtower';
        this.towerLevel = 1;
        this.color = 'white';
        this.fireRadius = 190;
        this.damage = 100;
        this.cost = 1000;
        this.fireRate = 30;
    };
};

class Projectile {
    constructor({position = {x: 0, y: 0}, enemy}) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.enemy = enemy;
        this.radius = 10;
    };

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fill();
    };

    update() {
        this.draw();

        const angle = Math.atan2(
            this.enemy.center.y - this.position.y, 
            this.enemy.center.x - this.position.x
            )

        const power = 10;
        this.velocity.x = Math.cos(angle) * power;
        this.velocity.y = Math.sin(angle) * power;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y
    };
};

class RadiusFire extends Projectile {
    constructor({position = {x: 0, y: 0, enemy}}){
        super(Projectile);
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0
        };
        this.enemy = enemy;
        this.size = 10;
    };
};
