
/**
 * Setup all visualization elements when the page is loaded.
 */
//const axios  = new axios()
var ip = ""
var rosConn;
var mapTable = $('#mapTable')
var mapname = "map"
var manager = null
var twist;
var cmdVel;
var publishImmidiately = true;
var selectedMapName = "tmp"
var seqWayPoint = 1
var wpointname;
var gmap_name = "Choose a map"
var gwaypoint_name = ""
var g_waypoints = [{
    name: "None"
}];

var lin_speed = 0.01;
var ang_speed = 0.005;

var flag = "";
var _check_nav;
var g_pose;
var listener;
var gauge_lin
var time = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// For drawing the lines
var imuData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var angularVelocity = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var myChart = null;
var colWidth = 0
//var viewer3d = null
var workspace = null;
var blocklyDiv = null;
var blocklyArea = null;

var isMapChoosen = false;
var isWaypointAvaliable = false;

var current_position =[];

function createJoystick() {
    // Check if joystick was aready created
    if (manager == null) {
        joystickContainer = document.getElementById('joystick');
        // joystck configuration, if you want to adjust joystick, refer to:
        // https://yoannmoinet.github.io/nipplejs/
        var options = {
            zone: joystickContainer,
            position: {
                left: 50 + '%',
                top: 100 + 'px'
            },
            mode: 'static',
            size: 200,
            color: '#0066ff',
            restJoystick: true
        };
        manager = nipplejs.create(options);
        // event listener for joystick move
        manager.on('move', function (evt, nipple) {
            // nipplejs returns direction is screen coordiantes
            // we need to rotate it, that dragging towards screen top will move robot forward
            var direction = nipple.angle.degree - 90;
            if (direction > 180) {
                direction = -(450 - nipple.angle.degree);
            }
            // convert angles to radians and scale linear and angular speed
            // adjust if youwant robot to drvie faster or slower
            var lin = Math.cos(direction / 57.29) * nipple.distance * lin_speed;//=============================================linear speed
            var ang = Math.sin(direction / 57.29) * nipple.distance * ang_speed;//============================================Angular speed
            // nipplejs is triggering events when joystic moves each pixel
            // we need delay between consecutive messege publications to 
            // prevent system from being flooded by messages
            // events triggered earlier than 50ms after last publication will be dropped 
            if (publishImmidiately) {
                publishImmidiately = false;
                moveAction(lin, ang);
                setTimeout(function () {
                    publishImmidiately = true;
                }, 50);
            }
        });
        // event litener for joystick release, always send stop message
        manager.on('end', function () {
            moveAction(0, 0);
        });
    }
}

function moveAction(linear, angular) {
    if (linear !== undefined && angular !== undefined) {
        twist.linear.x = linear;
        twist.angular.z = angular;
    } else {
        twist.linear.x = 0;
        twist.angular.z = 0;
    }
    cmdVel.publish(twist);
}



//function init() {
function init_blockly() {
    //axios = require('axios')
    //console.log(axios)

    colWidth = document.body.offsetWidth
    console.log("colWidth")
    console.log(colWidth)

    var tt = {}
    tt.toolbox = document.getElementById('toolbox')
    tt.scrollbars = true
    tt.css = true
    tt.zoom = {
        controls: true,
        wheel: true,
        startScale: 1.0,
        maxScale: 4,
        minScale: .25,
        scaleSpeed: 1.1
    }
    blocklyDiv = document.getElementById('blocklyDiv');
    blocklyArea = document.getElementById('blocklyArea');
    workspace = Blockly.inject(blocklyDiv, tt);
    console.log("Blockly injected")
    console.log(workspace)

    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = blocklyArea;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);

    var opts = {
        angle: 0.15, // The span of the gauge arc
        lineWidth: 0.44, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        staticLabels: {
            font: "10px sans-serif", // Specifies font
            labels: [-0.5, -0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.2, 0.4,
                0.5
            ], // Print labels at these values
            color: "#000000", // Optional: Label text color
            fractionDigits: 0 // Optional: Numerical precision. 0=round off.
        },
        renderTicks: {
            divisions: 5,
            divWidth: 1.1,
            divLength: 0.7,
            divColor: '#333333',
            subDivisions: 3,
            subLength: 0.5,
            subWidth: 0.6,
            subColor: '#666666'
        },
        limitMax: false, // If false, max value increases automatically if value > maxValue
        limitMin: false, // If true, the min value of the gauge will be fixed
        colorStart: '#6FADCF', // Colors
        colorStop: '#8FC0DA', // just experiment with them
        strokeColor: '#E0E0E0', // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true, // High resolution support

    };

    $(".GaugeMeter").gaugeMeter();

    var mapp_selected  = localStorage.getItem("mapname");
    $(mapp_selected).prop('checked', true)
    wpointname = document.getElementById('waypointname');
    
    //createJoystick();
    loadMap();
    $('#waypointTable').bootstrapTable({
        onCheck: function (row, $element) {
            //alert(JSON.stringify(row));
            gwaypoint_name = row.name
            var getwaypointparam = new ROSLIB.ServiceRequest({
                name: row.name,
                mapname: gmap_name
            });

            getPoseWaypointName.callService(getwaypointparam, function (result) {
                g_pose = result
                console.log(result);
            })
        }
    });
     
    $('#mapTable').bootstrapTable({
        onCheck: function (row, $element) {
            console.log(JSON.stringify(row));
            isMapChoosen = true;
            gmap_name = row.name;
            mapp_selected = row.name;
            localStorage.setItem("mapname",row.name);
            var getwaypointparam = new ROSLIB.ServiceRequest({
                mapname: row.name
            });
            getWaypointName.callService(getwaypointparam, function (result) {
                console.log(result);
                var dataSet = []
                while (g_waypoints.length > 0) {
                    g_waypoints.pop();
                }
                //g_waypoints.push(['none', 'NONE'])
                if (result.length == 0) {
                    isWaypointAvaliable = false
                } else {
                    isWaypointAvaliable = true
                }
                result.waypointname.forEach(fn => {
                    var item = {
                        name: fn
                    }
                    dataSet.push(item)
                    g_waypoints.push(item)
                    console.log(fn)

                });
                console.log(dataSet)
                $('#waypointTable').bootstrapTable({
                    data: dataSet
                })
                // $('#mapTable').bootstrapTable("destroy");
                $('#waypointTable').bootstrapTable('load', dataSet)
            })
            var getwaypointparam = new ROSLIB.ServiceRequest({
                name: row.name
            });
            getWayPoints.callService(getwaypointparam, function (result) {
                console.log(result);
            })
        }
    });




    /*      const checkbox = document.getElementById('switch_slam')
      console.log("+++++++++++++++++")

      console.log(checkbox)


      checkbox.addEventListener('change', (event) => {
          console.log("checked !!!!!!")
          if (event.target.checked) {
              startSLAMsrv.callService(onSlam, function (result) {
                  console.log(result);
              })
              alert('checked');
          } else {
              startSLAMsrv.callService(offSlam, function (result) {
                  console.log(result);
              })
              alert('not checked');
          }
      })*/




    /*mapTable.on('select', function (e, dt, type, indexes) {
        var count = table.rows({
            selected: true
        }).count();
        console.log("==============================>")
        console.log(count)

        // do something with the number of selected rows
    });*/

    /* var dataSet = [['aaaaa'],['bbbb'],['cccccc']]
     console.log(dataSet)
     var mTable = $('#mapTable').DataTable({
         aaData: dataSet,
         columns: [{
                 title: "Name"
             }
         ]
     });*/

    //console.log(mTable)

    // Our labels along the x-axis

    /*var ctx = document.getElementById("imuChart");
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                data: imuData
            }, {
                data: angularVelocity
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: -0.01,
                        max: 0.01,
                        stepSize: 0.0005,
                    }
                }]
            }
        }

    });*/

    Blockly.Blocks['sleep_type'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Sleep for");
            this.appendValueInput("NAME")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField("sec");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    Blockly.Python['sleep_type'] = function (block) {
        var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python
            .ORDER_ATOMIC);
        // TODO: Assemble JavaScript into code variable.
        var code = 'time.sleep(' + value_name + ')\n';
        return code;
    };

    Blockly.Blocks['agv_init'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("AGV navigation init");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    Blockly.Python['agv_init'] = function (block) {
        // TODO: Assemble JavaScript into code variable.
        var code = "import rospy\n"
        code = code + "import actionlib\n"
        code = code + "from move_base_msgs.msg import MoveBaseAction, MoveBaseGoal\n"
        code = code + "import json\n"
        code = code + "from tinydb import TinyDB, Query\n"
        code = code + "from rospy_message_converter import json_message_converter\n"
        code = code + "import agv\n"
        code = code + "import time\n"
        code = code + "waypoint_db = TinyDB('/home/pi/db.json')\n"
        code = code + "rospy.init_node('patrol')\n"
        code = code + "client = actionlib.SimpleActionClient('move_base', MoveBaseAction)\n"
        code = code + "client.wait_for_server()\n"
        return code;
    };





    Blockly.Blocks['move_to'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move to ");
            this.appendValueInput("map_name")
                .setCheck("String")
                .appendField("map");
            this.appendValueInput("waypoint")
                .setCheck("String")
                .appendField("waypoint");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };


    Blockly.Python['move_to'] = function (block) {
        var value_map_name = Blockly.Python.valueToCode(block, 'map_name', Blockly.Python
            .ORDER_ATOMIC);
        var value_waypoint = Blockly.Python.valueToCode(block, 'waypoint', Blockly.Python
            .ORDER_ATOMIC);
        // TODO: Assemble Python into code variable.
        var code = 'goal = agv.goal_pose(waypoint_db, ' + value_map_name + ' , ' +
            value_waypoint + ')\n';
        var code = code + "client.send_goal(goal)\n"
        var code = code + "client.wait_for_result()\n"
        return code;
    };


    Blockly.Blocks['move_to_preset'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Move to ");

            this.appendDummyInput()
                .appendField(gmap_name + " ");


            this.appendDummyInput()
                .appendField('waypoint')
                .appendField(new Blockly.FieldDropdown(
                    this.generateOptions), 'WAYPOINT');
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("");
            this.setHelpUrl("");
        },

        generateOptions: function () {
            var options = [];

            for (var i = 0; i < g_waypoints.length; i++) {

                options.push([g_waypoints[i].name, g_waypoints[i].name]);

            }
            return options;
        }
    };


    Blockly.Python['move_to_preset'] = function (block) {
        /*var value_waypoint = Blockly.Python.valueToCode(block, 'waypoint', Blockly.Python
            .ORDER_ATOMIC);*/
        var value_waypoint = block.getFieldValue('WAYPOINT');
        // TODO: Assemble Python into code variable.
        var code = 'goal = agv.goal_pose(waypoint_db, "' + gmap_name + '" , "' +
            value_waypoint + '")\n';
        var code = code + "client.send_goal(goal)\n"
        var code = code + "client.wait_for_result()\n"
        return code;
    };

    Blockly.Blocks['rospy_loop'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("ROS FOEVER LOOP");
            this.appendStatementInput("DO")
                .setCheck(null)
                .setAlign(Blockly.ALIGN_RIGHT);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("");
            this.setHelpUrl("");
        }
    };

    Blockly.Python['rospy_loop'] = function (block) {
        var statements_name = Blockly.Python.statementToCode(block, 'NAME');
        // TODO: Assemble Python into code variable.
        var branch = Blockly.Python.statementToCode(block, 'DO');
        branch = Blockly.Python.addLoopTrap(branch, block) || Blockly.Python.PASS;

        var code = 'while not rospy.is_shutdown():\n' + branch;
        return code;
    };
  }
//--------------------+++++++++++++++++++++++++++++++++++++++++++++++ End Doc Ready +++++++++++++++++++++++++++++++++++++++++++++++ --------------------------





ip = location.host;
ip = ip.substring(0, ip.indexOf(':'));
console.log(ip)


function saveBlockly() {
    var xml = Blockly.Xml.workspaceToDom(workspace);
    var xml_text = Blockly.Xml.domToText(xml);

    var inputVal = document.getElementById("file_name").value;

    var xhr = new XMLHttpRequest();
    var url = "http://" + ip + ":5000/uploadXML";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Upload sucessful")
            $('#cancel-blockly-btn').click();
        }
    };
    var data = JSON.stringify({
        filename: inputVal,
        data: xml_text
    })
    xhr.send(data);

}


function runBlockly(t) {
    /*var code = Blockly.Python.workspaceToCode(workspace);
        console.log(code)*/

    if (t.value == "run") {

        var code = Blockly.Python.workspaceToCode(workspace);
        console.log(code)

        var xhr = new XMLHttpRequest();
        var url = "http://" + ip + ":5000/run";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {

            }
        };
        var data = JSON.stringify({
            data: code
        })
        xhr.send(data);

        t.innerHTML = "STOP";
        t.value = "stop"

    } else {

        var xhr = new XMLHttpRequest();
        var url = "http://" + ip + ":5000/stop";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {}
        };
        var data = JSON.stringify({
            data: ""
        })
        xhr.send(data);

        t.innerHTML = "RUN";
        t.value = "run"

    }


}




var baseZoomX = 1;
var baseZoomY = 1;
// Connect to ROS.
var ros = new ROSLIB.Ros({
    //url: 'ws://192.168.88.248:9090'
    url: "ws://" + robot_ip + ":9090"

});










// Scale the canvas to fit to the map

/*var aaa1 = new ROS2D.ArrowShape({
    rootObject: viewer.scene
})*/

/*gridClient.on('change', function () {
    viewer.scaleToDimensions(gridClient.currentGrid.width, gridClient.currentGrid.height);
    viewer.shift(gridClient.currentGrid.pose.position.x, gridClient.currentGrid.pose.position.y);
    viewer.scene.addChild(aaa1)
    console.log("zoom ===== ")
    console.log(viewer.scene.scaleX)

    //viewer.scene.scaleX*=6
    //viewer.scene.scaleY*=6
    //viewer.scene.x+=200
    //viewer.scene.y-=300
    //zoomView.startZoom(gridClient.currentGrid.width/2, gridClient.currentGrid.height/2)
    //zoomView.zoom(3)


});*/


function view_map(){
    viewer3d = new ROS3D.Viewer({
        divID: 'map3d',
        width: colWidth / 12 * 8,
        height: colWidth / 12 * 8 * 3 / 4,
        antialias: true
    });

    viewer3d.resize(document.getElementById("map3d").offsetWidth * 0.96, document.getElementById(
        "map3d").offsetWidth * 3 / 4 * 0.96)

    var tfClient = new ROSLIB.TFClient({
        ros: ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 10.0,
        fixedFrame: 'map',
        serverName: 'tf2_web_republisher'
    });

    var laserScan = new ROS3D.LaserScan({
            ros: ros,
            topic: 'scan',
            tfClient: tfClient,
            rootObject: viewer3d.scene,
            material: {
                color: 0x880000,
                size: 0.1
            }
        }

    )
         
    var sn = null
    var pathDisplay = new ROS3D.Path({
        ros: ros,
        tfClient: tfClient,
        rootObject: viewer3d.scene,
        topic: '/move_base/GlobalPlanner/plan'

    })

    viewer3d.addObject(pathDisplay);


    //var orCtl = new ROS3D.OrbitControls(viewer3d.scene, viewer3d.camera)
    //viewer3d.addObject(orCtl);

    var poseR = new ROS3D.Pose({
        ros: ros,
        tfClient: tfClient,
        rootObject: viewer3d.scene,
        topic: 'robot_pose'

    })

    var urdfClient = new ROS3D.UrdfClient({
        ros: ros,
        tfClient: tfClient,
        rootObject: viewer3d.scene
    });

    var gridClient3d = new ROS3D.OccupancyGridClient({
        ros: ros,
        continuous: true,
        rootObject: viewer3d.scene
    });

    /*             var cosmap3d = new ROS3D.OccupancyGridClient({
                    ros: ros,
                    topic: "/move_base/global_costmap/costmap",
                    continuous: true,
                    opacity: 0.5,
                    offsetPose: new ROSLIB.Pose({
                        position: {
                            x: 0,
                            y: 0,
                            z: -1
                        }
                    }),
                    rootObject: viewer3d.scene
                }) */



    var tfClientM = new ROSLIB.TFClient({
        ros: ros,
        angularThres: 0.01,
        transThres: 0.01,
        rate: 10.0,
        fixedFrame: '/map'
    });





    var imClient = new ROS3D.InteractiveMarkerClient({
        ros: ros,
        tfClient: tfClientM,
        topic: '/simple_marker',
        camera: viewer3d.camera,
        rootObject: viewer3d.selectableObjects
    });


    var robotPosition = new ROS3D.MarkerClient({
        ros: ros,
        tfClient: tfClientM,
        topic: '/visualization_marker',
        camera: viewer3d.camera,
        rootObject: viewer3d.selectableObjects,
        lifetime: 10

    })

    var robotWaypoints = new ROS3D.MarkerArrayClient({
        ros: ros,
        tfClient: tfClientM,
        topic: '/visualization_marker_array',
        rootObject: viewer3d.selectableObjects,

    })

    var robotWaypoints_text = new ROS3D.MarkerArrayClient({
        ros: ros,
        tfClient: tfClientM,
        topic: '/visualization_marker_array_text',
        rootObject: viewer3d.selectableObjects,

    })
    twist = new ROSLIB.Message({
        linear: {
            x: 0,
            y: 0,
            z: 0
        },
        angular: {
            x: 0,
            y: 0,
            z: 0
        }
    });
    // Init topic object
    cmdVel = new ROSLIB.Topic({
        ros: ros,
        name: '/cmd_vel',
        messageType: 'geometry_msgs/Twist'
    });
    // Register publisher within ROS system
    cmdVel.advertise();

    listener = new ROSLIB.Topic({
        ros: ros,
        name: '/raw_odom',
        messageType: 'nav_msgs/Odometry'

    });
    var odom_count = 0
    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++GaugeMeter
    listener.subscribe(function (message) {
        //console.log('Received message on ' + listener.name + ': ' + message.twist.twist.linear.x);
     current_position = message;
     flag = "a";
     flag = "b"
        //current_position.y = - message;

        $("#GaugeMeter_1").gaugeMeter({
            //used: message.twist.twist.linear.x * 50,
            percent: message.twist.twist.linear.x * 50
        });

        //gauge_lin.set(message.twist.twist.linear.x); // set actual value
        //message.twist.twist.angular.z
        //listener.unsubscribe();
        document.getElementById("speed").innerHTML = message.twist.twist.linear.x * 50
        odom_count = odom_count + 1
        if (odom_count % 50 == 0) {
        try {
            myChart.data.labels.shift();
            myChart.data.datasets.forEach((dataset) => {
                dataset.data.shift();
            });
            //myChart.update();

            myChart.data.labels.push(message.header.seq);
            //myChart.data.datasets.forEach((dataset) => {
            myChart.data.datasets[0].data.push(message.twist.twist.angular.z);
            myChart.data.datasets[1].data.push(message.twist.twist.linear.x);


            //});
            myChart.update();
            odom_count = 0
        } catch (error) {
            
        }
       
        }
    });
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++GaugeMeter



    move_base_status_listener = new ROSLIB.Topic({
        ros: ros,
        name: '/move_base/status',
        messageType: 'actionlib_msgs/GoalStatusArray'

    });

    var nav_statusElement = document.getElementById('nav_status');
    move_base_status_listener.subscribe(function (message) {
        //if(message.status_list.length == 1){
        //console.log(message.status_list[0].status)

        /* if (message.status_list[0].status == 3) {
             if (nav_statusElement) {
                 nav_statusElement.innerHTML = 'Goal react';
             }
         } else if (message.status_list[0].status == 1) {
             if (nav_statusElement) {x
                 nav_statusElement.innerHTML = 'Driving';
             }
         }*/
        //}
    });

    listener = new ROSLIB.Topic({
        ros: ros,
        name: '/imu/data',
        messageType: 'sensor_msgs/Imu'

    });
    var imu_count = 0
    listener.subscribe(function (message) {
        imu_count = imu_count + 1
        if (imu_count % 50 == 0) {
            //console.log('IMU Received message on ' + listener.name + ': ' + message.orientation.w);
            imu_count = 0;


            /* myChart.data.labels.shift();
             myChart.data.datasets.forEach((dataset) => {
                 dataset.data.shift();
             });
             //myChart.update();

             myChart.data.labels.push(message.header.seq);
             //myChart.data.datasets.forEach((dataset) => {
                 myChart.data.datasets[0].data.push(message.orientation.w);
                 myChart.data.datasets[1].data.push(message.angular_velocity.z);


             //});
             myChart.update();*/
        }

    });


    var onresize = function (e) {
        try {
            console.log("resizing")
            console.log(document.getElementById("map3d").offsetWidth)
            viewer3d.resize(document.getElementById("map3d").offsetWidth * 0.96, document
                .getElementById(
                    "map3d").offsetWidth * 0.96 * 3 / 4)
    
            var element = blocklyArea;
            var x = 0;
            var y = 0;
            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element = element.offsetParent;
            } while (element);
            // Position blocklyDiv over blocklyArea.
            blocklyDiv.style.left = x + 'px';
            blocklyDiv.style.top = y + 'px';
            blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
            blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
            Blockly.svgResize(workspace);
        } catch (error) {
            return;
        }
        // Compute the absolute coordinates and dimensions of blocklyArea.

    };
    window.addEventListener('resize', onresize, false);
    //onresize();

}

var ros_run  = ros.on('connection', function () {
    console.log("Connected!!!!!")
    console.log(colWidth / 12 * 8)
    // Create the main viewer.
    try {
        view_map();
    } catch (error) {
        
    }

});

//==============================================================================================33333333333333333333333333333333

var actionClient = new ROSLIB.ActionClient({
    ros: ros,
    actionName: 'move_base_msgs/MoveBaseAction',
    serverName: '/move_base'
});



function sendGoal() {
    // create a goal

    console.log("send goal")
    //console.log(pose)
    console.log(g_pose)
    var goal = new ROSLIB.Goal({
        actionClient: actionClient,
        goalMessage: {
            target_pose: {
                header: {
                    frame_id: 'map'
                },
                pose: g_pose.pose
            }
        }
    });
    goal.send();

    goal.on('feedback', function (feedback) {
        // console.log('Feedback: ' + feedback);
    });

    goal.on('result', function (result) {
        // console.log('Final Result: ' + result);
    });


}


var getPoseSrv = new ROSLIB.Service({
    ros: ros,
    name: '/get_pose',
    serviceType: 'agv_interface/getpost'
})

var startSLAMsrv = new ROSLIB.Service({
    ros: ros,
    name: '/start_slam',
    serviceType: 'agv_interface/slamsrv'
});

var deleteMap = new ROSLIB.Service({
    ros: ros,
    name: '/delete_map',
    serviceType: 'agv_interface/deletemap'
})

var deleteWaypoit = new ROSLIB.Service({
    ros: ros,
    name: '/delete_waypoint',
    serviceType: 'agv_interface/deletewaypoint'

})

var onSlam = new ROSLIB.ServiceRequest({
    onezero: 1,
    map_file: "map_office"
});

var offSlam = new ROSLIB.ServiceRequest({
    onezero: 0,
    map_file: "map_office"
});

var startNavSrv = new ROSLIB.Service({
    ros: ros,
    name: '/start_navigation',
    serviceType: 'agv_interface/navigatesrv'
});

var onNav = new ROSLIB.ServiceRequest({
    onezero: 1,
    map_file: "map_office"
});

var offNav = new ROSLIB.ServiceRequest({
    onezero: 0,
    map_file: "map_office"
});


var onMarker = new ROSLIB.ServiceRequest({
    onezero: 1
});

var offMarker = new ROSLIB.ServiceRequest({
    onezero: 0
});

var showPoseMarker = new ROSLIB.Service({
    ros: ros,
    name: '/poseestimate_markers_service',
    serviceType: 'agv_interface/poseestimate'
});

var showNavMarker = new ROSLIB.Service({
    ros: ros,
    name: '/waypoint_markers_service',
    serviceType: 'agv_interface/navigatesrv'
});

var setPose = new ROSLIB.Service({
    ros: ros,
    name: '/set_pose',
    serviceType: 'agv_interface/poseestimate'
});

var getMap = new ROSLIB.Service({
    ros: ros,
    name: '/get_map',
    serviceType: 'agv_interface/maps'
});

var getWaypointList = new ROSLIB.Service({
    ros: ros,
    name: '/list_waypoint',
    serviceType: 'agv_interface/maps'
});

var getWayPoints = new ROSLIB.Service({
    ros: ros,
    name: '/get_waypoint',
    serviceType: 'agv_interface/waypointsarray'
});

var getWaypointName = new ROSLIB.Service({
    ros: ros,
    name: '/get_waypoint_name',
    serviceType: 'agv_interface/waypointname'
});

var getPoseWaypointName = new ROSLIB.Service({
    ros: ros,
    name: '/get_a_waypoint',
    serviceType: 'agv_interface/awaypoint'
});





var saveMapSrv = new ROSLIB.Service({
    ros: ros,
    name: '/save_map',
    serviceType: 'agv_interface/savemaps'
})



$(function () {
    $('#switch_nav').change(function () {
        var check_nav = $(this).prop('checked');
        _check_nav = check_nav;
        localStorage.setItem("nav",_check_nav);
        mapname = $('#mapTable').bootstrapTable('getSelections')[0].name
        if (check_nav == true) {

            var onNav_ = new ROSLIB.ServiceRequest({
                onezero: 1,
                map_file: mapname
            });

            console.log(onNav_)

            startNavSrv.callService(onNav_, function (result) {
                console.log(result);
            })
            document.getElementById("switch_slam").disabled = true
            document.getElementById("save_map_btn").disabled = true

        } else {

            var offNav_ = new ROSLIB.ServiceRequest({
                onezero: 0,
                map_file: mapname
            });


            console.log(offNav_)

            startNavSrv.callService(offNav_, function (result) {
                console.log(result);
            })

            document.getElementById("switch_slam").disabled = false
            document.getElementById("save_map_btn").disabled = false
        }
        console.log(check_nav)
    })
})


$(function () {
    $('#switch_slam').change(function () {
        var check_nav = $(this).prop('checked')
        if (check_nav == true) {

            startSLAMsrv.callService(onSlam, function (result) {
                console.log(result);
            })

            document.getElementById("switch_nav").disabled = true


        } else {
            startSLAMsrv.callService(offSlam, function (result) {
                console.log(result);
            })

            document.getElementById("switch_nav").disabled = false
        }
        console.log(check_nav)
    })
})


$(function () {
    $('#show_pose_marker').change(function () {
        var check_nav = $(this).prop('checked')
        if (check_nav == true) {

            showPoseMarker.callService(onMarker, function (result) {
                console.log(result);
            })
        } else {
            showPoseMarker.callService(offMarker, function (result) {
                console.log(result);
            })
        }
        console.log(check_nav)
    })
})


$(function () {
    $('#show_nav_marker').change(function () {
        var check_nav = $(this).prop('checked')
        if (check_nav == true) {

            showNavMarker.callService(onMarker, function (result) {
                console.log(result);
            })
        } else {
            showNavMarker.callService(offMarker, function (result) {
                console.log(result);
            })
        }
        console.log(check_nav)
    })
})





function deleteAmap() {
    var delMapParam = new ROSLIB.ServiceRequest({
        mapfile: gmap_name
    });
    deleteMap.callService(delMapParam, function (result) {
        console.log(result)
        loadMap()
    })
}


function deleteAwaypoint() {
    var delWaypointParam = new ROSLIB.ServiceRequest({
        mapfile: gmap_name,
        waypoint: gwaypoint_name
    });

    deleteWaypoit.callService(delWaypointParam, function (result) {
        var getwaypointparam = new ROSLIB.ServiceRequest({
            mapname: gmap_name
        });
        getWaypointName.callService(getwaypointparam, function (result) {
            console.log(result);
            var dataSet = []
            while (g_waypoints.length > 0) {
                g_waypoints.pop();
            }
            //g_waypoints.push(['none', 'NONE'])

            if (result.length == 0) {
                isWaypointAvaliable = false
            } else {
                isWaypointAvaliable = true
            }
            result.waypointname.forEach(fn => {
                var item = {
                    name: fn
                }
                dataSet.push(item)
                g_waypoints.push(item)
                console.log(fn)

            });


            console.log(dataSet)

            $('#waypointTable').bootstrapTable({
                data: dataSet
            })

            // $('#mapTable').bootstrapTable("destroy");
            $('#waypointTable').bootstrapTable('load', dataSet)
        })


        var getwaypointparam = new ROSLIB.ServiceRequest({
            name: gmap_name
        });



        getWayPoints.callService(getwaypointparam, function (result) {
            console.log(result);
        })

    })
}


var map_list;
function loadMap() {
    getMap.callService(onMarker, function (result) {
        console.log("Done");
        console.log(result);
        var dataSet = []
        result.map_file.forEach(fn => {
            var item = {
                name: fn
            }
            dataSet.push(item)
            console.log(fn)

        });
        console.log(dataSet)
        map_list= dataSet;
        $('#mapTable').bootstrapTable({
            data: dataSet
        })

        // $('#mapTable').bootstrapTable("destroy");
        $('#mapTable').bootstrapTable('load', dataSet)



    })


    /*getWaypointList.callService(onMarker, function (result) {
        console.log("Done");
        console.log(result);
        var dataSet = []
        result.map_file.forEach(fn => {
            var item = {
                name: fn
            }
            dataSet.push(item)
            console.log(fn)

        });


        console.log(dataSet)

        $('#waypointTable').bootstrapTable({
            data: dataSet
        })

        // $('#mapTable').bootstrapTable("destroy");
        $('#waypointTable').bootstrapTable('load', dataSet)



    })*/



}








$(function () {
    $('#exampleModal').on('show.bs.modal', function () {
        // do something…
        console.log("Modal loaded")
        var table = document.getElementById('tableContents');
        var tableContents = ''
        dataFiles.forEach(fn => {
            console.log(fn)
            tableContents = tableContents + '<tr class="clickableRow"><td>' + fn +
                '</td></tr>';

        });
        console.log(tableContents)
        table.innerHTML = tableContents;

    })
})






/*$(function () {
    $('#mapTable').on('click', 'tbody tr', function (event) {
        $(this).addClass('highlight').siblings().removeClass('highlight');
        //var myTable = $('#mapTable').DataTable();
        //var numberOfSelections = $('#mapTable').bootstrapTable('getSelections').row; 
        console.log(myTable)
    });
})*/




function setPoseCall() {
    setPose.callService(onMarker, function (result) {
        console.log(result);
    })
}

function setNavCall() {
    setPose.callService(onMarker, function (result) {
        console.log(result);
    })
}

function getPose() {
    console.log("get pose")
    console.log(selectedMapName)
    console.log(seqWayPoint)
    var mapname = $('#mapTable').bootstrapTable('getSelections')[0].name
    var poseReq = new ROSLIB.ServiceRequest({
        name: wpointname.value,
        seq: seqWayPoint,
        mapname: mapname
    });
    console.log(poseReq)
    console.log(getPoseSrv)
    getPoseSrv.callService(poseReq, function (result) {
        console.log(result);
        var getwaypointparam = new ROSLIB.ServiceRequest({
            mapname: mapname
        });
        getWaypointName.callService(getwaypointparam, function (result) {
            console.log(result);
            var dataSet = []
            while (g_waypoints.length > 0) {
                g_waypoints.pop();
            }
            //g_waypoints.push(['none', 'NONE'])

            if (result.length == 0) {
                isWaypointAvaliable = false
            } else {
                isWaypointAvaliable = true
            }
            result.waypointname.forEach(fn => {
                var item = {
                    name: fn
                }
                dataSet.push(item)
                g_waypoints.push(item)
                console.log(fn)

            });


            console.log(dataSet)

            $('#waypointTable').bootstrapTable({
                data: dataSet
            })

            // $('#mapTable').bootstrapTable("destroy");
            $('#waypointTable').bootstrapTable('load', dataSet)
        })

        var getwaypointparam = new ROSLIB.ServiceRequest({
            name: mapname
        });



        getWayPoints.callService(getwaypointparam, function (result) {
            console.log(result);
        })
    })
}

function setWaypointBtnActivation() {
    if (!document.getElementById('waypointname').value.length) {
        document.getElementById("setwaypointbtn").disabled = true;
        console.log("Enable set way point");
    } else {
        document.getElementById("setwaypointbtn").disabled = false;
        console.log(" Disable set way point");

    }
}


function saveMap() {
    var inputVal = document.getElementById("map_name").value;
    var mapName_ = new ROSLIB.ServiceRequest({
        mapfile: inputVal
    });

    console.log(mapName_)
    console.log(saveMapSrv)

    saveMapSrv.callService(mapName_, function (result) {
        console.log(result);
    })
    console.log(inputVal)
}


function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    $("#filelist").empty();
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    tbody.id = "filetable";
    tbody.setAttribute('id', "filetable");
    for (let element of data) {
        let row = tbody.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);

        }
    }
}

var selected_file = ""

function getFile() {
    var robot_ip = document.getElementById("Robot_ip").value;
    let mountains = [];
    // 1. Create a new XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. Configure it: GET-request for the URL /article/.../load
    var url = "http://" + robot_ip + ":5000/getXML";
    xhr.open('GET', url);
    xhr.responseType = 'json';

    // 3. Send the request over the network
    xhr.send();

    // 4. This will be called after the response is received
    xhr.onload = function () {
        if (xhr.status != 200) { // analyze HTTP status of the response
            console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            console.log(xhr.response.files); // response is the server
            mountains = xhr.response.files
            let table = document.getElementById("filelist");
            generateTable(table, mountains);

            $("#filelist tr").click(function () {
                selected_file = $(this).find('td:first').html();
                console.log(selected_file);
              //  document.getElementById("load-blockly-btn").disabled = false;

            })
        }
    };






}


function loadBlockly() {
    var robot_ip = document.getElementById("Robot_ip").value;
    var xhr = new XMLHttpRequest();
    var url = "http://" + robot_ip + ":5000/getXMLdata";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = 'json';
    xhr.onload = function () {
        if (xhr.status != 200) { // analyze HTTP status of the response
            console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        } else { // show the result
            console.log(xhr.response.content); // response is the server
            workspace.clear()
            var xml = Blockly.Xml.textToDom(xhr.response.content);
            Blockly.Xml.domToWorkspace(xml, workspace);
        }
    };
    var data = JSON.stringify({
    filename: selected_file
    })
    xhr.send(data);
    console.log(selected_file)
    }


$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    console.log(e.target.id.localeCompare("Pogramming")) // activated tab
    if (e.target.id.localeCompare("Pogramming") == 1) {
        console.log("Fa prog")
        var element = blocklyArea;
        var x = 0;
        var y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        blocklyDiv.style.left = x + 'px';
        blocklyDiv.style.top = y + 'px';
        blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
        blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(workspace);
    } else {
        try {
            console.log("Fa bav")
            console.log(document.getElementById("map3d").offsetWidth)
            viewer3d.resize(document.getElementById("map3d").offsetWidth * 0.96, document.getElementById(
                "map3d").offsetWidth * 3 / 4 * 0.96)
        } catch (error) {
            return;
        }

    }
})
