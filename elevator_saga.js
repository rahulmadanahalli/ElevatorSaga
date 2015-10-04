{
    init: function(elevators, floors) {
        floors_going_up = {}; //queue of floors that the elevator will visit next time it is going up.
        floors_going_down = {}; //queue of floors that the elevator will visit the next time it is going down.
        loadMax = 0.6;
        for (var i = 0; i < elevators.length; i++) {
            elevator = elevators[i];
            floors_going_down[elevator] = [];
            floors_going_up[elevator] = [];
            elevator.destinationQueue = []; //queue of floors that elevator is currently visiting.
            elevator.checkDestinationQueue();
            elevator.goingUpIndicator(true);
            elevator.goingDownIndicator(false);
        }

        function up_pressed(elevator, floorNum) {
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum > elevator.currentFloor() && elevator.loadFactor() < loadMax) {//if floor is on the way up and elevator isn't full
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.checkDestinationQueue();
                } else {                             //if elevator already passed this floor
                    floors_going_up[elevator].push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                floors_going_up[elevator].push(floorNum); //queue the elevator for the next time you're going up.    
            }
            //window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        }
        function down_pressed(elevator, floorNum) {
            if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum < elevator.currentFloor() && elevator.loadFactor() < loadMax) { //if floor is on the way down and elevator isn't full
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going down.
                }
            } else if (elevator.goingUpIndicator()) {
                floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going up.
            }
            //window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        }

        //button gets pressed on floor 0
        floors[0].on("up_button_pressed", function() {
            elevator = elevators[0];
            floorNum = this.floorNum();
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum >= elevator.currentFloor() && elevator.loadFactor() < loadMax) {//if floor is on the way up and elevator isn't full
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.checkDestinationQueue();
                    //window.alert(elevator.loadFactor());
                } else {                             //if elevator already passed this floor
                    floors_going_up[elevator].push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                elevator.destinationQueue.push(floorNum); //add floor to elevator path because you'll be going towards the bottom floor
                elevator.destinationQueue.sort();
                elevator.destinationQueue.reverse();
                elevator.checkDestinationQueue();    
            }
            //window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        });

        for (var i = 1; i < floors.length - 1; i++) {
            floor = floors[i];
            //button gets pressed on floor 1
            floor.on("up_button_pressed", function() {
                up_pressed(elevators[i%elevators.length], this.floorNum());
            });
            floor.on("down_button_pressed", function() {
                down_pressed(elevators[i%elevators.length], this.floorNum());
            });
        }


        floors[floors.length - 1].on("down_button_pressed", function() {
            elevator = elevators[floors.length % elevators.length];
            floorNum = this.floorNum();
            if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum <= elevator.currentFloor() && elevator.loadFactor() < loadMax) { //if floor is on the way down and elevator isn't full
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going down.
                }
            } else if (elevator.goingUpIndicator()) { //if elevator is going up
                elevator.destinationQueue.push(floorNum);//add floor to elevator path because elevator will be travelling towards the top floor
                elevator.destinationQueue.sort();
                elevator.checkDestinationQueue();
            }
            //window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");

        });

        for (var i = 0; i < elevators.length; i++) {
            elevator = elevators[i];
            //When the floor button inside elevator is pressed.
            elevator.on("floor_button_pressed", function(floorNum) {
                if (this.goingUpIndicator()) { //if elevator is going up
                    if (floorNum >= this.currentFloor()) {//if floor is on the way up
                        this.destinationQueue.push(floorNum); //add floor to elevator path
                        this.destinationQueue.sort();
                        this.checkDestinationQueue();
                    } else {                             //if elevator already passed this floor
                        floors_going_up[elevator].push(floorNum);//queue the elevator for the next time you're going up.
                    }
                } else if (this.goingDownIndicator()) {//if elevator is going down
                    if (floorNum <= this.currentFloor()) { //if floor is on the way down
                        this.destinationQueue.push(floorNum);//add floor to elevator path
                        this.destinationQueue.sort();
                        this.destinationQueue.reverse();
                        this.checkDestinationQueue();
                    } else {                                             //if elevator already passed this floor 
                        floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going down.
                    }   
                }
                //window.alert("elevator button pressed " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
            });


            //once elevator is stopped on floor X...
            elevator.on("stopped_at_floor", function(floorNum) {
                if (floorNum == 0) { //if the elevator is on floor 1
                    if (floors_going_up[elevator].length != 0 && this.destinationQueue.length == 0){ //if the going up queue isn't empty and the destination queue is empty
                        this.destinationQueue = floors_going_up[elevator]; //make destination queue the going up queue
                        this.destinationQueue.sort();
                        floors_going_up[elevator] = [];                        //reset going up queue
                        this.checkDestinationQueue();
                    }
                    this.goingUpIndicator(true); 
                    this.goingDownIndicator(false);
                    //window.alert("elevator stopped: \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
                } else if (floorNum == floors.length - 1) {
                    if (floors_going_down[elevator].length != 0 && this.destinationQueue.length == 0){ //if the going down queue isn't empty and the destination queue is empty
                        this.destinationQueue = floors_going_down[elevator]; //make destination queue the going down queue
                        this.destinationQueue.sort();
                        this.destinationQueue.reverse();
                        floors_going_down[elevator] = [];                        //reset going down queue
                        this.checkDestinationQueue();
                    }
                    this.goingUpIndicator(false);
                    this.goingDownIndicator(true);
                }
            });

            elevator.on("idle", function() { //estimating that more people will want to go up from ground floor, send the elevator to ground floor when idle
                if (floors_going_down[elevator].length != 0 && this.destinationQueue.length == 0){ //if the going down queue isn't empty and the destination queue is empty
                    this.destinationQueue = floors_going_down[elevator]; //make destination queue the going down queue
                    this.destinationQueue.sort();
                    this.destinationQueue.reverse();
                    floors_going_down[elevator] = [];                        //reset going down queue
                    this.checkDestinationQueue();
                } else {
                    this.goToFloor(0);
                }
                this.goingUpIndicator(false);
                this.goingDownIndicator(true);

            });
        }

    },
        update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
        }

}
