import rospy
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal
import json
from tinydb import TinyDB, Query
from rospy_message_converter import json_message_converter
import agv
import time
waypoint_db = TinyDB('/home/pi/db.json')
rospy.init_node('patrol')
client = actionlib.SimpleActionClient('move_base', MoveBaseAction)
client.wait_for_server()
for count in range(1):
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W6')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(1)
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W2')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(1)
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W3')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(1)
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W4')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(10)
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W5')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(1)
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W1')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(2)
  goal = agv.goal_pose(waypoint_db, 'KATOLEC' , 'W6')
  client.send_goal(goal)
  client.wait_for_result()
  time.sleep(10)
