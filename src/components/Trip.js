/* global window */
import React, { useState, useEffect, useCallback } from "react";

import DeckGL from '@deck.gl/react';
import {Map} from 'react-map-gl';

import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {TripsLayer} from '@deck.gl/geo-layers';
import {IconLayer, ScatterplotLayer} from "@deck.gl/layers";

import Slider from "@mui/material/Slider";
import "../css/trip.css";




/* ============================================
   조명 및 재질 설정
============================================ */
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000]
});

const lightingEffect = new LightingEffect({ambientLight, pointLight});

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70]
};

const material2 = {
  ambient: 0.3,
  diffuse: 0.6,
  shininess: 32,
  specularCol: [60, 64, 70]
};

/* ============================================
   기본 테마 설정
============================================ */
const DEFAULT_THEME = {
  buildingColor: [228, 228, 228],
  buildingColor2: [255, 255, 255],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  material2,
  effects: [lightingEffect]
};

/* ============================================
   초기 지도 상태 설정
============================================ */
const INITIAL_VIEW_STATE = { 
  longitude: 127.1, // 126.98 , -74
  latitude: 37.5, // 37.57 , 40.72
  zoom: 15,
  pitch: 30,
  bearing: 0
};


/* ============================================
상수 및 헬퍼 함수
============================================ */
const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

const minTime = 540;
const maxTime = 630;
const animationSpeed = 0.5;
const mapStyle = "mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc";

const MAPBOX_TOKEN = `pk.eyJ1Ijoic2hlcnJ5MTAyNCIsImEiOiJjbG00dmtic3YwbGNoM2Zxb3V5NmhxZDZ6In0.ZBrAsHLwNihh7xqTify5hQ`;

// 애니메이션 시간 업데이트
const returnAnimationTime = (time) => {
    if (time > maxTime) {
      return minTime;
    } else {
      return time + 0.01 * animationSpeed;
    }
  };
  
  // 시간 값을 0으로 채우는 함수 (ex. 08:05 형식으로 표시)
  const addZeroFill = (value) => {
    const valueString = value.toString();
    return valueString.length < 2 ? "0" + valueString : valueString;
  };
  
  // 시간을 시/분 형식으로 변환
  const returnAnimationDisplayTime = (time) => {
    const hour = addZeroFill(parseInt((Math.round(time) / 60) % 24));
    const minute = addZeroFill(Math.round(time) % 60);
    return [hour, minute];
  };
  
  const currData = (data, time) => {
    const arr = [];
    data.forEach((v) => {
      const timestamp = v.timestamp;  // 데이터의 타임스탬프 배열
      const s_t = timestamp[0];  // 타임스탬프 시작 시간
      const e_t = timestamp[timestamp.length - 1];  // 타임스탬프 종료 시간
      if (s_t <= time && e_t >= time) {
        arr.push(v);  // 해당 데이터를 결과 배열에 추가
      }
    });
    return arr;
  };

/* ============================================
   메인 컴포넌트: Trip
============================================ */
const Trip = (props) => {
  // 애니메이션 시간을 관리하는 상태
  const [time, setTime] = useState(minTime);
  const [animation] = useState({});



  
  

  // 부모(APP.JS)로부터 전달받은 데이터
  const trip_car = props.trip_car;
  const trip_foot = props.trip_foot;
  const stop = props.stop;
  const point_car = currData(props.point_car, time); // 시간 기준으로 필터링된 차량 포인트

  // const point_car = props.point_car;
  // const trip = currData(props.trip, time);


  // 애니메이션 업데이트
  const animate = useCallback(() => {
    setTime((time) => returnAnimationTime(time));
    animation.id = window.requestAnimationFrame(animate);
  }, [animation]);

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation, animate]);

  const stop_D = [
    { name: "GangnamASub - 도착지 1", coordinates: [127.23891, 37.39613] },
    { name: "GangnamASub - 도착지 2", coordinates: [127.26067, 37.41045] },
    { name: "GangnamBSub - 도착지 1", coordinates: [127.0361, 37.46838] },
    { name: "GangnamBSub - 도착지 2", coordinates: [127.02567, 37.48124] },
    { name: "GangdongASub - 도착지 1", coordinates: [127.175, 37.53185] },
    { name: "GangdongASub - 도착지 2", coordinates: [127.16189, 37.54123] },
    { name: "GangdongBSub - 도착지 1", coordinates: [127.23052, 37.49293] },
    { name: "GangdongBSub - 도착지 2", coordinates: [127.22134, 37.50321] },
    { name: "GangbukSub - 도착지 1", coordinates: [127.03969, 37.71744] },
    { name: "GangbukSub - 도착지 2", coordinates: [127.05318, 37.72814] },
    { name: "GangseoASub - 도착지 1", coordinates: [126.79751, 37.59165] },
    { name: "GangseoASub - 도착지 2", coordinates: [126.80542, 37.60022] },
    { name: "GangseoBSub - 도착지 1", coordinates: [126.74626, 37.52499] },
    { name: "GangseoBSub - 도착지 2", coordinates: [126.75578, 37.53843] },
    { name: "Gwanak1Sub - 도착지 1", coordinates: [126.87877, 37.48197] },
    { name: "Gwanak1Sub - 도착지 2", coordinates: [126.89034, 37.48945] },
    { name: "GwangjinBSub - 도착지 1", coordinates: [127.14655, 37.58534] },
    { name: "GwangjinBSub - 도착지 2", coordinates: [127.15512, 37.59789] },
    { name: "GwangjinASub - 도착지 1", coordinates: [127.08922, 37.60102] },
    { name: "GwangjinASub - 도착지 2", coordinates: [127.10184, 37.61056] },
    { name: "GuroSub - 도착지 1", coordinates: [126.77511, 37.53034] },
    { name: "GuroSub - 도착지 2", coordinates: [126.78565, 37.54389] },
    { name: "GeumcheonSub - 도착지 1", coordinates: [126.73088, 37.34392] },
    { name: "GeumcheonSub - 도착지 2", coordinates: [126.74234, 37.35567] },
    { name: "NowonSub - 도착지 1", coordinates: [127.21086, 37.69223] },
    { name: "NowonSub - 도착지 2", coordinates: [127.22078, 37.70445] },
    { name: "DobongSub - 도착지 1", coordinates: [127.02229, 37.75897] },
    { name: "DobongSub - 도착지 2", coordinates: [127.03156, 37.77056] },
    { name: "DongdaemunSub - 도착지 1", coordinates: [127.17757, 37.71365] },
    { name: "DongdaemunSub - 도착지 2", coordinates: [127.18934, 37.72312] },
    { name: "DongjakASub - 도착지 1", coordinates: [126.86025, 37.54989] },
    { name: "DongjakASub - 도착지 2", coordinates: [126.87245, 37.56112] },
    { name: "DongjakBSub - 도착지 1", coordinates: [126.88234, 37.44328] },
    { name: "DongjakBSub - 도착지 2", coordinates: [126.89356, 37.45189] },
    { name: "MapoSub - 도착지 1", coordinates: [126.92169, 37.66841] },
    { name: "MapoSub - 도착지 2", coordinates: [126.93345, 37.68012] },
    { name: "SeodaemunSub - 도착지 1", coordinates: [126.76539, 37.6495] },
    { name: "SeodaemunSub - 도착지 2", coordinates: [126.77845, 37.65978] },
    { name: "SeochoASub - 도착지 1", coordinates: [126.9637, 37.36008] },
    { name: "SeochoASub - 도착지 2", coordinates: [126.97456, 37.37234] },
    { name: "SeochoBSub - 도착지 1", coordinates: [126.91623, 37.32851] },
    { name: "SeochoBSub - 도착지 2", coordinates: [126.92812, 37.34245] },
    { name: "SeongdongASub - 도착지 1", coordinates: [127.14739, 37.58238] },
    { name: "SeongdongASub - 도착지 2", coordinates: [127.15678, 37.59456] },
    { name: "SeongbukASub - 도착지 1", coordinates: [126.92173, 37.66835] },
    { name: "SeongbukASub - 도착지 2", coordinates: [126.93378, 37.68023] },
    { name: "SeongbukBSub - 도착지 1", coordinates: [127.15217, 37.6362] },
    { name: "SeongbukBSub - 도착지 2", coordinates: [127.16545, 37.64789] },
    { name: "YangcheonSub - 도착지 1", coordinates: [127.18996, 37.68167] },
    { name: "YangcheonSub - 도착지 2", coordinates: [127.20145, 37.69412] },
    { name: "YeongdeungpoSub - 도착지 1", coordinates: [126.77044, 37.53129] },
    { name: "YeongdeungpoSub - 도착지 2", coordinates: [126.78312, 37.54389] },
    { name: "YongsanSub - 도착지 1", coordinates: [126.96979, 37.55799] },
    { name: "YongsanSub - 도착지 2", coordinates: [126.98123, 37.56912] },
    { name: "EunpyeongSub - 도착지 1", coordinates: [126.92041, 37.66492] },
    { name: "EunpyeongSub - 도착지 2", coordinates: [126.93356, 37.67834] },
    { name: "JungguSub - 도착지 1", coordinates: [126.99038, 37.52102] },
    { name: "JungguSub - 도착지 2", coordinates: [127.00312, 37.53356] },
    { name: "JungnangSub - 도착지 1", coordinates: [127.20614, 37.74561] },
    { name: "JungnangSub - 도착지 2", coordinates: [127.21745, 37.75689] },
    { name: "JongnoASub - 도착지 1", coordinates: [126.94924, 37.53864] },
    { name: "JongnoASub - 도착지 2", coordinates: [126.96145, 37.55178] },
    { name: "JongnoBSub - 도착지 1", coordinates: [126.78426, 37.59908] },
    { name: "JongnoBSub - 도착지 2", coordinates: [126.79678, 37.61045] },


    
  ];
  
  const communityCenters = [
    { name: "행운동 주민센터", coordinates: [126.957058, 37.480612] },
    { name: "홍은1동 주민센터", coordinates: [126.946994, 37.599580] },
    { name: "행당1동 주민센터", coordinates: [127.036352, 37.559477] },
    { name: "금호동 주민센터", coordinates: [127.021602, 37.555372] },
  ];
  
  
  
  /* ============================================
     레이어 설정
  ============================================ */

  //OD 원하는 곳으로 SSG
  const layers = [

    //아이콘(주민센터 )
    new IconLayer({
      id: "community-centers",
      data: communityCenters,
      sizeScale: 7,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
      },
      getIcon: () => "marker",
      getSize: 2,
      getPosition: (d) => d.coordinates,
      getColor: () => [255, 20, 147], // 핑크
      opacity: 1,
      pickable: true,
      onClick: ({ object }) => {
        if (object) {
          alert(`Clicked on ${object.name}`);
        }
      },
    }),

    //아이콘(우리 지정 아이콘은 하늘색)
    new IconLayer({
      id: "location-destination",
      data: stop,
      sizeScale: 7,
      iconAtlas:
        "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png",
      iconMapping: ICON_MAPPING,
      getIcon: (d) => "marker",
      getSize: 2,
      getPosition: (d) => d.coordinates,
      getColor: (d) =>
        ["SeodaemunSub", "SeongdongASub", "Gwanak1Sub"].some((stop) => d.name.startsWith(stop))
          ? [93, 173, 236] // 하늘색
          : [160, 212, 104], // 빨간색
      opacity: 1,
      mipmaps: false,
      pickable: true,
      radiusMinPixels: 2,
      radiusMaxPixels: 2,
    }),
    

    // 차량 경로 레이어
    new TripsLayer({  
      id: 'trips_car',
      data: trip_car,
      getPath: d => d.route,
      getTimestamps: d => d.timestamp,
      getColor: [255, 255, 0],
      opacity: 1,
      widthMinPixels: 4,
      capRounded : true,
      jointRounded : true,
      trailLength : 4,
      currentTime: time,
      shadowEnabled: false
    }),

    // 도보 경로 레이어
    new TripsLayer({  
      id: 'trips_foot',
      data: trip_foot,
      getPath: d => {
        console.log("로드된 trip_foot 데이터: ", d); // 개별 데이터 출력
        return d.route;
      },
      getTimestamps: d => d.timestamp,
      getColor: [255, 0, 255],
      opacity: 1,
      widthMinPixels: 7,
      capRounded : true,
      jointRounded : true,
      trailLength : 4,
      currentTime: time,
      shadowEnabled: false
    }),

    // 차량 포인트 레이어( 대기 하는 사람 )
    new ScatterplotLayer({
      id: 'scatterplot-layer',
      data: point_car,
      getPosition: d => d.coordinates,
      getFillColor: [255, 255, 255],
      getRadius: d => 3,
      getLineWidth: 3,
      radiusScale: 2,
      pickable: true,
      opacity: 0.5,
    }),


    // new ScatterplotLayer({
    //   id: "scatterplot-layer",
    //   data: trip,
    //   getPosition: (d) => {
    //     console.log("Route (first position):", d.route[0]); // 첫 번째 경로 좌표 확인
    //     return d.route[0];
    //   },
    //   getFillColor: (d) =>{
    //     console.log("Current time:", time, "Timestamp range:", d.timestamp[0], d.timestamp[1]);
    //     return time >= d.timestamp[0] && time < d.timestamp[1]
    //       ? [255, 255, 255] // 활성 상태
    //       : [0, 0, 0, 0]; // 비활성 상태
    //   },
    //   opacity: 1,
    // }),

  // // 도착지 아이콘 레이어
  // new IconLayer({
  //   id: "location-destination", // 고유 ID
  //   data: stop_D,
  //   sizeScale: 10, // 크기를 다르게 설정
  //   iconAtlas:
  //     "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png", // 동일한 Atlas 사용
  //   iconMapping: ICON_MAPPING,
  //   getIcon: (d) => "marker",
  //   getSize: 1, // 크기를 조금 더 다르게 설정
  //   getPosition: (d) => d.coordinates,
  //   getColor: [0, 255, 0], // 녹색으로 설정하여 기존 빨간색과 차별화
  //   opacity: 0.9,
  //   mipmaps: false,
  //   pickable: true,
  //   radiusMinPixels: 2,
  //   radiusMaxPixels: 4,
  // }),
  

  ];
  
  /* ============================================
     렌더링
  ============================================ */
  const SliderChange = (value) => {
    const time = value.target.value;
    setTime(time);
  };

  const [hour, minute] = returnAnimationDisplayTime(time);

  return (
    <div className="trip-container" style={{ position: "relative" }}>
      <DeckGL
        effects={DEFAULT_THEME.effects}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
      >
        <Map mapStyle={mapStyle} mapboxAccessToken={MAPBOX_TOKEN} preventStyleDiffing={true}/>
      </DeckGL>
      <h1 className="time">TIME : {`${hour} : ${minute}`}</h1>
      <Slider
        id="slider"
        value={time}
        min={minTime}
        max={maxTime}
        onChange={SliderChange}
        track="inverted"
      />
    </div>
  );
};



export default Trip;
