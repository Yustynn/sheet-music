#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

int count;

void setup() {
  Serial.begin(9600);                 //Serial connection
  WiFi.begin("OnePlus3", "tzehow's");   //WiFi connection
  count = 0;
 
  while (WiFi.status() != WL_CONNECTED) {  //Wait for the WiFI connection completion 
    delay(500);
    Serial.println("Waiting for connection");
  }
}
void loop() {
 if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
   
   HTTPClient http;    //Declare object of class HTTPClient
   String URL;
   if(Serial.available()){
    String input = Serial.readString();
    URL="http://192.168.43.247:3000/route?sensor="+input;
    Serial.println("URL is: " +URL);
    count=0;
   }
   else{
    URL="http://192.168.43.247:3000/route?sensor="+(String)count;
   }
//   /ukulele/boole/s1f1/s2f0/s3f2/s4f1
//   /piano/a/b/c/d/e/f/a#/
//   /recorder/boole/bottom/1/2/3/4/5/6/7

   http.begin(URL);
   http.addHeader("Content-Type", "text/plain");  //Specify content-type header
   
   Serial.println("Sending Message to Server");   //Print HTTP return code
   int httpCode = http.GET();   //Send the request
   String payload = http.getString();                  //Get the response payload
   Serial.println("Message sent to Server");
   
//   Serial.println(httpCode);   //Print HTTP return code
//   Serial.println(payload);    //Print request response payload
   count++;
   http.end();  //Close connection
 
 }else{
//    Serial.println("Error in WiFi connection");   
 }
}

