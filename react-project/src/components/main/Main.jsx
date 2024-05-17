import React, { useEffect, useState } from 'react';
import Header from '../header/Header';
import Menu from '../footer/Footer';
import ProgressTimeline from './ProgressTimeline';
import axios from '../../axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const Main = () => {
  const [quitTime, setQuitTime] = useState(null); // 마지막 흡연 시간
  const [elapsedTime, setElapsedTime] = useState(''); // 금연 시간
  const [cntSmoke, setCntSmoke] = useState(0) // 흐연 개수

  // 프로그레스바
  const [progress20Min, setProgress20Min] = useState(0);
  const [progress8Hours, setProgress8Hours] = useState(0);
  const [progress12Hours, setProgress12Hours] = useState(0);
  const [progress48Hours, setProgress48Hours] = useState(0);
  const [progress72Hours, setProgress72Hours] = useState(0);
  const [progress10Days, setProgress10Days] = useState(0);
  const [progress3Months, setProgress3Months] = useState(0);
  const [progress9Months, setProgress9Months] = useState(0);
  const [progress1Year, setProgress1Year] = useState(0);
  const [progress5Years, setProgress5Years] = useState(0);

  const [how, setHow] = useState('')


  const [stepStatus, setStepStatus] = useState([
    { status: '' }, // 20분
    { status: '' }, // 8시간
    { status: '' }, // 12시간
    { status: '' }, // 48시간
    { status: '' }, // 72시간
    { status: '' }, // 10일
    { status: '' }, // 3달
    { status: '' }, // 9달
    { status: '' }, // 1년
    { status: '' }  // 5년
  ]);

  useEffect(() => {
    smokingtimeData();
    smokingcntData();
  }, []);

  /** 흡연 시간 조회 */
  const smokingtimeData = () => {

    axios.post('/selectsmokingtime', {
      email: 'user1'
    })
    .then(res => {
      const quitTimeStr = res.data[0].SMOKE_TIME;

      const quitTimeDate = new Date(quitTimeStr);
      setQuitTime(quitTimeDate);
    });
  };

  // 흡연 횟수 조회
  const smokingcntData = () => {

    axios.post('/selectsmokingcnt', {})
    .then(res => {
      const cnt = res.data <= 0 ? Math.abs(res.data) : res.data;
      setCntSmoke(cnt);
      setHow(cnt <= 0 ? '더 피움' : '적게 핌');
    })
    .catch(err => {
      console.error('흡연 카운트 조회 오류:', err);
    });
  }

  useEffect(() => {
    if (quitTime) {
      const updateElapsedTime = () => {

        // 현재 시간
        const now = new Date();

        // 현재 시간 년, 월, 일, 시, 분, 초
        const nowYear = now.getFullYear();
        const nowMonth = now.getMonth() + 1;
        const nowDay = now.getDate();
        const nowHour = now.getHours();
        const nowMinute = now.getMinutes();
        const nowSecond = now.getSeconds();

        // 흡연 시간 년, 월, 일, 시, 분, 초
        const quitYear = quitTime.getUTCFullYear();
        const quitMonth = quitTime.getUTCMonth() + 1;
        const quitDay = quitTime.getUTCDate();
        const quitHour = quitTime.getUTCHours();
        const quitMinute = quitTime.getUTCMinutes();
        const quitSecond = quitTime.getUTCSeconds();

        // 현재 시간 - 흡연 시간
        let diffYear = nowYear - quitYear;
        let diffMonth = nowMonth - quitMonth;
        let diffDay = nowDay - quitDay;
        let diffHour = nowHour - quitHour;
        let diffMinute = nowMinute - quitMinute;
        let diffSecond = nowSecond - quitSecond;

        if (diffSecond < 0) {
          diffSecond += 60;
          diffMinute--;
        }
        if (diffMinute < 0) {
          diffMinute += 60;
          diffHour--;
        }
        if (diffHour < 0) {
          diffHour += 24;
          diffDay--;
        }
        if (diffDay < 0) {
          const daysInPreviousMonth = new Date(nowYear, nowMonth - 1, 0).getDate();
          diffDay += daysInPreviousMonth;
          diffMonth--;
        }

        const formattedTime = 
          (diffDay > 0 ? `${diffDay}일 ` : '') +
          (diffHour > 0 || diffDay > 0 ? `${diffHour}시간 ` : '') +
          `${diffMinute}분 ${diffSecond}초`;

        setElapsedTime(formattedTime);

        // 금연 시간 프로세스 바
        const totalElapsedMinutes = diffYear * 525600 + diffMonth * 43800 + diffDay * 1440 + diffHour * 60 + diffMinute + diffSecond / 60;
        const totalElapsedHours = totalElapsedMinutes / 60;
        const totalElapsedDays = totalElapsedHours / 24;

        const progress20Min = Math.min((totalElapsedMinutes / 20) * 100, 100);
        const progress8Hours = Math.min((totalElapsedHours / 8) * 100, 100);
        const progress12Hours = Math.min((totalElapsedHours / 12) * 100, 100);
        const progress48Hours = Math.min((totalElapsedHours / 48) * 100, 100);
        const progress72Hours = Math.min((totalElapsedHours / 72) * 100, 100);
        const progress10Days = Math.min((totalElapsedDays / 10) * 100, 100);
        const progress3Months = Math.min((totalElapsedDays / 90) * 100, 100);
        const progress9Months = Math.min((totalElapsedDays / 270) * 100, 100);
        const progress1Year = Math.min((totalElapsedDays / 365) * 100, 100);
        const progress5Years = Math.min((totalElapsedDays / (365 * 5)) * 100, 100);

        setProgress20Min(progress20Min);
        setProgress8Hours(progress8Hours);
        setProgress12Hours(progress12Hours);
        setProgress48Hours(progress48Hours);
        setProgress72Hours(progress72Hours);
        setProgress10Days(progress10Days);
        setProgress3Months(progress3Months);
        setProgress9Months(progress9Months);
        setProgress1Year(progress1Year);
        setProgress5Years(progress5Years);

        const newStepStatus = [...stepStatus];
        const progressArray = [
          { progress: progress20Min, index: 0 },
          { progress: progress8Hours, index: 1 },
          { progress: progress12Hours, index: 2 },
          { progress: progress48Hours, index: 3 },
          { progress: progress72Hours, index: 4 },
          { progress: progress10Days, index: 5 },
          { progress: progress3Months, index: 6 },
          { progress: progress9Months, index: 7 },
          { progress: progress1Year, index: 8 },
          { progress: progress5Years, index: 9 },
        ];

        let highestProgress = 0;
        let highestIndex = -1;

        progressArray.forEach(({ progress, index }) => {
          if (progress === 100) {
            newStepStatus[index].status = 'completed';
          } else {
            if (progress > highestProgress) {
              highestProgress = progress;
              highestIndex = index;
            }
            newStepStatus[index].status = 'pending';
          }
        });

        if (highestIndex !== -1) {
          newStepStatus[highestIndex].status = 'current';
        }

        setStepStatus(newStepStatus);
      };

      updateElapsedTime(); 

      const intervalId = setInterval(updateElapsedTime, 1000); 

      return () => clearInterval(intervalId); 

    }
  }, [quitTime]);

  return (
    <div className='main-container'>
      <Header />
      <div className='main-task'> 
        <div className='task'>
          <p className='p'>마지막 흡연으로부터</p>
          <h3 className='quit'>{elapsedTime}</h3>
        </div>
        <div className='task'>
          <p className='p' id='text1'>오늘 하루 평균보다</p>
          <h3 className='quit_percent'>{cntSmoke}개</h3>
          <p className='p'>{how}</p>
        </div>
      </div>

      <div className='div-content'>
        <div className='content'>
          <ProgressTimeline steps={stepStatus} />
          <div className='bar_ex'>
            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>20분</p><br/>
                <p className='i'>혈압과 맥박이 정상으로 떨어졌습니다.<br/> &nbsp;&nbsp;</p>
              </div>
              <ProgressBar 
                now={progress20Min} 
                label={`${progress20Min.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[0].status === 'completed' ? 'completed' : stepStatus[0].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>8시간</p><br/>
                <p className='i'>혈중산소농도가 정상으로 돌아옵니다. 니코틴 레벨이 90%까지 떨어집니다.</p>
              </div>
              <ProgressBar 
                now={progress8Hours} 
                label={`${progress8Hours.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[1].status === 'completed' ? 'completed' : stepStatus[1].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>12시간</p><br/>
                <p className='i'>혈압이 떨어지고, 심장병 발병률이 줄어들기 시작합니다.<br/> &nbsp;&nbsp;</p>
              </div>
              <ProgressBar 
                now={progress12Hours} 
                label={`${progress12Hours.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[2].status === 'completed' ? 'completed' : stepStatus[2].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>48시간</p><br/>
                <p className='i'>맛과 냄새를 맡는 능력이 향상됩니다.<br/> &nbsp;&nbsp;</p>
              </div>
              <ProgressBar 
                now={progress48Hours} 
                label={`${progress48Hours.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[3].status === 'completed' ? 'completed' : stepStatus[3].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>72시간</p><br/>
                <p className='i'>몸에서 니코틴이 모두 빠져나왔습니다. 숨쉬기 편해집니다.<br/> &nbsp;&nbsp;</p>
              </div>
              <ProgressBar 
                now={progress72Hours} 
                label={`${progress72Hours.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[4].status === 'completed' ? 'completed' : stepStatus[4].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>10일</p><br/>
                <p className='i'>일반적인 경우 니코틴 욕구가 줄어드는 것을 느끼기 시작합니다.<br/> &nbsp;&nbsp;</p>
              </div>
              <ProgressBar 
                now={progress10Days} 
                label={`${progress10Days.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[5].status === 'completed' ? 'completed' : stepStatus[5].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>3개월</p><br/>
                <p className='i'>기침과 숨가쁨이 덜해집니다. 심혈관계가 개선되고, 신체 활동이 조금 더 쉬워집니다.</p>
              </div>
              <ProgressBar 
                now={progress3Months} 
                label={`${progress3Months.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[6].status === 'completed' ? 'completed' : stepStatus[6].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>9개월</p><br/>
                <p className='i'>코막힘 증상, 피로, 숨가쁨이 감소됩니다. 호흡기 감염 위험이 크게 감소합니다.</p>
              </div>
              <ProgressBar 
                now={progress9Months} 
                label={`${progress9Months.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[7].status === 'completed' ? 'completed' : stepStatus[7].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>1년</p><br/>
                <p className='i'>치유된 폐 섬모는 폐에서 점액을 밀어내고 감염을 막습니다.<br/> &nbsp;&nbsp;</p>
              </div>
              <ProgressBar 
                now={progress1Year} 
                label={`${progress1Year.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[8].status === 'completed' ? 'completed' : stepStatus[8].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>

            <div className='total_box'>
              <div className='main_text'>
                <p className='b'>5년</p><br/>
                <p className='i'>뇌졸중 위험이 크게 감소하였습니다. 동맥과 혈관이 다시 넓어지기 시작할 정도로 몸이 충분히 치유되었습니다.</p>
              </div>
              <ProgressBar 
                now={progress5Years} 
                label={`${progress5Years.toFixed(1)}%`} 
                className={`progress-bar ${stepStatus[9].status === 'completed' ? 'completed' : stepStatus[9].status === 'current' ? 'current' : 'pending'}`} 
                role="progressbar" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className='footer'><Menu /></div>
    </div>
  );
};

export default Main;