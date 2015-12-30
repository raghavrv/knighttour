// To get the event and pass it as a parameter. actions helper does not accept external parameters... This seems to be only workaround
// [To be checked ...]

function clickHandler(evt) {
// in firefox event is not global like in chrome ....   
  var controller = Chess.__container__.lookup("controller:application"); // This is done to redirect from this function to respondToClick
  console.log("x: " + evt.pageX + "y: " + evt.pageY );
  controller.send('respondToClick',evt); 
}

function notationToIndex(notation)
{
    var row = 8 - parseInt(notation[1])
    var col = notation.charCodeAt(0)-97;
    
    return row*8 + col;
}

function indexToNotation(indx)
{
    //console.log("getx: " + getx(indx));
    var col = coordFromPos(indx).x;
    var row = coordFromPos(indx).y;
    
    var res = "";
    
    res += String.fromCharCode(parseInt(col) + 97);
    res += (8 - parseInt(row)).toString();
    // console.log("res: " + res);
    return res;
}

function coordFromPos(pos)
{
    return { x: (parseInt(pos) % 8), y: (Math.floor(parseInt(pos) / 8)) }
}

function getId(posx, posy)
{
    return (posx + (posy*8));
}

//canvas drawing functions

function moveTo(elt, pos, offsetx, offsety){
   
   var row = Math.floor(parseInt(pos) / 8);
   var col = parseInt(pos) % 8;
   
   squareWidth = document.getElementById('board').offsetHeight / 8;
   
   elt.style.top = (row*squareWidth) + 'px';
   elt.style.left = (col*squareWidth) + 'px';
}


function drawFullLine(prev, next)
{
    var coorp = coordFromPos(prev)
    var prevx = coorp.x
    var prevy = coorp.y

    var coorn = coordFromPos(next)
    var nextx = coorn.x
    var nexty = coorn.y

    var difx  = nextx - prevx
    var dify  = nexty - prevy

    var traversal = []

    if ( difx == 2 && dify == 1)
	    traversal = [ 1, 1, 8 ]

    else if ( difx == 2 && dify == -1)
	    traversal = [ 1, 1, -8 ]

    else if ( difx == -2 && dify == 1)
	    traversal = [ -1, -1, 8 ]

    else if ( difx == -2 && dify == -1)
	    traversal = [ -1, -1, -8 ]

    else if ( difx == 1 && dify == 2)
	    traversal = [ 1, 8, 8 ]

    else if ( difx == 1 && dify == -2)
	    traversal = [ 1, -8, -8 ]

    else if ( difx == -1 && dify == 2)
	    traversal = [ -1, 8, 8 ]

    else if ( difx == -1 && dify == -2 )
	    traversal = [ -1, -8, -8 ]

    else
	    traversal = []

    for ( var i = 0; i < traversal.length; i++ )
    {
	    drawLine(prev, prev+traversal[i], ( i == traversal.length - 1 ) );
	    prev = prev + traversal[i];
    }
}

function drawLine(prev, next)
{
    offset = 25;
    squareWidth2 = 50;
    
    prevx = (coordFromPos(prev).x * squareWidth2) + offset;
    prevy = (coordFromPos(prev).y * squareWidth2) + offset;
    
    nextx = ( coordFromPos(next).x * squareWidth2) + offset;
    nexty = ( coordFromPos(next).y * squareWidth2) + offset;
    
    context = document.getElementById('canv').getContext('2d');    
    context.beginPath();
    // console.log(getx(prev)+","+gety(prev));
    //console.log((coordFromPos(prev).x + 0.5 ) );
    //console.log((coordFromPos(next).x + 0.5 ) );
    context.moveTo(prevx, prevy);
    context.lineTo(nextx, nexty);
    context.lineWidth = 2;
    context.strokeStyle = '#ff0000';
    context.lineCap = 'butt';
    context.stroke();
    
    
    
};

function drawArcs(path)
{
    for ( var i = 0; i< path.length; i++)
    {
	    
    coors = coordFromPos(notationToIndex(path[i]))
    x = coors.x * 50 + 25;
    y = coors.y * 50 + 25;
    context.beginPath();
    context.arc(x, y, 10, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'red';
    context.stroke();

    context.font = "18px verdana";
    context.fillStyle = 'red';
    x -= 6
    y += 6
    context.fillText(i, x, y);


    }
};

// to get id notation from text notation .. a8 --> 0 --> ( 0, 0)


// Path finder functions

function pathFinder(start, stop)
{
    unvisited = []
    chessBoard = {}
    
    // Initiating all elements to infinity
    for ( var i = 0; i < 8 ; i++)
    {   var row = {};
        for (var j = 0; j< 8 ; j++ )
        {
            row[j] = { x: i, y: j, weight: Infinity, from : null };
            unvisited.push(row[j]);
        }
        chessBoard[i] = row;
    }
    
    start = chessBoard[start.x][start.y];
    stop  = chessBoard[stop.x][stop.y];  // getting start / stop nodes ...
    start.weight = 0;
    start.from = start;
    curNode = start;
    
    //console.log("x: " + curNode.x + "y: " + curNode.y);
    //console.log(indexToNotation(getId(curNode.x, curNode.y)));
    console.log(indexToNotation(getId(stop.x, stop.y)));
    
    while( unvisited.length > 0 ) // while there are more unvisited nodes ...
    {
        if ( ( curNode.x == stop.x ) && ( curNode.y == stop.y ) )
            break;
        
        console.log("Now at : " + indexToNotation(getId(curNode.x, curNode.y)));
        
        n = getNeigh(curNode, unvisited, chessBoard)
        
        consolelogn = '';
        
        for ( var i = 0; i < n.length; i++ )
        {   nde = n[i];
            consolelogn += indexToNotation(getId(nde.x,nde.y)) + ' ' ;
        }
        
        console.log("-- Neighbours are : " + consolelogn );
        
        for ( var i = 0; i < n.length; i++ )
        {   nde = n[i];
            if ( nde.weight > curNode.weight + 1 )
            {
                nde.weight = curNode.weight + 1;
                nde.from = curNode;
            }
        }
        
        unvisited.splice(unvisited.indexOf(curNode), 1);
        
        nearest = { weight: Infinity };
        
        for  ( var i = 0; i < unvisited.length; i++)
            if ( unvisited[i].weight < nearest.weight )
                nearest = unvisited[i];
            
        curNode = nearest;
            
    }
    
    path = [];
    path.push(indexToNotation(getId(curNode.x, curNode.y)));
    
    while ( curNode != start )
    {
        curNode = curNode.from;
        path.push(indexToNotation(getId(curNode.x, curNode.y)));
    }
    
    return  path.reverse();
}

function getNeigh(node, unvisited, chessBoard)
{
    next = [
    { x: 1, y: 2 },
    { x: 1, y: -2 },
    { x: -1, y: 2 },
    { x: -1, y: -2 },
    { x: 2, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: 1 },
    { x: -2, y: -1 },    
    ]
    
    neigh = []
    
    for ( var i = 0 ; i < 8 ; i++ )
    {
        nxt = {
            x: (node.x + next[i].x ),
            y: (node.y + next[i].y )
        }
        
        if ( ( ( nxt.x < 8 ) && ( nxt.x >= 0 ) ) && ( ( nxt.y < 8 ) && ( nxt.y >=0 ) ) && ( isUnvisited(nxt, unvisited) ) )
        {   //alert(chessBoard[nxt.x][nxt.y].y);
            neigh.push(chessBoard[nxt.x][nxt.y])
        }
    }
    
    return neigh;
}     

function isUnvisited(node, unvisited)
{
    for ( var i = 0; i < unvisited.length; i++ )
    {   n = unvisited[i];
	    if ( node.x == n.x && node.y == n.y ) 
            return true;
    }
        
    return false;
}
// Ember functions ... 

Chess = Ember.Application.create();
Chess.ApplicationAdapter = DS.FixtureAdapter.extend();

// Contains two route ... one for the main application and one for the path display at the bottom

Chess.Router.map(function() {
    this.resource('application', { path: '/' }, function() {
        this.resource('path', { path: '/path' });
    });
});

// ApplicationController

Chess.ApplicationController = Ember.Controller.extend({

    startPos: '',
    stopPos: '',
    pathVector: [],
    inst: "Choose Start Position ... ",
    selected: false,
    startSelected: false,
    stopSelected: false,
    bothSelected: false,
    currentSelection: "start",
    inPathRoute: false,
    geometryInitiated: false,
    canvasOffsetX: 0,
    canvasOffsetY: 0,
    
    actions: {
        
        changeStart: function() {
            this.set('inst', 'Please click on the start position');
	    $('canv').css('cursor', 'url(images/flag-g.png), none');
            this.set('currentSelection', 'start');
            
        },
        
        changeStop: function() {
            this.set('inst', 'Please click on the stop position');
	    $('canv').css('cursor', 'url(images/flag-r.png), none');
            this.set('currentSelection', 'stop');
            
        },
        
        initGeometry: function() {
            k = document.getElementById('knight');
            c = document.getElementById('canv');
            b = document.getElementById('board');
            
            sw = c.offsetHeight / 8 ; // since canv height is given in %.
            
            this.set('k', k);
            this.set('c', c);
            this.set('squareWidth', sw );
            
            var offsetX = 0;
            var offsetY = 0;  // calculating offsets of parent div's etc ...
            var elt = c;
            //console.log(squareWidth);
            do{
                offsetX += elt.offsetLeft - elt.scrollLeft;
                offsetY += elt.offsetTop - elt.scrollTop;
            }
            while(elt = elt.offsetParent)
                
            this.set('canvasOffsetX', offsetX);
            this.set('canvasOffsetY', offsetY);
	    this.set('canvasWidth', c.offsetHeight);
            
            this.set('geometryInitiated', true); // initiate c, k, b, sw, into controller and set it to true ... easier / faster to access.
            
        },
        
        respondToClick: function(evt) {
            if ( this.get('selected') )
                return; // ignore click when selected is on
            
            var posType = this.get('currentSelection');
            if ( posType.length > 0 ) // do not respond if simply clicked.
            {   
                if ( ! this.get('geometryInitiated')) 
                    this.send('initGeometry');
                
                squareWidth = this.get('squareWidth');
                
                var canvasX = evt.pageX - this.get('canvasOffsetX');
                var canvasY = evt.pageY - this.get('canvasOffsetY');
                
                var posx = Math.floor( parseFloat(canvasX) / parseFloat(squareWidth) );
                var posy = Math.floor( parseFloat(canvasY) / parseFloat(squareWidth) ); // sqr wid = ht ...
                
                //console.log("x " + posx + "y " + posy);
                //console.log(getId(posx, posy));
                var posId = getId(posx, posy);
                //console.log(posId);
                var posNotation = indexToNotation(posId);                
                //console.log(posNotation);
                
                if (( posId > 64 ) && ( posId < 0 )) // Invalid position selected ( click out of canvas )
                {   this.set('inst', 'Invalid click. Please Retry');
                    return;
                }
                
                this.set(posType+"Pos", posNotation);
                this.set(posType+"Selected", true);
                
                
                if ( posType == 'start')
                {
                    if ( this.get('stopSelected') )
                        this.set('bothSelected', true);                                            
                    else
		    {
                        this.set('inst', posType + " has been set successfuly to " + this.get(posType + "Pos") + ". Please select Stop Position.");
		    }
			$('#canv').css('cursor', 'url("images/flag-r.png"), none');
			$('#start-flag').show();
			moveTo($('#start-flag')[0], notationToIndex(this.get('startPos')), this.get('canvasOffsetX'), this.get('canvasOffsetY'))
			this.set('currentSelection', 'stop');
		    

    		}
                else
                {
                    if ( this.get('startSelected') )
                        this.set('bothSelected', true);                    
                    else
		    {
                        this.set('inst', posType + " has been set successfuly to " + this.get(posType + "Pos") + ". Please select Start Position.");
		    }
			$('#canv').css('cursor', 'url("images/flag-g.png"), none');
			$('#stop-flag').show();
			//alert($('#stop-flag')[0]);
			moveTo($('#stop-flag')[0], notationToIndex(this.get('stopPos')), this.get('canvasOffsetX'), this.get('canvasOffsetY'))
			this.set('currentSelection','');
		    
                }               
                
                if ( this.get('bothSelected', true) )
                {
                    //this.set('selected', true);
                    this.set('inst', "Both the positions have been successfuly set. Click Animate to animate. Or click on the positions to change ");
                }
                
                
                
            }
           else
               this.set('inst', 'Click ignored. Choose start / stop first !');
        },
        
        animate: function() {
            this.set('selected', true);
            //this.set('showKnight', true);
            this.send('injectKnight');
            this.set('inst', 'Calculating the path please wait ... ');
            this.send('calcRoute');
            this.set('inst', 'Path calculation successful ... ');            
            this.send('drawPath');
        },
        
        drawPath: function() {
            
            //console.log(k);
            //var r = document.getElementById("res");    // result text
            var c = document.getElementById("canv");  // canvas for trace line
            var context = c.getContext('2d');
            squareWidth = c.offsetHeight / 8;   // since canv height is given as a % ...
            this.set('inst', 'The computed path is :')
            pathV = this.get('pathVector');
            /*
            //test line ...
            context = c.getContext('2d'); 
            context.beginPath();
            context.moveTo(0,0);
            context.lineTo(400,400);
            context.stroke();
            */
	    moveTo(this.get('k'), notationToIndex(pathV[0]), this.get('canvasOffsetX'), this.get('canvasOffsetY')); 

	    this.set('i', 1);
            this.set('setIntervalId', window.setInterval(function() { Chess.__container__.lookup("controller:application").send('next'); }, 500));
                
        },
        
        next: function() { 
            
            if ( !this.get('busy',false) )
            {   
		this.set('busy', true);
                p = this.get('pathVector');
                lenp = p.length;
                i = parseInt(this.get('i'));

		if ( i >= lenp )
                {
                    window.clearInterval(this.get('setIntervalId'));
                    this.send('endAnimation');
		    
                }

	        else
		{

			var cur = p[i];
			var prev = p[i-1];
			this.set('i', i+1);

			console.log(notationToIndex(cur));
			console.log(notationToIndex(prev));
			
			// update the inst
			this.set('inst', ( this.get('inst') + " " + cur ) ); // append the path as it is animated.
			
			// move the knight
			drawFullLine(notationToIndex(prev), notationToIndex(cur));
			moveTo(this.get('k'), notationToIndex(cur), this.get('canvasOffsetX'), this.get('canvasOffsetY')); // setting reference as the canvas right top corner.
			
			// i++ and loop control 
			//console.log(i+1);
			//console.log(this.get('i', i));
		}

	    	this.set('busy', false);
		
            }
        },
        
        endAnimation: function() {
            drawArcs(this.get('pathVector'));
            this.transitionToRoute('path');
	    $(this.get('k')).hide();
        },
        
        injectKnight: function() {
            knight = document.createElement('img');
            knight.src = "./images/knight.png";
            knight.id = "knight";
            var cArea = document.getElementById('chess-area');
            //inject this knight into chess area ...
            // using if helpers does not render the knight image to dom... so prob in getElementById
            cArea.appendChild(knight);
            // now getElementById will work ...         
	    this.set('k', knight); 
        },

        calcRoute: function() {
            
            // Following dijikstra's algorithm...
            start = coordFromPos(notationToIndex(this.get('startPos')));
            stop = coordFromPos(notationToIndex(this.get('stopPos')));
            
            
            this.set('pathVector', pathFinder(start, stop));
            console.log(this.get('pathVector'));
        },
    }
       
});
/*

 Chess.ApplicationView = Ember.View.extend({
	
                classNames: ['canv'],

		mouseEnter: function(elt) {
			$('#canv').css({ cursor: "url(images/knight.png), none" });
			// $('#canv').css({cursor: '../images/flag.png'});
		},

		
		mouseMove: function() {

			this.get('controller').send('initGeometry');
			offx = this.get('controller').get('canvasOffsetX');
			offy = this.get('controller').get('canvasOffsetY');

			$('#flag').css({"left": ( window.event.pageX - offx - 20 ), "top": ( window.event.pageY - offy - 20 ) });
		},
		

		mouseLeave: function() {
			$('#canv').removeAttr('cursor');
		}

});

*/

Chess.PathController = Ember.ArrayController.extend({
    
    needs: 'application',
    path: Ember.computed.alias('controllers.application.pathVector') // alias to the application controllers property
        
});
