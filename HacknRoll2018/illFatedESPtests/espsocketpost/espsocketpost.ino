#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

ESP8266WiFiMulti WiFiMulti;

const uint16_t port = 12345;
const char * host = "192.168.43.193"; // ip or dns
WiFiClient client;

void setup() {
    Serial.begin(115200);
    delay(10);

    // We start by connecting to a WiFi network
    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP("yPhone", "whyubun2");

    Serial.println();
    Serial.println();
    Serial.print("Wait for WiFi... ");

    while(WiFiMulti.run() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    delay(500);
}


void loop() {
        
//    Serial.print("connecting to ");
    Serial.println(host);

    // Use WiFiClient class to create TCP connections
    if (!client.connect(host, port)) {
        Serial.println("connection failed");
        Serial.println("wait 5 sec...");
        delay(5000);
        return;
    }

    // This will send the request to the server
    client.println("Send this data to server");
    client.write("Hello World!");

    //read back one line from server
    String line = client.readStringUntil('\r');
//    Serial.println(line);

//    Serial.println("closing connection");
    client.stop();
    
    Serial.println("wait .3 sec...");
//    delay(300);
}

