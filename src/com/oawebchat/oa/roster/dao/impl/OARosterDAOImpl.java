package com.oawebchat.oa.roster.dao.impl;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.oawebchat.oa.roster.dao.IOARosterDAO;
import com.oawebchat.oa.roster.vo.OARoster;
import com.oawebchat.orm.hibernate.HibernateDao;

//OA联系人操作
@Repository
public class OARosterDAOImpl extends HibernateDao<OARoster,String> implements IOARosterDAO {
	@Autowired
	@Qualifier("sqlSession")
	private SqlSession sqlSession;// DB数据库ibatis
	// 联系人列表
	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public List<OARoster> getRosterList(String jid) throws Exception {
		// TODO Auto-generated method stub
		//return this.find("from OARoster where jid=?", jid);
		return sqlSession.selectList("com.oawebchat.roster.getRosterList", jid);
	}
	
	//联系人列表
	@Transactional
	public List<OARoster>  getRosterList(String jid, String contact) throws Exception{
		return this.find("from OARoster where jid=?  and  contact=?", jid,contact );
	}
	
	//保存联系人
	@Transactional
	public void saveRoster(OARoster roster) throws Exception{
		this.save(roster);
	}

	//删除联系人
	@Transactional
	public void deleteRoster(OARoster roster) throws Exception{
		this.delete(roster);
	}
}
