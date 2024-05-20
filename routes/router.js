const express = require('express');
const router = express.Router();
const db = require('../config/db');
const oracledb = require('oracledb')
const path = require('path')
const { sendEmail } = require('../config/email');


// 메인 경로
router.get('/', (req, res) => {
    console.log('누군가 메인페이지에 접근했습니다!');
    res.sendFile(path.join(__dirname, "..", "react-project", "build", "index.html"));
});

/** 최근 흡연 시간을 가져오는 경로 */
router.post('/selectsmokingtime', async (req, res) => {

    let { email } = req.body;

    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT TO_CHAR(smoke_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as smoke_time
                     FROM tb_smoking_sensor a
                     where user_email = 'user_email 01'
                     and a.sensor_idx = (select max(sensor_idx)
                                           from tb_smoking_sensor )`;


        oracledb.fetchAsString = [oracledb.DATE];
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        result.rows.forEach(row => {
            const dateStr = row.SMOKE_TIME; 
            const date = new Date(dateStr);
          });

      
        await connection.close();

        res.send(result.rows);

    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 흡연 카운트를 가져오는 경로 */
router.post('/selectsmokingcnt', async (req, res) => {

    // let { email } = req.body;

    try {
        const connection = await db.connectToOracle();

        // 평균 흡연 개수
        const averageResult = await connection.execute(
            `WITH smoke_counts AS (
            SELECT COUNT(*) AS count
            FROM tb_smoking_sensor
            WHERE user_email = 'user_email 01'
            GROUP BY TRUNC(TO_DATE(smoke_date, 'YYYY-MM-DD'))
            )
            SELECT AVG(count) AS average
            FROM smoke_counts`
        );
  
        const averageCount = averageResult.rows.length > 0 ? averageResult.rows[0][0] : 0;
    
        // 오늘 흡연 개수
        const todayResult = await connection.execute(
            `SELECT COUNT(*) AS count
            FROM tb_smoking_sensor
            WHERE user_email = 'user_email 01' AND TRUNC(TO_DATE(smoke_date, 'YYYY-MM-DD')) = TRUNC(SYSDATE)`
        );
    
        const todayCount = todayResult.rows.length > 0 ? todayResult.rows[0][0] : 0;
    
        // count = 오늘 흡연 개수 - 평균 흡연 개수
        const countDifference = todayCount - averageCount;
    
        res.json(countDifference);
        
      
        await connection.close();


    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 캘린더 */ 
router.post('/handledate', async (req, res) => {
    console.log('최근 흡연 시간을 조회합니다.');

    const user = 'user_email 01';
    const { date } = req.body;
    console.log('date', date, 'user',user);

    try {
        const connection = await db.connectToOracle();
        const sql = `
        SELECT TO_CHAR(smoke_time, 'MM/DD HH24:MI'), smoke_loc
        FROM tb_smoking_sensor
        WHERE user_email = '${user}'
        AND TO_CHAR(smoke_time,'YY/MM/DD') LIKE '${date}'
        `;

        console.log("Executing SQL:", sql);

        oracledb.fetchAsString = [oracledb.DATE];
        connection.execute(sql, function(err,result){
            if(err){
                console.log(err.message)
            }else {
                console.log('success', result.rows)
                res.json({result : result.rows})
                // res.send(result.rows);
            }
        })

        await connection.close();

        
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 이메일 랜덤 코드 생성 함수 */ 
function generateRandomCode(length = 6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
/** 회원가입 이메일 전송 */ 
router.post('/send-email', async (req, res) => {
    const { email } = req.body;
    const code = generateRandomCode();
    console.log("postsendmails")
    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT user_email FROM tb_user WHERE user_email = :email`;
        
        const result = await connection.execute(sql, [email]);

        if (result.rows.length > 0) {
            await connection.close();
            return res.json({ success: false, message: 'exist email' });
        }

        await sendEmail(email, 'SMOQ', `인증코드: ${code}`);
        req.session.sendauthcode = code;
        console.log("session code1", req.session.sendauthcode);
        res.status(200).json({ success: true, code: code });

        await connection.close();
    } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).json({ success: false, message: '코드 전송 실패', error: error.message });
    }
});


/** 이메일 코드 인증 */ 
router.post('/sendcode', async (req, res) => {
    const { authcode } = req.body;

    console.log("Received authcode:", authcode);
    console.log("Session code:", req.session.sendauthcode);

    if (!req.session.sendauthcode) {
        return res.status(400).json({ success: false, message: "No session code found" });
    }

    if (authcode.trim() === req.session.sendauthcode.trim()) {
        res.json({ success: true, message: "success" });
    } else {
        res.json({ success: false, message: "fail" });
    }
});

/** 회원가입 - 사용자 */
router.post('/joinDatauser', async (req, res) => {
    const {email, password, name, nickname, birthDate, smokeCount} = req.body

    try {
        const connection = await db.connectToOracle();
        const sql = `INSERT INTO TB_USER (USER_EMAIL, USER_PW, USER_NAME, USER_NICK, USER_BIRTHDATE, USER_SMOKE_CNT, JOINED_AT)
                     VALUES (:email, :password, :name, :nickname, TO_DATE(:birthDate, 'YYYY-MM-DD'), :smokeCount, SYSDATE)`;
        const params = { email, password, name, nickname, birthDate, smokeCount };
    
        await connection.execute(sql, params, { autoCommit: true });
    
        res.json({ result: "success", message: '회원가입 성공' });
      } catch (error) {
        console.error('회원가입 실패:', error);
        res.status(500).json({ success: false, message: '회원가입 실패' });
      }
});

/** 회원가입 - 관리자 */
router.post('/joinDatamanager', async (req, res) => {
    const {email, password, name, org} = req.body

    try {
        const connection = await db.connectToOracle();
        const sql = `INSERT INTO TB_MANAGER (MGR_EMAIL, MGR_PW, MGR_NAME, MGR_ORG, CREATED_AT)
                     VALUES (:email, :password, :name, :org, SYSDATE)`;
        const params = {email, password, name, org};
    
        await connection.execute(sql, params, { autoCommit: true });
    
        res.json({ result: "success", message: '회원가입 성공' });
      } catch (error) {
        console.error('회원가입 실패:', error);
        res.status(500).json({ success: false, message: '회원가입 실패' });
      }
});

/** 로그인 */
router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        const connection = await db.connectToOracle();
        let sql = ''
        if (userType === 'personal') {
            sql = `SELECT USER_EMAIL FROM TB_USER WHERE USER_EMAIL = :email AND USER_PW = :password`;
        } else {
            sql = `SELECT MGR_EMAIL FROM TB_MANAGER WHERE MGR_EMAIL = :email AND MGR_PW = :password`;
        }
        
        const params = { email, password };

        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        if (result.rows.length > 0) {
            req.session.email = email; // 세션에 이메일 저장
            res.json({ success: true, message: '로그인 성공', email });
        } else {
            res.json({ success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' });
        }

        await connection.close();
    } catch (error) {
        console.error('로그인 실패:', error);
        res.status(500).json({ success: false, message: '로그인 실패' });
    }
});

/** user 이메일 찾기 */
router.post('/find-useremail', async (req, res) => {
    const { name, birthDate } = req.body;

    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT USER_EMAIL FROM TB_USER WHERE USER_NAME = :name AND USER_BIRTHDATE = :birthDate`;
        const params = { name, birthDate };

        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await connection.close();

        if (result.rows.length > 0) {
            res.json({ success: true, email: result.rows[0].USER_EMAIL });
        } else {
            res.json({ success: false, message: '일치하는 사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('이메일 찾기 실패:', error);
        res.status(500).json({ success: false, message: '이메일 찾기 실패' });
    }
});

/** manager 이메일 찾기 */
router.post('/find-manageremail', async (req, res) => {
    const { name, org } = req.body;

    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT MGR_EMAIL FROM TB_MANAGER WHERE MGR_NAME = :name AND MGR_ORG = :org`;
        const params = { name, org };

        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await connection.close();

        if (result.rows.length > 0) {
            res.json({ success: true, email: result.rows[0].MGR_EMAIL });
        } else {
            res.json({ success: false, message: '일치하는 사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('이메일 찾기 실패:', error);
        res.status(500).json({ success: false, message: '이메일 찾기 실패' });
    }
});

/** user 임시 비밀번호 발송 */
router.post('/send-userpw', async (req, res) => {
    const { email, name, birthDate } = req.body;
    const code = generateRandomCode();
    console.log("postsendmails")
    try {
        const connection = await db.connectToOracle();
        const sql = `UPDATE TB_USER
                     SET USER_PW = :code
                     WHERE USER_EMAIL = :email AND USER_NAME = :name AND USER_BIRTHDATE = :birthDate`;
        
        const params = { code, email, name, birthDate };
        
        const result = await connection.execute(sql, params, { autoCommit: true });
        await connection.close();

        if (result.rowsAffected > 0) {
            await sendEmail(email, 'SMOQ', `임시 비밀번호: ${code}`);
            console.log("success", code)
            res.json({ success: true, message: '임시 비밀번호가 이메일로 전송되었습니다.' });
        } else {
            res.json({ success: false, message: '일치하는 사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).json({ success: false, message: '코드 전송 실패', error: error.message });
    }
});


/** manager 임시 비밀번호 발송 */
router.post('/send-managerpw', async (req, res) => {
    const { email, name, org } = req.body;
    const code = generateRandomCode();
    console.log("postsendmails")
    try {
        const connection = await db.connectToOracle();
        const sql = `UPDATE TB_MANAGER
                     SET MGR_PW = :code
                     WHERE MGR_EMAIL = :email AND MGR_NAME = :name AND MGR_ORG = :org`;
        
        const params = { code, email, name, org };
        
        const result = await connection.execute(sql, params, { autoCommit: true });
        await connection.close();


        if (result.rowsAffected > 0) {
            await sendEmail(email, 'SMOQ', `임시 비밀번호: ${code}`);
            console.log("success", code)
            res.json({ success: true, message: '임시 비밀번호가 이메일로 전송되었습니다.' });
        } else {
            res.json({ success: false, message: '일치하는 사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error("Failed to send email:", error);
        res.status(500).json({ success: false, message: '코드 전송 실패', error: error.message });
    }
});


module.exports = router;
