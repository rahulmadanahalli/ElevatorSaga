# ElevatorSaga
With high probability, current solution can complete up to challenge 9

## Potential Improvements
Store array of people at each floor; therefore, you can augment the elevator scheduling algorithm to assign bigger capacity elevators to floors with more people.

Store queue of elevators in javascript max/min (depending on whether you're going up or down) heap implementation . This will minimize the operational run time from klogk to logk for adding a floor to the elevators destination queue (where k is the number of elements already in the queue).

## TODO
