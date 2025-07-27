import React, { useState } from 'react';

const StudentManager = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent, getStudentStats }) => {
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentId: '',
    email: '',
    notes: ''
  });
  const [editingStudent, setEditingStudent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStudent.name.trim() || !newStudent.studentId.trim()) {
      alert('请填写学生姓名和学号');
      return;
    }

    // 检查学号是否重复
    if (students.some(student => student.studentId === newStudent.studentId.trim())) {
      alert('该学号已存在');
      return;
    }

    onAddStudent({
      name: newStudent.name.trim(),
      studentId: newStudent.studentId.trim(),
      email: newStudent.email.trim(),
      notes: newStudent.notes.trim()
    });

    setNewStudent({ name: '', studentId: '', email: '', notes: '' });
    setShowAddForm(false);
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!editingStudent.name.trim() || !editingStudent.studentId.trim()) {
      alert('请填写学生姓名和学号');
      return;
    }

    // 检查学号是否与其他学生重复
    if (students.some(student => 
      student.id !== editingStudent.id && 
      student.studentId === editingStudent.studentId.trim()
    )) {
      alert('该学号已存在');
      return;
    }

    onUpdateStudent(editingStudent.id, {
      name: editingStudent.name.trim(),
      studentId: editingStudent.studentId.trim(),
      email: editingStudent.email.trim(),
      notes: editingStudent.notes.trim()
    });

    setEditingStudent(null);
  };

  const handleDelete = (student) => {
    if (window.confirm(`确定要删除学生 "${student.name}" 吗？这将同时删除其所有参与记录。`)) {
      onDeleteStudent(student.id);
    }
  };

  return (
    <div className="student-manager">
      <div style={{ 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, color: '#333' }}>
          学生列表 ({students.length})
        </h3>
        <button
          className="btn btn-primary btn-small"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '取消' : '添加学生'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-student-form">
          <h4 style={{ marginTop: 0, color: '#333' }}>添加新学生</h4>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>姓名 *</label>
              <input
                type="text"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="请输入学生姓名"
                required
              />
            </div>
            <div className="form-group">
              <label>学号 *</label>
              <input
                type="text"
                value={newStudent.studentId}
                onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                placeholder="请输入学号"
                required
              />
            </div>
            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="请输入邮箱地址"
              />
            </div>
            <div className="form-group">
              <label>备注</label>
              <input
                type="text"
                value={newStudent.notes}
                onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
                placeholder="备注信息"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn btn-primary">
                添加
              </button>
              <button 
                type="button" 
                className="btn" 
                onClick={() => setShowAddForm(false)}
                style={{ backgroundColor: '#6c757d', color: 'white' }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="student-list">
        {students.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            暂无学生数据<br />
            点击"添加学生"开始使用
          </div>
        ) : (
          students.map(student => {
            const stats = getStudentStats(student.id);
            return (
              <div key={student.id} className="student-item">
                {editingStudent && editingStudent.id === student.id ? (
                  <form onSubmit={handleUpdateSubmit} style={{ width: '100%' }}>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                      <input
                        type="text"
                        value={editingStudent.name}
                        onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                        placeholder="姓名"
                        required
                        style={{ marginBottom: '5px' }}
                      />
                      <input
                        type="text"
                        value={editingStudent.studentId}
                        onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value })}
                        placeholder="学号"
                        required
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button type="submit" className="btn btn-primary btn-small">
                        保存
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-small"
                        onClick={() => setEditingStudent(null)}
                        style={{ backgroundColor: '#6c757d', color: 'white' }}
                      >
                        取消
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                      <div className="student-id">学号: {student.studentId}</div>
                      {student.email && (
                        <div className="student-id">邮箱: {student.email}</div>
                      )}
                    </div>
                    <div className="student-stats">
                      <div>被叫: {stats.totalCalls}次</div>
                      <div>正确率: {stats.successRate}%</div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                        <button
                          className="btn btn-primary btn-small"
                          onClick={() => handleEdit(student)}
                        >
                          编辑
                        </button>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(student)}
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentManager;
