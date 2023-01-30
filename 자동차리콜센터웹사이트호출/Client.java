import java.net.*;
import java.io.*;

import javax.net.ssl.*;
import java.security.cert.*;
import java.security.*;


public class Client {

	public static void main(String[] args) throws Exception {

		URL url = new URL("https://car.go.kr/ri/recall/list.do");
		XTrustManager trustAllCerts[] = new XTrustManager[]{new XTrustManager()};
		SSLContext context = SSLContext.getInstance("SSL");
		context.init(null,trustAllCerts, new SecureRandom());
		HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());
		HttpsURLConnection sconnection = (HttpsURLConnection)url.openConnection();
		sconnection.setDoOutput(true);
		sconnection.setDoInput(true);
		sconnection.setRequestMethod("POST");
		sconnection.setRequestProperty("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
		OutputStream out=sconnection.getOutputStream();

		//String jsonString = "{\"srchFlg\":\"Y\",\"vehicleIdFlag\":1,\"vehicleIdNumber\":\"30³Ê3447\"}";
		String jsonString = "srchFlg=Y&vehicleIdFlag=1&vehicleIdNumber=06¸Ó5954";

		out.write(jsonString.getBytes("utf-8"));
		out.flush();

		InputStream in = sconnection.getInputStream();
		byte[] data = new byte[1024*4];
		int size;

		while((size=in.read(data))!=-1)
			System.out.println(new String(data,0,size,"utf-8"));
	}
}








