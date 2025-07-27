import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';

const ParticipationTracker = ({ students, participationHistory, getStudentStats }) => {
  const [selectedStudentId, setSelectedStudentId] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [responseFilter, setResponseFilter] = useState('all');

  // 过滤后的参与记录
  const filteredHistory = useMemo(() => {
    let filtered = [...participationHistory];

    // 按学生过滤
    if (selectedStudentId !== 'all') {
      filtered = filtered.filter(record => record.studentId === selectedStudentId);
    }

    // 按日期过滤
    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(record => 
            new Date(record.timestamp) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(record => 
            new Date(record.timestamp) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(record => 
            new Date(record.timestamp) >= filterDate
          );
          break;
        default:
          break;
      }
    }

    // 按回答类型过滤
    if (responseFilter !== 'all') {
      filtered = filtered.filter(record => record.response === responseFilter);
    }

    // 按时间倒序排列
    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [participationHistory, selectedStudentId, dateFilter, responseFilter]);

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : '未知学生';
  };

  const getStudentById = (studentId) => {
    return students.find(s => s.id === studentId);
  };

  const formatDateTime = (timestamp) => {
    try {
      return format(new Date(timestamp), 'yyyy年MM月dd日 HH:mm:ss');
    } catch (error) {
      return '无效日期';
    }
  };

  const getResponseBadge = (response) => {
    const badges = {
      'correct': { text: '正确', class: 'correct' },
      'incorrect': { text: '错误', class: 'incorrect' },
      'no-response': { text: '未回应', class: 'no-response' }
    };
    
    const badge = badges[response] || { text: '未知', class: 'no-response' };
    return (
      <span className={`response-badge ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  // 统计数据
  const stats = useMemo(() => {
    const total = filteredHistory.length;
    const correct = filteredHistory.filter(r => r.response === 'correct').length;
    const incorrect = filteredHistory.filter(r => r.response === 'incorrect').length;
    const noResponse = filteredHistory.filter(r => r.response === 'no-response').length;
    
    return {
      total,
      correct,
      incorrect,
      noResponse,
      correctRate: total > 0 ? ((correct / total) * 100).toFixed(1) : 0
    };
  }, [filteredHistory]);

  return (
    <div className="participation-tracker">
      <h2 style={{ marginBottom: '20px', color: '#333' }}>参与记录追踪</h2>

      {/* 过滤器 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div className="form-group">
          <label>选择学生:</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="all">所有学生</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} ({student.studentId})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>时间范围:</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="all">全部时间</option>
            <option value="today">今天</option>
            <option value="week">最近一周</option>
            <option value="month">最近一月</option>
          </select>
        </div>

        <div className="form-group">
          <label>回答类型:</label>
          <select
            value={responseFilter}
            onChange={(e) => setResponseFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            <option value="all">所有类型</option>
            <option value="correct">回答正确</option>
            <option value="incorrect">回答错误</option>
            <option value="no-response">未回应</option>
          </select>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">总记录数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#4caf50' }}>{stats.correct}</div>
          <div className="stat-label">正确回答</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#f44336' }}>{stats.incorrect}</div>
          <div className="stat-label">错误回答</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#ff9800' }}>{stats.noResponse}</div>
          <div className="stat-label">未回应</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#2196f3' }}>{stats.correctRate}%</div>
          <div className="stat-label">正确率</div>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="history-table">
        <h3 style={{ 
          margin: '20px 0 15px 0', 
          color: '#333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          参与记录详情
          <span style={{ fontSize: '0.8em', fontWeight: 'normal', color: '#666' }}>
            共 {filteredHistory.length} 条记录
          </span>
        </h3>
        
        {filteredHistory.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#666',
            backgroundColor: 'white',
            borderRadius: '8px'
          }}>
            {participationHistory.length === 0 ? 
              '暂无参与记录，开始随机选择学生并记录回答情况吧！' : 
              '没有符合筛选条件的记录'
            }
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>时间</th>
                <th>学生</th>
                <th>学号</th>
                <th>回答情况</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(record => {
                const student = getStudentById(record.studentId);
                return (
                  <tr key={record.id}>
                    <td style={{ fontSize: '0.9em' }}>
                      {formatDateTime(record.timestamp)}
                    </td>
                    <td>
                      <strong>{getStudentName(record.studentId)}</strong>
                    </td>
                    <td style={{ color: '#666' }}>
                      {student ? student.studentId : '未知'}
                    </td>
                    <td>
                      {getResponseBadge(record.response)}
                    </td>
                    <td style={{ 
                      maxWidth: '200px', 
                      wordBreak: 'break-word',
                      fontSize: '0.9em',
                      color: '#666'
                    }}>
                      {record.notes || '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* 导出功能提示 */}
      {filteredHistory.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '0.9em',
          color: '#1976d2'
        }}>
          💡 提示：您可以通过菜单栏的"文件" → "导出数据"功能导出所有数据进行备份或进一步分析。
        </div>
      )}
    </div>
  );
};

export default ParticipationTracker;
