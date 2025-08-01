import React, { useState, useEffect } from 'react';

function App() {
  const [formData, setFormData] = useState({
    company: '', title: '', location: '',
    salary: '', contact: '', remote: '',
    requirements: '', notes: ''
  });
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const webhookUrl = 'https://script.google.com/macros/s/AKfycbwPQQeqE3TBni3iML4yRH2RfPsQfLewMOWE1mXVlAFTn6a7tvAQaejv9Cu2fJ4BjLRP/exec';

  const sheetJsonUrl = 'https://opensheet.elk.sh/1qttA9chHlsxeex-WLIt3lsExBYi4ws2ZGdyYcm4csoY/工作表1';

  const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value});
  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(formData)
      });
      setFormData({company:'',title:'',location:'',salary:'',contact:'',remote:'',requirements:'',notes:''});
      fetchJobs();
    } catch {
      setError('❌ 上傳失敗');
    }
    setLoading(false);
  };

  const fetchJobs = async () => {
    try {
      const res = await fetch(sheetJsonUrl);
      const data = await res.json();
      setJobs(data.reverse());
    } catch {
      setError('❌ 無法讀取職缺資料');
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div style={{ margin:'1rem' }}>
      <h1>職缺平台</h1>
      <input name="company" placeholder="公司" value={formData.company} onChange={handleChange} /><br/>
      {/* ...其餘輸入欄位類似 */}
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '上傳中...' : '上傳職缺'}
      </button>
      {error && <div style={{color:'red'}}>{error}</div>}
      <hr/>
      <h2>職缺列表</h2>
      {jobs.map((job,i)=>(
        <div key={i} style={{border:'1px solid #ccc',padding:'0.5rem',margin:'0.5rem 0'}}>
          <strong>{job.title} @ {job.company}</strong><br/>
          地點: {job.location} | 薪資: {job.salary}<br/>
          聯絡: {job.contact} | 遠端: {job.remote}<br/>
          要求: {job.requirements}<br/>
          補充: {job.notes}
        </div>
      ))}
    </div>
  );
}

export default App;
