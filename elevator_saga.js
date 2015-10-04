{
    init: function(elevators, floors) {
        floors_going_up = {}; //queue of floors that the elevator will visit next time it is going up.
        floors_going_down = {}; //queue of floors that the elevator will visit the next time it is going down.
        loadMax = .62;
        for (var i = 0; i < elevators.length; i++) {
            elevator = elevators[i];
            floors_going_down[elevator] = [];
            floors_going_up[elevator] = [];
            elevator.destinationQueue = []; //queue of floors that elevator is currently visiting.
            elevator.checkDestinationQueue();
            elevator.goingUpIndicator(true);
            elevator.goingDownIndicator(false);
        }

        function diff(a,b) {
            return a - b;
        }

        function assign_elevator(floorNum, direction) {
            for (var i = 0; i < elevators.length; i++) {
                elevator = elevators[i];
                if (direction == "up") {
                    if (elevator.goingUpIndicator() && elevator.currentFloor() <= floorNum && elevator.loadFactor() < loadMax) {
                        //window.alert("floor: " + floorNum + " going " + direction + " received elevator " + i);
                        return elevator;
                    }
                } else {
                    if (elevator.goingDownIndicator() && elevator.currentFloor() >= floorNum && elevator.loadFactor() < loadMax) {
                        //window.alert("floor: " + floorNum + " going " + direction + " received elevator " + i);
                        return elevator;
                    }
                }

            }
            //window.alert("floor: " + floorNum + " going " + direction + " received nothing");
            return null;
        }

        function up_pressed(elevator, floorNum) {
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum > elevator.currentFloor() && elevator.loadFactor() < loadMax) {//if floor is on the way up and elevator isn't full
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort(diff);
                    elevator.checkDestinationQueue();
                } else {                             //if elevator already passed this floor
                    floors_going_up[elevator].push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                floors_going_up[elevator].push(floorNum); //queue the elevator for the next time you're going up.    
            }
            //window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up[elevator] + "], goingDown: [" + floors_going_down[elevator] + "]");
        }
        function down_pressed(elevator, floorNum) {
            if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum < elevator.currentFloor() && elevator.loadFactor() < loadMax) { //if floor is on the way down and elevator isn't full
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort(diff);
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going down.
                }
            } else if (elevator.goingUpIndicator()) {
                floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going up.
            }
            //window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up[elevator] + "], goingDown: [" + floors_going_down[elevator] + "]");
        }

        //button gets pressed on floor 0
        floors[0].on("up_button_pressed", function() {

            for (var i = 0; i < elevators.length; i++) {
                if (elevators[i].destinationQueue.indexOf(0) != -1) {
                    return;
                }
            }
            elevator = assign_elevator(this.floorNum(), "up");
            if (elevator == null) {
                elevator = elevators[parseInt(Math.random()*elevators.length, 10)];
            }
            floorNum = this.floorNum();
            if (elevator.goingUpIndicator()) { //if elevator is going up
                if (floorNum >= elevator.currentFloor() && elevator.loadFactor() < loadMax) {//if floor is on the way up and elevator isn't full
                    elevator.destinationQueue.push(floorNum); //add floor to elevator path
                    elevator.destinationQueue.sort(diff);
                    elevator.checkDestinationQueue();
                    //window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
                } else {                             //if elevator already passed this floor
                    floors_going_up[elevator].push(floorNum);//queue the elevator for the next time you're going up.
                }
            } else if (elevator.goingDownIndicator()) {//if elevator is going down
                elevator.destinationQueue.push(floorNum); //add floor to elevator path because you'll be going towards the bottom floor
                elevator.destinationQueue.sort(diff);
                elevator.destinationQueue.reverse();
                elevator.checkDestinationQueue();    
            }
            //window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
        });

        for (var i = 1; i < floors.length - 1; i++) {
            floor = floors[i];
            //button gets pressed on floor 1
            floor.on("up_button_pressed", function() {

                for (var i = 0; i < elevators.length; i++) {
                    if (elevators[i].destinationQueue.indexOf(this.floorNum()) != -1 && elevators[i].goingUpIndicator()) {

                        return;
                    }
                }

                elevator = assign_elevator(this.floorNum(), "up")
                if (elevator == null) {
                    elevator = elevators[parseInt(Math.random()*elevators.length, 10)];
                }
                up_pressed(elevator, this.floorNum());
            });
            floor.on("down_button_pressed", function() {

                for (var i = 0; i < elevators.length; i++) {
                    if (elevators[i].destinationQueue.indexOf(this.floorNum()) != -1 && elevators[i].goingDownIndicator()) {
                        return;
                    }
                }

                elevator = assign_elevator(this.floorNum(), "down")
                if (elevator == null) {
                    elevator = elevators[parseInt(Math.random()*elevators.length, 10)];
                }
                down_pressed(elevator, this.floorNum());
            });
        }


        floors[floors.length - 1].on("down_button_pressed", function() {
            elevator = assign_elevator(this.floorNum(), "down");
            if (elevator == null) {
                elevator = elevators[parseInt(Math.random()*elevators.length, 10)];
            }
            floorNum = this.floorNum();
            if (elevator.goingDownIndicator()) {//if elevator is going down
                if (floorNum <= elevator.currentFloor() && elevator.loadFactor() < loadMax) { //if floor is on the way down and elevator isn't full
                    elevator.destinationQueue.push(floorNum);//add floor to elevator path
                    elevator.destinationQueue.sort(diff);
                    elevator.destinationQueue.reverse();
                    elevator.checkDestinationQueue();
                } else {                                             //if elevator already passed this floor 
                    floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going down.
                }
            } else if (elevator.goingUpIndicator()) { //if elevator is going up
                elevator.destinationQueue.push(floorNum);//add floor to elevator path because elevator will be travelling towards the top floor
                elevator.destinationQueue.sort(diff);
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
                        this.destinationQueue.sort(diff);
                        this.checkDestinationQueue();
                        //window.alert(this.destinationQueue);
                    } else {                             //if elevator already passed this floor
                        floors_going_up[this].push(floorNum);//queue the elevator for the next time you're going up.
                    }
                } else if (this.goingDownIndicator()) {//if elevator is going down
                    if (floorNum <= this.currentFloor()) { //if floor is on the way down
                        this.destinationQueue.push(floorNum);//add floor to elevator path
                        this.destinationQueue.sort(diff);
                        this.destinationQueue.reverse();
                        this.checkDestinationQueue();
                    } else {                                             //if elevator already passed this floor 
                        floors_going_down[this].push(floorNum); //queue the elevator for the next time you're going down.
                    }   
                }
                //window.alert("elevator button pressed " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
            });


            //once elevator is stopped on floor X...
            elevator.on("stopped_at_floor", function(floorNum) {
                if (floorNum == 0) { //if the elevator is on floor 1
                    if (floors_going_up[this].length != 0 && this.destinationQueue.length == 0){ //if the going up queue isn't empty and the destination queue is empty
                        this.destinationQueue = floors_going_up[this]; //make destination queue the going up queue
                        this.destinationQueue.sort(diff);
                        floors_going_up[this] = [];   //reset going up queue
                        this.checkDestinationQueue();
                        //while (this.destinationQueue.indexOf(0) != -1) {
                        //  this.destinationQueue.splice(this.destinationQueue.indexOf(0), 1);
                        //  this.checkDestinationQueue();
                        //window.alert(this.destinationQueue);
                        //}
                    }

                    this.goingUpIndicator(true); 
                    this.goingDownIndicator(false);
                    //window.alert("elevator stopped: \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up + "], goingDown: [" + floors_going_down + "]");
                } else if (floorNum == floors.length - 1) {
                    if (floors_going_down[this].length != 0 && this.destinationQueue.length == 0){ //if the going down queue isn't empty and the destination queue is empty
                        this.destinationQueue = floors_going_down[this]; //make destination queue the going down queue
                        this.destinationQueue.sort(diff);
                        this.destinationQueue.reverse();
                        floors_going_down[this] = [];                        //reset going down queue
                        this.checkDestinationQueue();
                    }
                    this.goingUpIndicator(false);
                    this.goingDownIndicator(true);
                }
            });

            elevator.on("idle", function() { //estimating that more people will want to go up from ground floor, send the elevator to ground floor when idle
                //window.alert(floors_going_down[this])
                if (floors_going_down[this].length != 0 && this.destinationQueue.length == 0){ //if the going down queue isn't empty and the destination queue is empty
                    this.destinationQueue = floors_going_down[this]; //make destination queue the going down queue
                    this.destinationQueue.sort(diff);
                    this.destinationQueue.reverse();
                    floors_going_down[this] = [];                        //reset going down queue
                    this.checkDestinationQueue();
                } else {
                    if (this.destinationQueue.indexOf(0) == -1) {
                        this.destinationQueue.push(0);
                        this.destinationQueue.sort(diff);
                        this.destinationQueue.reverse();
                        this.checkDestinationQueue();
                        //window.alert(this.destinationQueue);
                    }
                }
                this.goingUpIndicator(false);
                this.goingDownIndicator(true);


            });

        }

    },
        update: function(dt, elevators, floors) {
            function up_pressed(elevator, floorNum) {
                if (elevator.goingUpIndicator()) { //if elevator is going up
                    if (floorNum > elevator.currentFloor() && elevator.loadFactor() < loadMax) {//if floor is on the way up and elevator isn't full
                        elevator.destinationQueue.push(floorNum); //add floor to elevator path
                        elevator.destinationQueue.sort(diff);
                        elevator.checkDestinationQueue();
                    } else {                             //if elevator already passed this floor
                        floors_going_up[elevator].push(floorNum);//queue the elevator for the next time you're going up.
                    }
                } else if (elevator.goingDownIndicator()) {//if elevator is going down
                    floors_going_up[elevator].push(floorNum); //queue the elevator for the next time you're going up.    
                }
                //window.alert("floor up " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up[elevator] + "], goingDown: [" + floors_going_down[elevator] + "]");
            }
            function down_pressed(elevator, floorNum) {
                if (elevator.goingDownIndicator()) {//if elevator is going down
                    if (floorNum < elevator.currentFloor() && elevator.loadFactor() < loadMax) { //if floor is on the way down and elevator isn't full
                        elevator.destinationQueue.push(floorNum);//add floor to elevator path
                        elevator.destinationQueue.sort(diff);
                        elevator.destinationQueue.reverse();
                        elevator.checkDestinationQueue();
                    } else {                                             //if elevator already passed this floor 
                        floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going down.
                    }
                } else if (elevator.goingUpIndicator()) {
                    floors_going_down[elevator].push(floorNum); //queue the elevator for the next time you're going up.
                }
                //window.alert("floor down " + floorNum + ": \nelevator: [" + elevator.destinationQueue + "], goingUp: [" + floors_going_up[elevator] + "], goingDown: [" + floors_going_down[elevator] + "]");
            }
            function diff(a,b) {
                return a - b;
            }
            
            for (var i = 0; i < elevators.length; i++) {
                elevator = elevators[i]
                if (elevator.loadFactor() >= loadMax) {
                    for (var j = 0; j < elevator.destinationQueue.length; j++) {
                        if (elevator.getPressedFloors().indexOf(elevator.destinationQueue[j]) == -1) {
                            if (elevator.goingUpIndicator()) {
                                up_pressed(elevators[parseInt(Math.random()*elevators.length,10)], elevator.destinationQueue[j]);
                            } else {
                                down_pressed(elevators[parseInt(Math.random()*elevators.length,10)], elevator.destinationQueue[j]);
                            }
                        }
                    }
                    elevator.destinationQueue = elevator.getPressedFloors();
                    elevator.destinationQueue.sort(diff);
                    if (elevator.goingDownIndicator()) {
                        elevator.destinationQueue.reverse();
                    }
                    elevator.checkDestinationQueue();
                }


            }
        }

}