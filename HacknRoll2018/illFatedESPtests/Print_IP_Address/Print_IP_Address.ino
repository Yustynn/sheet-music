#include "ESP8266WiFi.h"

// WiFi parameters to be configured
const char* ssid = "OnePlus3";
const char* password = "tzehow's";

void setup(void)
{ 
  Serial.begin(9600);
  // Connect to WiFi
  WiFi.begin(ssid, password);

  // while wifi not connected yet, print '.'
  // then after it connected, get out of the loop
  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
  }
  //print a new line, then print WiFi connected and the IP address
  Serial.println("");
  Serial.println("WiFi connected");
  // Print the IP address
}
void loop() {
  // Nothing
  Serial.println(WiFi.localIP());
  delay(500);
}
