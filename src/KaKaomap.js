/* global kakao */
import React, {useEffect, useState, useRef} from 'react';
import ROSLIB from "roslib";
import {MapMarker, Map} from "react-kakao-maps-sdk";

const ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
});

const listener = new ROSLIB.Topic({
    ros: ros,
    name: "/converted_gps_data",
    messageType: "sensor_msgs/NavSatFix"
});

const Kakaomap = () => {
    const [msg, setMsg] = useState();
    const [lat, setLat] = useState();
    const [long, setLong] = useState();

    ros.on("connection", () => {
        setMsg("Connected to websocket server.");
    });
    ros.on("error", () => {
        const error = "Error connecting to websocket server.";
        setMsg(error);
    });
    ros.on("close", () => {
        setMsg("Connection to websocket server closed.");
    });

    useEffect(() => {
        listener.subscribe((message) => {
            setMsg('Received message on ' + listener.name + " " + message);
            setLat(message.latitude);
            setLong(message.longitude);
        });
    }, []);


    return (
    <div style={{ textAlign : "center" }}>
        <h1>Check MSG</h1>
        <h2>{msg}</h2>
        <h2>( {lat} , {long} )</h2>
        {lat && long &&
            <Map // 지도를 표시할 Container
                center={{
                    lat: lat,
                    lng: long
                }}
                style={{
                    // 지도의 크기
                    width: "100%",
                    height: "450px",
                }}
                level={3} // 지도의 확대 레벨
            >
            <MapMarker // 마커를 생성합니다
                position={{
                    lat: lat,
                    lng: long
                }}
                draggable={true} // 마커가 드래그 가능하도록 설정합니다
            />
            </Map>
        }
    </div>
    );
}

export default Kakaomap;