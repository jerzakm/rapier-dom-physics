<script>
    import * as Box2D from '@cocos/box2d'
    import {onMount} from 'svelte'

    console.log(Box2D);


	var world;
    let canvas
    var ctx;
    var canvas_width;
    var canvas_height;

    function draw_world(world, context)
    {
        //first clear the canvas
        ctx.clearRect( 0 , 0 , canvas_width, canvas_height );

        ctx.fillStyle = '#FFF4C9';
        ctx.fillRect(0,0, canvas_width, canvas_height);

        //convert the canvas coordinate directions to cartesian
        ctx.save();
        ctx.translate(0 , canvas_height);
        ctx.scale(1 , -1);
        world.DrawDebugData();
        ctx.restore();

        ctx.font = 'bold 18px arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 14px arial';
    }

    //Create box2d world object
    function createWorld()
    {
        //Gravity vector x, y - 10 m/s2 - thats earth!!
        var gravity = new Box2D.Vec2(0, -10);

        world = new Box2D.World(gravity , true );

        //setup debug draw
        var debugDraw = new Box2D.Draw();
        // debugDraw.SetSprite(document.getElementById('canvas').getContext('2d'));
        // let scale = 1
        // debugDraw.SetDrawScale(scale);
        // debugDraw.SetFillAlpha(0.5);
        // debugDraw.SetLineThickness(1.0);
        // debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

        world.SetDebugDraw(debugDraw);

        //createGround(world);
        let ground = createBox(world, 4, 1, 4 , 0.5, {type : Box2D.Body.b2_staticBody});

        return world;
    }

    function createGround(world)
{
	var bodyDef = new Box2D.BodyDef();

	var fixDef = new Box2D.FixtureDef();
	fixDef.density = 1.0;
	fixDef.friction = 1.0;
	fixDef.restitution = 0.5;

	fixDef.shape = new Box2D.PolygonShape;

	//mention half the sizes
	fixDef.shape.SetAsBox(4.00 , .5);

	//set the position of the center
	bodyDef.position.Set(4.10 , 1);

	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function createBall(world, x, y, r, options)
{
	var body_def = new Box2D.BodyDef();
	var fix_def = new Box2D.FixtureDef;

	fix_def.density = 1.0;
	fix_def.friction = 0.5;
	fix_def.restitution = 0.5;

	var shape = new Box2D.CircleShape(r);
	fix_def.shape = shape;

	body_def.position.Set(x , y);

	body_def.linearDamping = 0.0;
	body_def.angularDamping = 0.0;

	body_def.type = Box2D.Body.b2_dynamicBody;
	body_def.userData = options.user_data;

	var b = world.CreateBody( body_def );
	b.CreateFixture(fix_def);

	return b;
}

//Create some elements
function createHelloWorld()
{
	// H
	createBox(world, .5 , 2.2, .1, .2);

	createBox(world, .9 , 2.2 , .1, .2);
	createBox(world, .7 , 1.95 , .3, .05);
	createBox(world, .5 , 1.7 , .1 , .2);
	createBox(world, .9 , 1.7 , .1 , .2);
}


//Create standard boxes of given height , width at x,y
function createBox(world, x, y, width, height, options)
{
	 //default setting
	options = {
		'density' : 1.0 ,
		'friction' : 1.0 ,
		'restitution' : 0.5 ,

		'linearDamping' : 0.0 ,
		'angularDamping' : 0.0 ,

		'type' : Box2D.Body.b2_dynamicBody
	}

    var body_def = new Box2D.BodyDef();
	var fix_def = new Box2D.FixtureDef();

	fix_def.density = options.density;
	fix_def.friction = options.friction;
	fix_def.restitution = options.restitution;

	fix_def.shape = new Box2D.PolygonShape();

	fix_def.shape.SetAsBox( width , height );

	body_def.position.Set(x , y);

	body_def.linearDamping = options.linearDamping;
	body_def.angularDamping = options.angularDamping;

	body_def.type = options.type;
	body_def.userData = options.user_data;

	var b = world.CreateBody( body_def );
	var f = b.CreateFixture(fix_def);

	return b;
}

/*
	This method will draw the world again and again
	called by settimeout , self looped
*/
function step()
{
    console.log('stepping')
	var fps = 1;
	var timeStep = 1.0/fps;

	//move the world ahead , step ahead man!!

    console.log(world)
	world.Step(timeStep , 8 , 3);
	world.ClearForces();

	draw_world(world, ctx);
}

/*
	Convert coordinates in canvas to box2d world
*/
function get_real(p)
{
	return new Box2D.Vec2(p.x + 0, 6 - p.y);
}


onMount(()=> {
	ctx = canvas.getContext('2d');

	//first create the world
	world = createWorld();

	//get internal dimensions of the canvas
	canvas_width = parseInt(canvas.width);
	canvas_height = parseInt(canvas.height);

	//create the hello world boxes in the world
	createHelloWorld();

	//click event handler on our world

    canvas.addEventListener('click', (e)=> {
        var p = get_real(new Box2D.Vec2(e.clientX / 1, e.clientY / 1));

		//create shape
		if (Math.random() > 0.5)
		{
			//Square box
			createBox(world, p.x , p.y , .1 , .1);
		}
		else
		{
			//circle
			createBall(world, p.x , p.y, 0.2, {'user_data' : {'fill_color' : 'rgba(204,100,0,0.3)' , 'border_color' : '#555' }});
		}
    })


	 window.setInterval(step, 1000 / 60);
})


</script>

<canvas id="canvas" bind:this={canvas}/>