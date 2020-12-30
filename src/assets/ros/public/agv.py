import rospy
import actionlib
from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal
import json
from tinydb import TinyDB, Query
from rospy_message_converter import json_message_converter

def goal_pose(waypoint_db, map, waypoint):
    pp = Query()
    rel = waypoint_db.search((pp.mapname == map) & (pp.name == waypoint))
    print rel[0]['waypoint']
    pose = json_message_converter.convert_json_to_ros_message('geometry_msgs/Pose', rel[0]['waypoint'])

    print(pose)
    goal_pose = MoveBaseGoal() 
    goal_pose.target_pose.header.frame_id = 'map' 
    goal_pose.target_pose.pose.position.x = pose.position.x
    goal_pose.target_pose.pose.position.y = pose.position.y 
    goal_pose.target_pose.pose.position.z = pose.position.z 
    goal_pose.target_pose.pose.orientation.x = pose.orientation.x
    goal_pose.target_pose.pose.orientation.y = pose.orientation.y
    goal_pose.target_pose.pose.orientation.z = pose.orientation.z
    goal_pose.target_pose.pose.orientation.w = pose.orientation.w
    return goal_pose
