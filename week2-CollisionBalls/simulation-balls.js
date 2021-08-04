//////////////////
//Clase Contenedor de Bolas
//////////////////

class Container{

    static contadorContainer=0;

    constructor(nameElement,width,height){
        this.element= document.getElementById(nameElement);
        this.width=width ;
        this.height=height;
        this.balls=[];
        this.idContainer=++Container.contadorContainer
    }

    dataContainer(){
        return this.idContainer+" "+this.element+" "+this.width+" "+this.height
    }

    toString(){
        return this.dataContainer()
    }

    init(){
        this.element.style.width = this.width + 'px';
        this.element.style.height = this.height + 'px';
        document.body.appendChild(this.element);
    }

}

//////////////////
//Clase Bola
//////////////////

class Ball{

    static contadorBall=0;

    constructor(radius,px,py,vx,vy){
        this._radius = radius;
        this._px = px;
        this._py = py;
        this._vx = vx;
        this._vy = vy;
        this._element = document.createElement('div');
        this._nameContainer = "";
        this.idBall=++Ball.contadorBall
    }

    get radius(){
        return this._radius;}
    get velocity(){
        return this._vx + " " + this._vy;}
    setVelocity(vx,vy){
        this._vx=vx; this._vy=vy;}
    get position(){
        return this._px + " " + this._py;}
    setPosition(x, y){
        this._px=x; this._py=y;}


    setupStyle(color,clase){
        this._element.style.backgroundColor = color;
        this._element.style.width = (2*this._radius) + 'px';
        this._element.style.height = (2*this._radius)  + 'px';
        this._element.className += clase;
    }

    addContainer(nameContainer){
        this._nameContainer=nameContainer;
        nameContainer.element.appendChild(this._element);
        this.moveTo(this._px, this._py);
        nameContainer.balls[this.idBall-1]=this;
    }

    moveTo(x, y){
        this._px=x;
        this._py=y;
        this._element.style.left =(x) - (this._radius) + 'px';
        this._element.style.top =  (y) - (this._radius) + 'px';
    }

    changeDirectionEdge(x,y){
        if (x < (0+this._radius)) {
            this._vx = -this._vx;
            this.moveTo(0+this._radius,this._py);
        }
        if (x > this._nameContainer.width-this._radius) {
            this._vx = -this._vx;
            this.moveTo(this._nameContainer.width-this._radius,this._py);
        }
        if (y < (0+this._radius)) {
            this._vy = -this._vy;
            this.moveTo((this._px ,0+this._radius));
        }
        if (y > this._nameContainer.height-this._radius) {
            this._vy = -this._vy;
            this.moveTo((this._px ,this._nameContainer.height-this._radius));
        }
        this.moveTo(this._px + this._vx,this._py + this._vy);
    }


    changeDirectionCollision(x,y){
        for (let i = 0; i < container1.balls.length; i++) {
            if (container1.balls[i]!=this){
                let xOther=container1.balls[i]._px;
                let yOther=container1.balls[i]._py;
                let distanceCenter= Math.sqrt(Math.pow((x-xOther), 2) + Math.pow((y-yOther), 2));
                if (distanceCenter<=((this._radius)+(container1.balls[i]._radius))){
                    let theta1=this.angle_theta(this._vx ,this._vy) ;
                    let theta2=this.angle_theta( container1.balls[i]._vx, container1.balls[i]._vy) ;
                    let phi= this.angle_theta(xOther-x ,yOther-y);
                    let oldV1=Math.sqrt(Math.pow(this._vx, 2) + Math.pow(this._vy, 2));
                    let oldV2=Math.sqrt(Math.pow(container1.balls[i]._vx, 2) + Math.pow(container1.balls[i]._vy, 2));
                    this._vx = parseInt(this.v1fx(oldV1,oldV2,theta1,theta2,phi) );
                    this._vy =  parseInt(this.v1fy(oldV1,oldV2,theta1,theta2,phi));
                    container1.balls[i]._vx =  this.v2fx(oldV1,oldV2,theta1,theta2,phi);
                    container1.balls[i]._vy =  this.v2fy(oldV1,oldV2,theta1,theta2,phi);
                    console.log("CHOQUE");
                    console.log(this._vx,this._vy);
                    console.log(container1.balls[i]._vx,container1.balls[i]._vy);
                    changeDirectionEdge(this._px + this._vx,this._py + this._vy)
                    //this.moveTo(this._px + this._vx,this._py + this._vy);
                    return true
                }
            }
        }
    }

    angle_theta(dx,dy){
        if (Math.abs(dy) < 0.01){ //prevent div by zero
            dy = 0.01 }
        let z =Math.sqrt(Math.pow((dy), 2) + Math.pow((dy), 2));
        let angle = 2 * Math.atan((dy)/(dx+z));
        return (angle)
    }

    v1fx(v1,v2,t1,t2,g){
        return (v2 * Math.cos(t2 - g) * Math.cos(g)) + (v1 * Math.sin(t1 - g) * Math.cos(g + Math.PI / 2));    }
    v1fy(v1,v2,t1,t2,g){
        return (v2 * Math.cos(t2 - g) * Math.sin(g)) + (v1 * Math.sin(t1 - g) * Math.sin(g + Math.PI / 2));    }
    v2fx(v1,v2,t1,t2,g){
        return (v1 * Math.cos(t1 - g)* Math.cos(g))  + (v2 * Math.sin(t2 - g) * Math.cos(g + Math.PI / 2));    }
    v2fy(v1,v2,t1,t2,g){
        return (v1 * Math.cos(t1 - g) * Math.sin(g)) + (v2 *Math.sin(t2 - g) * Math.sin(g + Math.PI / 2));    }



    initSimulateMove(){
        var simulateBall = this;
        setInterval(function(){
            let oldPx=simulateBall._px;
            let oldPy=simulateBall._py;
            let newPx=oldPx + simulateBall._vx;
            let newPy=oldPy+ simulateBall._vy;
            if (simulateBall.changeDirectionCollision(newPx,newPy)){
            } else if (simulateBall.changeDirectionEdge(newPx,newPy)) {
            } else {
                simulateBall.moveTo(newPx,newPy);
            }
            }, 1000/60);
    }

}


/////////////////
// Crear Contenedor de Bolas
//////////////////
var container1=new Container('container-balls-1',800,600);
container1.init();

//////////////////
// Crear Bolas
//////////////////
var numberBallsTotal= 4;
var ballsColors = ["red", "blue","yellow","green"];

for (let i = 0; i < numberBallsTotal; i++) {
    let randomNumberRadius = Math.floor((Math.random() * (40 - (20))) + (20));
    let maxpx= 800-(randomNumberRadius);
    let minpx= 0+(randomNumberRadius);
    let randomNumberPx = Math.floor((Math.random() * (maxpx -minpx)) + (minpx));
    let maxpy= 600-(randomNumberRadius);
    let minpy= 0+(randomNumberRadius);
    let randomNumberPy = Math.floor((Math.random() * (maxpy - minpy)) + (minpy));
    let randomNumberVx = Math.floor((Math.random() * (10 - (-10))) + (-10));
    let randomNumberVy = Math.floor((Math.random() * (10 - (-10))) + (-10))
    let ball=new Ball(randomNumberRadius,randomNumberPx,randomNumberPy,randomNumberVx,randomNumberVy);
    let randomNumberColor = Math.floor(Math.random() * 4);
    let color = ballsColors[randomNumberColor];
    ball.setupStyle(color,"ball");
    ball.addContainer(container1);
    ball.initSimulateMove();
}

