import React, { useMemo } from 'react';
import { format, startOfDay, subDays, eachDayOfInterval } from 'date-fns';

const Statistics = ({ students, participationHistory, getStudentStats }) => {
  // 整体统计数据
  const overallStats = useMemo(() => {
    const totalStudents = students.length;
    const totalParticipations = participationHistory.length;
    const activeStudents = new Set(participationHistory.map(p => p.studentId)).size;
    const participationRate = totalStudents > 0 ? ((activeStudents / totalStudents) * 100).toFixed(1) : 0;
    
    const correctAnswers = participationHistory.filter(p => p.response === 'correct').length;
    const incorrectAnswers = participationHistory.filter(p => p.response === 'incorrect').length;
    const noResponses = participationHistory.filter(p => p.response === 'no-response').length;
    
    const overallCorrectRate = totalParticipations > 0 ? 
      ((correctAnswers / totalParticipations) * 100).toFixed(1) : 0;

    return {
      totalStudents,
      totalParticipations,
      activeStudents,
      participationRate,
      correctAnswers,
      incorrectAnswers,
      noResponses,
      overallCorrectRate
    };
  }, [students, participationHistory]);

  // 学生排名数据
  const studentRankings = useMemo(() => {
    return students.map(student => {
      const stats = getStudentStats(student.id);
      return {
        ...student,
        ...stats
      };
    }).sort((a, b) => {
      // 先按总被叫次数排序，再按正确率排序
      if (b.totalCalls !== a.totalCalls) {
        return b.totalCalls - a.totalCalls;
      }
      return parseFloat(b.successRate) - parseFloat(a.successRate);
    });
  }, [students, getStudentStats]);

  // 最近7天的参与趋势
  const weeklyTrend = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return last7Days.map(date => {
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayParticipations = participationHistory.filter(p => {
        const pDate = new Date(p.timestamp);
        return pDate >= dayStart && pDate < dayEnd;
      });

      return {
        date: format(date, 'MM/dd'),
        fullDate: format(date, 'yyyy年MM月dd日'),
        count: dayParticipations.length,
        correct: dayParticipations.filter(p => p.response === 'correct').length,
        incorrect: dayParticipations.filter(p => p.response === 'incorrect').length,
        noResponse: dayParticipations.filter(p => p.response === 'no-response').length
      };
    });
  }, [participationHistory]);

  // 回答类型分布
  const responseDistribution = useMemo(() => {
    const total = participationHistory.length;
    if (total === 0) return [];

    const correct = participationHistory.filter(p => p.response === 'correct').length;
    const incorrect = participationHistory.filter(p => p.response === 'incorrect').length;
    const noResponse = participationHistory.filter(p => p.response === 'no-response').length;

    return [
      { type: '正确回答', count: correct, percentage: ((correct / total) * 100).toFixed(1), color: '#4caf50' },
      { type: '错误回答', count: incorrect, percentage: ((incorrect / total) * 100).toFixed(1), color: '#f44336' },
      { type: '未回应', count: noResponse, percentage: ((noResponse / total) * 100).toFixed(1), color: '#ff9800' }
    ];
  }, [participationHistory]);

  // 活跃度分析
  const activityAnalysis = useMemo(() => {
    const studentActivity = students.map(student => {
      const stats = getStudentStats(student.id);
      let level = '未参与';
      let color = '#9e9e9e';
      
      if (stats.totalCalls === 0) {
        level = '未参与';
        color = '#9e9e9e';
      } else if (stats.totalCalls <= 2) {
        level = '低活跃';
        color = '#ff9800';
      } else if (stats.totalCalls <= 5) {
        level = '中等活跃';
        color = '#2196f3';
      } else {
        level = '高活跃';
        color = '#4caf50';
      }

      return {
        ...student,
        ...stats,
        activityLevel: level,
        activityColor: color
      };
    });

    const activityCounts = {
      '未参与': studentActivity.filter(s => s.activityLevel === '未参与').length,
      '低活跃': studentActivity.filter(s => s.activityLevel === '低活跃').length,
      '中等活跃': studentActivity.filter(s => s.activityLevel === '中等活跃').length,
      '高活跃': studentActivity.filter(s => s.activityLevel === '高活跃').length
    };

    return { studentActivity, activityCounts };
  }, [students, getStudentStats]);

  return (
    <div className="statistics">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>统计报告</h2>

      {/* 整体统计概览 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{overallStats.totalStudents}</div>
          <div className="stat-label">总学生数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{overallStats.totalParticipations}</div>
          <div className="stat-label">总参与次数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{overallStats.activeStudents}</div>
          <div className="stat-label">活跃学生数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{overallStats.participationRate}%</div>
          <div className="stat-label">参与率</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{overallStats.overallCorrectRate}%</div>
          <div className="stat-label">整体正确率</div>
        </div>
      </div>

      {/* 回答类型分布 */}
      {responseDistribution.length > 0 && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '15px', color: '#333' }}>回答类型分布</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
            {responseDistribution.map(item => (
              <div key={item.type} style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: item.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                  margin: '0 auto 10px'
                }}>
                  {item.percentage}%
                </div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{item.type}</div>
                <div style={{ color: '#666', fontSize: '0.9em' }}>{item.count} 次</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 最近7天趋势 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>最近7天参与趋势</h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '10px', height: '200px', padding: '10px 0' }}>
          {weeklyTrend.map((day, index) => {
            const maxCount = Math.max(...weeklyTrend.map(d => d.count), 1);
            const height = (day.count / maxCount) * 150;
            
            return (
              <div key={index} style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                minWidth: '60px'
              }}>
                <div style={{
                  width: '100%',
                  height: `${height}px`,
                  backgroundColor: day.count > 0 ? '#2196f3' : '#e0e0e0',
                  borderRadius: '4px 4px 0 0',
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.8em',
                  fontWeight: 'bold',
                  paddingBottom: '5px',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  title: `${day.fullDate}: ${day.count}次参与`
                }}>
                  {day.count > 0 && day.count}
                </div>
                <div style={{ 
                  marginTop: '8px', 
                  fontSize: '0.8em', 
                  color: '#666',
                  textAlign: 'center'
                }}>
                  {day.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 学生活跃度分析 */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>学生活跃度分析</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          {Object.entries(activityAnalysis.activityCounts).map(([level, count]) => (
            <div key={level} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#2196f3' }}>{count}</div>
              <div style={{ color: '#666' }}>{level}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 学生排名 */}
      <div className="history-table">
        <h3 style={{ margin: '20px 0 15px 0', color: '#333' }}>学生参与排名</h3>
        {studentRankings.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666'
          }}>
            暂无学生数据
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>排名</th>
                <th>学生姓名</th>
                <th>学号</th>
                <th>被叫次数</th>
                <th>正确次数</th>
                <th>错误次数</th>
                <th>未回应次数</th>
                <th>正确率</th>
                <th>活跃度</th>
              </tr>
            </thead>
            <tbody>
              {studentRankings.map((student, index) => {
                const activity = activityAnalysis.studentActivity.find(s => s.id === student.id);
                return (
                  <tr key={student.id}>
                    <td style={{ fontWeight: 'bold', color: '#2196f3' }}>
                      {index + 1}
                    </td>
                    <td><strong>{student.name}</strong></td>
                    <td style={{ color: '#666' }}>{student.studentId}</td>
                    <td>{student.totalCalls}</td>
                    <td style={{ color: '#4caf50' }}>{student.correctAnswers}</td>
                    <td style={{ color: '#f44336' }}>{student.incorrectAnswers}</td>
                    <td style={{ color: '#ff9800' }}>{student.noResponses}</td>
                    <td>
                      <span style={{ 
                        fontWeight: 'bold',
                        color: parseFloat(student.successRate) >= 70 ? '#4caf50' : 
                               parseFloat(student.successRate) >= 50 ? '#ff9800' : '#f44336'
                      }}>
                        {student.successRate}%
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '0.8em',
                        fontWeight: 'bold',
                        backgroundColor: activity?.activityColor + '20',
                        color: activity?.activityColor
                      }}>
                        {activity?.activityLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 使用建议 */}
      {overallStats.totalParticipations > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          borderLeft: '4px solid #2196f3'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>📊 数据洞察与建议</h4>
          <ul style={{ margin: 0, paddingLeft: '20px', color: '#666' }}>
            {overallStats.participationRate < 50 && (
              <li>参与率较低({overallStats.participationRate}%)，建议多关注未参与的学生</li>
            )}
            {overallStats.overallCorrectRate < 60 && (
              <li>整体正确率偏低({overallStats.overallCorrectRate}%)，可能需要调整教学方法或问题难度</li>
            )}
            {activityAnalysis.activityCounts['未参与'] > 0 && (
              <li>有 {activityAnalysis.activityCounts['未参与']} 名学生尚未参与，建议主动邀请他们回答问题</li>
            )}
            {activityAnalysis.activityCounts['高活跃'] > 0 && (
              <li>有 {activityAnalysis.activityCounts['高活跃']} 名高活跃学生，可以考虑让他们帮助其他同学</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Statistics;
