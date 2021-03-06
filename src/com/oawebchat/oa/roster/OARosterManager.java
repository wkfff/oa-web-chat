package com.oawebchat.oa.roster;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.vysper.xmpp.addressing.Entity;
import org.apache.vysper.xmpp.addressing.EntityFormatException;
import org.apache.vysper.xmpp.addressing.EntityImpl;
import org.apache.vysper.xmpp.modules.ServerRuntimeContextService;
import org.apache.vysper.xmpp.modules.roster.MutableRoster;
import org.apache.vysper.xmpp.modules.roster.Roster;
import org.apache.vysper.xmpp.modules.roster.RosterException;
import org.apache.vysper.xmpp.modules.roster.RosterGroup;
import org.apache.vysper.xmpp.modules.roster.RosterItem;
import org.apache.vysper.xmpp.modules.roster.SubscriptionType;
import org.apache.vysper.xmpp.modules.roster.persistence.RosterManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.oawebchat.oa.roster.dao.IOARosterDAO;
import com.oawebchat.oa.roster.dao.IOARosterGroupDAO;
import com.oawebchat.oa.roster.vo.OARoster;
import com.oawebchat.oa.roster.vo.OARosterGroup;
import com.oawebchat.utils.UUIDGenerator;

//OA联系人接口
public class OARosterManager implements RosterManager,
		ServerRuntimeContextService {

	public final static String SERVER_SERVICE_ROSTERMANAGER = "oaRosterManager";

	private final static Logger logger = LoggerFactory
			.getLogger(OARosterManager.class);
	@Autowired
	IOARosterDAO oaRosterDAO;// 联系人操作
	@Autowired
	IOARosterGroupDAO oaRosterGroupDAO;// 联系人分组操作

	//取得服务ID
	@Override
	public String getServiceName() {
		// TODO Auto-generated method stub
		return "oaRosterManager";
	}

	
	//添加联系人操作
	@Override
	public void addContact(Entity entity, RosterItem rosterItem)
			throws RosterException {
		// TODO Auto-generated method stub

		OARoster roster = null;

		List<OARoster> rosterList = null;
		try {// 已保存的联系人
			rosterList = oaRosterDAO.getRosterList(entity.getBareJID()
					.toString(), rosterItem.getJid().getBareJID().toString());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("", e);
		}

		if (rosterList != null && rosterList.size() > 0) {
			roster = rosterList.get(0);
		} else {

			roster = new OARoster();

			roster.setId(UUIDGenerator.generate());// uuid
			roster.setCreateddatetime(new Timestamp(new Date().getTime()));// 创建时间
			roster.setJid(entity.getBareJID().toString());// 本用户JID
			roster.setContact(rosterItem.getJid().toString());// 联系人JID
		}
		List<RosterGroup> groupList = rosterItem.getGroups();// 分组

		List<OARosterGroup> oaGroupList = new ArrayList<OARosterGroup>();// 数据库存储分组
		if (groupList != null && groupList.size() > 0) {
			for (RosterGroup group : groupList) {
				OARosterGroup oag = new OARosterGroup();
				oag.setId(UUIDGenerator.generate());
				oag.setRosterid(roster.getId());// 联系人数据库ID
				oag.setGroupname(group.getName());// 分组名称

				oaGroupList.add(oag);
			}
		}

		try {// 保存联系人
			oaRosterDAO.saveRoster(roster);
			oaRosterGroupDAO.deleteRosterGroup(roster.getId());// 删除联系人分组
			oaRosterGroupDAO.saveRosterGroupList(oaGroupList);// 保存联系人分组
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("", e);
		}

	}

	//返回联系人对象
	@Override
	public RosterItem getContact(Entity jid, Entity rosterItem)
			throws RosterException {
		// TODO Auto-generated method stub
		try {
			return  new RosterItem(EntityImpl.parse(rosterItem.getBareJID().toString()), SubscriptionType.BOTH);
		} catch (EntityFormatException e) {
			// TODO Auto-generated catch block
			throw new RosterException("JID 解析错误");
		}
	}

	//删除联系人
	@Override
	public void removeContact(Entity jidUser, Entity jidContact)
			throws RosterException {
		// TODO Auto-generated method stub

		List<OARoster> rosterList = null;
		try {// 已保存的联系人
			rosterList = oaRosterDAO.getRosterList(jidUser.getBareJID()
					.toString(), jidContact.getBareJID().toString());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("", e);
		}

		if (rosterList != null && rosterList.size() > 0) {
			OARoster roster = rosterList.get(0);
			
			try {
				oaRosterGroupDAO.deleteRosterGroup(roster.getId());// 删除联系人分组
				
				oaRosterDAO.deleteRoster(roster);//删除联系人
			} catch (Exception e) {
				// TODO Auto-generated catch block
				logger.error("",e);
			}
		}
	}

	@Override
	public Roster retrieve(Entity jid) throws RosterException {
		// TODO Auto-generated method stub
		// TODO Auto-generated method stub
		MutableRoster roster = new MutableRoster();// 联系人集合

		// 联系人数据库查询列表
		List<OARoster> rosterList = null;
		try {
			rosterList = oaRosterDAO.getRosterList(jid.getBareJID().toString());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			logger.error("", e);
		}

		if (rosterList != null && rosterList.size() > 0) {
			for (OARoster r : rosterList) {
				try {
					RosterItem item = new RosterItem(EntityImpl.parse(r
							.getContact()), SubscriptionType.BOTH);// 构造联系人对象
					
					List<OARosterGroup> groupList=null;//分组列表
					
					try {
						groupList=oaRosterGroupDAO.getRosterGroupList(r.getId());
					} catch (Exception e) {
						// TODO Auto-generated catch block
						logger.error("",e);
					}
					
					//输出联系人分组
					if(groupList!=null && groupList.size()>0){
						List<RosterGroup>  gList =new ArrayList<RosterGroup>();
						for(OARosterGroup group :groupList){
							RosterGroup g =new RosterGroup(group.getGroupname());
							gList.add(g);
						}
						item.setGroups(gList);
					}

					roster.addItem(item);
				} catch (EntityFormatException e) {
					// TODO Auto-generated catch block
					logger.error("", e);
				}

			}
		}

		return roster;
	}

}
