import React, { useState, useEffect } from 'react';

const RandomSelector = ({ students, selectedStudent, onSelectStudent, onRecordParticipation }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [showResponseButtons, setShowResponseButtons] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectionHistory, setSelectionHistory] = useState([]);

  useEffect(() => {
    if (selectedStudent) {
      setShowResponseButtons(true);
      setNotes('');
    }
  }, [selectedStudent]);

  const handleRandomSelect = () => {
    if (students.length === 0) {
      alert('请先添加学生');
      return;
    }

    setIsSelecting(true);
    setShowResponseButtons(false);
    
    // 模拟随机选择动画
    let count = 0;
    const maxCount = 20; // 动画次数
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * students.length);
      const tempStudent = students[randomIndex];
      
      // 临时显示随机学生
      document.querySelector('.selected-student').textContent = tempStudent.name;
      
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        
        // 最终选择
        const finalStudent = onSelectStudent();
        if (finalStudent) {
          setSelectionHistory(prev => [finalStudent, ...prev.slice(0, 4)]); // 保留最近5次
        }
        setIsSelecting(false);
      }
    }, 100);
  };

  const handleResponse = (response) => {
    if (!selectedStudent) return;

    onRecordParticipation(selectedStudent.id, response, notes);
    setShowResponseButtons(false);
    setNotes('');
    
    // 显示反馈
    const responseText = {
      'correct': '回答正确！',
      'incorrect': '回答错误',
      'no-response': '未回应'
    };
    
    alert(`${selectedStudent.name} - ${responseText[response]}`);
  };

  const getStudentCallCount = (studentId) => {
    return selectionHistory.filter(student => student.id === studentId).length;
  };

  return (
    <div className="random-selector">
      <div className="random-selection-area">
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.8em' }}>随机选择学生</h2>
        
        <div className="selected-student">
          {selectedStudent ? selectedStudent.name : '点击下方按钮开始选择'}
        </div>
        
        <div>
          <button
            className="random-button"
            onClick={handleRandomSelect}
            disabled={isSelecting || students.length === 0}
          >
            {isSelecting ? '选择中...' : '🎲 随机选择'}
          </button>
        </div>

        {selectedStudent && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            borderRadius: '8px',
            fontSize: '1.1em'
          }}>
            <div><strong>学号:</strong> {selectedStudent.studentId}</div>
            {selectedStudent.email && (
              <div><strong>邮箱:</strong> {selectedStudent.email}</div>
            )}
            {selectedStudent.notes && (
              <div><strong>备注:</strong> {selectedStudent.notes}</div>
            )}
          </div>
        )}

        {showResponseButtons && selectedStudent && (
          <div className="response-section" style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '15px', fontSize: '1.3em' }}>记录回答情况</h3>
            
            <div className="response-buttons">
              <button
                className="response-button correct"
                onClick={() => handleResponse('correct')}
              >
                ✓ 回答正确
              </button>
              <button
                className="response-button incorrect"
                onClick={() => handleResponse('incorrect')}
              >
                ✗ 回答错误
              </button>
              <button
                className="response-button no-response"
                onClick={() => handleResponse('no-response')}
              >
                ⚪ 未回应
              </button>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '1em',
                fontWeight: 'bold'
              }}>
                备注 (可选):
              </label>
              <textarea
                className="notes-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="记录回答质量、表现等..."
                rows="3"
              />
            </div>
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div className="stat-card">
          <div className="stat-number">{students.length}</div>
          <div className="stat-label">总学生数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{selectionHistory.length}</div>
          <div className="stat-label">本次会话选择次数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {students.length > 0 ? Math.round((new Set(selectionHistory.map(s => s.id)).size / students.length) * 100) : 0}%
          </div>
          <div className="stat-label">学生覆盖率</div>
        </div>
      </div>

      {/* 最近选择历史 */}
      {selectionHistory.length > 0 && (
        <div className="recent-selections">
          <h3 style={{ marginBottom: '15px', color: '#333' }}>最近选择记录</h3>
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>序号</th>
                  <th>学生姓名</th>
                  <th>学号</th>
                  <th>本次被选次数</th>
                </tr>
              </thead>
              <tbody>
                {selectionHistory.map((student, index) => (
                  <tr key={`${student.id}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.studentId}</td>
                    <td>{getStudentCallCount(student.id)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      {students.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          color: '#666',
          fontSize: '1.1em'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>开始使用</h3>
          <p>请先在左侧添加学生信息，然后就可以开始随机选择了！</p>
          <p style={{ fontSize: '0.9em', marginTop: '15px' }}>
            💡 提示：选择学生后，记得记录他们的回答情况以便后续统计分析
          </p>
        </div>
      )}
    </div>
  );
};

export default RandomSelector;
