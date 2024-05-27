#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>

#define GPS_RX_PIN 21
#define GPS_TX_PIN 20

HardwareSerial gpsSerial(1); // 하드웨어 시리얼 포트 객체 생성
bool gpsEnabled = true;      // GPS 활성화 여부를 나타내는 플래그
String gpsData;              // GPS 데이터를 저장하는 변수

const char* ssid = "콩기계";        // 와이파이 SSID 입력 
const char* password = "33336666";  // 와이파이 비밀번호 입력
const char* serverUrl = "https://1905-106-252-44-73.ngrok-free.app/api/data"; // 플라스크 서버 주소 입력

String user_email = "yb1881ua@gmail.com";

int MQ2 = A4;
int MQ7 = A2;
int MQ135 = A3;

void setup() {
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void loop() {
  readSensors();
  if (!gpsEnabled) {
    delay(5000);
    gpsEnabled = true;
  }
}

void readSensors() {
  int MQ2Value = analogRead(MQ2);
  int MQ7Value = analogRead(MQ7);
  int MQ135Value = analogRead(MQ135);

//   if (MQ2Value >= 1500 && MQ7Value >= 1250 && MQ135Value >= 1250) {
//     readGPSData();
//     processGPSData(MQ2Value, MQ7Value, MQ135Value);
//   }
// }
  if (MQ2Value >= 320 && MQ7Value >= 700 && MQ135Value >= 750) {
    readGPSData();
    processGPSData(MQ2Value, MQ7Value, MQ135Value);
  }
}

void readGPSData() {
  while (gpsSerial.available()) {
    char c = gpsSerial.read();
    gpsData += c;
    if (c == '\n') {
      gpsEnabled = false;
    }
  }
}

void processGPSData(int MQ2Value, int MQ7Value, int MQ135Value) {
  String latitude, longitude;
  getLatLongFromGPGLL(gpsData, latitude, longitude);
  sendSensorData(latitude, longitude, MQ2Value, MQ7Value, MQ135Value);
  delay(60000);
}

void getLatLongFromGPGLL(String sentence, String& latitude, String& longitude) {
  int comma1 = sentence.indexOf(',');
  int comma2 = sentence.indexOf(',', comma1 + 1);
  int comma3 = sentence.indexOf(',', comma2 + 1);
  int comma4 = sentence.indexOf(',', comma3 + 1);
  latitude = convertToDecimalDegrees(sentence.substring(comma1 + 1, comma2));
  longitude = convertToDecimalDegrees(sentence.substring(comma3 + 1, comma4));
}

String convertToDecimalDegrees(String rawDegrees) {
  double degrees = rawDegrees.substring(0, rawDegrees.indexOf('.') - 2).toDouble();
  double minutes = rawDegrees.substring(rawDegrees.indexOf('.') - 2).toDouble();
  return String(degrees + (minutes / 60), 6); // 유효 숫자 6자리까지 반환
}

void sendSensorData(String latitude, String longitude, int MQ2Value, int MQ7Value, int MQ135Value) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // Corrected JSON 형식으로 데이터 작성
  String data = "{"
              "\"user_email\": \"" + user_email + "\", "
              "\"latitude\": \"" + latitude + "\", "
              "\"longitude\": \"" + longitude + "\", "
              "\"sensor1_value\": " + String(MQ2Value) + ", "
              "\"sensor2_value\": " + String(MQ7Value) + ", "
              "\"sensor3_value\": " + String(MQ135Value) + 
              "}";

  int httpResponseCode = http.POST(data);
  http.end();
}