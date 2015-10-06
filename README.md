# ElevatorSaga
With high probability, current solution can complete challenges 1 - 9, 11, 12, 16, and 17 with high probability.

## Features

Once a person presses an elevator up/down button on the floor, I have a scheduler that finds an elevator that is already on the path to that floor. If no matches exist, I assign that floor to a random elevator. If elevator is going down and is on 4th floor right now, then floor should be between floors [0, 4] to be on the elevator's path. If that floor is not on that elevator's current path, then we put that floor in that elevator's backlog queue. We have 2 backlog queues, one for floors that have passengers wanting to go up and one for those with passengers wanting to go down, whenever an elevator gets an empty destination queue, it will refill its current destination queue with on of the backlog queues and empty that backlog queue. For instance, if an elevator is going down and it needs to pick up a person going up on floor 4, the elevator will get them next time it's on the way up.

A pet peeve of mine for elevators is that they stop on a floor even if there is absolutely no room in the elevator for you or your friends. The elevators in ElevatorSaga have a load factor sensor that senses capactiy limits, and I implemented a system where, if the elevator is full and it is scheduled to go to certain floors, it'll only go to the floors where it can drop off people. The other floors that it cannot visit since it is full will be rescheduled to another elevator.



## Potential Improvements/Optimizations
Store array of people at each floor; therefore, you can augment the elevator scheduling algorithm to assign bigger capacity elevators to floors with more people.

Store queue of elevators in javascript max/min (depending on whether you're going up or down) heap implementation . This will minimize the operational run time from klogk to logk for adding a floor to the elevators destination queue (where k is the number of elements already in the queue).

Maybe make backlog destination queue centralized so that all elevators poll from the same backlog queue for better coordination.

When the elevator is full, only re-assign floors that are before a floor where you unload people. That way you won't skip later floors even though when you get there, that elevator will be partially empty.



## TODO
