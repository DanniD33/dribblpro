function rand(max) {
	return Math.floor(Math.random() * max);
}

// This function is used to disrupt the order of array a. It uses the Fisher-Yates algorithm, also known as the Knuth shuffling algorithm
function shuffle(a) {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

// This function is used to change the brightness of the image.
function changeBrightness(factor, sprite) {
	var virtCanvas = document.createElement("canvas");
	virtCanvas.width = 500;
	virtCanvas.height = 500;
	var context = virtCanvas.getContext("2d");
	context.drawImage(sprite, 0, 0, 500, 500);

	var imgData = context.getImageData(0, 0, 500, 500);

	for (let i = 0; i < imgData.data.length; i += 4) {
		imgData.data[i] = imgData.data[i] * factor;
		imgData.data[i + 1] = imgData.data[i + 1] * factor;
		imgData.data[i + 2] = imgData.data[i + 2] * factor;
	}
	context.putImageData(imgData, 0, 0);

	var spriteOutput = new Image();
	spriteOutput.src = virtCanvas.toDataURL();
	virtCanvas.remove();
	return spriteOutput;
}

function toggleVisablity(id) {
	if (document.getElementById(id).style.visibility == "visible") {
		document.getElementById(id).style.visibility = "hidden";
	} else {
		document.getElementById(id).style.visibility = "visible";
	}
}

//------------------------------------------------ ------------------ Generate a maze
function Maze(Width, Height) {
	var mazeMap; // Map used to store the maze
	var width = Width;
	var height = Height;
	var startCoord, endCoord; //The coordinates of the starting point and end point of the maze
	var dirs = ["n", "s", "e", "w"]; //Array in four directions
	var modDir = {
		// An object used to modify coordinates based on direction
		n: {
			y: -1,
			x: 0,
			o: "s",
		},
		s: {
			y: 1,
			x: 0,
			o: "n",
		},
		e: {
			y: 0,
			x: 1,
			o: "w",
		},
		w: {
			y: 0,
			x: -1,
			o: "e",
		},
	};

	this.map = function () {
		return mazeMap;
	};
	this.startCoord = function () {
		return startCoord;
	};
	this.endCoord = function () {
		return endCoord;
	};

	// Generate a map of the maze
	function genMap() {
		mazeMap = new Array(height);
		for (y = 0; y < height; y++) {
			mazeMap[y] = new Array(width);
			for (x = 0; x < width; ++x) {
				mazeMap[y][x] = {
					n: false,
					s: false,
					e: false,
					w: false,// Walls in four directions
					visited: false, // Whether it has been visited
					priorPos: null,// previous position
				};
			}
		}
	}

	// Define the path of the maze
	function defineMaze() {
		var isComp = false;
		var move = false;
		var cellsVisited = 1;
		var numLoops = 0;
		var maxLoops = 0;
		var pos = {
			x: 0,
			y: 0,
		};
		var numCells = width * height;
		while (!isComp) {
			move = false;
			mazeMap[pos.x][pos.y].visited = true;

			if (numLoops >= maxLoops) {
				shuffle(dirs);
				maxLoops = Math.round(rand(height / 8));
				numLoops = 0;
			}
			numLoops++;
			for (index = 0; index < dirs.length; index++) {
				var direction = dirs[index];
				var nx = pos.x + modDir[direction].x;
				var ny = pos.y + modDir[direction].y;

				if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
					//Check if the tile is already visited
					if (!mazeMap[nx][ny].visited) {
						//Carve through walls from this tile to next
						mazeMap[pos.x][pos.y][direction] = true;
						mazeMap[nx][ny][modDir[direction].o] = true;

						//Set Currentcell as next cells Prior visited
						mazeMap[nx][ny].priorPos = pos;
						//Update Cell position to newly visited location
						pos = {
							x: nx,
							y: ny,
						};
						cellsVisited++;
						//Recursively call this method on the next tile
						move = true;
						break;
					}
				}
			}

			if (!move) {
				// If a direction cannot be found, move the current position back to the previous cell and call the method again
				pos = mazeMap[pos.x][pos.y].priorPos;
			}
			if (numCells == cellsVisited) {
				isComp = true;
			}
		}
	}

	// Define the start and end points of the maze
	function defineStartEnd() {
		switch (rand(4)) {
			case 0:
				startCoord = {
					x: 0,
					y: 0,
				};
				endCoord = {
					x: height - 1,
					y: width - 1,
				};
				break;
			case 1:
				startCoord = {
					x: 0,
					y: width - 1,
				};
				endCoord = {
					x: height - 1,
					y: 0,
				};
				break;
			case 2:
				startCoord = {
					x: height - 1,
					y: 0,
				};
				endCoord = {
					x: 0,
					y: width - 1,
				};
				break;
			case 3:
				startCoord = {
					x: height - 1,
					y: width - 1,
				};
				endCoord = {
					x: 0,
					y: 0,
				};
				break;
		}
	}

	genMap();
	defineStartEnd();
	defineMaze();
}

//------------------------------------------------ ------------------ Draw the maze on canvas
function DrawMaze(Maze, ctx, cellsize, endSprite = null) {
	var map = Maze.map();
	var cellSize = cellsize;
	var drawEndMethod;
	ctx.lineWidth = cellSize / 40;

	// Fog is turned off by default
	this.fog = false;

	// Turn on fog mode sound effects
	this.enableFog = function () {
		this.fog = true;
		document.getElementById("fogOn").play();
	};

	//Turn off fog mode sound effects
	this.disableFog = function () {
		this.fog = false;
		document.getElementById("fogOff").play();
	};

	// Draw Fog
	this.drawFog = function (playerCoords) {
		// Redraw the maze so that its walls are always visible
		drawMap();
	// First, we fill the entire maze with black to create a fog effect
		ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

		// Then we calculate the size of the area around the player that should be visible
		var visibleRadius = cellSize * Math.round(map.length * 0.12);

		// Next, we create a radial gradient from fully transparent to fully opaque
		var gradient = ctx.createRadialGradient(
			(playerCoords.x + 0.5) * cellSize,
			(playerCoords.y + 0.5) * cellSize,
			0,
			(playerCoords.x + 0.5) * cellSize,
			(playerCoords.y + 0.5) * cellSize,
			visibleRadius
		);
		/*gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
		gradient.addColorStop(1, "rgba(0, 0, 0, 0.5)");*/
		gradient.addColorStop(0.65, "rgba(0, 0, 0, 0.5)");
		gradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");// 0.2 makes the end point slightly shiny

		// Finally, we use this gradient to clear the fog around the player
		ctx.globalCompositeOperation = "destination-out";
		ctx.fillStyle = gradient;

		ctx.beginPath();
		ctx.arc(
			(playerCoords.x + 0.5) * cellSize,
			(playerCoords.y + 0.5) * cellSize,
			visibleRadius,
			0,
			2 * Math.PI
		);
		ctx.fill();

		// And clear the fog around the end point
		var endCoords = maze.endCoord();
		ctx.beginPath();
		ctx.arc(
			(endCoords.x + 0.5) * cellSize,
			(endCoords.y + 0.5) * cellSize,
			visibleRadius,
			0,
			2 * Math.PI
		);
		ctx.fill();

		//Redraw the image of the end point to create a foggy effect at the end point
		if (endSprite) {
			drawEndSprite();
		}
		//Restore default compositing operation
		ctx.globalCompositeOperation = "source-over";
	};

	// Redraw the maze
	this.redrawMaze = function (size) {
		cellSize = size;
		ctx.lineWidth = cellSize / 50;
		drawMap();
		drawEndMethod();
		//Call the method to draw Fog
		if (this.fog) {
			this.drawFog(player.cellCoords);
		}
	};

	// draw a cell
	function drawCell(xCord, yCord, cell) {
		var x = xCord * cellSize;
		var y = yCord * cellSize;

		ctx.strokeStyle = "black"; //Set the drawing color of the wall

		if (cell.n == false) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + cellSize, y);
			ctx.stroke();
		}
		if (cell.s === false) {
			ctx.beginPath();
			ctx.moveTo(x, y + cellSize);
			ctx.lineTo(x + cellSize, y + cellSize);
			ctx.stroke();
		}
		if (cell.e === false) {
			ctx.beginPath();
			ctx.moveTo(x + cellSize, y);
			ctx.lineTo(x + cellSize, y + cellSize);
			ctx.stroke();
		}
		if (cell.w === false) {
			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x, y + cellSize);
			ctx.stroke();
		}
	}

	function drawMap() {
		for (x = 0; x < map.length; x++) {
			for (y = 0; y < map[x].length; y++) {
				drawCell(x, y, map[x][y]);
			}
		}
	}

	
// Draw the end point mark
	function drawEndFlag() {
		var coord = Maze.endCoord();
		var gridSize = 4;
		var fraction = cellSize / gridSize - 2;
		var colorSwap = true;
		for (let y = 0; y < gridSize; y++) {
			if (gridSize % 2 == 0) {
				colorSwap = !colorSwap;
			}
			for (let x = 0; x < gridSize; x++) {
				ctx.beginPath();
				ctx.rect(
					coord.x * cellSize + x * fraction + 4.5,
					coord.y * cellSize + y * fraction + 4.5,
					fraction,
					fraction
				);
				if (colorSwap) {
					ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
				} else {
					ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
				}
				ctx.fill();
				colorSwap = !colorSwap;
			}
		}
	}

 // Draw the end point mark
	function drawEndSprite() {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		var coord = Maze.endCoord();
		ctx.drawImage(
			endSprite,
			2,
			2,
			endSprite.width,
			endSprite.height,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	// clear canvas
	function clear() {
		var canvasSize = cellSize * map.length;
		ctx.clearRect(0, 0, canvasSize, canvasSize);
	}

	// If there is no endpoint image, draw the default logo
	if (endSprite != null) {
		drawEndMethod = drawEndSprite;
	} else {
		drawEndMethod = drawEndFlag;
	}
	clear();
	drawMap();
	drawEndMethod();
}

//------------------------------------------------ ------------------Create and control a player in the maze
function Player(maze, c, _cellsize, onComplete, sprite = null) {
	var ctx = c.getContext("2d");
	var drawSprite;
	var moves = 0;
	drawSprite = drawSpriteCircle;
	if (sprite != null) {
		drawSprite = drawSpriteImg;
	}
	var player = this;
	var map = maze.map();
	var cellCoords = {
		x: maze.startCoord().x,
		y: maze.startCoord().y,
	};
	var cellSize = _cellsize;
	var halfCellSize = cellSize / 2;

	// Redraw the player
	this.redrawPlayer = function (_cellsize) {
		cellSize = _cellsize;
		drawSpriteImg(cellCoords);
	};

	this.startTime = performance.now(); //Set startTime here

	
//Default draws a circular player
	function drawSpriteCircle(coord) {
		ctx.beginPath();
		ctx.fillStyle = "yellow";
		ctx.arc(
			(coord.x + 1) * cellSize - halfCellSize,
			(coord.y + 1) * cellSize - halfCellSize,
			halfCellSize - 2,
			0,
			2 * Math.PI
		);
		ctx.fill();
		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves);
			player.unbindKeyDown();
		}
	}

	// Draw an image of the player
	function drawSpriteImg(coord) {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		ctx.drawImage(
			sprite,
			0,
			0,
			sprite.width,
			sprite.height,
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
		if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
			onComplete(moves);
			player.unbindKeyDown();
		}
	}

	//Remove player image
	function removeSprite(coord) {
		var offsetLeft = cellSize / 50;
		var offsetRight = cellSize / 25;
		ctx.clearRect(
			coord.x * cellSize + offsetLeft,
			coord.y * cellSize + offsetLeft,
			cellSize - offsetRight,
			cellSize - offsetRight
		);
	}

	//--------------------------------------------- Check player movement, the number of steps is only increased when the player actually moves
	function check(e) {
		var cell = map[cellCoords.x][cellCoords.y];
		var moved = false;
		switch (e.keyCode) {
			case 65:
			case 37: // west
				if (cell.w == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x - 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
			case 87:
			case 38: // north
				if (cell.n == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x,
						y: cellCoords.y - 1,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
			case 68:
			case 39: // east
				if (cell.e == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x + 1,
						y: cellCoords.y,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
			case 83:
			case 40: // south
				if (cell.s == true) {
					moves++;
					removeSprite(cellCoords);
					cellCoords = {
						x: cellCoords.x,
						y: cellCoords.y + 1,
					};
					drawSprite(cellCoords);
					moved = true;
				}
				break;
		}
		//Call the method to draw Fog
		if (draw.fog) {
			draw.drawFog(cellCoords);
		}
		if (!moved) {
			document.getElementById("wall").play();
		}
	}

	//Bind keyboard events
	this.bindKeyDown = function () {
		window.addEventListener("keydown", check, false);

		$("#view").swipe({
			swipe: function (
				event,
				direction,
				distance,
				duration,
				fingerCount,
				fingerData
			) {
				console.log(direction);
				switch (direction) {
					case "up":
						check({
							keyCode: 38,
						});
						break;
					case "down":
						check({
							keyCode: 40,
						});
						break;
					case "left":
						check({
							keyCode: 37,
						});
						break;
					case "right":
						check({
							keyCode: 39,
						});
						break;
				}
			},
			threshold: 0,
		});
	};

	//Unbind keyboard event
	this.unbindKeyDown = function () {
		window.removeEventListener("keydown", check, false);
		$("#view").swipe("destroy");
	};

	drawSprite(maze.startCoord());

	this.bindKeyDown();
}

//------------------------------------------------ ------------------ Maze basic settings
var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite; // player image
var finishSprite; //image of end point
var maze, draw, player;
var cellSize; //The size of each cell
var difficulty; // Difficulty of the maze
// sprite.src = 'media/sprite.png';

window.onload = function () {
	let viewWidth = $("#view").width();
	let viewHeight = $("#view").height();
	if (viewHeight < viewWidth) {
		ctx.canvas.width = viewHeight - viewHeight / 100;
		ctx.canvas.height = viewHeight - viewHeight / 100;
	} else {
		ctx.canvas.width = viewWidth - viewWidth / 100;
		ctx.canvas.height = viewWidth - viewWidth / 100;
	}



	



	

// // Define coin objects
// const coins = [
// 	{ x: 100, y: 100, collected: false },
// 	{ x: 200, y: 200, collected: false },
// 	// Add more coin objects as needed
// ];

// // Render coins onto the canvas
// function renderCoins() {
// 	coins.forEach(coin => {
// 			if (!coin.collected) {
// 					// Render the coin at its position
// 					ctx.fillStyle = 'gold';
// 					ctx.beginPath();
// 					ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
// 					ctx.fill();
// 			}
// 	});
// }

// // Detect coin collection
// function detectCoinCollection(playerX, playerY) {
// 	coins.forEach(coin => {
// 			if (!coin.collected && distance(playerX, playerY, coin.x, coin.y) < 15) {
// 					coin.collected = true;
// 					updateScore();
// 			}
// 	});
// }

// // Update player's score when a coin is collected
// function updateScore() {
// 	score += 10; // Increment score by 10 for each coin collected
// 	// Update score display on the game interface
// }

// // Example distance calculation function
// function distance(x1, y1, x2, y2) {
// 	return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
// }




// renderCoins()



	
	//Load and edit sprites
	var completeOne = false;
	var completeTwo = false;
	var isComplete = () => {
		if (completeOne === true && completeTwo === true) {
			console.log("Runs");
			setTimeout(function () {
				makeMaze();
			}, 500);
		}
	};

	sprite = new Image();
	sprite.src =
		// "https://i.ibb.co/c8DnVSG/1-12-icon-icons-com-68880.png" 
		"./r2assets/kdpunchleftred.png";
		// + "?" +
		// new Date().getTime();
	sprite.setAttribute("crossOrigin", " ");
	sprite.onload = function () {
		sprite = changeBrightness(1.7, sprite);
		completeOne = true;
		console.log(completeOne);
		isComplete();
	};

	finishSprite = new Image();
	finishSprite.src =
		"https://i.ibb.co/g7p9R1c/door-icon-126434.png" +
		"?" +
		new Date().getTime();
	finishSprite.setAttribute("crossOrigin", " ");
	finishSprite.onload = function () {
		finishSprite = changeBrightness(1.1, finishSprite);
		//call function that changes completeTwo to true only if block = 13
		// triggerCompTwo()
		completeTwo = true;
		
		console.log(completeTwo);
		isComplete();
	};




//block sprite
	// blockSprite = new Image();
	// blockSprite.src =
	// 	"./frassets/blockfinalround.png";
	// 	//  + "?" +
	// 	new Date().getTime();
	// blockSprite.setAttribute("crossOrigin", " ");
	// blockSprite.onload = function () {
	// 	blockSprite = changeBrightness(1.1, blockSprite);
	// 	//call function that changes completeTwo to true only if block = 13
	// 	// triggerCompTwo()
	// 	completeTwo = true;
		
	// 	console.log(completeTwo);
	// 	isComplete();
	// };




};

window.onresize = function () {
	let viewWidth = $("#view").width();
	let viewHeight = $("#view").height();
	if (viewHeight < viewWidth) {
		ctx.canvas.width = viewHeight - viewHeight / 100;
		ctx.canvas.height = viewHeight - viewHeight / 100;
	} else {
		ctx.canvas.width = viewWidth - viewWidth / 100;
		ctx.canvas.height = viewWidth - viewWidth / 100;
	}
	cellSize = mazeCanvas.width / difficulty;
	if (player != null) {
		draw.redrawMaze(cellSize);
		player.redrawPlayer(cellSize);
	}
};

//difficulty selection
document.getElementById("diffSelect").addEventListener("change", function () {
	if (this.value === "custom") {
		document.getElementById("customInput").style.visibility = "visible";
	} else {
		document.getElementById("customInput").style.visibility = "hidden";
	}
});

//------------------------------------------------ ------------------ Generate maze
function makeMaze() {
	if (player != undefined) {
		player.unbindKeyDown();
		player = null;
	}
	var e = document.getElementById("diffSelect");
	var difficulty =
		e.value === "custom"
			? document.getElementById("customInput").value
			: e.options[e.selectedIndex].value;
	cellSize = mazeCanvas.width / difficulty;
	maze = new Maze(difficulty, difficulty);
	draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
	player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
	if (document.getElementById("mazeContainer").style.opacity < "100") {
		document.getElementById("mazeContainer").style.opacity = "100";
	}
	// Inherit Fog settings
	if (document.getElementById("fogCheckbox").checked) {
		draw.enableFog();
	} else {
		draw.disableFog();
	}

	// Calculate the score
	function calculateScore(steps, time, minSteps, maxSteps, maxTime) {
		var score = 100 * (1 - (steps - minSteps) / maxSteps - time / maxTime);
		return Math.max(0, score.toFixed(2)); // Keep two decimal places, and the score is not less than 0
	}

	// Customs clearance information
	function displayVictoryMess(moves) {
		var endTime = performance.now();
		var timeElapsed = ((endTime - player.startTime) / 1000).toFixed(2); // Calculate the clearance time and convert it to seconds, keeping two decimal places
		var fogMode = document.getElementById("fogCheckbox").checked; // Check if fog mode is enabled

		// Calculate minsteps
		function findShortestPath(maze) {
			var startCoord = maze.startCoord(); 
			var endCoord = maze.endCoord();
			var queue = [startCoord];
			var visited = new Set();
			var distance = {};
			var key = (coord) => coord.x + "," + coord.y;

			distance[key(startCoord)] = 0;

			while (queue.length > 0) {
				var current = queue.shift();
				var currentKey = key(current);

				if (current.x === endCoord.x && current.y === endCoord.y) {
					// reach destination
					return distance[currentKey];
				}

				for (var direction of ["n", "s", "e", "w"]) {
					if (maze.map()[current.x][current.y][direction]) {
						var next = {
							x:
								current.x +
								(direction === "e" ? 1 : direction === "w" ? -1 : 0),
							y:
								current.y +
								(direction === "s" ? 1 : direction === "n" ? -1 : 0),
						};
						var nextKey = key(next);

						if (!visited.has(nextKey)) {
							queue.push(next);
							visited.add(nextKey);
							distance[nextKey] = distance[currentKey] + 1;
						}
					}
				}
			}

			// If the path is not found, return infinity
			return Infinity;
		}

		// After generating the maze, run BFS to find the shortest path
		var minSteps = findShortestPath(maze);

		// Save the original minSteps value before calculating the score
		var originalMinSteps = minSteps;

		// If fog mode is enabled, multiply minSteps by y = 1.01^a
		if (fogMode) {
			var factor = Math.pow(1.01, difficulty);
			minSteps *= factor;
		}

		var maxSteps = difficulty * difficulty; // Assume max is the square of the number of cells in the maze
		var maxTime = maxSteps * 2;

		if (isMobileDevice()) {
			// If the user is using a mobile device, then the maximum time is set to max*5
			maxTime = maxSteps * 5;
		}
		var score = calculateScore(moves, timeElapsed, minSteps, maxSteps, maxTime);
		document.getElementById("moves").innerHTML =
			"You Moved <b>" +
			moves +
			"</b> Steps. <br /> Minimum Possible Steps: <b>" +
			originalMinSteps +
			"</b><br /> Spent Time : <b>" +
			timeElapsed +
			"</b> s. <br /> Your Score: <b>" +
			score;

		toggleVisablity("Message-Container");
		document.getElementById("victory").play();
		window.location.href = "/infinity";
		// window.location.href = "http://localhost:5000/extended";
		// window.location.href = "http://localhost:8080/extended";


		// window.location.href = "https://8eeb-2601-c1-c100-710-61b7-792d-5597-a3ad.ngrok-free.app" + "/extended";
	}

	document.getElementById("moves").className = "score";
}

//Switch Fog
document.getElementById("fogCheckbox").addEventListener("change", function () {
	if (this.checked) {
		draw.enableFog();
	} else {
		draw.disableFog();
	}
});

//------------------------------------------------ ------------------ Determine whether it is a mobile device
function isMobileDevice() {
	// Determine whether the user's device has a touch screen
	var hasTouchScreen = false;
	if ("maxTouchPoints" in navigator) {
		hasTouchScreen = navigator.maxTouchPoints > 0;
	} else if ("msMaxTouchPoints" in navigator) {
		hasTouchScreen = navigator.msMaxTouchPoints > 0;
	} else {
		var mQ = window.matchMedia && matchMedia("(pointer:coarse)");
		if (mQ && mQ.media === "(pointer:coarse)") {
			hasTouchScreen = !!mQ.matches;
		} else if ("orientation" in window) {
			hasTouchScreen = true; // Assume that all devices with orientation sensing are touch screens
		} else {
			// Use some common mobile device characteristics to determine
			var ua = navigator.userAgent;
			var regex =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
			hasTouchScreen = regex.test(ua);
		}
	}
	return hasTouchScreen;
}