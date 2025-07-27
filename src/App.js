import React, { useState, useEffect } from 'react';
import './App.css';
import StudentManager from './components/StudentManager';
import RandomSelector from './components/RandomSelector';
import ParticipationTracker from './components/ParticipationTracker';
import Statistics from './components/Statistics';

function App() {
  const [students, setStudents] = useState([]);
  const [participationHistory, setParticipationHistory] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('selector');
  const [isLoading, setIsLoading] = useState(true);

  // 加载数据
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (window.electronAPI) {
        const data = await window.electronAPI.loadData();
        setStudents(data.students || []);
        setParticipationHistory(data.participationHistory || []);
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async () => {
    try {
      if (window.electronAPI) {
        await window.electronAPI.saveData({
          students,
          participationHistory
        });
      }
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 自动保存数据
  useEffect(() => {
    if (!isLoading) {
      saveData();
    }
  }, [students, participationHistory, isLoading]);

  const addStudent = (student) => {
    const newStudent = {
      id: Date.now().toString(),
      ...student,
      createdAt: new Date().toISOString()
    };
    setStudents([...students, newStudent]);
  };

  const updateStudent = (id, updatedStudent) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(students.filter(student => student.id !== id));
    // 同时删除相关的参与记录
    setParticipationHistory(participationHistory.filter(record => record.studentId !== id));
  };

  const selectRandomStudent = () => {
    if (students.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * students.length);
    const selected = students[randomIndex];
    setSelectedStudent(selected);
    return selected;
  };

  const recordParticipation = (studentId, response, notes = '') => {
    const record = {
      id: Date.now().toString(),
      studentId,
      timestamp: new Date().toISOString(),
      response,
      notes
    };
    setParticipationHistory([...participationHistory, record]);
  };

  const getStudentStats = (studentId) => {
    const studentRecords = participationHistory.filter(record => record.studentId === studentId);
    const totalCalls = studentRecords.length;
    const correctAnswers = studentRecords.filter(record => record.response === 'correct').length;
    const incorrectAnswers = studentRecords.filter(record => record.response === 'incorrect').length;
    const noResponses = studentRecords.filter(record => record.response === 'no-response').length;
    
    return {
      totalCalls,
      correctAnswers,
      incorrectAnswers,
      noResponses,
      successRate: totalCalls > 0 ? (correctAnswers / totalCalls * 100).toFixed(1) : 0
    };
  };

  if (isLoading) {
    return (
      <div className="app">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2em',
          color: '#666'
        }}>
          正在加载数据...
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header style={{
        backgroundColor: '#2196f3',
        color: 'white',
        padding: '15px 20px',
        fontSize: '1.5em',
        fontWeight: 'bold',
        textAlign: 'center'
      }}>
        学生参与管理器
      </header>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'selector' ? 'active' : ''}`}
          onClick={() => setActiveTab('selector')}
        >
          随机选择
        </div>
        <div 
          className={`tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          参与追踪
        </div>
        <div 
          className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          统计报告
        </div>
      </div>

      <div className="main-content">
        <div className="sidebar">
          <StudentManager
            students={students}
            onAddStudent={addStudent}
            onUpdateStudent={updateStudent}
            onDeleteStudent={deleteStudent}
            getStudentStats={getStudentStats}
          />
        </div>
        
        <div className="content-area">
          {activeTab === 'selector' && (
            <RandomSelector
              students={students}
              selectedStudent={selectedStudent}
              onSelectStudent={selectRandomStudent}
              onRecordParticipation={recordParticipation}
            />
          )}
          
          {activeTab === 'tracker' && (
            <ParticipationTracker
              students={students}
              participationHistory={participationHistory}
              getStudentStats={getStudentStats}
            />
          )}
          
          {activeTab === 'statistics' && (
            <Statistics
              students={students}
              participationHistory={participationHistory}
              getStudentStats={getStudentStats}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
