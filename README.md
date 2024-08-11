# 📎 연기 감지 기반 금연 지원 서비스 (팀명: SMOQ)
![그림01](https://github.com/2024-SMHRD-IS-IOT-3/SMOQ/assets/150112222/73ea5875-063f-41f1-be70-42336de594aa)



## 👀 서비스 소개
* MQ-2(가스 센서), MQ-7(일산화탄소 센서), MQ-135(유해가스/공기질 센서)를 통한 흡연 감지시 흡연 위치, 흡연 시간을 웹을 통해 보여주는 서비스
<br>

## 📅 프로젝트 기간
2024.04.11 ~ 2024.05.24 (7주)
<br>
<br>

## ⭐ 주요 기능
* 일산화탄소 센서, 가연성 가스 센서, 공기질 센서를 통한 흡연 감지
* GPS 모듈을 사용한 흡연 시 위치 정보 수집
* 웹으로 흡연 위치, 흡연 시간을 보여주는 서비스
* 관리자가 사용자의 흡연 정보를 조회할 수 있는 서비스
<br>

## ⛏ 기술스택
<table>
    <tr>
        <th>구분</th>
        <th>내용</th>
    </tr>
    <tr>
        <td>사용언어</td>
        <td>
            <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"/>
            <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"/>
            <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white"/>
            <img src="https://img.shields.io/badge/C-A8B9CC?style=for-the-badge&logo=C&logoColor=white"/> 
        </td>
    </tr>
    <tr>
        <td>라이브러리</td>
        <td>
            <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
            <img src="https://img.shields.io/badge/react bootstrap-41E0FD?style=for-the-badge&logo=reactbootstrap&logoColor=white">
            <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white">
            <img src="https://img.shields.io/badge/Axios-007CE2?style=for-the-badge&logo=axios&logoColor=white" >
            <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=Express&logoColor=white" >
            <img src="https://img.shields.io/badge/KakaoMap-FFCD00?style=for-the-badge&logo=Kakao&logoColor=white"/>
            <img src="https://img.shields.io/badge/Google-4285F4?style=for-the-badge&logo=Google&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>개발도구</td>
        <td>
            <img src="https://img.shields.io/badge/Arduino-00979D?style=for-the-badge&logo=Arduino&logoColor=white"/>
            <img src="https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=VisualStudioCode&logoColor=white"/>
            <img src="https://img.shields.io/badge/Jupyter-F37626?style=for-the-badge&logo=Jupyter&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>서버환경</td>
        <td>
            <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white"/> 
            <img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=Flask&logoColor=white"/> 
        </td>
    </tr>
    <tr>
        <td>데이터베이스</td>
        <td>
            <img src="https://img.shields.io/badge/Oracle 11g-F80000?style=for-the-badge&logo=Oracle&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>협업도구</td>
        <td>
            <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>
            <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>
            <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"/>
        </td>
    </tr>
</table>
<br>

## ⛏ 개발환경
+ Node.js 20.12.0<br>
+ React 18.3.1<br>
+ Arduino IDE 2.3.2<br>
    + ESP32C3 Dev Module board<br>
+ ESP32-C3-DevkitM-1<br>
    + ESP32-C3-MINI-1<br>
    + ESP32-C3FN4<br>
+ MQ-2 (pp-A205)<br>
    + ZYMQ-2 sensor<br>
    + LM393<br>
+ MQ-7(SZH-SSBH-097)<br>
    + ZYMQ-7 sensor<br>
    +  LM393<br>
+ MQ-135(SZH-SSBH-038)<br>
    + ZYMQ-135 sensor<br>
    +  LM393<br>
+ NEO-6M(GY-GPS6MV2)<br>
    + NEO-6M<br>

<br>

## ⛏ 회로 구성도
![image](https://github.com/2024-SMHRD-IS-IOT-3/SMOQ/assets/150112222/75f5c5aa-643c-4110-b5e0-900ef87fb67a)
<br>

## ⚙ 시스템 아키텍처(구조)
![image](https://github.com/2024-SMHRD-IS-IOT-3/SMOQ/assets/150112222/5a42191f-54c8-43d9-91d4-eb89d6ca3576)
<br>

## 📌 SW유스케이스
![image](https://github.com/2024-SMHRD-IS-IOT-3/SMOQ/assets/150112222/235a0ee0-1e16-47be-b3f0-3ad48936a576)
<br>

## 📌 서비스 흐름도
![flow](https://github.com/2024-SMHRD-IS-IOT-3/SMOQ/assets/131474134/3d28d5aa-0076-4363-a10e-5bea1a59e9ef)

<br>

## 📌 ER다이어그램
![ERD](https://github.com/2024-SMHRD-IS-IOT-3/SMOQ/assets/150112222/ea9015bb-f95f-470b-9c9e-9c5aa74eb5ae)
<br>





## 🖥 화면 구성

### 로그인 / 회원가입
![image](https://github.com/user-attachments/assets/8899e882-8246-4698-a6ae-79ba9d45bc0e)
![image](https://github.com/user-attachments/assets/d70c84c7-821d-45e3-925c-63e921dbbcb9)

### 사용자 메인페이지 / 기록페이지 / 그래프페이지 / 장소페이지
![image](https://github.com/user-attachments/assets/0d366c78-e0d0-4db0-bdf0-a478ba6be20a)


### 관리자 메인페이지/관리페이지
![image](https://github.com/user-attachments/assets/d37706dd-02be-460f-841b-98738cdd1ad9)


### 저널 페이지
![image](https://github.com/user-attachments/assets/e0a12b30-ec3a-4305-ba55-99fec5ce1298)


### 회원정보/회원정보수정/회원탈퇴
![image](https://github.com/user-attachments/assets/9ee43035-8154-4e21-9356-9493e01b8daf)
![image](https://github.com/user-attachments/assets/de708a54-0bda-4c25-acb7-cbf754e01e5f)



## 👨‍👩‍👦‍👦 팀원 역할
<table>
  <tr>
    <td align="center"><img src="https://item.kakaocdn.net/do/fd49574de6581aa2a91d82ff6adb6c0115b3f4e3c2033bfd702a321ec6eda72c" width="100" height="100"/></td>
    <td align="center"><img src="https://mb.ntdtv.kr/assets/uploads/2019/01/Screen-Shot-2019-01-08-at-4.31.55-PM-e1546932545978.png" width="100" height="100"/></td>
    <td align="center"><img src="https://mblogthumb-phinf.pstatic.net/20160127_177/krazymouse_1453865104404DjQIi_PNG/%C4%AB%C4%AB%BF%C0%C7%C1%B7%BB%C1%EE_%B6%F3%C0%CC%BE%F0.png?type=w2" width="100" height="100"/></td>
    <td align="center"><img src="https://i.pinimg.com/236x/ed/bb/53/edbb53d4f6dd710431c1140551404af9.jpg" width="100" height="100"/></td>
  </tr>
  <tr>
    <td align="center"><strong>임동원</strong></td>
    <td align="center"><strong>주영빈</strong></td>
    <td align="center"><strong>김가연</strong></td>
    <td align="center"><strong>박태하</strong></td>
  </tr>
  <tr>
    <td align="center"><b>
        프로젝트 총괄<br>
기록, 장소 페이지 제작<br>
캘린더, 그래프 제작<br>
구글맵 API를 활용한 지오코딩
    </b></td>
    <td align="center">
        <b> - 센서를 통한 데이터 수집<br>
            - <br>
            - <br>
        </b></td>
    <td align="center">
        <b>- 회원가입, 로그인 페이지 제작<br>
           - 사용자. 관리자 메인 페이지 제작<br>
           - 사용자의 금연 시간별 프로세스 바 제작<br>
           - DB 설계 / 구축<br>
           - 관리자가 사용자 조회할 수 있는 페이지<br>
           - 메일 전송을 통한 문의하기<br>
           - 로그인 인증</b>
    </td>
    <td align="center"><b>Frontend</b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/dd0nw" target='_blank'>github</a></td>
    <td align="center"><a href="https://github.com/yb1882" target='_blank'>github</a></td>
    <td align="center"><a href="https://github.com/yeon820" target='_blank'>github</a></td>
    <td align="center"><a href="https://github.com/SAMTAEGUEK" target='_blank'>github</a></td>
  </tr>
</table>

## 🤾‍♂️ 트러블슈팅
* 문제점 : 블루투스 통신과 GPS모듈(NEO-6M)을 같이 사용하면 GPS값만 출력하고 블루투스 주소값은 출력하지 않음
* 원인 : esp32 c3보드에 시리얼 포트가 하나만 존재해서 발생
* 해결방안 : 블루투스 통신 대신 WIFI 통신 사용
