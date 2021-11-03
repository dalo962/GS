package com.soluvis.bake.common.controller;

import com.penta.scpdb.ScpDbAgent;

public class Encryption
{
  static ScpDbAgent mAgtRN = null;
  static String mIniFilePath = "/WAS/ERP/BA-SCP/conf/scpdb_agent.ini";
  static byte[] mCtxREGR = null;
  private static int mEncryptLen = 6;
  private static boolean mEncryptScp = false;
  
  private static void initContext()
  {
       mAgtRN = new ScpDbAgent();
    if (!mEncryptScp)
    {
      int ret = mAgtRN.AgentInit(mIniFilePath);
      if ((ret != 0) && (ret != 118))
      {
        return;
      }
      mCtxREGR = mAgtRN.AgentCipherCreateContextServiceID("RSDTRGST_NO", "Account");
    }
  }
  
  public static String encryptDATA(int index, String pPlain)
  {
    return encryptREGR(pPlain);
  }
  
  public static String encryptREGR(String pPlain)
  {
    if (pPlain == null) {
      return null;
    }
    String encoded = pPlain;
    try
    {
      if (mAgtRN == null) {
        initContext();
      }
      encoded = mEncryptScp ? mAgtRN.ScpEncB64(mIniFilePath, "RSDTRGST_NO", pPlain) : 
        mAgtRN.AgentCipherEncryptStringB64(mCtxREGR, pPlain);
    }
    catch (Exception ex)
    {
    	return null;
    }
    return encoded;
  }
  
  public static String encryptANI(String pPlain)
  {
    if (pPlain == null) {
      return null;
    }
    String encoded = pPlain;
    try
    {
      if (mAgtRN == null) {
        initContext();
      }
      encoded = mEncryptLen <= pPlain.length() ? 
        mAgtRN.AgentCipherEncryptStringB64(mCtxREGR, pPlain) : mEncryptScp ? mAgtRN.ScpEncB64(mIniFilePath, "RSDTRGST_NO", pPlain) : 
        pPlain;
    }
    catch (Exception ex)
    {
    	return null;
    }
    return encoded;
  }
  
  public static String decryptDATA(int index, String pPlain)
  {
    return decryptREGR(pPlain);
  }
  
  public static String decryptREGR(String pEncoded)
  {
    String decoded = null;
    try
    {
      if (mAgtRN == null) {
        initContext();
      }
      decoded = mEncryptScp ? mAgtRN.ScpDecB64(mIniFilePath, "RSDTRGST_NO", pEncoded) : 
        mAgtRN.AgentCipherDecryptStringB64(mCtxREGR, pEncoded);
    }
    catch (Exception ex)
    {
    	return null;
    }
    return decoded;
  }
  
  public static String decryptANI(String pEncoded)
  {
    String decoded = null;
    try
    {
      if (mAgtRN == null) {
        initContext();
      }
      decoded = mEncryptScp ? mAgtRN.ScpDecB64(mIniFilePath, "RSDTRGST_NO", pEncoded) : 
        mAgtRN.AgentCipherDecryptStringB64(mCtxREGR, pEncoded);
    }
    catch (Exception ex)
    {
      return null;
    }
    return decoded;
  }
}
