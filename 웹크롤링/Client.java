import java.net.*;
import java.io.*;

import javax.net.ssl.*;
import java.security.cert.*;
import java.security.*;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Attributes;
import org.jsoup.select.Elements;


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

		String jsonString = "srchFlg=Y&vehicleIdFlag=1&vehicleIdNumber=06머5954";

		out.write(jsonString.getBytes("utf-8"));
		out.flush();

		InputStream in = sconnection.getInputStream();
		byte[] data = new byte[1024*32];
		int size;
		StringBuilder html = new StringBuilder();


		while((size=in.read(data))!=-1)
			html.append(new String(data,0,size,"utf-8"));

		//System.out.println(html.toString());

		Document document = Jsoup.parse(html.toString());

		Element element = document.select("div.latest-recall").first();
		if(element==null)
			System.out.println("조회에 실패하였습니다.");

		Element recallElement = element.clone();
		Elements aTags = recallElement.select("a[href*=#]");

		System.out.println(aTags.size());

		for(Element aTag : aTags) {
			Attributes attrs = aTag.attributes();
			for(Attribute attr : attrs) {
				String attrName = attr.getKey();
				if(attrName.equals("onclick")) {
					String attrValue = attr.getValue();
					if(attrValue.contains("statDetailView")) {
						Elements tags = aTag.children();
						for(Element tag : tags) {
							System.out.println(tag.tagName());
							System.out.println(tag.text());
						}
						System.out.println("리콜대상");
						for(Element a : aTag.nextElementSiblings()) {
							Elements e = a.select("span.count");
							for(Element ee : e)
								System.out.println(ee.text());
						}
					}
					if(attrValue.contains("grtsDetailView")) {
						Elements tags = aTag.getElementsByTag("strong");
						for(Element tag : tags) {
							System.out.println(tag.tagName());
							System.out.println(tag.text());
						}
						System.out.println("무상점검수리 대상");
					}
				}
			}

		}
		System.out.println("no recall");
	}
}








