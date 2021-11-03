package com.soluvis.bake.system.security;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

public class RereadableRequestWrapper extends HttpServletRequestWrapper{

	private final Charset endcoding;
	private byte[] rawData;
	
	public RereadableRequestWrapper(HttpServletRequest request) throws IOException{
		super(request);
		
		String characterEncoding = request.getCharacterEncoding();
		if (StringUtils.isBlank(characterEncoding)) {
			characterEncoding = StandardCharsets.UTF_8.name();
		}
		
		this.endcoding = Charset.forName(characterEncoding);
		
		try {
			InputStream inputStream = request.getInputStream();
			this.rawData = IOUtils.toByteArray(inputStream);
		} catch (IOException e) {
			throw e;
		}
	}
	
	@Override
	public ServletInputStream getInputStream() throws IOException {
		final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(this.rawData);
		ServletInputStream servletInputStream = new ServletInputStream() {
			
			@Override
			public int read() throws IOException {
				return byteArrayInputStream.read();
			}
			
			@Override
			public void setReadListener(ReadListener arg0) {
				// TODO Auto-generated method stub
				
			}
			
			@Override
			public boolean isReady() {
				// TODO Auto-generated method stub
				return false;
			}
			
			@Override
			public boolean isFinished() {
				// TODO Auto-generated method stub
				return false;
			}
		};
		return servletInputStream;
	}
	
	@Override
	public BufferedReader getReader() throws IOException {
		return new BufferedReader(new InputStreamReader(this.getInputStream(), this.endcoding));
	}
	
	@Override
	public ServletRequest getRequest() {
		return super.getRequest();
	}
}
