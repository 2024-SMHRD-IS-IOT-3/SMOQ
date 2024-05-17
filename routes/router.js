const express = require('express');
const router = express.Router();
const db = require('../config/db');
const oracledb = require('oracledb')
const path = require('path')


// 메인 경로
router.get('/', (req, res) => {
    console.log('누군가 메인페이지에 접근했습니다!');
    res.sendFile(path.join(__dirname, "..", "react-project", "build", "index.html"));
});

// 회원가입을 담당하는 경로(기능)
router.post('/handlejoin', (req, res) => {
    console.log('누군가 회원가입을 희망합니다', req.body);

    let {id, pw, nick} = req.body;

    let sql = "INSERT INTO nodejs_member (ID, PW, NICK) VALUES (?, ?, ?)";
    conn.query(sql, [id, pw, nick], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({result: 'failed'});
            return;
        }
        if (rows.affectedRows > 0) {
            res.json({result: 'success'});
        } else {
            res.json({result: 'failed'});
        }
    });
});

// 로그인을 담당하는 경로
router.post('/handlelogin', (req, res) => {
    console.log("누군가 로그인을 희망합니다", req.body);

    let {id, pw} = req.body;

    let sql = "SELECT ID, NICK FROM nodejs_member WHERE ID = ? AND PW = ?";
    conn.query(sql, [id, pw], (err, rows) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({result: 'failed'});
            return;
        }
        console.log('rows', rows.length);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.json({result: "failed"});
        }
    });
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


module.exports = router;
