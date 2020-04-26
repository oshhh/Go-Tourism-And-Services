var C;
var part=[];
var coll=[];
BALLS=10;
COLLS=3;
var debug_vec;
function randomrgb(){
	xc=Math.random()*150+105;
	yc=Math.random()*150+105;
	zc=Math.random()*150+105;
	return "rgb("+String(xc)+","+String(yc)+","+String(zc)+")";
}
function V2(x,y){
    this.x=x;
    this.y=y;
    this.normalize=function(){
        div=Math.sqrt(x*x+y*y);
        if(div!==0)
        {
        this.x=this.x/div;
        this.y=this.y/div;
        }
    }
    this.set=function(x,y){
        this.x=x;
        this.y=y;
    }
    this.length=function(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    this.Squaredlength=function(){
        return this.x*this.x+this.y*this.y;
    }
    this.distSquared=function(other){
        return (other.y-this.y)*(other.y-this.y)+(other.x-this.x)*(other.x-this.x);
    }
    this.dot=function(other){
        return (this.x*other.x)+(this.y*other.y);
    }
    this.cross=function(other){
        return new V2(this.x*other.y,-(this.y*other.x));
    }
    this.VecAdd=function(other){
        return new V2(this.x+other.x,this.y+other.y);
    }
    this.scale=function(scalar){
        return new V2(this.x*scalar,this.y*scalar);
    }
}
function Hcollision(Lcollider,body){
    this.collider=Lcollider;
    this.rbody=body;
    this.getbodypos=function(){
        t=Lcollider.perp.dot(Lcollider.st)-body.r-body.pos.dot(Lcollider.perp);
        t=t/(body.vel.dot(Lcollider.perp));
        return body.pos.VecAdd(body.vel.scale(t));
    }
    this.contactPoint=function(){
        t=Lcollider.perp.dot(Lcollider.st)-body.pos.dot(Lcollider.perp);
        t=t/(body.vel.dot(Lcollider.perp));
        return body.pos.VecAdd(body.vel.scale(t));
    }
}
function lineCollider(x1,y1,x2,y2,right_handed_normal=true){
    this.st=new V2(x1,y1);
    this.ed=new V2(x2,y2);
    div=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    this.along=new V2((x2-x1)/div,(y2-y1)/div);
    if(right_handed_normal)
    {
        this.perp=new V2(-(this.along.y),this.along.x);
    }
    else{
        this.perp=new V2(this.along.y,-(this.along.x));
    }
    this.render=function(){
        if(C!=undefined)
        {
            C.x.beginPath(); 
            C.x.lineWidth = "2";
            C.x.strokeStyle = "#FFF";
            C.x.moveTo(C.xoff+this.st.x, C.yoff-this.st.y);
            C.x.lineTo(C.xoff+this.ed.x, C.yoff-this.ed.y);
            C.x.stroke();
        }
    }
    this.iscolliding=function(other)
    {
        dirst=new V2(other.pos.x-this.st.x,other.pos.y-this.st.y);
        stsign=(this.st.x-other.pos.x)*this.along.x+(this.st.y-other.pos.y)*this.along.y;
        edsign=(this.ed.x-other.pos.x)*this.along.x+(this.ed.y-other.pos.y)*this.along.y;
        tolerance=other.vel.length()/4;
        if(Math.sign(stsign*edsign)<0)
        {
            if(Math.abs(dirst.dot(this.perp))<other.r+tolerance && Math.sign(this.perp.dot(other.vel))>0)
            {
                sup=new Hcollision(this,other);
                dampening=1;
                other.pos=sup.getbodypos();
                x=other.vel.length();
                other.vel.x=other.vel.x/x;
                other.vel.y=other.vel.y/x;
                pScale=2*this.perp.dot(other.vel);
                OutRay=(this.perp.scale(pScale)).VecAdd(other.vel.scale(-1));
                other.vel.set(OutRay.x*(-x)*dampening,OutRay.y*(-x)*dampening);
                lg("collision!");
                return true
            }
        }
        return false;
    }
}

function circle(xcord,ycord){
    this.pos=new V2(xcord,ycord);
    this.vel=new V2(0,0);
    this.acc=new V2(0,0);
    this.color=randomrgb();
    this.r=Math.random()*4 + 3;
    this.render=function(){
        if(C!=undefined)
        {
            this.pos.x+=this.vel.x;
            this.pos.y+=this.vel.y;
            this.vel.x+=this.acc.x;
            this.vel.y+=this.acc.y;
            for(collptr=0;collptr<coll.length;collptr++)
            {
                if(coll[collptr].iscolliding(this))
                {
                    break;
                }
            }
            C.x.fillStyle = this.color;
            C.x.beginPath();
            C.x.arc(C.xoff+this.pos.x, C.yoff-this.pos.y, this.r, Math.PI * 2, false);
            C.x.fill();
        }
    }
}

function drawPoint(pos,radius=5){
    C.x.fillStyle = randomrgb;
    C.x.beginPath();
    C.x.arc(C.xoff+pos.x,C.yoff-pos.y, radius, Math.PI * 2, false);
    C.x.fill();
}
function drawVec(direction,radius=5){
    direction.normalize();
    direction=direction.scale(30);
    center=new V2(-C.w*0.2,C.h*0.2);
    C.x.fillStyle = "#F00";
    C.x.beginPath();
    C.x.arc(C.xoff+center.x,C.yoff-center.y, radius, Math.PI * 2, false);
    C.x.fill();
    C.x.fillStyle = "#0F0";
    C.x.beginPath();
    C.x.arc(C.xoff+center.x+direction.x,C.yoff-center.y+direction.y, radius, Math.PI * 2, false);
    C.x.fill();
}

function st(){
    C={};
    coll=[];
    part=[];
    width=window.innerWidth*0.9;
    height=window.innerHeight*0.8;
	canvas = document.getElementById("board");
    canvas.height=String(height);
    canvas.width=String(width);
    ctx=canvas.getContext("2d");
    C = {x:ctx,
        w:width,
        h:height,
        elem:canvas,
        xoff:width/2,
        yoff:height/2
    };
    for(i=0;i<BALLS;i++)
    {
        part.push(new circle(Math.random()*C.w-(C.w/2),Math.random()*C.h-(C.h/2)));
        part[i].acc.y=-0.1;
        part[i].vel.x=Math.random()*8-4;
        part[i].vel.y=Math.random()*4-2;
    }
    for(i=0;i<COLLS;i++)
    {
        coll.push(new lineCollider(Math.random()*C.w-(C.w/2),Math.random()*C.h-(C.h/2),Math.random()*C.w-(C.w/2),Math.random()*C.h-(C.h/2)))
    }
    coll.push(new lineCollider(-C.w/2+10,-C.h/2+10,C.w/2-10,-C.h/2+10,false));
    coll.push(new lineCollider(C.w/2-10,-C.h/2+10,C.w/2-10,C.h/2-10,false));
    coll.push(new lineCollider(-C.w/2+10,C.h/2-10,C.w/2-10,C.h/2-10,true));
    coll.push(new lineCollider(-C.w/2+10,-C.h/2+10,-C.w/2+10,C.h/2-10,true));
    debug_vec=new V2(1,0);
}
function update(){
    secx=width/10;
    secy=secx;
    C.x.clearRect(0, 0, C.w, C.h);
    for(i=0;i<part.length;i++)
    {
        part[i].render();
    }
    for(i=0;i<coll.length;i++)
    {
        coll[i].render();
    }
    // drawVec(debug_vec);
    window.requestAnimationFrame(update);
}
function lg(obj){
    console.log(obj);
}
function stop(){
    C={};
}