const express = require('express');
const router = express.Router();
const db = require('../config/db');
const oracledb = require('oracledb')
const path = require('path')
const { sendEmail } = require('../config/email');


 const addr = "";
// 메인 경로
router.get('/', (req, res) => {
    console.log('누군가 메인페이지에 접근했습니다!');
    res.sendFile(path.join(__dirname, "..", "react-project", "build", "index.html"));
});

/** 최근 흡연 시간을 가져오는 경로 */
router.post('/selectsmokingtime', async (req, res) => {

    let { email } = req.body;
    console.log("email",email)
    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT TO_CHAR(smoke_time, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') as smoke_time
                     FROM tb_smoking_sensor a
                     where user_email = :email
                     and a.sensor_idx = (select max(sensor_idx)
                                           from tb_smoking_sensor where user_email = :email )`;


        oracledb.fetchAsString = [oracledb.DATE];
        const result = await connection.execute(sql, [email, email], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        console.log(result)
       
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

    let { email } = req.body;

    try {
        const connection = await db.connectToOracle();

        // 평균 흡연 개수
        const averageResult = await connection.execute(
            `WITH smoke_counts AS (
            SELECT COUNT(*) AS count
            FROM tb_smoking_sensor
            WHERE user_email = :email
            GROUP BY TRUNC(TO_DATE(smoke_date, 'YYYY-MM-DD'))
            )
            SELECT AVG(count) AS average
            FROM smoke_counts`, [email]
        );
  
        const averageCount = averageResult.rows.length > 0 ? averageResult.rows[0][0] : 0;
    
        // 오늘 흡연 개수
        const todayResult = await connection.execute(
            `SELECT COUNT(*) AS count
            FROM tb_smoking_sensor
            WHERE user_email = :email AND TRUNC(TO_DATE(smoke_date, 'YYYY-MM-DD')) = TRUNC(SYSDATE)`, [email]
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
    console.log(birthDate)
    try {
        const connection = await db.connectToOracle();
        const sql = `INSERT INTO TB_USER (USER_EMAIL, USER_PW, USER_NAME, USER_NICK, USER_BIRTHDATE, USER_SMOKE_CNT, JOINED_AT)
                     VALUES (:email, :password, :name, :nickname, TO_DATE(:birthDate, 'MM-DD-YYYY'), :smokeCount, SYSDATE)`;

        const sql2 = `INSERT INTO TB_WRITING_USER (USER_EMAIL) VALUES (:email)`
        const params = { email, password, name, nickname, birthDate, smokeCount };
        const params2 = { email };
    
        await connection.execute(sql, params, { autoCommit: true });
        await connection.execute(sql2, params2, { autoCommit: true });
    
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
        const sql2 = `INSERT INTO TB_WRITING_USER (MGR_EMAIL) VALUES (:email)`
        const params = {email, password, name, org};
        const params2 = { email };
    
        await connection.execute(sql, params, { autoCommit: true });
        await connection.execute(sql2, params2, { autoCommit: true });
    
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
            sql = `SELECT USER_EMAIL, JOINED_AT FROM TB_USER WHERE USER_EMAIL = :email AND USER_PW = :password`;
        } else {
            sql = `SELECT MGR_EMAIL, CREATED_AT FROM TB_MANAGER WHERE MGR_EMAIL = :email AND MGR_PW = :password`;
        }
        
        const params = { email, password };

        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });

        

        if (result.rows.length > 0) {
            const user = result.rows[0];
            req.session.email = email;
            res.json({ 
                success: true, 
                message: '로그인 성공', 
                email: user.USER_EMAIL || user.MGR_EMAIL,
                joined_at: user.JOINED_AT 
            });

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

/** 관리자가 유저 조회 */
router.post('/find-user', async (req, res) => {
    const { name, birthDate } = req.body;

    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT USER_NAME, USER_BIRTHDATE FROM TB_USER WHERE USER_NAME = :name AND USER_BIRTHDATE = :birthDate
        `;
        const params = { name, birthDate };

        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        await connection.close();

        if (result.rows.length > 0) {
            res.json({ success: true, users: result.rows });
        } else {
            res.json({ success: false, message: '존재하지 않는 사용자입니다.' });
        }
    } catch (error) {
        console.error('사용자 검색 실패:', error);
        res.status(500).json({ success: false, message: '사용자 검색 실패' });
    }
});

/** 모든 사용자 정보 조회 */
router.get('/all-users', async (req, res) => {
    const sessionMgrEmail = req.session.mgrEmail;
    try {
        const connection = await db.connectToOracle();
        const sql = `SELECT USER_NAME, USER_BIRTHDATE 
                                FROM TB_USER 
                                WHERE USER_EMAIL IN (SELECT USER_EMAIL 
                             FROM TB_MANAGEMENT
                             WHERE MGR_ID = :sessionMgrEmail)`;

        const result = await connection.execute(sql, [sessionMgrEmail], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        await connection.close();

        if (result.rows.length > 0) {
            res.json({ success: true, users: result.rows });
        } else {
            res.json({ success: false, message: '사용자 정보가 없습니다.' });
        }
    } catch (error) {
        console.error('모든 사용자 정보 불러오기 실패:', error);
        res.status(500).json({ success: false, message: '모든 사용자 정보 불러오기 실패' });
    }
});

/** 관리자가 사용자를 조회 */
router.post('/get-smoking-data', async (req, res) => {
    const { name, birthDate } = req.body;
  
    try {
      const connection = await db.connectToOracle();
      const sql = `
        SELECT TO_CHAR(smoke_time, 'YYYY-MM-DD HH24:MI:SS') AS SMOKE_DATE, smoke_loc AS SMOKE_LOC
        FROM tb_smoking_sensor
        WHERE user_email = (
          SELECT USER_EMAIL FROM TB_USER WHERE USER_NAME = :name AND USER_BIRTHDATE = :birthDate
        )
        ORDER BY smoke_time DESC
      `;
      const params = { name, birthDate };
  
      const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
      await connection.close();
  
      if (result.rows.length > 0) {
        res.json({ success: true, data: result.rows });
      } else {
        res.json({ success: false, message: '흡연 데이터가 없습니다.' });
      }
    } catch (error) {
      console.error('흡연 데이터 불러오기 실패:', error);
      res.status(500).json({ success: false, message: '흡연 데이터 불러오기 실패' });
    }
  });

/** 날짜 범위 조회 */
  router.post('/queryDateRange', async (req, res) => {
    console.log('기간 내 데이터를 조회합니다.');

    const { email, startDate, endDate } = req.body;
    console.log('startDate', startDate, 'endDate', endDate, 'user', email);


    try {
        const connection = await db.connectToOracle();
        const sql = `
        SELECT TO_CHAR(smoke_time,'MM/DD HH24:MI') AS SMOKE_TIME, smoke_loc AS SMOKE_LOC
        FROM tb_smoking_sensor
        WHERE user_email ='${email}'
        AND smoke_time BETWEEN TO_DATE('${startDate}', 'YY/MM/DD') AND TO_DATE('${endDate}', 'YY/MM/DD') + 1
        `;

        console.log("Executing SQL:", sql);
        oracledb.fetchAsString = [oracledb.DATE];

        connection.execute(sql, function(err,result){
            if(err){
                console.log(err.message)
            }else {
                console.log('success', result.rows)
                res.json({result : result.rows})
            }
        })

        await connection.close();
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 캘린더 날짜로 조회 */
router.post('/handledate', async (req, res) => {
    console.log('최근 흡연 시간을 조회합니다.');
    
    const { date, email } = req.body;
    console.log('date', date, 'user', email);


    try {
        const connection = await db.connectToOracle();
        const sql = `
        SELECT TO_CHAR(smoke_time, 'MM/DD HH24:MI'), smoke_loc
        FROM tb_smoking_sensor
        WHERE user_email = '${email}'
        AND TO_CHAR(smoke_time,'YY/MM/DD') LIKE '${date}'
        `;

        console.log("Executing SQL:", sql);

        oracledb.fetchAsString = [oracledb.DATE];
        connection.execute(sql, function(err, result) {
            if (err) {
                console.log(err.message);
                res.status(500).json({ error: 'Error executing query' });
            } else {
                if (result.rows.length > 0) {
                    console.log('success', result.rows);
                    // 위도, 경도 각각 다른 변수 저장
                    let loca = result.rows[0][1].split(',');
                    let lat = loca[0];
                    let len = loca[1];
                    console.log(loca);

                    // 객체데이터 생성
                    // result.rows[0][0], formatted_address
                    res.json({ result: result.rows });
                } else {
                    console.log('No results found');
                    res.json({ result: 'No results found' });
                }
            }
        });

        await connection.close();

    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






/** 날짜 범위 조회하기(그래프) */
router.post('/graphDateRange', async (req, res) => {
    console.log('기간 내 데이터를 조회합니다.');

    const { email, startDate, endDate } = req.body;
    console.log('startDate', startDate, 'endDate', endDate, 'user', email);


    try {
        const connection = await db.connectToOracle();
        const sql = `
        SELECT TO_CHAR(smoke_time, 'YY/MM/DD') AS SMOKE_DATE, COUNT(*) AS SMOKE_COUNT
        FROM tb_smoking_sensor
        WHERE user_email ='${email}'
        AND smoke_time BETWEEN TO_DATE('${startDate}', 'YY/MM/DD HH24:MI:SS') AND TO_DATE('${endDate}', 'YY/MM/DD HH24:MI:SS') + 1
        GROUP BY TO_CHAR(smoke_time, 'YY/MM/DD')
        ORDER BY TO_CHAR(smoke_time, 'YY/MM/DD')
        `;

        console.log("Executing SQL:", sql);
        oracledb.fetchAsString = [oracledb.DATE];

        connection.execute(sql, function(err, result) {
            if (err) {
                console.log(err.message);
            } else {
                console.log('success', result.rows);
                res.json({ result: result.rows });
            }
        });

        await connection.close();
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 게시글 전체 목록 가져오기 */
router.get('/journallist', async (req, res) => {
    try {
      const connection = await db.connectToOracle();
      const sql = `SELECT POST_IDX, WRITING_USER, POST_CONTENT, TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI') AS CREATED_AT, POST_LIKES FROM TB_POST ORDER BY CREATED_AT DESC`;
      const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
  
      const journalData = await Promise.all(result.rows.map(async (row) => {
        const postContent = await lobToString(row.POST_CONTENT);
        const commentCount = await getCommentCount(connection, row.POST_IDX);
  
        // WRITING_USER를 사용하여 이메일을 검색
        const emailResult = await connection.execute(
          'SELECT USER_EMAIL FROM TB_WRITING_USER WHERE WRITING_USER = :writingUser',
          { writingUser: row.WRITING_USER },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
  
        const userEmail = emailResult.rows.length > 0 ? emailResult.rows[0].USER_EMAIL : null;

        // userEmail로 WRITING_USER 가져오기
      const writingUserResult = await connection.execute(
        'SELECT WRITING_USER FROM TB_WRITING_USER WHERE USER_EMAIL = :userEmail',
        { userEmail },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const writingUser = writingUserResult.rows.length > 0 ? writingUserResult.rows[0].WRITING_USER : null;
      console.log(writingUser)

  
        return {
          id: row.POST_IDX,
          user: userEmail, 
          content: postContent,
          date: row.CREATED_AT,
          likes: row.POST_LIKES,
          comments: commentCount,
          writingUser: writingUser
        };
      }));
  
      await connection.close();
  
      res.json({ success: true, data: journalData });
    } catch (error) {
      console.error('Failed to fetch journal posts:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch journal posts' });
    }
  });

  /** post_idx에 따른 댓글 개수 가져오기 */
  async function getCommentCount(connection, postIdx) {
    try {
      const sql = `SELECT COUNT(*) AS COUNT FROM TB_COMMENT WHERE POST_IDX = :postIdx`;
      const result = await connection.execute(sql, [postIdx], { outFormat: oracledb.OUT_FORMAT_OBJECT });
      return result.rows[0].COUNT || 0;
    } catch (error) {
      console.error('Failed to fetch comment count:', error);
      return 0;
    }
  }
  
  /** LOB 데이터 처리 */
  async function lobToString(lob) {
    return new Promise((resolve, reject) => {
      if (lob === null) {
        resolve('');
        return;
      }
      let content = '';
      lob.setEncoding('utf8');
      lob.on('data', (chunk) => {
        content += chunk;
      });
      lob.on('end', () => {
        resolve(content);
      });
      lob.on('error', (err) => {
        reject(err);
      });
    });
  }

/** 게시물 좋아요 수 업데이트 */
router.post('/update-like', async (req, res) => {
    const { postId } = req.body;
    console.log(postId)
  
    try {
      const connection = await db.connectToOracle();
      const sql = `UPDATE TB_POST SET POST_LIKES = POST_LIKES + 1 WHERE POST_IDX = :postId`;
      await connection.execute(sql, [postId], { autoCommit: true });
      console.log(postId)
  
      await connection.close();
      res.json({ success: true });
    } catch (error) {
      console.error('Failed to update likes:', error);
      res.status(500).json({ success: false, message: 'Failed to update likes' });
    }
  });

/** 카카오 지도 */
router.post('/handlemap', async(req, res)=> {
    console.log('지도를 표시합니다');
    const {email} = req.body;
    console.log('gd',email);

    try {
        const connection = await db.connectToOracle();
        const sql = `
        SELECT smoke_loc
        FROM tb_smoking_sensor
        WHERE user_email = '${email}'
        `;

        console.log("Executing SQL:", sql);
        oracledb.fetchAsString = [oracledb.DATE];

        connection.execute(sql, function(err, result){
            if(err){
                console.log(err.message);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log('success', result.rows);
                // Parse the result to extract the smoke_loc values
                const smokeLocs = result.rows.map(row => row[0]);
                res.json({ result: smokeLocs });
            }
        });

        await connection.close();
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/** 클릭한 게시글 내용 */
router.get('/post/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: 'Post ID must be a valid number' });
  }

  try {
    const connection = await db.connectToOracle();
    const postSql = `SELECT POST_IDX, WRITING_USER, POST_CONTENT, TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI') AS CREATED_AT, POST_LIKES FROM TB_POST WHERE POST_IDX = :id`;
    const postResult = await connection.execute(postSql, [parseInt(id)], { outFormat: oracledb.OUT_FORMAT_OBJECT });

    if (postResult.rows.length === 0) {
      await connection.close();
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const postContent = await lobToString(postResult.rows[0].POST_CONTENT);

    // WRITING_USER를 사용하여 이메일을 검색
    const writingUser = postResult.rows[0].WRITING_USER;
    const emailResult = await connection.execute(
      'SELECT USER_EMAIL FROM TB_WRITING_USER WHERE WRITING_USER = :writingUser',
      { writingUser },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const userEmail = emailResult.rows.length > 0 ? emailResult.rows[0].USER_EMAIL : null;

    const post = {
      user: userEmail, // 이메일을 user 필드로 설정
      content: postContent,
      date: postResult.rows[0].CREATED_AT,
      likes: postResult.rows[0].POST_LIKES,
    };

    await connection.close();

    res.json({ success: true, post });
  } catch (error) {
    console.error('Failed to fetch post data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch post data' });
  }
});


/** 클릭한 게시글의 댓글 목록 */
router.get('/postcomments/:id', async (req, res) => {
    const postId = req.params.id;

    console.log("postID", postId);
  
    try {
      const connection = await db.connectToOracle();
  
      const result = await connection.execute(
        `SELECT WRITING_USER, CMT_CONTENT, TO_CHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT 
         FROM TB_COMMENT 
         WHERE POST_IDX = :postId 
         ORDER BY CREATED_AT DESC`,
        [postId],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );
  
      const comments = await Promise.all(result.rows.map(async row => {
        const writingUser = row.WRITING_USER;

        // WRITING_USER를 사용하여 이메일 조회
        const emailResult = await connection.execute(
          'SELECT USER_EMAIL FROM TB_WRITING_USER WHERE WRITING_USER = :writingUser',
          { writingUser },
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        const userEmail = emailResult.rows.length > 0 ? emailResult.rows[0].USER_EMAIL : null;

        return {
          user: userEmail,
          content: row.CMT_CONTENT,
          date: row.CREATED_AT
        };
      }));

      console.log("comments", comments);
  
      res.json({ success: true, comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.json({ success: false, message: 'Failed to fetch comments' });
    }
});
  
/** 댓글작성 */
router.post('/post/:id/comment', async (req, res) => {
    const { id } = req.params;
    const { user, content } = req.body; 
        
    const intid = parseInt(id, 10)
    const intuser = parseInt(user, 10)
        console.log(id, intuser, content)
        console.log("s")
    try {
        const connection = await db.connectToOracle();
        const sql = `INSERT INTO TB_COMMENT (POST_IDX, CMT_CONTENT, CREATED_AT, WRITING_USER) VALUES (:intid, :content, sysdate, :intuser)`;
        const params = { intid, content, intuser };
        console.log("params")
        await connection.execute(sql, params, { autoCommit: true });
        console.log("connec")
        res.json({ success: true, message: '댓글이 성공적으로 저장되었습니다.' });
    } catch (error) {
        console.error('Failed to save comment:', error);
        res.status(500).json({ success: false, message: 'Failed to save comment', error: error.message });
    }
});

/** 게시글을 작성 */
router.post('/writepost', async (req, res) => {
    const { content, email } = req.body;

  
    try {
      const connection = await db.connectToOracle();
      const sql = `INSERT INTO TB_POST (POST_CONTENT, CREATED_AT, WRITING_USER)
      VALUES (
          :content,
          SYSDATE,
          (SELECT writing_user FROM TB_WRITING_USER WHERE USER_EMAIL = :email)
      )`;
      const params = { content, email};
  
      await connection.execute(sql, params, { autoCommit: true });
  
      res.json({ success: true, message: 'Post saved successfully.' });
    } catch (error) {
      console.error('Failed to save post:', error);
      res.status(500).json({ success: false, message: 'Failed to save post', error: error.message });
    } 
  });

  /** 유저 프로필 가져오기 */
  router.post('/user-profile', async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const connection = await db.connectToOracle();
        console.log("user-profile");
        // 사용자 정보를 가져오는 SQL 쿼리
        const sql = `
        SELECT USER_EMAIL, USER_NAME, USER_NICK, USER_BIRTHDATE, NVL(USER_SMOKE_CNT, 0) AS USER_SMOKE_CNT
FROM TB_USER
WHERE USER_EMAIL = :email;
`;
        
        // SQL 쿼리 실행
        const result = await connection.execute(sql, [email], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        await connection.close();
        console.log(result.rows);
        // 결과가 있는 경우 사용자 프로필 데이터를 응답으로 반환
        if (result.rows.length > 0) {
            const userProfile = result.rows[0];
            res.json({ success: true, userProfile });
        } else {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }
    } catch (error) {
        console.error('사용자 프로필 가져오기 실패:', error);
        res.status(500).json({ success: false, message: '사용자 프로필 가져오기 실패' });
    }
});

/** 유저 프로필 수정 */
router.post('/update-profile', async (req, res) => {
    console.log("Update profile endpoint hit with data:", req.body);
    const { email, newNickname } = req.body;
    // Rest of your code...

    try {
        const connection = await db.connectToOracle();
        
        // 사용자가 존재하는지 확인
        const userCheckSql = `SELECT * FROM TB_USER WHERE USER_EMAIL = :email`;
        const userCheckResult = await connection.execute(userCheckSql, [email]);

        if (userCheckResult.rows.length === 0) {
            await connection.close();
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        // 사용자 프로필 업데이트
        const updateSql = `
            UPDATE TB_USER 
            SET USER_NICK = :newNickname
            WHERE USER_EMAIL = :email
        `;
        const updateParams = {
            newNickname,
            email
        };

        await connection.execute(updateSql, updateParams, { autoCommit: true });

        await connection.close();

        res.json({ success: true, message: '프로필이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
        console.error('프로필 업데이트 실패:', error);
        res.status(500).json({ success: false, message: '프로필 업데이트 실패', error: error.message });
    }
});

/** 관리중인 유저 조회 */
router.post('/managed-users', async (req, res) => {
    const { mgremail } = req.body;
    console.log("select");
    try {
        const connection = await db.connectToOracle();

        const sql = `
            SELECT USER_NAME, USER_BIRTHDATE, TO_CHAR(JOINED_AT, 'YYYY-MM-DD HH24:MI') as JOINED_AT
            FROM TB_USER
            WHERE USER_EMAIL IN (SELECT user_email FROM TB_MANAGEMENT WHERE mgr_id = :mgremail)
        `;

        const params = { mgremail };

        const result = await connection.execute(sql, params, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        console.log(result.rows);

        if (result.rows.length > 0) {
            const managedUsers = result.rows.map(row => ({
                USER_NAME: row.USER_NAME,
                USER_BIRTHDATE: row.USER_BIRTHDATE,
                JOINED_AT: row.JOINED_AT
            }));
            res.json({ success: true, managedUsers });
        } else {
            res.json({ success: false, message: 'No managed users found' });
        }

        await connection.close();
    } catch (error) {
        console.error('Error fetching managed users:', error);
        res.status(500).json({ success: false, message: 'Error fetching managed users' });
    }
});

/** 관리유저 추가 */
router.post('/add-user', async (req, res) => {
    const { mgremail,  newuserEmail} = req.body;

    try {
        const connection = await db.connectToOracle();

        // Construct the SQL query to insert data into TB_MANAGEMENT
        const sql = `
            INSERT INTO TB_MANAGEMENT (MGR_ID, USER_EMAIL, CREATED_AT)
            VALUES (:mgremail, :newuserEmail, sysdate)
        `;

        const params = { mgremail, newuserEmail };
        console.log(mgremail, newuserEmail)
        // Execute the SQL query
        const result = await connection.execute(sql, params);
        console.log("result", result.rowsAffected)
        // Check if any rows were affected (inserted)
        if (result.rowsAffected  > 0) {
            res.json({ success: true, message: 'Managed user added successfully' });
        } else {
            res.json({ success: false, message: 'Failed to add managed user' });
        }

        await connection.close();
    } catch (error) {
        console.error('Error adding managed user:', error);
        res.status(500).json({ success: false, message: 'Error adding managed user' });
    }
});


/** 관리유저 삭제 */
router.post('/delete-user', async (req, res) => {
    const { mgrId, userEmail } = req.body;

    try {
        const connection = await db.connectToOracle();

        // Construct the SQL query to delete data from TB_MANAGEMENT
        const sql = `
            DELETE FROM TB_MANAGEMENT
            WHERE MGR_ID = :mgrId AND USER_EMAIL = :userEmail
        `;

        const params = { mgrId, userEmail };

        // Execute the SQL query
        const result = await connection.execute(sql, params);

        // Check if any rows were affected (deleted)
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
            res.json({ success: true, message: 'User data deleted successfully' });
        } else {
            res.json({ success: false, message: 'No matching data found to delete' });
        }

        await connection.close();
    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({ success: false, message: 'Error deleting user data' });
    }
});

/** 문의하기 메일 발송 */
router.post('/sendFeedback', async (req, res) => {
    const { category, message } = req.body;
    console.log("message",category, message)
    const emailContent = `카테고리: ${category}\n\n ${message}`;
    
    try {
        await sendEmail('g8793173@gmail.com', 'SMOQ 문의', emailContent);
        console.log('success')
        res.status(200).json({ success: true, message: 'Feedback sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send feedback' });
    }
});

/** 비밀번호 변경 */
router.post('/changePassword', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;

    console.log("changePassword");
    console.log(email);


    try {
        const connection = await db.connectToOracle();

        const result = await connection.execute(
            'SELECT USER_PW FROM TB_USER WHERE USER_EMAIL = :email',
            { email }
        );

        console.log(email);
        console.log(result.rows);
        console.log('1');

        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        console.log('2');
        const dbPassword = result.rows[0][0];
        console.log(dbPassword);
        console.log(currentPassword)
        console.log('3');

        if (currentPassword !== dbPassword) {
            console.log("a");
            return res.status(400).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
        }

        console.log('4');

        await connection.execute(
            'UPDATE TB_USER SET USER_PW = :newPassword WHERE USER_EMAIL = :email',
            { newPassword, email },
            { autoCommit: true }
        );

        console.log(result.rows);

        res.status(200).json({ success: true, message: '비밀번호가 성공적으로 변경되었습니다.' });
    } catch (error) {
        console.error('비밀번호 변경 실패:', error);
        res.status(500).json({ success: false, message: '비밀번호 변경 실패' });
    } 

});

/** 회원탈퇴 */
router.post('/resign', async (req, res) => {
    const { email } = req.body;
    let connection;

    console.log(email)

    try {
      connection = await db.connectToOracle();
  
      await connection.execute('SET TRANSACTION ISOLATION LEVEL SERIALIZABLE');
  
      const result1 = await connection.execute(
        'DELETE FROM TB_SMOKING_SENSOR WHERE USER_EMAIL = :email',
        { email }
      );
    
      console.log('df')
      const result = await connection.execute(
        'SELECT WRITING_USER FROM TB_WRITING_USER WHERE USER_EMAIL = :email',
        { email }
      );
      console.log(result)
      
      console.log("CC5")
      if (result.rows.length > 0) {
        const writingUser = result.rows[0][0];
        console.log("Found writingUser:", writingUser);
        console.log("CC4")
        // TB_COMMENT에서 삭제
        await connection.execute(
          'DELETE FROM TB_COMMENT WHERE WRITING_USER = :writingUser',
          { writingUser }
        );
        console.log("CC3")
        // TB_POST에서 삭제
        await connection.execute(
          'DELETE FROM TB_POST WHERE WRITING_USER = :writingUser',
          { writingUser }
        );
        console.log("CC2")
        // TB_WRITING_USER에서 삭제
        await connection.execute(
          'DELETE FROM TB_WRITING_USER WHERE USER_EMAIL = :email',
          { email }
        );
      } else {
        console.log("No WRITING_USER found for email:", email);
      }
      console.log("CC1")
      await connection.execute(
        'DELETE FROM TB_USER WHERE USER_EMAIL = :email',
        {  email }
      );
  console.log("CC")
      await connection.commit();
      console.log("DD")
      console.log(result)
      res.status(200).json({ success: true, message: '회원 탈퇴가 성공적으로 처리되었습니다.' });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (err) {
          console.error('Failed to rollback transaction:', err);
        }
      }
      console.error('회원 탈퇴 실패:', error);
      res.status(500).json({ success: false, message: '회원 탈퇴 실패' });
    } 
  });
  

module.exports = router;
