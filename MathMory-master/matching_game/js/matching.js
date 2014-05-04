var tiles = new Array(),
	flips = new Array('tb', 'bt', 'lr', 'rl' ),
	iFlippedTile = null,
	iTileBeingFlippedId = null,
	tileImages = new Array(1,2,3,4,5,6,7,8,9,10),
	tileAllocation = null,
	iTimer = 0,
	iInterval = 100,
	iPeekTime = 3000;
	counter=0;
	gamecounter=0;
	tenRandomnumbers= new Array();
	numbercount=0;
	anzahlallerbilder=11; //muss an die anzahl der bilder angepasst werden
	reversecounter=9;
	reihenfolge=new Array();
	position=0;


function getRandomImageForTile() {

while(tenRandomnumbers.length != 10){														//get ten random numbers for tenRandomnumbers array
	var iRandomImage = Math.floor((Math.random() * (anzahlallerbilder - 0)) + 0), 
	iMaxImageUse = 2;
	if(tenRandomnumbers.indexOf(iRandomImage) > -1 == false){
		tenRandomnumbers[numbercount]=iRandomImage;
		numbercount=numbercount+1;
	}
	}
	
while(reihenfolge.length != 10){
	var randomnumber = Math.round(Math.random() * (9 - 0)) + 0;
	
	if(reihenfolge.indexOf(randomnumber) > -1 == false){
		reihenfolge[position]=randomnumber;
		position=position+1;
		console.log("position= " + position);
	}
	}
		
	if(reversecounter>=0){
	var iRandomImage=tenRandomnumbers[reversecounter]+1;
	reversecounter=reversecounter-1;
	console.log("iRandomImage=" + iRandomImage);
	return iRandomImage;
	}
	else{
	order=reihenfolge[position-1];
	var iRandomImage=tenRandomnumbers[order]+1 + "a";
	position=position-1;
	console.log("iRandomImage=" + iRandomImage);
	return iRandomImage;
	}
	

}

 
function createTile(iCounter) {
//console.log("createTile wird ausgeführt");
	
	var curTile =  new tile("tile" + iCounter),
		iRandomImage = getRandomImageForTile();
		
	tileAllocation[iRandomImage] = tileAllocation[iRandomImage] + 1;
		
	curTile.setFrontColor("tileColor" + Math.floor((Math.random() * 5) + 1));
	curTile.setStartAt(500 * Math.floor((Math.random() * 5) + 1));
	curTile.setFlipMethod(flips[Math.floor((Math.random() * 3) + 1)]);
	curTile.setBackContentImage("images/" +  iRandomImage + ".jpg");
	
	return curTile;
}

function initState() {

	/* Reset the tile allocation count array.  This
		is used to ensure each image is only 
		allocated twice.
	*/
	tileAllocation = new Array(0,0,0,0,0,0,0,0,0,0);
	
	while(tiles.length > 0) {
		tiles.pop();
	}
	
	$('#board').empty();
	iTimer = 0;
	
}

function initTiles() {

	var iCounter = 0, 
		curTile = null;

	initState();
	
	// Randomly create twenty tiles and render to board
	for(iCounter = 0; iCounter < 20; iCounter++) {
		
		curTile = createTile(iCounter);
		
		$('#board').append(curTile.getHTML());
		
		tiles.push(curTile);
	}	
}

function hideTiles(callback) {
	
	var iCounter = 0;

	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		
		tiles[iCounter].revertFlip();

	}
	
	callback();
}

function revealTiles(callback) {
	
	var iCounter = 0,
		bTileNotFlipped = false;

	for(iCounter = 0; iCounter < tiles.length; iCounter++) {
		
		if(tiles[iCounter].getFlipped() === false) {
		
			if(iTimer > tiles[iCounter].getStartAt()) {
				tiles[iCounter].flip();
			}
			else {
				bTileNotFlipped = true;
			}
		}
	}
	
	iTimer = iTimer + iInterval;

	if(bTileNotFlipped === true) {
		setTimeout("revealTiles(" + callback + ")",iInterval);
	} else {
		callback();
	}
}

function playAudio(sAudio) {
	
	var audioElement = document.getElementById('audioEngine');
			
	if(audioElement !== null) {

		audioElement.src = sAudio;
		audioElement.play();
	}	
}

function checkMatch() {
	
	if(iFlippedTile === null) {
		  
		iFlippedTile = iTileBeingFlippedId;

	} else {
	bild1=tiles[iFlippedTile].getBackContentImage().replace(/[a]/g,"");
	bild2=tiles[iTileBeingFlippedId].getBackContentImage().replace(/[a]/g,"");
		
		if( bild1 !== bild2) {
			
			setTimeout("tiles[" + iFlippedTile + "].revertFlip()", 2000);
			setTimeout("tiles[" + iTileBeingFlippedId + "].revertFlip()", 2000);
			
			playAudio("mp3/no.mp3");

		} else {
			if(counter!=9){
				counter=counter+1;
				playAudio("mp3/applause.mp3");
			}
			else{
				if(gamecounter!=1){
					gamecounter=gamecounter+1
				counter=0;
				endtime = new Date().getTime();
				timeof1=endtime-starttime
				confirm("Jetzt ist " + storage.getAll()["secondplayer"] + " an der Reihe");
				document.getElementById("spieler").innerHTML = "Es spielt: " + storage.getAll()["secondplayer"];
				startgame();
				}
				else{
					//wird ausgeführt, wenn der 2te spieler fertig ist.
					endtime = new Date().getTime();
					timeof2=endtime-starttime
					if(timeof1<timeof2){
						confirm(storage.getAll()["name"] + " war schneller.");
						document.getElementById("newgame").innerHTML = "REVANGE?";	
					}
					if(timeof2<timeof1){
						confirm(storage.getAll()["secondplayer"] + " war schneller.");
						document.getElementById("newgame").innerHTML = "REVANGE?";	
					}
					else{
						confim("Beide Spieler waren gleichschnell");
						document.getElementById("newgame").innerHTML = "REVANGE?";	
					}
				
				}		
			}
		}

		iFlippedTile = null;
		iTileBeingFlippedId = null;
	}
}

function onPeekComplete() {

	$('div.tile').click(function() {
	
		iTileBeingFlippedId = this.id.substring("tile".length);
	
		if(tiles[iTileBeingFlippedId].getFlipped() === false) {
			tiles[iTileBeingFlippedId].addFlipCompleteCallback(function() { checkMatch(); });
			tiles[iTileBeingFlippedId].flip();
		}
	  
	});
}

function onPeekStart() {
	setTimeout("hideTiles( function() { onPeekComplete(); })",iPeekTime);
}

function startgame() {
var tiles = new Array(),
	flips = new Array('tb', 'bt', 'lr', 'rl' ),
	iFlippedTile = null,
	iTileBeingFlippedId = null,
	tileImages = new Array(1,2,3,4,5,6,7,8,9,10),
	tileAllocation = null,
	iTimer = 0,
	iInterval = 100,
	iPeekTime = 3000;
	counter=0;
	tenRandomnumbers= new Array();
	numbercount=0;
	anzahlallerbilder=11;
	reversecounter=9;
	reihenfolge=new Array();
	position=0;
	
			starttime = new Date().getTime();
	
			initTiles();
			setTimeout("revealTiles(function() { onPeekStart(); })",iInterval);

};
