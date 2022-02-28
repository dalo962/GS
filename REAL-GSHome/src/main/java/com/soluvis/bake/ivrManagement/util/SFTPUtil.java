package com.soluvis.bake.ivrManagement.util;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.chequer.axboot.core.controllers.BaseController;
import com.jcraft.jsch.Channel;
import com.jcraft.jsch.ChannelExec;
import com.jcraft.jsch.ChannelSftp;
import com.jcraft.jsch.JSch;
import com.jcraft.jsch.JSchException;
import com.jcraft.jsch.Session;
import com.jcraft.jsch.SftpException;

public class SFTPUtil {
	JSch jsch = null;
	Session session = null;
	Properties config = null;
	Channel channelToSFTP = null;
	Channel channelToSSH = null;
	ChannelSftp channelSftp = null;
	ChannelExec channelExec = null;
	
	private static String uploadPath = "";
	private static String deployPath = "";
	private static String backupPath = "";
	private static String user = "";
	private static String password = "";
	private static String ip_p = "";
	private static String ip_b = "";
	private static int port = 0;
	
	private static String localAddress = "";
	private static String ip_remote = "";

	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);
	
	public SFTPUtil() {
		try {
			SFTPUtil.localAddress = InetAddress.getLocalHost().getHostAddress();
		} catch (UnknownHostException e) {
			logger.info("SFTPUtil Error: "+e.getMessage());		
			e.printStackTrace();
		}
		
		if(localAddress.equals(ip_p)) SFTPUtil.ip_remote = ip_b;
		else if(localAddress.equals(ip_b)) SFTPUtil.ip_remote = ip_p;
		
		logger.info("SFTPUtil LocalIP:"+localAddress+" remoteIP:"+ip_remote);
	}
	
	public boolean upload(String source, String target) {
		try {
			channelSftp.put(uploadPath+source, uploadPath+target);
			return true;
		} catch (SftpException e) {
			logger.info("SFTPUtil Upload Error: "+e.getMessage());
			return false;
		}
	}
	public boolean deploy(String source, String target) {
		try {
			System.out.println(uploadPath+source);
			channelSftp.put(uploadPath+source, deployPath+target);
			return true;
		} catch (SftpException e) {
			logger.info("SFTPUtil Upload Error: "+e.getMessage());
			return false;
		}
	}
	public boolean isOperation(){
		if(ip_remote.equals("")){
			return false;
		} else{
			return true;
		}
	}
	public boolean isExist(String path) {
		boolean result = true;
		try {
			channelSftp.stat(path);
		} catch (SftpException sftpe) {
			result = false;
		}
		return result;
	}
	public boolean makeDirectory(String path){
		boolean bresult = true;
		String[] splitPath = path.split("/");
		String pathStep = "";
		for (int i = 0; i < splitPath.length; i++) {
			pathStep += "/"+splitPath[i];
			if(splitPath.equals("") || splitPath == null){
			}else{
				try {
					channelSftp.stat(pathStep);
				} catch (SftpException e) {
					try {
						logger.info("SFTPUtil mkdir: "+pathStep);
						channelSftp.mkdir(pathStep);
					} catch (SftpException e1) {
						bresult = false;
						logger.info("SFTPUtil mkdir Error: "+e1.getMessage());
					}
				}
			}
		}
		return bresult;
	}
	public boolean exeCommand(String command){
		boolean bResult = true;
		try {
			channelExec.setCommand(command);
			channelExec.connect();
		} catch (JSchException e) {
			bResult = false;
			logger.info("SFTPUtil exeCommand Error: "+e.getMessage());
			e.printStackTrace();
		}
		return bResult;
	}
	
	public boolean deleteFile(String target){
		boolean bResult = true;
		try {
			channelSftp.rm(target);
		} catch (SftpException e) {
			logger.info("SFTPUtil deleteFile Error: "+e.getMessage());
			bResult = false;
		}
		return bResult;
	}
	
	public boolean connectSession(){
		try {
			logger.info("SFTPUtil... set Session to remote");
			jsch = new JSch();
			session = jsch.getSession(user, ip_remote, port);
			session.setPassword(password);
			config = new Properties();
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			session.connect();
			logger.info("SFTPUtil... complete set Session");
			return true;
		} catch (Exception e) {
			logger.info("SFTPUtil Session Error: "+e.getMessage());	
			return false;
		}
	}
	public boolean connectSession(String remoteIp){
		try {
			logger.info("SFTPUtil... set Session to remote");
			jsch = new JSch();
			session = jsch.getSession(user, remoteIp, port);
			session.setPassword(password);
			config = new Properties();
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			session.connect();
			logger.info("SFTPUtil... complete set Session");
			return true;
		} catch (Exception e) {
			logger.info("SFTPUtil Session Error: "+e.getMessage());		
			return false;
		}
	}
	public void connectSFTP(){
		try {
			logger.info("SFTPUtil... set SFTP to remote");
			channelToSFTP = session.openChannel("sftp");
			channelToSFTP.connect();
			channelSftp = (ChannelSftp) channelToSFTP;
			logger.info("SFTPUtil... complete set SFTP");
		} catch (Exception e) {
			logger.info("SFTPUtil SFTP Error: "+e.getMessage());		
		}
		
	}
	
	public void connectSSH(){ // 커맨드 용으로만 사용.
		try {
			logger.info("SFTPUtil... set SSH to remote");
			channelToSSH = session.openChannel("exec");			
			channelExec = (ChannelExec) channelToSSH;
			logger.info("SFTPUtil... complete set SSH");
		} catch (Exception e) {
			e.printStackTrace();
			logger.info("SFTPUtil SSH Error: "+e.getMessage());		
		}
		
	}
	
	public void close(){
		if(channelSftp != null) channelSftp.disconnect();
		if(channelExec != null) channelExec.disconnect();
		if(channelToSFTP != null) channelToSFTP.disconnect();
		if(channelToSSH != null) channelToSSH.disconnect();
		if(session != null) session.disconnect();
	}
	
	public static boolean checkInfo(){
		if(uploadPath.equals("")||deployPath.equals("")||backupPath.equals("")||user.equals("")||password.equals("")||ip_p.equals("")||port==0){
			return false;
		}else{
			return true;
		}
	}
	
	public static String getUploadPath(){
		return uploadPath;
	}
	
	public static void setUploadPath(String uploadPath) {
		SFTPUtil.uploadPath = uploadPath;
	}
	
	public static String getDeployPath() {
		return deployPath;
	}

	public static void setDeployPath(String deployPath) {
		SFTPUtil.deployPath = deployPath;
	}

	public static String getBackupPath() {
		return backupPath;
	}

	public static void setBackupPath(String backupPath) {
		SFTPUtil.backupPath = backupPath;
	}

	public static String getUser() {
		return user;
	}

	public static void setUser(String user) {
		SFTPUtil.user = user;
	}

	public static String getPassword() {
		return password;
	}

	public static void setPassword(String password) {
		SFTPUtil.password = password;
	}

	public static String getIp_p() {
		return ip_p;
	}

	public static void setIp_p(String ip_p) {
		SFTPUtil.ip_p = ip_p;
	}

	public static String getIp_b() {
		return ip_b;
	}

	public static void setIp_b(String ip_b) {
		SFTPUtil.ip_b = ip_b;
	}

	public static int getPort() {
		return port;
	}

	public static void setPort(int port) {
		SFTPUtil.port = port;
	}
	
	public static String getLocalAddress() {
		return localAddress;
	}

	public static void setLocalAddress(String localAddress) {
		SFTPUtil.localAddress = localAddress;
	}

	public static String getIp_remote() {
		return ip_remote;
	}

	public static void setIp_remote(String ip_remote) {
		SFTPUtil.ip_remote = ip_remote;
	}
	
}
