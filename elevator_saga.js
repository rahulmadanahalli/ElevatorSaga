{
    init: function(elevators, floors) {
        var elevator = elevators[0];
        floors_going_up = []; //queue of floors that the elevator will visit next time it is going up.
        floors_going_down = []; //queue of floors that the elevator will visit the next time it is going down.
        elevator.destinationQueue = []; //queue of floors that elevator is currently visiting.
        elevator.checkDestinationQueue();
        elevator.goingUpIndicator(true);
        elevator.goingDownIndicator(false);
        
        function up_pressed(floorNum) {
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum >= elevator.currentFloor() && elevator.loadFactor() < 1) {//if floor is on the way up and elevator isn't full
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.checkDestinationQueue();
                } else {                             //if elevator already passed this floor
                    floors_going_up.push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                floors_going_up.push(floorNum); //queue the elevator for the next time you're going up.    
            }
            window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        }
        function down_pressed(floorNum) {
            if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum <= elevator.currentFloor() && elevator.loadFactor() < 1) { //if floor is on the way down and elevator isn't full
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down.push(floorNum); //queue the elevator for the next time you're going down.
                }
            } else if (elevator.goingUpIndicator()) {
                floors_going_down.push(floorNum); //queue the elevator for the next time you're going up.
            }
            window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        }

        floor0 = floors[0];

        //button gets pressed on floor 0
        floor0.on("up_button_pressed", function() {
            floorNum = floor0.floorNum();
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum >= elevator.currentFloor() && elevator.loadFactor() < 1) {//if floor is on the way up and elevator isn't full
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.checkDestinationQueue();
                } else {                             //if elevator already passed this floor
                    floors_going_up.push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                elevator.destinationQueue.push(floorNum); //add floor to elevator path because you'll be going towards the bottom floor
                elevator.destinationQueue.sort();
                elevator.destinationQueue.reverse();
                elevator.checkDestinationQueue();    
            }
            window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        });


        floor1 = floors[1];

        //button gets pressed on floor 1
        floor1.on("up_button_pressed", function() {
            floorNum = floor1.floorNum();
            up_pressed(floorNum);
        });
        floor1.on("down_button_pressed", function() {
            floorNum = floor1.floorNum();
            down_pressed(floorNum);

        });

        floor2 = floors[2];

        //button gets pressed on floor 1
        floor2.on("up_button_pressed", function() {
            floorNum = floor2.floorNum();
            up_pressed(floorNum);
        });
        floor2.on("down_button_pressed", function() {
            floorNum = floor2.floorNum();
            down_pressed(floorNum);
        });

        floor3 = floors[3];

        //button gets pressed on floor 1
        floor3.on("up_button_pressed", function() {
            floorNum = floor3.floorNum();
            up_pressed(floorNum);    
        });
        floor3.on("down_button_pressed", function() {
            floorNum = floor3.floorNum();
            down_pressed(floorNum);
        });

        floor4 = floors[4];

        //button gets pressed on floor 2
        floor4.on("down_button_pressed", function() {
            floorNum = floor4.floorNum();
            if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum <= elevator.currentFloor() && elevator.loadFactor() < 1) { //if floor is on the way down and elevator isn't full
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down.push(floorNum); //queue the elevator for the next time you're going down.
                }
            } else if (elevator.goingUpIndicator()) { //if elevator is going up
                elevator.destinationQueue.push(floorNum);//add floor to elevator path because elevator will be travelling towards the top floor
                elevator.destinationQueue.sort();
                elevator.checkDestinationQueue();
            }
            //window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");

        });


        //When the floor button inside elevator is pressed.
        elevator.on("floor_button_pressed", function(floorNum) {
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum >= elevator.currentFloor()) {//if floor is on the way up
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.checkDestinationQueue();
                } else {                             //if elevator already passed this floor
                    floors_going_up.push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum <= elevator.currentFloor()) { //if floor is on the way down
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down.push(floorNum); //queue the elevator for the next time you're going down.
                }   
            }
            //window.alert("elevator button pressed " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        });

        //once elevator is stopped on floor X...
        elevator.on("stopped_at_floor", function(floorNum) {
            if (floorNum == 0) { //if the elevator is on floor 1
                if (floors_going_up.length != 0 && elevator.destinationQueue.length == 0){ //if the going up queue isn't empty and the destination queue is empty
                    elevator.destinationQueue = floors_going_up; //make destination queue the going up queue
                    elevator.destinationQueue.sort();
                    floors_going_up = [];                        //reset going up queue
                    elevator.checkDestinationQueue();
                }
                elevator.goingUpIndicator(true); 
                elevator.goingDownIndicator(false);
            } else if (floorNum == 2) {
                if (floors_going_down.length != 0 && elevator.destinationQueue.length == 0){ //if the going down queue isn't empty and the destination queue is empty
                    elevator.destinationQueue = floors_going_down; //make destination queue the going down queue
                    elevator.destinationQueue.sort();
                    elevator.destinationQueue.reverse();
                    floors_going_down = [];                        //reset going down queue
                    elevator.checkDestinationQueue();
                }
                elevator.goingUpIndicator(false);
                elevator.goingDownIndicator(true);
            }
            //window.alert("elevator stopped: \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        });

        elevator.on("idle", function() { //estimating that more people will want to go up from ground floor, send the elevator to ground floor when idle
            if (floors_going_down.length != 0 && elevator.destinationQueue.length == 0){ //if the going down queue isn't empty and the destination queue is empty
                elevator.destinationQueue = floors_going_down; //make destination queue the going down queue
                elevator.destinationQueue.sort();
                elevator.destinationQueue.reverse();
                floors_going_down = [];                        //reset going down queue
                elevator.checkDestinationQueue();
            } else {
                elevator.goToFloor(0);
            }
            elevator.goingUpIndicator(false);
            elevator.goingDownIndicator(true);

        });

    },
    update: function(dt, elevators, floors) {
            // We normally don't need to do anything here
    }
    
}
