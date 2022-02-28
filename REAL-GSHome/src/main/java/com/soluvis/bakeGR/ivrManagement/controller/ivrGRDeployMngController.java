package com.soluvis.bakeGR.ivrManagement.controller;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.chequer.axboot.core.api.response.ApiResponse;
import com.chequer.axboot.core.code.AXBootTypes;
import com.chequer.axboot.core.controllers.BaseController;
import com.soluvis.bake.common.controller.commController;
import com.soluvis.bake.common.utils.RequestUtil;
import com.soluvis.bake.ivrManagement.util.SFTPUtil;
import com.soluvis.bake.system.domain.user.MDCLoginUser;
import com.soluvis.bake.system.utils.SessionUtils;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployFile;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRDeployMng;
import com.soluvis.bakeGR.ivrManagement.domain.ivrGRUrlList;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRDeployMngService;
import com.soluvis.bakeGR.ivrManagement.service.ivrGRUrlListService;

/** 
 * @author riverBST
 * @desc   IVR 시나리오 배포 관리.
 */
@Controller
@RequestMapping(value = "/gr/api/ivr/ivrDeployMng")
public class ivrGRDeployMngController extends commController{
	
	@Inject
	private ivrGRDeployMngService ivrGRDeployMngService;	
	
	@Inject
	private ivrGRUrlListService ivrGRUrlListService;
	
	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
	
	MDCLoginUser loginUser;
	
	SseEmitter emitter = null;
	
	/** 
	 * @desc 공통코드 확인 및 세팅
	 */
	@RequestMapping(value="/DeployMngCodeCheck", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody ApiResponse DeployMngCodeCheck(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<>();
		Map<String, String> codeMap = new HashMap<>(); 
		List<Map<String, Object>> search = null;
		String resultMsg = "";
		try
		{	
			logger.info("ivrGRDeployMngService.DeployMngCodeCheck Query Start...");		
			search = ivrGRDeployMngService.DeployMngCodeCheck(map);
			
			for (int i = 0; i < search.size(); i++) {
				Map<String, Object> dataMap = search.get(i);
				
				String code = dataMap.get("CODE").toString();
				String name = dataMap.get("NAME").toString();
				codeMap.put(code, name);
			}
			
			if(codeMap.get("PATH_UPLOAD") != null){
				SFTPUtil.setUploadPath(codeMap.get("PATH_UPLOAD").toString());
			}
			if(codeMap.get("PATH_BACKUP") != null){
				SFTPUtil.setBackupPath(codeMap.get("PATH_BACKUP").toString());
			}
			if(codeMap.get("PATH_DEPLOY") != null){
				SFTPUtil.setDeployPath(codeMap.get("PATH_DEPLOY").toString());
			}
			if(codeMap.get("USERNAME") != null){
				SFTPUtil.setUser(codeMap.get("USERNAME").toString());
			}
			if(codeMap.get("PASSWORD") != null){
				SFTPUtil.setPassword(codeMap.get("PASSWORD").toString());
			}
			if(codeMap.get("HOST_P") != null){
				SFTPUtil.setIp_p(codeMap.get("HOST_P").toString());
			}
			if(codeMap.get("HOST_B") != null){
				SFTPUtil.setIp_b(codeMap.get("HOST_B").toString());
			}
			if(codeMap.get("PORT_SFTP") != null){
				SFTPUtil.setPort(Integer.parseInt(codeMap.get("PORT_SFTP").toString()));
			}
			if(SFTPUtil.checkInfo()){
				resultMsg = "success";
			}else{
				resultMsg = "fail";
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		return ok(resultMsg);
	}
	
	/** 
	 * @desc 스피너 돌리기용 더미 API.
	 */
	@RequestMapping(value="/DeployMngDummy", method = RequestMethod.POST, produces = APPLICATION_JSON)
	public @ResponseBody ApiResponse DeployMngDummy(HttpServletRequest request) throws Exception {
		return ok();
	}
	
	/** 
	 * @desc 배포 현황 확인 용 에미터
	 */
	@RequestMapping("/ConnectEmitter") 
	public SseEmitter emitterTest(HttpServletRequest req) { 
		emitter = new SseEmitter(-1L);
		return emitter; 
	}
	
	/** 
	 * @desc 배포관리 목록을 조회합니다.
	 */
	@RequestMapping(value="/DeployMngSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRDeployMng> DeployMngSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = RequestUtil.getParameterMap(request); 
		
		List<ivrGRDeployMng> search = null;
		
		try
		{	
			if(map.get("step") != null){
				String strStepList = map.get("step").toString();
				if(strStepList != null){
					List<String> stepList = new ArrayList<String>();
					String[] splitStrStepList = strStepList.split(",");
					for (int i = 0; i < splitStrStepList.length; i++) {
						stepList.add(splitStrStepList[i]);
					}
					map.put("stepList", stepList);
				}
			}
			
			logger.info("ivrGRDeployMngService.DeployMngGet Query Start...");		
			search = ivrGRDeployMngService.DeployMngGet(map);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		
		return search;
	}
	
	/** 
	 * @desc 배포관리 목록을 저장
	 */
	@RequestMapping(value = "/DeployMngSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngSave(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		int result = 0; 
		int sqlrst = 0;
		String msg = "success";
		
		try
		{
			for (ivrGRDeployMng dm : deployMng)
			{
				if(AXBootTypes.DataStatus.CREATED.equals(dm.getDataStatus()))
				{		
					map.put("directory", dm.getDirectory());
					map.put("filename", dm.getFilename());
					map.put("filesize", dm.getFilesize());
					map.put("description", dm.getDescription());
					map.put("step", '0');
					map.put("uuid", dm.getUuid());
					map.put("work_flag", "Y");
					map.put("crt_dt", sdf.format(new Date()));
					map.put("crt_by", cid);
					
					logger.info("ivrGRDeployMngService.DeployMngIst Query Start...");
					sqlrst = ivrGRDeployMngService.DeployMngIst(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(dm.getDataStatus()))
				{
					map.put("seq", dm.getSeq());
					map.put("directory", dm.getDirectory());
					map.put("filename", dm.getFilename());
					map.put("filesize", dm.getFilesize());
					map.put("description", dm.getDescription());
					map.put("step", dm.getStep());
					map.put("uuid", dm.getUuid());
					map.put("work_flag", dm.getWork_flag());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRDeployMngService.DeployMngUdt Query Start...");
					sqlrst = ivrGRDeployMngService.DeployMngUdt(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(dm.getDataStatus()))
				{
					map.put("seq", dm.getSeq());
					
					logger.info("ivrGRDeployMngService.DeployMngDel Query Start...");
					sqlrst = ivrGRDeployMngService.DeployMngDel(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}			
			}
		
			
			if(result == 0)
			{
				
			}
			else
			{
				msg = "fail - DataBase 연동 실패\n관리자에게 문의하세요.";
			}
		}
		catch(Exception e)
		{
			logger.info("DeployMngSave Fail "+e.getMessage());
			msg = "fail - "+e.getMessage();
		}
		return ok(msg);		
	}	
	
	/** 
	 * @desc 배포 파일을 조회합니다.
	 */
	@RequestMapping(value="/DeployFileSearch", method = RequestMethod.GET, produces = APPLICATION_JSON)
	public @ResponseBody List<ivrGRDeployFile> DeployFileSearch(HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>(); 
		List<ivrGRDeployFile> search = null;
		
		try
		{	
			logger.info("ivrGRDeployMngService.DeployFileSearch Query Start...");			
			search = ivrGRDeployMngService.DeployFileGet(map);
		}
		catch(Exception e)
		{
			System.out.println(e.getMessage());
		}
		
		return search;
	}
	
	/** 
	 * @desc 배포관리 파일 목록을 변경
	 */
	@RequestMapping(value = "/DeployFileSave", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployFileSave(@Valid @RequestBody List<ivrGRDeployFile> deployFile, HttpServletRequest request) throws Exception {	
		Map<String, Object> map = new HashMap<String, Object>();
		
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		int result = 0; 
		int sqlrst = 0;
		String msg = "";
		
		try
		{
			for (ivrGRDeployFile df : deployFile)
			{
				map.put("uuid", df.getUuid());
								
				if(AXBootTypes.DataStatus.CREATED.equals(df.getDataStatus()))
				{		
					map.put("filename", df.getFilename());
					map.put("filesize", df.getFilesize());
					map.put("crt_dt", sdf.format(new Date()));
					map.put("crt_by", cid);
					
					logger.info("ivrGRDeployMngService.DeployFileIst Query Start...");
					sqlrst = ivrGRDeployMngService.DeployFileIst(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.MODIFIED.equals(df.getDataStatus()))
				{
					map.put("filename", df.getFilename());
					map.put("upt_dt", sdf.format(new Date()));
					map.put("upt_by", cid);
						
					logger.info("ivrGRDeployMngService.DeployFileUdt Query Start...");
					sqlrst = ivrGRDeployMngService.DeployFileUdt(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}
				else if(AXBootTypes.DataStatus.DELETED.equals(df.getDataStatus()))
				{
					
					
					logger.info("ivrGRDeployMngService.DeployFileDel Query Start...");
					sqlrst = ivrGRDeployMngService.DeployFileDel(map);
					
					if(sqlrst == 0)
					{
						result++;
					}
				}			
			}
			if(msg.equals("")){
				msg = "success";
			}
		} catch(Exception e) {
			logger.info("DeployFileSave Fail "+e.getMessage());
			msg = "fail - "+e.getMessage();
		}
		
		if(result > 0){
			msg = "fail - DataBase 연동 실패\n관리자에게 문의하세요.";
		}
			
		return ok(msg);		
	}		
	
	/** 
	 * @desc 배포 파일을 BAKE 양쪽 서버로 업로드
	 */
	@RequestMapping(value="/DeployMngSimple", method = RequestMethod.POST)
	public @ResponseBody ApiResponse DeployMngSimple(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		DeployMngMkdir(deployMng,request);
//		DeployMngValid(deployMng,request);
		DeployMngBackup(deployMng,request);
		DeployMngDeploy(deployMng, request);
		return ok();
	}
	
	/** 
	 * @desc 배포 파일을 BAKE 양쪽 서버로 업로드
	 */
	@RequestMapping(value="/DeployFileUpload", method = RequestMethod.POST)
	public @ResponseBody ApiResponse DeployFileUpload(@RequestParam("fileList") List<MultipartFile> multipartfile, HttpServletRequest request) throws Exception {
		logger.info("DeployFileUpload... Start");
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		
		String resultMsg = "";
		
		resultMsg = DeployFileUpload(multipartfile, false);
		
		return ok(resultMsg);
		
	}
	
	/** 
	 * @desc 배포 파일을 BAKE 양쪽 서버로 업로드
	 */
	@RequestMapping(value="/DeployFileUploadSimple", method = RequestMethod.POST)
	public @ResponseBody ApiResponse DeployFileUploadSimple(@RequestParam("fileList") List<MultipartFile> multipartfile, HttpServletRequest request) throws Exception {
		logger.info("DeployFileUpload... Start");
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		
		String resultMsg = "";
		
		resultMsg = DeployFileUpload(multipartfile, true);
		
		
		return ok(resultMsg);
		
	}
	
	public String DeployFileUpload(List<MultipartFile> multipartfile, boolean simpleFlag) throws Exception {
		
		String cid = loginUser.getSessionUser().getUserCd();
		String resultMsg = "";
		SFTPUtil sFTPUtil = new SFTPUtil();
		
		resultMsg += "*업로드 결과\n";
		
		if(multipartfile.size() > 0){
			
			try {
				
				if(sFTPUtil.isOperation()){	// 개발서버의 경우 remoteIP가 없다.
					emitter.send("UPLOAD;CONNECT;"+SFTPUtil.getIp_remote());
					if(!sFTPUtil.connectSession()){
						return "SFTP 연결 실패";	
					};
					sFTPUtil.connectSFTP();
				}
				
				int fileNum = 1;
				for(MultipartFile sFile : multipartfile){
					String originFilename = sFile.getOriginalFilename();	// 파일 이름
					String uuid = UUID.randomUUID().toString();	// 같은 이름 파일 처리를 위한 UUID 생성
					System.out.println(sFile.getSize());
					
					emitter.send("UPLOAD;"+SFTPUtil.getLocalAddress()+";"+originFilename);
					logger.info("DeployFileUpload... try upload "+ originFilename+" to "+uuid);
					File tFile = new File(SFTPUtil.getUploadPath()+uuid);
					InputStream is = null;
					try{
						is = sFile.getInputStream();
						FileUtils.copyInputStreamToFile(is, tFile);
						resultMsg += Integer.toString(fileNum)+"."+originFilename+": 업로드-success";
						logger.info("DeployFileUpload... success upload "+ originFilename+" to "+uuid);
						boolean bresult = true;
						if(sFTPUtil.isOperation()){
							emitter.send("UPLOAD;SYNC-"+SFTPUtil.getIp_remote()+";"+originFilename);
							bresult = sFTPUtil.upload(uuid,uuid);
							
							if(bresult){
								resultMsg += " 동기화-success";
								logger.info("DeployFileUpload... success sync "+uuid);
							} else{
								if(simpleFlag){
									return"동기화 실패";
								}
								resultMsg += " 동기화-fail";
								resultMsg += "\n";		
								logger.info("DeployFileUpload... fail sync "+uuid);
							}
							
						}
						
						if(simpleFlag){
							// 적재한 파일 DB로 관리.
							Map<String,Object> map = new HashMap<String,Object>();
							map.put("uuid", uuid);
							map.put("filename",originFilename);
							map.put("filesize",sFile.getSize());
							map.put("step","0");
							map.put("work_flag","S");
							map.put("crt_dt", sdf.format(new Date()));
							map.put("crt_by", cid);
							
							logger.info("ivrGRDeployMngService.DeployFileIst Query Start...");
							
							int sqlrst = 0;
							sqlrst = ivrGRDeployMngService.DeployMngIst(map);
							
							if(sqlrst == 0)
							{
								resultMsg += " DBInsert-success";
							}
						}else{
							Map<String,Object> map = new HashMap<String,Object>();
							map.put("uuid", uuid);
							map.put("filename",originFilename);
							map.put("filesize",sFile.getSize());
							map.put("crt_dt", sdf.format(new Date()));
							map.put("crt_by", cid);
							
							logger.info("ivrGRDeployMngService.DeployFileIst Query Start...");
							
							int sqlrst = 0;
							sqlrst = ivrGRDeployMngService.DeployFileIst(map);
							
							if(sqlrst == 0)
							{
								resultMsg += " DBInsert-success";
							}
						}
						
						resultMsg += "\n";
						
					} catch(IOException e){
						if(simpleFlag){
							return "업로드 fail";
						}
						resultMsg += Integer.toString(fileNum)+"."+originFilename+": 업로드-fail";
						resultMsg += "\n";
						logger.info("DeployFileUpload... fail upload "+originFilename);
						logger.info(e.getMessage());
					} finally{
						fileNum++;
						if(is != null)	is.close();
					}
				}
				emitter.send("UPLOAD;END");
				Thread.sleep(300);
			} catch (Exception e) {
				logger.info("DeployFileUpload Fail :" + e.getMessage());
			} finally {
				sFTPUtil.close();
			}
		}else{
			logger.info("DeployFileUpload file is Empty...");
		}
		return resultMsg;
	}
	
	/** 
	 * @desc 배포관리 목록 정합성 검사
	 */
	@RequestMapping(value = "/DeployMngValid", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngValid(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		logger.info("DeployMngValid... Start");
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		SFTPUtil sFTPUtil = new SFTPUtil();
		
		
		String resultMsg = "";
		
		//----------------------- UUID 정합성 검사 START
		resultMsg += "*UUID 검사 결과\n";

		int result = 0; 
		int sqlrst = 0;
		
		String[] arUuid = new String[deployMng.size()];
		boolean uuidFlag = true;
		for (int i = 0; i < arUuid.length; i++) {
			Map<String,Object> param = new HashMap<String,Object>();
			String uuid = deployMng.get(i).getUuid();
			param.put("uuid", uuid);
			logger.info("ivrGRDeployMngService.DeployFileGet Query Start...");
			List<ivrGRDeployFile> list = ivrGRDeployMngService.DeployFileGet(param);
			
			if(list.size()>0){
				arUuid[i] = list.get(0).getUuid();
			} else{
				resultMsg += uuid+" - UUID가 존재하지 않습니다.\n";
				uuidFlag = false;
			}
		}
		if(!uuidFlag){
			return ok(resultMsg);
		}
		resultMsg += "success\n";
		//----------------------- UUID 정합성 검사 END
		logger.info("ivrGRUrlListService.UrlListGet Query Start...");
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRUrlList> Urlsearch = ivrGRUrlListService.UrlListGet(map);
		
		int UrlSize = Urlsearch.size();
		
		//----------------------- 디렉토리 정합성 검사 START  
		
		resultMsg += "*디렉토리 검사 결과\n";
		try {
			for (int i = 0; i < UrlSize; i++) {
				try {
					logger.info("DeployMngValid... try connect Session");
					
					emitter.send("VALID;CONNECT;"+Urlsearch.get(i).getUrl_nm());
					if(!sFTPUtil.connectSession(Urlsearch.get(i).getSvr_ip())){
						return ok("SFTP 연결 실패");	
					};
					sFTPUtil.connectSFTP();
					
					for (ivrGRDeployMng dm : deployMng) {
						String directory = dm.getDirectory();
						String fullPath = SFTPUtil.getDeployPath()+directory;
						
						emitter.send("VALID;"+Urlsearch.get(i).getUrl_nm()+";"+fullPath);
						
						boolean bResult = sFTPUtil.isExist(fullPath);
						
						if(bResult){
						} else{
							resultMsg += "디렉토리가 존재하지 않습니다.\n";
							return ok(resultMsg + "디렉토리를 생성 하시겠습니까?");
						}
						
					}
				} catch (Exception e) { 
					resultMsg += "fail - "+ e.getMessage()+"\n";
				} finally{
					sFTPUtil.close();
				}
				
			}
			emitter.send("VALID;END");
			Thread.sleep(300);
			
			resultMsg += "success\n";
			//----------------------- 디렉토리 정합성 검사 END
			
			for (ivrGRDeployMng dm : deployMng) {
				Map<String,Object> param = new HashMap<String,Object>();
				param.put("seq", dm.getSeq());
				String directory = dm.getDirectory();
				if(!directory.substring(directory.length()-1).equals("/")){
					directory = directory+"/";
				}
				param.put("directory", directory);
				param.put("filename", dm.getFilename());
				param.put("description", dm.getDescription());
				param.put("step", "1"); // 정합성완료 단계로 업데이트
				param.put("uuid", dm.getUuid());
				param.put("work_flag", dm.getWork_flag());
				param.put("upt_dt", sdf.format(new Date()));
				param.put("upt_by", cid);
				
				logger.info("ivrGRDeployMngService.DeployMngUdt Query Start...");
				sqlrst = ivrGRDeployMngService.DeployMngUdt(param);
				
				if(sqlrst == 0)
				{
					result++;
				}
			} 
			
			if(result != 0)
			{
				resultMsg = "fail - DataBase 연동 실패\n관리자에게 문의하세요.";
			}
		}
		catch(Exception e)
		{
			logger.info("DeployMngSave Fail "+e.getMessage());
			resultMsg = "fail - "+e.getMessage();
		}
		return ok(resultMsg);		
	}
	
	@RequestMapping(value = "/DeployMngMkdir", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngMkdir(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		logger.info("DeployMngMkdir... Start");
		
		SFTPUtil sFTPUtil = new SFTPUtil();
		
		String resultMsg = "";
		
		//----------------------- UUID 정합성 검사 START
		resultMsg += "*디렉토리 생성 결과\n";
		logger.info("ivrGRUrlListService.UrlListGet Query Start...");
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRUrlList> Urlsearch = ivrGRUrlListService.UrlListGet(map);
		
		for (int i = 0; i < Urlsearch.size(); i++) {
			try {
				resultMsg += Urlsearch.get(i).getUrl_nm()+": ";
				emitter.send("MKDIR;CONNECT;"+Urlsearch.get(i).getUrl_nm());
				if(!sFTPUtil.connectSession(Urlsearch.get(i).getSvr_ip())){
					return ok("SFTP 연결 실패");	
				};
				sFTPUtil.connectSFTP();
				for (ivrGRDeployMng dm : deployMng) {
					String directory = dm.getDirectory();

					if(!sFTPUtil.isExist(SFTPUtil.getDeployPath()+directory)){ // 경로가 없을 경우 만들어준다.
						emitter.send("MKDIR;"+Urlsearch.get(i).getUrl_nm()+";"+SFTPUtil.getDeployPath()+directory);
						if(!sFTPUtil.makeDirectory(SFTPUtil.getDeployPath()+directory)){
							resultMsg += "\n"+SFTPUtil.getDeployPath()+directory+": 디렉토리 생성 fail";
							return ok(resultMsg);
						}else{
						}
					}
					
				}
				resultMsg += "success\n";
			} catch (Exception e) {
				resultMsg += "DeployMngMkdir... Error:"+e.getMessage()+"\n";
			} finally{
				sFTPUtil.close();
			}
		}
		emitter.send("MKDIR;END");
		Thread.sleep(300);
		
		return ok(resultMsg);
	}
	
	/** 
	 * @desc 배포관리 목록 파일 백업
	 */
	@RequestMapping(value = "/DeployMngBackup", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngBackup(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		logger.info("DeployMngBackup... Start");
		
		SFTPUtil sFTPUtil = new SFTPUtil();
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		String resultMsg = "";
		String ymdhms = sdf.format(new Date());
		String backupYmdPath = SFTPUtil.getBackupPath()+ymdhms+"/";
		
		resultMsg += "*각 서버 백업 결과\n";
		logger.info("ivrGRUrlListService.UrlListGet Query Start...");
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRUrlList> Urlsearch = ivrGRUrlListService.UrlListGet(map);
		
		boolean[] newFileFlag = new boolean[deployMng.size()];
		Arrays.fill(newFileFlag, false);
		
		for (int i = 0; i < Urlsearch.size(); i++) {
			try {
				resultMsg += Urlsearch.get(i).getUrl_nm()+":";
				emitter.send("BACKUP;CONNECT;"+Urlsearch.get(i).getUrl_nm());
				if(!sFTPUtil.connectSession(Urlsearch.get(i).getSvr_ip())){
					return ok("SFTP 연결 실패");	
				};
				sFTPUtil.connectSFTP();
				if(!sFTPUtil.isExist(backupYmdPath)){
					if(sFTPUtil.makeDirectory(backupYmdPath)){ // 백업 Root디렉토리 생성
					}else{
						resultMsg += "\n"+backupYmdPath+": 디렉토리 생성 fail";
						return ok(resultMsg);
					}
				}
				
				sFTPUtil.connectSSH();
				String commandStr = "";
				int dmNum = 0;
				for (ivrGRDeployMng dm : deployMng) {
					String directory = dm.getDirectory();
					String filename = dm.getFilename();
					String backupFullPath = backupYmdPath+directory;
					if(sFTPUtil.isExist(SFTPUtil.getDeployPath()+directory+filename)){ // 실제 시나리오 파일 존재 할 경우 백업한다.
						if(!sFTPUtil.isExist(backupFullPath)){ // 백업경로에 디렉토리가 없으면 생성해준다.
							if(!sFTPUtil.makeDirectory(backupFullPath)){
								resultMsg += "\n"+backupFullPath+": 디렉토리 생성 fail\n";
								return ok(resultMsg);
							}else{
							}
						}
						
						emitter.send("BACKUP;"+Urlsearch.get(i).getUrl_nm()+";"+SFTPUtil.getDeployPath()+directory+filename);
						
						commandStr +="cp "+SFTPUtil.getDeployPath()+directory+filename+" "+backupFullPath+filename+"; ";
						
					}else{
						emitter.send("BACKUP;NEW-"+Urlsearch.get(i).getUrl_nm()+";"+SFTPUtil.getDeployPath()+directory+filename);
						newFileFlag[dmNum] = true;
					}
					dmNum++;
				}
				if(!sFTPUtil.exeCommand(commandStr)){
					resultMsg += " 파일 백업 fail\n";
					return ok(resultMsg);
				}else{
					resultMsg +="success\n";
				}
			} catch (Exception e) {
				resultMsg += "DeployMngBackup... Error:"+e.getMessage()+"\n";
			} finally{
				sFTPUtil.close();
			}
		}
		emitter.send("BACKUP;END");
		Thread.sleep(300);
		
		int sqlrst = 0;
		int result = 0;
		
		for (int i = 0; i < deployMng.size(); i++) {
			Map<String,Object> param = new HashMap<String,Object>();
			ivrGRDeployMng dm = deployMng.get(i);
			
			param.put("seq", dm.getSeq());
			param.put("directory", dm.getDirectory());
			param.put("filename", dm.getFilename());
			param.put("filesize", dm.getFilesize());
			param.put("description", dm.getDescription());
			if(newFileFlag[i]){
				param.put("step", "2"); // 신규파일
			}
			else{
				param.put("step", "3"); // 백업완료
				param.put("backup_dt", ymdhms);
			}
				
			param.put("uuid", dm.getUuid());
			param.put("work_flag", dm.getWork_flag());
			param.put("upt_dt", sdf.format(new Date()));
			param.put("upt_by", cid);
			
			logger.info("ivrGRDeployMngService.DeployMngUdt Query Start...");
			sqlrst = ivrGRDeployMngService.DeployMngUdt(param);
			
			if(sqlrst == 0)
			{
				result++;
			}
		}
		
		if(result != 0)
		{
			resultMsg = "fail - DataBase 연동 실패\n관리자에게 문의하세요.";
		}
		
		
		return ok(resultMsg);
	}
	
	/** 
	 * @desc 배포관리 목록 파일 배포
	 */
	@RequestMapping(value = "/DeployMngDeploy", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngDeploy(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		logger.info("DeployMngDeploy... Start");
		
		SFTPUtil sFTPUtil = new SFTPUtil();
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		String resultMsg = "";
		
		logger.info("ivrGRUrlListService.UrlListGet Query Start...");
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRUrlList> Urlsearch = ivrGRUrlListService.UrlListGet(map);
		boolean[][] ErrorFlag = new boolean[Urlsearch.size()][deployMng.size()];
		String[][] ErrorMessage = new String[Urlsearch.size()][deployMng.size()];
		for (int i = 0; i < ErrorFlag.length; i++) {
			Arrays.fill(ErrorFlag[i], false);
		}
		for (int i = 0; i < ErrorMessage.length; i++) {
			Arrays.fill(ErrorMessage[i], "");
		}
		
		
		resultMsg += "*각 서버 배포 결과\n";
		for (int i = 0; i < Urlsearch.size(); i++) {
			try {
				resultMsg += Urlsearch.get(i).getUrl_nm()+": ";
				emitter.send("DEPLOY;CONNECT;"+Urlsearch.get(i).getUrl_nm());
				if(!sFTPUtil.connectSession(Urlsearch.get(i).getSvr_ip())){
					return ok("SFTP 연결 실패");	
				};
				sFTPUtil.connectSFTP();
				boolean successFlag = true;
				for (int j = 0; j < deployMng.size(); j++) {
					ivrGRDeployMng dm = deployMng.get(j);
					String uuid = dm.getUuid();
					String directory = dm.getDirectory();
					if(!directory.substring(directory.length()-1).equals("/")){
						directory = directory+"/";
					}
					String filename = dm.getFilename();
					
					try{
						emitter.send("DEPLOY;"+Urlsearch.get(i).getUrl_nm()+";"+SFTPUtil.getDeployPath()+directory+filename);
						boolean bresult = sFTPUtil.deploy(uuid,directory+filename);
						
						if(bresult){
							logger.info("DeployMngDeploy... success "+directory+filename);
						} else{
							resultMsg += directory+filename+" 배포-fail\n";
							logger.info("DeployMngDeploy... fail "+directory+filename);
							ErrorFlag[i][j] = true;
							ErrorMessage[i][j] = directory+filename+":fail ";
							successFlag = false;
						}
					}catch(Exception e){
						logger.info("DeployMngDeploy... Error "+e.getMessage());
						resultMsg += "배포-fail :"+e.getMessage()+"\n";
						ErrorFlag[i][j] = true;
						ErrorMessage[i][j] ="DeployError ";
						successFlag = false;
					}
				}
				if(successFlag) resultMsg += "success\n";
			} catch (Exception e) {
				resultMsg += "DeployMngDeploy... Error:"+e.getMessage()+"\n";
			} finally{
				sFTPUtil.close();
			}
			
		}
		emitter.send("DEPLOY;END");
		Thread.sleep(300);
		
		int sqlrst = 0;
		int result = 0;
		for (int j = 0; j < deployMng.size(); j++) {
			Map<String,Object> param = new HashMap<String,Object>();
			ivrGRDeployMng dm = deployMng.get(j);
			
			param.put("step", "4"); // 배포완료
			if(Urlsearch.size() == 1){
				if(ErrorFlag[0][j]){
					param.put("MPVIVRMCP001", ErrorMessage[0][j]);
					param.put("step", dm.getStep());
				}else{
					param.put("MPVIVRMCP001", "배포성공");
				}
			}
			for (int i = 0; i< Urlsearch.size(); i++) {
				if(ErrorFlag[i][j]){
					param.put(Urlsearch.get(i).getUrl_nm(), ErrorMessage[i][j]);
					param.put("step", dm.getStep());
				}else{
					param.put(Urlsearch.get(i).getUrl_nm(), "배포성공");
				}
			}
			param.put("seq", dm.getSeq());
			param.put("upt_dt", sdf.format(new Date()));
			param.put("upt_by", cid);
			
			logger.info("ivrGRDeployMngService.DeployMngUdt Query Start...");
			sqlrst = ivrGRDeployMngService.DeployMngUdtResult(param);
			
			if(sqlrst == 0)
			{
				result++;
			}
			
			if(result != 0)
			{
				resultMsg = "fail - DataBase 연동 실패\n관리자에게 문의하세요.";
			}
		}
		
		return ok(resultMsg);
	}
	
	/** 
	 * @desc 배포관리 목록 파일 원복
	 */
	@RequestMapping(value = "/DeployMngRollback", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngRollback(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		logger.info("DeployMngRollback... Start");
		
		SFTPUtil sFTPUtil = new SFTPUtil();
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();
		
		String resultMsg = "";
		
		logger.info("ivrGRUrlListService.UrlListGet Query Start...");
		Map<String, Object> map = new HashMap<String, Object>();
		List<ivrGRUrlList> Urlsearch = ivrGRUrlListService.UrlListGet(map);
		boolean[][] ErrorFlag = new boolean[Urlsearch.size()][deployMng.size()];
		String[][] ErrorMessage = new String[Urlsearch.size()][deployMng.size()];
		for (int i = 0; i < ErrorFlag.length; i++) {
			Arrays.fill(ErrorFlag[i], false);
		}
		for (int i = 0; i < ErrorMessage.length; i++) {
			Arrays.fill(ErrorMessage[i], "");
		}
		
		resultMsg += "*각 서버 원복 결과\n";
		
		for (int i = 0; i < Urlsearch.size(); i++) {
			try {
				resultMsg += Urlsearch.get(i).getUrl_nm()+":";
				emitter.send("ROLLBACK;CONNECT;"+Urlsearch.get(i).getUrl_nm());
				if(!sFTPUtil.connectSession(Urlsearch.get(i).getSvr_ip())){
					return ok("SFTP 연결 실패");	
				};
				sFTPUtil.connectSSH();
				boolean successFlag = true;
				String commandStr = "";
				for (int j = 0; j < deployMng.size(); j++) {
					try {
						ivrGRDeployMng dm = deployMng.get(j);
						String directory = dm.getDirectory();
						String filename = dm.getFilename();
						String backupDt = dm.getBackup_dt();
						String backupFilePath = SFTPUtil.getBackupPath()+backupDt+"/"+directory+filename;
						String operFilePath = SFTPUtil.getDeployPath()+directory+filename;
						emitter.send("ROLLBACK;"+Urlsearch.get(i).getUrl_nm()+";"+operFilePath);
						
						commandStr += "cp "+ backupFilePath + " " + operFilePath + "; ";
						
					} catch (Exception e) {
						resultMsg += "DeployMngRollback... Error:"+e.getMessage()+"\n";
						successFlag = false;
						ErrorFlag[i][j] = true;
						ErrorMessage[i][j] = e.getMessage()+":fail ";
					}
					
				}
				if(sFTPUtil.exeCommand(commandStr)){
					if(successFlag) resultMsg += " success\n";
				}else{
					resultMsg += " 롤백-fail\n";
				}
			} catch (Exception e) {
				e.printStackTrace();
				resultMsg += "DeployMngRollback... Error:"+e.getMessage()+"\n";
			} finally{
				sFTPUtil.close();
			}
			
		}
		
		emitter.send("ROLLBACK;END");
		Thread.sleep(300);
		
		int sqlrst = 0;
		int result = 0;
		for (int j = 0; j < deployMng.size(); j++) {
			Map<String,Object> param = new HashMap<String,Object>();
			ivrGRDeployMng dm = deployMng.get(j);
			
			param.put("step", "5"); // 원복완료
			if(Urlsearch.size() == 1){
				if(ErrorFlag[0][j]){
					param.put("MPVIVRMCP001", ErrorMessage[0][j]);
					param.put("step", dm.getStep());
				}else{
					param.put("MPVIVRMCP001", "원복성공");
				}
			}
			for (int i = 0; i< Urlsearch.size(); i++) {
				if(ErrorFlag[i][j]){
					param.put(Urlsearch.get(i).getUrl_nm(), ErrorMessage[i][j]);
					param.put("step", dm.getStep());
				}else{
					param.put(Urlsearch.get(i).getUrl_nm(), "원복성공");
				}
			}
			
			param.put("seq", dm.getSeq());
			param.put("upt_dt", sdf.format(new Date()));
			param.put("upt_by", cid);
			
			logger.info("ivrGRDeployMngService.DeployMngUdt Query Start...");
			sqlrst = ivrGRDeployMngService.DeployMngUdtResult(param);
			
			if(sqlrst == 0)
			{
				result++;
			}
			
			if(result != 0)
			{
				resultMsg = "fail - DataBase 연동 실패\n관리자에게 문의하세요.";
			}
		}
		
		return ok(resultMsg);
	}
	
	/** 
	 * @desc 배포관리 목록 파일 원복
	 */
	@RequestMapping(value = "/DeployMngComplete", method = RequestMethod.POST, produces = APPLICATION_JSON)
    public @ResponseBody ApiResponse DeployMngComplete(@Valid @RequestBody List<ivrGRDeployMng> deployMng, HttpServletRequest request) throws Exception {
		Map<String, Object> map = new HashMap<String, Object>();
		
		// 현재 로그인된 ID정보를 가져온다
		loginUser = SessionUtils.getCurrentMdcLoginUser(request);
		String cid = loginUser.getSessionUser().getUserCd();

		int result = 0; 
		int sqlrst = 0;
		String msg = "success";
		for (ivrGRDeployMng dm : deployMng) {
			map.put("seq", dm.getSeq());
			map.put("directory", dm.getDirectory());
			map.put("filename", dm.getFilename());
			map.put("filesize", dm.getFilesize());
			map.put("description", dm.getDescription());
			map.put("step", dm.getStep());
			map.put("uuid", dm.getUuid());
			map.put("work_flag", "N");
			map.put("backup_dt", dm.getBackup_dt());
			map.put("upt_dt", sdf.format(new Date()));
			map.put("upt_by", cid);
			
			logger.info("ivrGRDeployMngService.DeployMngUdt Query Start...");
			sqlrst = ivrGRDeployMngService.DeployMngUdt(map);
			
			if(sqlrst == 0)
			{
				result++;
			}
		}
		
		if(result > 0){
			msg = "DB Fail";
		}
					
		return ok(msg);
	}
}