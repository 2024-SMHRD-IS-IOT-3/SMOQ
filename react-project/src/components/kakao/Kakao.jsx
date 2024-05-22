import React, { useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "../../axios";


const { kakao } = window;

const Kakao = () => {
  useEffect(() => {
    const fetchSmokeLocs = async () => {
      try {
        const email = sessionStorage.getItem("email");

        const response = await axios.post("/handlemap", { email: email });
        const smokeLocs = response.data.result;

        const container = document.getElementById("map");
        const options = {
          center: new kakao.maps.LatLng(35.1106537, 126.8770122),
          level: 3,
        };
        const map = new kakao.maps.Map(container, options);

        smokeLocs.forEach((loc) => {
          const [lat, lng] = loc.split(",").map(Number);
          const markerPosition = new kakao.maps.LatLng(lat, lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        });
      } catch (error) {
        console.error("Error fetching smoke locations:", error);
      }
    };

    fetchSmokeLocs();
  }, []);

  return (
    <div>
      <Header />
      <div id="map" className="map-container"></div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
};

export default Kakao;
